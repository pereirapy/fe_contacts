import React from 'react'
import { Button, Table, Row, Col, Form } from 'react-bootstrap'
import ContainerCRUD from '../../components/common/ContainerCRUD/ContainerCRUD'
import { withTranslation } from 'react-i18next'
import { contacts } from '../../services'
import {
  map,
  getOr,
  isEmpty,
  pipe,
  uniq,
  compact,
  remove,
  contains,
  find,
  isNil
} from 'lodash/fp'
import AskDelete from '../common/AskDelete/AskDelete'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faList, faFileExcel } from '@fortawesome/free-solid-svg-icons'

import ListDetailsContact from '../DetailsContact/Modal/ListDetailsContact'
import { Link } from 'react-router-dom'
import NoRecords from '../common/NoRecords/NoRecords'
import Pagination from '../common/Pagination/Pagination'
import Search from '../common/Search/Search'
import { parseQuery } from '../../utils/forms'
import { RECORDS_PER_PAGE } from '../../constants/application'
import {
  ID_STATUS_AVAILABLE,
  ID_STATUS_BIBLE_STUDY,
  ID_STATUS_RETURN_VISIT,
  ID_STATUS_NO_VISIT,
  ID_STATUS_SEND_TO_OTHER_CONG,
} from '../../constants/status'

import FilterData from '../common/FilterData/FilterData'
import NewContact from './NewContact'
import EditContact from './EditContact'
import SendPhones from './SendPhones/SendPhones'
import BatchChanges from './BatchChanges/BatchChanges'
import { showError } from '../../utils/generic'
import ReactPlaceholder from 'react-placeholder'
import { isPublisher, isAtLeastElder } from '../../utils/loginDataManager'
import { CSVLink } from 'react-csv'

class Contacts extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      data: [],
      headers: [],
      dataCVS: [],
      error: false,
      hiddenFilter: false,
      checksContactsPhones: [],
      submitting: false,
      pagination: {},
      statusForbidden: [ID_STATUS_NO_VISIT, ID_STATUS_SEND_TO_OTHER_CONG],
      queryParams: {
        sort: '"lastConversationInDays":DESC,name:IS NULL DESC,name:ASC',
        perPage: RECORDS_PER_PAGE,
        currentPage: 1,
        filters: JSON.stringify({
          name: '',
          owner: '',
          phone: '',
          note: '',
          typeCompany: '-1',
          genders: [],
          languages: [],
          status: [],
        }),
      },
    }
    this.handleGetAll = this.handleGetAll.bind(this)
    this.handleDelete = this.handleDelete.bind(this)
    this.handleCheckAll = this.handleCheckAll.bind(this)
    this.afterSentPhones = this.afterSentPhones.bind(this)
    this.handleOnClick = this.handleOnClick.bind(this)
    this.toggleFilter = this.toggleFilter.bind(this)
    this.parseDataCVS = this.parseDataCVS.bind(this)
    this.setRowColor = this.setRowColor.bind(this)
    this.setSubRowVisible = this.setSubRowVisible.bind(this)
  }

  async handleGetAll(objQuery) {
    this.setState({ submitting: true })
    const { t } = this.props
    try {
      const queryParams = parseQuery(objQuery, this.state)
      const response = await contacts.getAll(queryParams)
      this.setState({
        data: getOr([], 'data.data.list', response),
        pagination: getOr({}, 'data.data.pagination', response),
        submitting: false,
        error: false,
        queryParams,
      })
    } catch (error) {
      this.setState({
        error,
        submitting: false,
      })
      showError(error, t, 'contacts')
    }
  }

  async handleDelete(id) {
    const { t } = this.props
    this.setState({ submitting: true })
    await contacts
      .dellOne(id)
      .then(() => {
        this.handleGetAll()
      })
      .catch((error) => {
        this.setState({ submitting: false })
        showError(error, t, 'contacts')
      })
  }

  handleOnClick(event) {
    const {
      target: { value, checked },
    } = event
    const newValues = checked
      ? pipe(uniq, compact)([...this.state.checksContactsPhones, value])
      : remove(
          (valueSaved) => valueSaved === value,
          this.state.checksContactsPhones
        )

    this.setState({
      checksContactsPhones: newValues,
    })
  }

  handleCheckAll(event) {
    const {
      target: { checked },
    } = event

    const newValues = checked
      ? map((contact) => contact.phone, this.state.data)
      : []
    this.setState({ checksContactsPhones: newValues })
  }

  afterSentPhones() {
    document.getElementById('checkall').checked = false
    this.handleGetAll()
    this.setState({ checksContactsPhones: [] })
  }

  componentDidMount() {
    if (isPublisher()) {
      const { history } = this.props
      history.push('/')
    } else this.handleGetAll()
  }

  toggleFilter() {
    this.setState({ hiddenFilter: !getOr(false, 'hiddenFilter', this.state) })
  }

  parseDataCVS() {
    const { t } = this.props
    const { checksContactsPhones, data } = this.state
    const dataCVS = map((phone) => {
      const contact = find((item) => item.phone === phone, data)
      return {
        ...contact,
        gender: t(contact.gender),
        typeCompany: t(`${contact.typeCompany ? 'commercial' : 'residential'}`),
        languageName: t(`languages:${contact.languageName}`),
        statusDescription: t(`status:${contact.statusDescription}`),
        locationName: isNil(contact.idLocation)
          ? t('unknownLocation')
          : `${contact.locationName} - ${contact.departmentName}`,
        lastConversationInDays: t(`${contact.lastConversationInDays}`),
        details: contact.information,
      }
    }, checksContactsPhones)
    this.setState({
      dataCVS,
      headers: [
        { label: t('phone'), key: 'phone' },
        { label: t('name'), key: 'name' },
        { label: t('owner'), key: 'owner' },
        { label: t('gender'), key: 'gender' },
        { label: t('typeCompany'), key: 'typeCompany' },
        { label: t('language'), key: 'languageName' },
        { label: t('status'), key: 'statusDescription' },
        { label: t('location'), key: 'locationName' },
        {
          label: t('lastConversationsInDays'),
          key: 'lastConversationInDays',
        },
        { label: t('details'), key: 'details' },
      ],
    })
  }

  setRowColor(idStatus) {
    let color
    switch (idStatus) {
      case ID_STATUS_AVAILABLE:
        color = 'text-success'
        break
      case ID_STATUS_BIBLE_STUDY:
      case ID_STATUS_RETURN_VISIT:
        color = 'bg-warning'
        break
      default:
        color = ''
    }
    return color
  }

  setSubRowVisible(contact) {
    if (
      (contact.idStatus === ID_STATUS_RETURN_VISIT ||
        contact.idStatus === ID_STATUS_BIBLE_STUDY) &&
      !isEmpty(getOr('', 'publisherName', contact))
    ) {
      return ''
    }
    return 'd-none'
  }

  render() {
    const { t } = this.props
    const {
      data,
      pagination,
      submitting,
      checksContactsPhones,
      statusForbidden,
      error,
      hiddenFilter,
      headers,
      dataCVS,
    } = this.state
    const colSpan = '10'
    return (
      <ContainerCRUD title={t('listTitle')} {...this.props}>
        <Row>
          <Col xs={12} lg={3} xl={2} className={hiddenFilter ? 'd-none' : ''}>
            <FilterData
              handleFilters={this.handleGetAll}
              refresh={submitting}
              error={error}
              showTypeCompany={true}
              getFilters={contacts.getAllFilters}
            />
          </Col>
          <Col xs={12} lg={hiddenFilter ? 12 : 9} xl={hiddenFilter ? 12 : 10}>
            <Table striped bordered hover responsive size="sm">
              <thead>
                <Search
                  onFilter={this.handleGetAll}
                  fields={['name', 'phone', 'note', 'owner']}
                  colspan={colSpan}
                  toggleFilter={this.toggleFilter}
                />
                <tr>
                  <th>
                    <Form.Check
                      type="checkbox"
                      id="checkall"
                      name=""
                      label=""
                      value="all"
                      onClick={this.handleCheckAll}
                    />
                  </th>
                  <th>{t('phone')}</th>
                  <th className="d-none d-sm-table-cell">{t('name')}</th>
                  <th className="d-none d-lg-table-cell">{t('typeCompany')}</th>
                  <th className="d-none d-lg-table-cell">{t('language')}</th>
                  <th className="d-none d-lg-table-cell">{t('status')}</th>
                  <th
                    style={{ maxWidth: '90px' }}
                    className="d-none d-lg-table-cell text-center"
                  >
                    {t('lastConversationsInDays')}
                  </th>
                  <th style={{ minWidth: '116px' }}>{t('details')}</th>
                  <th style={{ minWidth: '189px' }}>
                    <NewContact afterClose={this.handleGetAll} />{' '}
                    <SendPhones
                      checksContactsPhones={checksContactsPhones}
                      contactsData={data}
                      afterClose={this.afterSentPhones}
                    />{' '}
                    {isAtLeastElder() && (
                      <BatchChanges
                        checksContactsPhones={checksContactsPhones}
                        contactsData={data}
                        afterClose={this.handleGetAll}
                      />
                    )}{' '}
                    <CSVLink
                      data={dataCVS}
                      headers={headers}
                      filename={`${t('listTitle')}.csv`}
                      title={t('titleExportToCVS')}
                      className={`btn btn-primary ${
                        checksContactsPhones.length > 0 ? '' : 'disabled'
                      }`}
                      onClick={this.parseDataCVS}
                    >
                      <FontAwesomeIcon icon={faFileExcel} />
                    </CSVLink>
                  </th>
                </tr>
              </thead>
              <tbody>
                {submitting ? (
                  <tr>
                    <td colSpan={colSpan}>
                      <ReactPlaceholder
                        showLoadingAnimation={true}
                        type="text"
                        ready={!submitting}
                        rows={RECORDS_PER_PAGE}
                      />
                    </td>
                  </tr>
                ) : !isEmpty(data) ? (
                  map(
                    (contact) => (
                      <tr
                        key={contact.phone}
                        className={
                          contains(contact.idStatus, statusForbidden)
                            ? 'bg-danger'
                            : ''
                        }
                      >
                        <td>
                          <Form.Check
                            type="checkbox"
                            checked={contains(
                              contact.phone,
                              checksContactsPhones
                            )}
                            name="checksContactsPhones"
                            value={contact.phone}
                            className="checkBoxPhones"
                            onChange={this.handleOnClick}
                          />
                        </td>
                        <td>{contact.phone}</td>
                        <td className="d-none d-sm-table-cell">
                          {contact.name}
                          <div className={this.setSubRowVisible(contact)}>
                            <Form.Text
                              className={`text-muted ${this.setRowColor(
                                contact.idStatus
                              )}`}
                            >
                              {t('lastSpokeToPublisherName')}:{' '}
                              {contact.publisherName}
                            </Form.Text>
                          </div>
                        </td>
                        <td className="d-none d-lg-table-cell">
                          {t(
                            `${
                              contact.typeCompany ? 'commercial' : 'residential'
                            }`
                          )}
                        </td>
                        <td className="d-none d-lg-table-cell">
                          {t(`languages:${contact.languageName}`)}
                        </td>
                        <td
                          className={`d-none d-lg-table-cell ${this.setRowColor(
                            contact.idStatus
                          )}`}
                        >
                          {t(`status:${contact.statusDescription}`)}
                        </td>
                        <td className="d-none d-lg-table-cell">
                          {t(`${contact.lastConversationInDays}`)}
                        </td>
                        <td>
                          <ListDetailsContact
                            contact={contact}
                            id={contact.phone}
                            afterClose={() => this.handleGetAll()}
                          />{' '}
                          <Button
                            title={t('common:list')}
                            variant="success"
                            as={Link}
                            to={`/contacts/${encodeURI(contact.phone)}/details`}
                          >
                            <FontAwesomeIcon icon={faList} />
                          </Button>
                        </td>
                        <td>
                          <EditContact
                            id={contact.phone}
                            afterClose={() => this.handleGetAll()}
                          />{' '}
                          <AskDelete
                            id={contact.phone}
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
                      onClick={this.handleGetAll}
                      submitting={submitting}
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

export default withTranslation([
  'contacts',
  'common',
  'detailsContacts',
  'languages',
  'status',
])(Contacts)
