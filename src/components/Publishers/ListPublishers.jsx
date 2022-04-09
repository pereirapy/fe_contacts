import React from 'react'
import Swal from 'sweetalert2'
import ReactPlaceholder from 'react-placeholder'
import { withTranslation } from 'react-i18next'
import { Table, Row, Col } from 'react-bootstrap'
import { getOr, map, isEmpty, isEqual } from 'lodash/fp'

import { EIcons } from '../../enums/icons'
import { publishers } from '../../services'
import { showError } from '../../utils/generic'
import { getQueryParamsFromURL } from '../../utils/forms'
import { RECORDS_PER_PAGE } from '../../constants/application'
import { ApplicationContext } from '../../contexts/application'
import { handleFilter, toggleFilter } from '../../utils/contactsHelper'

import Icon from '../common/Icon/Icon'
import NewPublisher from './NewPublisher'
import EditPublisher from './EditPublisher'
import Search from '../common/Search/Search'
import NoRecords from '../common/NoRecords/NoRecords'
import AskDelete from '../common/AskDelete/AskDelete'
import FilterData from '../common/FilterData/FilterData'
import Pagination from '../common/Pagination/Pagination'
import ContainerCRUD from '../common/ContainerCRUD/ContainerCRUD'

class Publishers extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      data: [],
      submitting: false,
      loading: false,
      hiddenFilter: false,
      pagination: {},
      queryParams: {
        sort: 'publishers.active:DESC, publishers.name:ASC',
        perPage: RECORDS_PER_PAGE,
        currentPage: 1,
        filters: JSON.stringify({
          name: '',
          phone: '',
          email: '',
          responsibility: [],
        }),
      },
    }
    this.handleGetAll = this.handleGetAll.bind(this)
    this.handleDelete = this.handleDelete.bind(this)
    this.showErrorNotAllowedDeleteCurrentUser =
      this.showErrorNotAllowedDeleteCurrentUser.bind(this)
  }

  async handleGetAll() {
    const { t } = this.props
    this.setState({
      loading: true,
    })
    try {
      const queryParams = getQueryParamsFromURL(this.props)
        ? getQueryParamsFromURL(this.props)
        : this.state.queryParams
      const response = await publishers.getAllWithPagination(queryParams)
      this.setState({
        data: getOr([], 'data.data.list', response),
        pagination: getOr({}, 'data.data.pagination', response),
        loading: false,
        error: false,
        queryParams,
      })
    } catch (error) {
      this.setState({
        error,
        loading: false,
      })
      showError(error, t, 'publishers')
    }
  }

  showErrorNotAllowedDeleteCurrentUser() {
    const { t } = this.props

    Swal.fire({
      icon: 'error',
      title: t('notAllowedDeleteCurrentUser'),
    })
  }

  async handleDelete(id) {
    const { t } = this.props
    const { user } = this.context
    if (id === getOr(0, 'id', user)) {
      this.showErrorNotAllowedDeleteCurrentUser()
      return
    }
    this.setState({ loading: true })
    await publishers
      .dellOne(id)
      .then(() => {
        this.handleGetAll()
        this.setState({ loading: false })
      })
      .catch((error) => {
        this.setState({ loading: false })
        showError(error, t, 'publishers')
      })
  }

  componentDidMount() {
    this.handleGetAll()
  }

  componentDidUpdate(prevProps, prevState) {
    const { loading } = this.state
    const prevLoading = prevState.loading
    const prevQueryParams = prevState.queryParams
    const queryParams = getQueryParamsFromURL(this.props)
    if (
      !loading &&
      !prevLoading &&
      queryParams &&
      !isEqual(queryParams, prevQueryParams)
    ) {
      this.handleGetAll()
    }
  }

  getTitle(onlyText) {
    const { t } = this.props
    const title = t('listTitle')

    return onlyText ? title : <Icon name={EIcons.briefcaseIcon} label={title} />
  }

  render() {
    const { t } = this.props
    const {
      data,
      pagination,
      loading,
      error,
      hiddenFilter,
      queryParams: { filters },
    } = this.state
    const colSpan = '11'
    const filtersParsed = JSON.parse(filters)

    return (
      <ContainerCRUD
        color="blue"
        title={this.getTitle()}
        titleOnlyText={this.getTitle(true)}
        {...this.props}
      >
        <Row>
          <Col xs={12} lg={3} xl={2} className={hiddenFilter ? 'd-none' : ''}>
            <FilterData
              filters={filtersParsed}
              handleFilters={(objQuery) =>
                handleFilter({ objQuery, componentReact: this })
              }
              refresh={loading}
              error={error}
              getFilters={publishers.getAllFilters}
            />
          </Col>
          <Col xs={12} lg={hiddenFilter ? 12 : 9} xl={hiddenFilter ? 12 : 10}>
            <Table striped bordered hover responsive>
              <thead>
                <Search
                  filters={filtersParsed}
                  onFilter={(objQuery) =>
                    handleFilter({
                      objQuery,
                      componentReact: this,
                    })
                  }
                  fields={['name', 'phone', 'email']}
                  colspan={colSpan}
                  toggleFilter={() => toggleFilter(this)}
                />
                <tr>
                  <th>{t('name')}</th>
                  <th>{t('email')}</th>
                  <th>{t('phone')}</th>
                  <th>{t('privilege')}</th>
                  <th>{t('active')}</th>
                  <th>
                    <NewPublisher afterClose={this.handleGetAll} />
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={colSpan}>
                      <ReactPlaceholder
                        showLoadingAnimation={true}
                        type="text"
                        ready={!loading}
                        rows={RECORDS_PER_PAGE}
                      />
                    </td>
                  </tr>
                ) : !isEmpty(data) ? (
                  map(
                    (publishers) => (
                      <tr key={publishers.id}>
                        <td>{publishers.name}</td>
                        <td>{publishers.email}</td>
                        <td>{publishers.phone}</td>
                        <td>
                          {t(
                            `responsibility:${publishers.responsibilityDescription}`
                          )}
                        </td>
                        <td
                          className={`text-${
                            publishers.active ? 'success' : 'danger'
                          }`}
                        >
                          {t(`common:${publishers.active ? 'yes' : 'no'}`)}
                        </td>
                        <td style={{ minWidth: '114px' }}>
                          <EditPublisher
                            id={publishers.id}
                            afterClose={this.handleGetAll}
                          />
                          <AskDelete
                            id={publishers.id}
                            funcToCallAfterConfirmation={this.handleDelete}
                          />
                        </td>
                      </tr>
                    ),
                    data
                  )
                ) : (
                  <NoRecords cols={colSpan} />
                )}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={colSpan} style={{ border: 0 }}>
                    <Pagination
                      pagination={pagination}
                      loading={loading}
                      onClick={(objQuery) =>
                        handleFilter({
                          objQuery,
                          componentReact: this,
                        })
                      }
                    />
                  </td>
                </tr>
              </tfoot>
            </Table>
          </Col>
        </Row>
      </ContainerCRUD>
    )
  }
}

Publishers.contextType = ApplicationContext

export default withTranslation(['publishers', 'common', 'responsibility'])(
  Publishers
)
