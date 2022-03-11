import React from 'react'
import Swal from 'sweetalert2'
import { Link } from 'react-router-dom'
import { withTranslation } from 'react-i18next'
import ReactPlaceholder from 'react-placeholder'
import { getOr, map, first, isEmpty, isEqual } from 'lodash/fp'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, Table, Row, Col, Container } from 'react-bootstrap'
import {
  faPlusSquare,
  faEdit,
  faAddressCard,
} from '@fortawesome/free-solid-svg-icons'

import {
  handleFilter,
  getLastPublisherThatTouched,
  isWaitingFeedback,
} from '../../../utils/contactsHelper'
import { details } from '../../../services'
import { showError } from '../../../utils/generic'
import { getQueryParamsFromURL } from '../../../utils/forms'
import { RECORDS_PER_PAGE } from '../../../constants/application'

import Search from '../../common/Search/Search'
import AskDelete from '../../common/AskDelete/AskDelete'
import NoRecords from '../../common/NoRecords/NoRecords'
import Pagination from '../../common/Pagination/Pagination'
import ContainerCRUD from '../../common/ContainerCRUD/ContainerCRUD'

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
    this.handleDelete = this.handleDelete.bind(this)
    this.notificationNotAllowedNewDetails =
      this.notificationNotAllowedNewDetails.bind(this)
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
        waitingFeedback: isWaitingFeedback(response),
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

  notificationNotAllowedNewDetails() {
    const { t } = this.props
    Swal.fire({
      icon: 'error',
      title: t('common:ops'),
      text: t('notificationNotAllowedNewDetails'),
    })
  }

  getTitle(onlyText) {
    const { t } = this.props
    const { phone, name } = this.state
    const nameForTitle = !isEmpty(name) ? `- ${name}` : ''
    const title = `${t('title')} #${phone} ${nameForTitle}`

    return onlyText ? (
      title
    ) : (
      <React.Fragment>
        <FontAwesomeIcon icon={faAddressCard} /> {title}
      </React.Fragment>
    )
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
    const filtersParsed = JSON.parse(filters)

    return (
      <ContainerCRUD
        color="orange"
        title={this.getTitle()}
        titleOnlyText={this.getTitle(true)}
        {...this.props}
      >
        <Container className="border p-4">
          <Row>
            <Col>
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
                              {getLastPublisherThatTouched({
                                detail,
                                componentReact: this,
                              })}
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
                        onClick={(objQuery) =>
                          handleFilter({
                            objQuery,
                            componentReact: this,
                          })
                        }
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
