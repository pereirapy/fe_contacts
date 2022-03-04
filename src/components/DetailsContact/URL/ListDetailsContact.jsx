import React from 'react'
import { withTranslation } from 'react-i18next'
import ContainerCRUD from '../../../components/common/ContainerCRUD/ContainerCRUD'
import { formatDateDMYHHmm } from '../../../utils/forms'
import { details } from '../../../services'
import { getOr, map, first, isEmpty, some, isEqual } from 'lodash/fp'
import { Button, Table, Row, Col, Container } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import AskDelete from '../../common/AskDelete/AskDelete'
import NoRecords from '../../common/NoRecords/NoRecords'
import Pagination from '../../common/Pagination/Pagination'
import Search from '../../common/Search/Search'
import {
  parseQuery,
  setFiltersToURL,
  getQueryParamsFromURL,
} from '../../../utils/forms'
import { RECORDS_PER_PAGE } from '../../../constants/application'
import {
  faPlusSquare,
  faEdit,
  faAddressCard,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { showError } from '../../../utils/generic'
import ReactPlaceholder from 'react-placeholder'
import Swal from 'sweetalert2'

class ListDetailsContact extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      data: [],
      name: '',
      loading: false,
      waitingFeedback: false,
      phone: getOr(0, 'match.params.phone', props),
      pagination: {},
      queryParams: {
        sort: '"detailsContacts"."createdAt":DESC',
        perPage: RECORDS_PER_PAGE,
        currentPage: 1,
        filters: JSON.stringify({
          publisher: '',
          details: '',
        }),
      },
    }
    this.handleGetAllOneContact = this.handleGetAllOneContact.bind(this)
    this.handleFilter = this.handleFilter.bind(this)
    this.handleDelete = this.handleDelete.bind(this)
    this.notificationNotAllowedNewDetails =
      this.notificationNotAllowedNewDetails.bind(this)
  }

  getLastPublisherThatTouched(detail) {
    const { t } = this.props

    return detail.updatedAt
      ? t('common:updatedByAt', {
          date: formatDateDMYHHmm(detail.updatedAt),
          name: detail.publisherUpdatedByName,
        })
      : t('common:createdByAt', {
          date: formatDateDMYHHmm(detail.createdAt),
          name: detail.publisherCreatedByName,
        })
  }

  isWaitingFeedback = (response) =>
    some({ waitingFeedback: true }, getOr([], 'data.data.list', response))

  handleFilter(objQuery) {
    const queryParams = parseQuery(objQuery, this.state)
    setFiltersToURL(queryParams, this.props)
  }

  async handleGetAllOneContact(objQuery) {
    this.setState({ loading: true })
    try {
      const phone = getOr(0, 'props.match.params.phone', this)
      const queryParams = getQueryParamsFromURL(this.props)
        ? getQueryParamsFromURL(this.props)
        : this.state.queryParams
      const response = await details.getAllOneContact(phone, queryParams)
      const data = getOr([], 'data.data.list', response)
      const { name } = first(data) || { name: '' }

      this.setState({
        data,
        waitingFeedback: this.isWaitingFeedback(response),
        pagination: getOr({}, 'data.data.pagination', response),
        error: false,
        queryParams,
        name,
        loading: false,
      })
    } catch (error) {
      const { t } = this.props

      this.setState({
        error,
        loading: false,
      })

      showError(error, t, 'detailsContacts')
    }
  }

  async handleDelete(id) {
    const { t } = this.props
    this.setState({ loading: true })

    await details
      .dellOne(id)
      .then(() => {
        this.handleGetAllOneContact()
        this.setState({ loading: false })
      })
      .catch((error) => {
        this.setState({ loading: false })
        showError(error, t, 'detailsContacts')
      })
  }
  componentDidMount() {
    this.handleGetAllOneContact()
  }

  componentDidUpdate(prevProps, prevState) {
    const { loading } = this.state
    const prevSubmiting = prevState.loading
    const prevQueryParams = prevState.queryParams
    const queryParams = getQueryParamsFromURL(this.props)
    if (
      !loading &&
      !prevSubmiting &&
      queryParams &&
      !isEqual(queryParams, prevQueryParams)
    ) {
      this.handleGetAllOneContact()
    }
  }

  getNameForTitle() {
    const { name } = this.state
    return !isEmpty(name) ? `- ${name}` : ''
  }

  notificationNotAllowedNewDetails() {
    const { t } = this.props
    Swal.fire({
      icon: 'error',
      title: t('common:ops'),
      text: t('notificationNotAllowedNewDetails'),
    })
  }

  render() {
    const { t, history } = this.props
    const {
      data,
      phone,
      loading,
      pagination,
      waitingFeedback,
      queryParams: { filters },
    } = this.state
    const colSpan = 4
    const title = (
      <React.Fragment>
        <FontAwesomeIcon icon={faAddressCard} />{' '}
        {`${t('title')} #${phone} ${this.getNameForTitle()}`}
      </React.Fragment>
    )
    const filtersParsed = JSON.parse(filters)

    return (
      <ContainerCRUD color="orange" title={title} {...this.props}>
        <Container className="border p-4">
          <Row>
            <Col>
              <Table striped bordered hover responsive>
                <thead>
                  <Search
                    filters={filtersParsed}
                    onFilter={this.handleFilter}
                    fields={['publisher', 'details']}
                    colspan={colSpan}
                    history={history}
                  />
                  <tr>
                    <th>{t('publisher')}</th>
                    <th>{t('dateAndReponsible')}</th>
                    <th>{t('details')}</th>
                    <th style={{ minWidth: '116px' }}>
                      {waitingFeedback ? (
                        <Button
                          variant="primary"
                          onClick={this.notificationNotAllowedNewDetails}
                        >
                          <FontAwesomeIcon icon={faPlusSquare} />
                        </Button>
                      ) : (
                        <Button
                          title={t('common:new')}
                          variant="primary"
                          as={Link}
                          to={`/contacts/${encodeURI(phone)}/details/new`}
                        >
                          <FontAwesomeIcon icon={faPlusSquare} />
                        </Button>
                      )}
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
                          rows={5}
                        />
                      </td>
                    </tr>
                  ) : !isEmpty(data) ? (
                    map(
                      (detail) => (
                        <tr key={detail.id}>
                          <td>{detail.publisherName}</td>
                          <td>
                            <small>
                              {this.getLastPublisherThatTouched(detail)}
                            </small>
                          </td>
                          <td>{t(detail.information)}</td>
                          <td style={{ minWidth: '114px' }}>
                            <Button
                              title={t('common:edit')}
                              variant="success"
                              as={Link}
                              to={`/contacts/${encodeURI(phone)}/details/edit/${
                                detail.id
                              }`}
                            >
                              <FontAwesomeIcon icon={faEdit} />
                            </Button>{' '}
                            <AskDelete
                              id={detail.id}
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
                        onClick={this.handleFilter}
                        loading={loading}
                      />
                    </td>
                  </tr>
                </tfoot>
              </Table>
            </Col>
          </Row>
        </Container>
      </ContainerCRUD>
    )
  }
}

export default withTranslation(['detailsContacts', 'common'])(
  ListDetailsContact
)
