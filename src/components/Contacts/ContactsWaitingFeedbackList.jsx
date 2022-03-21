import React from 'react'
import { CSVLink } from 'react-csv'
import { withTranslation } from 'react-i18next'
import ReactPlaceholder from 'react-placeholder'
import { Checkbox } from 'pretty-checkbox-react'
import { Table, Row, Col } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { map, getOr, isEmpty, contains, isEqual } from 'lodash/fp'
import {
  faFileExcel,
  faHourglass,
  faUndo,
} from '@fortawesome/free-solid-svg-icons'

import {
  handleFilter,
  toggleFilter,
  handleCheckAll,
  parseDataCVS,
  handleOnClick,
  thisDateAlreadyReachedMaxAllowed,
  getStyleForFieldDays,
  uncheckCheckboxSelectAll,
} from '../../utils/contactsHelper'
import { details } from '../../services'
import { showError } from '../../utils/generic'
import { RECORDS_PER_PAGE } from '../../constants/application'
import { ApplicationContext } from '../../contexts/application'
import { showInformationAboutCampaign } from '../../utils/contactsHelper'
import { formatDateDMY, getQueryParamsFromURL } from '../../utils/forms'

import Search from '../common/Search/Search'
import SendPhones from './SendPhones/SendPhones'
import AskDelete from '../common/AskDelete/AskDelete'
import NoRecords from '../common/NoRecords/NoRecords'
import Pagination from '../common/Pagination/Pagination'
import FilterData from '../common/FilterData/FilterData'
import OurToolTip from '../common/OurToolTip/OurToolTip'
import ContainerCRUD from '../common/ContainerCRUD/ContainerCRUD'
import EditDetailsContact from '../DetailsContact/Modal/EditDetailsContact'
import AssignNewPublisher from './AssignNewPublisher/AssignNewPublisher'
import './styles.css'

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
          campaigns: [],
        }),
      },
    }
    this.handleGetAll = this.handleGetAll.bind(this)
    this.handleDelete = this.handleDelete.bind(this)
  }

  async handleGetAll() {
    this.setState({ submitting: true, checksContactsPhones: [] })
    uncheckCheckboxSelectAll()
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

  componentDidMount() {
    this.handleGetAll()
  }

  componentDidUpdate(prevProps, prevState) {
    const { submitting } = this.state
    const prevSubmitting = prevState.submitting
    const prevQueryParams = prevState.queryParams
    const queryParams = getQueryParamsFromURL(this.props)
    if (
      !submitting &&
      !prevSubmitting &&
      queryParams &&
      !isEqual(queryParams, prevQueryParams)
    ) {
      this.handleGetAll()
    }
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

  getFilterQueryParams() {
    const { campaignActive } = this.context
    return campaignActive
      ? {
          toOmit: JSON.stringify(['campaigns']),
        }
      : {}
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
    const filtersParams = this.getFilterQueryParams()

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
              handleFilters={(objQuery) =>
                handleFilter({ objQuery, componentReact: this })
              }
              refresh={submitting}
              error={error}
              showTypeCompany={true}
              getFilters={() => details.getAllWaitingFeedbackFilters(filtersParams)}
            />
          </Col>
          <Col xs={12} lg={hiddenFilter ? 12 : 9} xl={hiddenFilter ? 12 : 10}>
            <Table striped bordered hover responsive size="sm">
              <thead>
                <Search
                  filters={filtersParsed}
                  onFilter={(objQuery) =>
                    handleFilter({
                      objQuery,
                      componentReact: this,
                    })
                  }
                  fields={[
                    'name',
                    'phone',
                    'responsible',
                    'creator',
                    'note',
                    'owner',
                  ]}
                  colspan={colSpan}
                  toggleFilter={() => toggleFilter(this)}
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
                      onClick={(event) =>
                        handleCheckAll({
                          event,
                          componentReact: this,
                        })
                      }
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
                      afterClose={this.handleGetAll}
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
                      onClick={() => parseDataCVS(this, true)}
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
                            onChange={(event) =>
                              handleOnClick({
                                event,
                                componentReact: this,
                              })
                            }
                          />
                        </td>
                        <td>{detailContact.phone}</td>
                        <td className="d-none d-sm-table-cell">
                          {detailContact.contactName}
                          {showInformationAboutCampaign({
                            detailContact,
                            componentReact: this,
                          })}
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
                            showTooltip={thisDateAlreadyReachedMaxAllowed(
                              detailContact
                            )}
                            getStyleForFieldDays={() =>
                              getStyleForFieldDays(detailContact)
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
                            icon={faUndo}
                            buttonTitleTranslated={t('giveBack')}
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

ContactsWaitingFeedbackList.contextType = ApplicationContext

export default withTranslation([
  'contacts',
  'common',
  'detailsContacts',
  'languages',
  'status',
])(ContactsWaitingFeedbackList)
