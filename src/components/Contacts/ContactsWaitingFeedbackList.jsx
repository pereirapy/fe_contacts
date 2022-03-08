import React from 'react'
import { Table, Row, Col } from 'react-bootstrap'
import { withTranslation } from 'react-i18next'
import { CSVLink } from 'react-csv'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileExcel, faHourglass } from '@fortawesome/free-solid-svg-icons'
import { Checkbox } from 'pretty-checkbox-react'
import ReactPlaceholder from 'react-placeholder'
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
  isEqual,
} from 'lodash/fp'
import {
  parseQuery,
  formatDateDMY,
  diffDate,
  setFiltersToURL,
  getQueryParamsFromURL,
} from '../../utils/forms'
import {
  RECORDS_PER_PAGE,
  MAX_DAYS_ALLOWED_WITH_NUMBERS,
} from '../../constants/application'

import { details } from '../../services'
import { ApplicationContext } from '../../contexts/application'
import { showError } from '../../utils/generic'
import './styles.css'

import Search from '../common/Search/Search'
import AskDelete from '../common/AskDelete/AskDelete'
import NoRecords from '../common/NoRecords/NoRecords'
import Pagination from '../common/Pagination/Pagination'
import FilterData from '../common/FilterData/FilterData'
import OurToolTip from '../common/OurToolTip/OurToolTip'
import SendPhones from './SendPhones/SendPhones'
import EditDetailsContact from '../DetailsContact/Modal/EditDetailsContact'
import AssignNewPublisher from './AssignNewPublisher/AssignNewPublisher'
import ContainerCRUD from '../../components/common/ContainerCRUD/ContainerCRUD'

class ContactsWaitingFeedbackList extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      data: [],
      error: false,
      hiddenFilter: false,
      checksContactsPhones: [],
      headers: [],
      dataCVS: [],
      submitting: false,
      pagination: {},
      queryParams: {
        sort: `"createdAt":ASC,"publisherName":ASC`,
        perPage: RECORDS_PER_PAGE,
        currentPage: 1,
        filters: JSON.stringify({
          name: '',
          owner: '',
          phone: '',
          responsible: '',
          creator: '',
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
    this.handleOnClick = this.handleOnClick.bind(this)
    this.toggleFilter = this.toggleFilter.bind(this)
    this.parseDataCVS = this.parseDataCVS.bind(this)
    this.handleFilter = this.handleFilter.bind(this)
  }

  uncheckCheckboxSelectAll() {
    document.getElementById('checkall').checked = false
  }

  handleFilter(objQuery) {
    const queryParams = parseQuery(objQuery, this.state)
    setFiltersToURL(queryParams, this.props)
  }

  async handleGetAll() {
    this.setState({ submitting: true, checksContactsPhones: [] })
    this.uncheckCheckboxSelectAll()
    const { t } = this.props
    try {
      const queryParams = getQueryParamsFromURL(this.props)
        ? getQueryParamsFromURL(this.props)
        : this.state.queryParams
      const response = await details.getAllWaitingFeedback(queryParams)
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
    await details
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

  componentDidMount() {
    this.handleGetAll()
  }

  componentDidUpdate(prevProps, prevState) {
    const { submitting } = this.state
    const prevSubmiting = prevState.submitting
    const prevQueryParams = prevState.queryParams
    const queryParams = getQueryParamsFromURL(this.props)
    if (
      !submitting &&
      !prevSubmiting &&
      queryParams &&
      !isEqual(queryParams, prevQueryParams)
    ) {
      this.handleGetAll()
    }
  }

  afterSentPhones() {
    this.handleGetAll()
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
      }
    }, checksContactsPhones)
    this.setState({
      dataCVS,
      headers: [
        { label: t('phone'), key: 'phone' },
        { label: t('name'), key: 'contactName' },
        { label: t('owner'), key: 'owner' },
        { label: t('gender'), key: 'gender' },
        { label: t('typeCompany'), key: 'typeCompany' },
        { label: t('language'), key: 'languageName' },
        { label: t('status'), key: 'statusDescription' },
        {
          label: t('publisherCreatedBy'),
          key: 'publisherNameCreatedBy',
        },
        { label: t('publisherResponsible'), key: 'publisherName' },
      ],
    })
  }

  getDateWithDays(date) {
    const { t } = this.props

    return `${formatDateDMY(date)} (${t('diffDate', {
      days: diffDate(date),
    })})`
  }

  thisDateAlreadyReachedMaxAllowed = (date) => {
    const days = diffDate(date)
    return days > MAX_DAYS_ALLOWED_WITH_NUMBERS
  }

  getStyleForFieldDays(date) {
    return this.thisDateAlreadyReachedMaxAllowed(date)
      ? 'link text-danger'
      : 'link'
  }

  getTitle(onlyText) {
    const { t } = this.props
    const { campaignActive } = this.context
    const campaignName = campaignActive ? ` - ${campaignActive.name}` : ''
    const title = `${t('titleWaitingFeedback')}${campaignName}`
    return onlyText ? (
      title
    ) : (
      <React.Fragment>
        <FontAwesomeIcon icon={faHourglass} /> {title}
      </React.Fragment>
    )
  }

  render() {
    const { t } = this.props
    const {
      data,
      pagination,
      submitting,
      checksContactsPhones,
      error,
      hiddenFilter,
      headers,
      dataCVS,
      queryParams: { filters },
    } = this.state
    const colSpan = '9'
    const filtersParsed = JSON.parse(filters)

    return (
      <ContainerCRUD
        color="warning"
        title={this.getTitle()}
        titleOnlyText={this.getTitle(true)}
        {...this.props}
      >
        <Row>
          <Col xs={12} lg={3} xl={2} className={hiddenFilter ? 'd-none' : ''}>
            <FilterData
              filters={filtersParsed}
              handleFilters={this.handleFilter}
              refresh={submitting}
              error={error}
              showTypeCompany={true}
              getFilters={details.getAllWaitingFeedbackFilters}
            />
          </Col>
          <Col xs={12} lg={hiddenFilter ? 12 : 9} xl={hiddenFilter ? 12 : 10}>
            <Table striped bordered hover responsive size="sm">
              <thead>
                <Search
                  filters={filtersParsed}
                  onFilter={this.handleFilter}
                  fields={[
                    'name',
                    'phone',
                    'responsible',
                    'creator',
                    'note',
                    'owner',
                  ]}
                  colspan={colSpan}
                  toggleFilter={this.toggleFilter}
                />
                <tr>
                  <th style={{ minWidth: '60px' }}>
                    <Checkbox
                      type="checkbox"
                      id="checkall"
                      name="checkall"
                      className="marginLeftCheckbox"
                      color="success"
                      bigger
                      animation="pulse"
                      value="all"
                      onClick={this.handleCheckAll}
                    />
                  </th>
                  <th>{t('phone')}</th>
                  <th className="d-none d-sm-table-cell">{t('name')}</th>
                  <th className="d-none d-lg-table-cell">{t('language')}</th>
                  <th className="d-none d-lg-table-cell">{t('status')}</th>
                  <th className="d-none d-lg-table-cell">
                    {t('publisherCreatedBy')}
                  </th>
                  <th className="d-none d-lg-table-cell">{t('createdAt')}</th>
                  <th className="d-none d-lg-table-cell">
                    {t('publisherResponsible')}
                  </th>
                  <th style={{ minWidth: '116px' }}>
                    <SendPhones
                      checksContactsPhones={checksContactsPhones}
                      contactsData={data}
                      afterClose={this.afterSentPhones}
                    />{' '}
                    <AssignNewPublisher
                      checksContactsPhones={checksContactsPhones}
                      contactsData={data}
                      afterClose={this.handleGetAll}
                    />{' '}
                    <CSVLink
                      data={dataCVS}
                      headers={headers}
                      filename={`${t('titleWaitingFeedback')}.csv`}
                      title={t('titleExportToCVSWaitingFeedback')}
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
                    (detailContact) => (
                      <tr key={detailContact.id}>
                        <td style={{ width: '60px' }}>
                          <Checkbox
                            type="checkbox"
                            checked={contains(
                              detailContact.phone,
                              checksContactsPhones
                            )}
                            name="checksContactsPhones"
                            value={detailContact.phone}
                            color="success"
                            className="marginLeftCheckbox"
                            bigger
                            onChange={this.handleOnClick}
                          />
                        </td>
                        <td>{detailContact.phone}</td>
                        <td className="d-none d-sm-table-cell">
                          {detailContact.contactName}
                        </td>
                        <td className="d-none d-lg-table-cell">
                          {t(`languages:${detailContact.languageName}`)}
                        </td>
                        <td className="d-none d-lg-table-cell">
                          {t(`status:${detailContact.statusDescription}`)}
                        </td>
                        <td className="d-none d-lg-table-cell">
                          {detailContact.publisherNameCreatedBy}
                        </td>
                        <td className="d-none d-lg-table-cell">
                          <OurToolTip
                            info={formatDateDMY(detailContact.createdAt)}
                            toolTipContent="toolTipWaitingFeedback"
                            showTooltip={this.thisDateAlreadyReachedMaxAllowed(
                              detailContact.createdAt
                            )}
                            getStyleForFieldDays={() =>
                              this.getStyleForFieldDays(detailContact.createdAt)
                            }
                          />
                        </td>
                        <td className="d-none d-lg-table-cell">
                          {detailContact.publisherName}
                        </td>
                        <td>
                          <EditDetailsContact
                            data={detailContact}
                            contact={detailContact}
                            id={detailContact.id}
                            afterClose={this.handleGetAll}
                          />{' '}
                          <AskDelete
                            id={detailContact.id}
                            title={t('deleteRecordWaitingFeedback')}
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
                      submitting={submitting}
                      onClick={this.handleFilter}
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

ContactsWaitingFeedbackList.contextType = ApplicationContext

export default withTranslation([
  'contacts',
  'common',
  'detailsContacts',
  'languages',
  'status',
])(ContactsWaitingFeedbackList)
