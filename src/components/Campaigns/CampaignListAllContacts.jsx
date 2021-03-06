import React from 'react'
import { CSVLink } from 'react-csv'
import { Link } from 'react-router-dom'
import { withTranslation } from 'react-i18next'
import ReactPlaceholder from 'react-placeholder'
import { Checkbox } from 'pretty-checkbox-react'
import { Table, Row, Col, Form } from 'react-bootstrap'
import { map, getOr, isEmpty, contains, isEqual } from 'lodash/fp'

import {
  handleFilter,
  toggleFilter,
  handleCheckAll,
  parseDataCVS,
  setBackgroundForbidden,
  handleOnClick,
  setSubRowVisible,
  setRowColor,
  getInformationAboveName,
  thisDateAlreadyReachedMaxAllowed,
  getToolTipVariant,
  uncheckCheckboxSelectAll,
} from '../../utils/contactsHelper'
import {
  ID_STATUS_NO_VISIT,
  ID_STATUS_SEND_TO_OTHER_CONG,
} from '../../constants/status'
import { EIcons } from '../../enums/icons'
import { showError } from '../../utils/generic'
import { campaigns, details } from '../../services'
import { getQueryParamsFromURL } from '../../utils/forms'
import { RECORDS_PER_PAGE } from '../../constants/application'
import { ApplicationContext } from '../../contexts/application'

import Icon from '../common/Icon/Icon'
import Button from '../common/Button/Button'
import Search from '../common/Search/Search'
import EditContact from '../Contacts/EditContact'
import AskDelete from '../common/AskDelete/AskDelete'
import NoRecords from '../common/NoRecords/NoRecords'
import Pagination from '../common/Pagination/Pagination'
import FilterData from '../common/FilterData/FilterData'
import OurToolTip from '../common/OurToolTip/OurToolTip'
import ContainerCRUD from '../common/ContainerCRUD/ContainerCRUD'
import ListDetailsContact from '../DetailsContact/Modal/ListDetailsContact'
import './styles.css'

class CampaignListAllContacts extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      data: [],
      headers: [],
      dataCVS: [],
      error: false,
      hiddenFilter: false,
      checksContactsPhones: [],
      loading: false,
      pagination: {},
      campaignData: null,
      statusForbidden: [ID_STATUS_NO_VISIT, ID_STATUS_SEND_TO_OTHER_CONG],
      queryParams: {
        sort: '"idStatus":ASC,name:IS NULL DESC,name:ASC',
        perPage: RECORDS_PER_PAGE,
        currentPage: 1,
        filters: JSON.stringify({
          name: '',
          owner: '',
          phone: '',
          note: '',
          typeCompany: '-1',
          typeContact: '0',
          modeAllContacts: props.modeAllContacts ? '-1' : '0',
          genders: [],
          languages: [],
          status: [],
        }),
      },
    }
    this.handleGetAll = this.handleGetAll.bind(this)
    this.handleDelete = this.handleDelete.bind(this)
  }

  async handleGetAll() {
    this.setState({ loading: true, checksContactsPhones: [] })
    uncheckCheckboxSelectAll()
    const { t } = this.props
    try {
      const queryParams = getQueryParamsFromURL(this.props)
        ? getQueryParamsFromURL(this.props)
        : this.state.queryParams
      const id = getOr(0, 'props.match.params.id', this)
      const campaignResponse = await campaigns.getOne(id)
      const response = await campaigns.getAllContactsOne(id, queryParams)
      const error = getOr([], 'data.errors[0]', response)
      if (isEmpty(error)) {
        this.setState({
          data: getOr([], 'data.data.list', response),
          campaignData: getOr(null, 'data.data', campaignResponse),
          pagination: getOr({}, 'data.data.pagination', response),
          loading: false,
          error: false,
          queryParams,
        })
      } else {
        this.setState({
          error,
          loading: false,
        })
        showError(error, t, 'campaigns')
      }
    } catch (error) {
      this.setState({
        error,
        loading: false,
      })
      showError(error, t, 'campaigns')
    }
  }

  async handleDelete(id) {
    const { t } = this.props
    this.setState({ loading: true })
    await details
      .dellOne(id)
      .then(() => {
        this.handleGetAll()
      })
      .catch((error) => {
        this.setState({ loading: false })
        showError(error, t, 'contacts')
      })
  }

  componentDidMount() {
    const { isPublisher } = this.context
    if (isPublisher) {
      const { history } = this.props
      history.push('/')
    } else {
      this.handleGetAll()
    }
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
    const { campaignData } = this.state
    const title = t('campaigns:listAllTitle', { campaign: campaignData?.name })
    return onlyText ? title : <Icon name={EIcons.bullhornIcon} label={title} />
  }

  render() {
    const { t, history } = this.props
    const {
      data,
      pagination,
      loading,
      checksContactsPhones,
      error,
      hiddenFilter,
      headers,
      dataCVS,
      queryParams: { filters },
    } = this.state
    const colSpan = '10'

    const idCampaign = getOr(0, 'props.match.params.id', this)

    const filtersParsed = JSON.parse(filters)
    return (
      <ContainerCRUD
        color={'success'}
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
              showTypeCompany={true}
              getFilters={() => campaigns.getAllContactsOneFilters(idCampaign)}
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
                  fields={['name', 'phone', 'note', 'owner']}
                  colspan={colSpan}
                  toggleFilter={() => toggleFilter(this)}
                  history={history}
                />
                <tr>
                  <th style={{ width: '60px' }}>
                    <Checkbox
                      id="checkall"
                      name="all"
                      value="all"
                      onClick={(event) =>
                        handleCheckAll({
                          event,
                          componentReact: this,
                        })
                      }
                      color="success"
                      className="marginLeftCheckbox"
                      bigger
                      animation="pulse"
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
                    {t('lastConversationInDays')}
                  </th>
                  <th className="d-none d-lg-table-cell">
                    {t('waitingFeedback')}
                  </th>
                  <th style={{ minWidth: '116px' }}>{t('details')}</th>
                  <th style={{ minWidth: '189px' }}>
                    <CSVLink
                      data={dataCVS}
                      headers={headers}
                      filename={`${t('listTitle')}.csv`}
                      title={t('titleExportToCVS')}
                      onClick={() => parseDataCVS(this, false)}
                    >
                      <Button
                        margin={false}
                        iconName={EIcons.fileExcelIcon}
                        className={`${
                          checksContactsPhones.length > 0 ? '' : 'disabled'
                        }`}
                      />
                    </CSVLink>
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
                    (contact) => (
                      <tr
                        key={contact.phone}
                        className={setBackgroundForbidden({
                          contact,
                          componentReact: this,
                        })}
                      >
                        <td style={{ minWidth: '60px' }}>
                          <Checkbox
                            checked={contains(
                              contact.phone,
                              checksContactsPhones
                            )}
                            name="checksContactsPhones"
                            value={contact.phone}
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
                        <td>{contact.phone}</td>
                        <td className="d-none d-sm-table-cell verticalBottom">
                          <span>{contact.name}</span>
                          <div style={setSubRowVisible(contact)}>
                            <Form.Text
                              className={`text-muted ${setRowColor(
                                contact.idStatus
                              )}`}
                            >
                              {getInformationAboveName({
                                contact,
                                componentReact: this,
                              })}
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
                          className={`d-none d-lg-table-cell ${setRowColor(
                            contact.idStatus
                          )}`}
                        >
                          {t(`status:${contact.statusDescription}`)}
                        </td>
                        <td className="d-none d-lg-table-cell">
                          <OurToolTip
                            info={t(contact.lastConversationInDays)}
                            toolTipContent={t('toolTipWaitingFeedback')}
                            showTooltip={thisDateAlreadyReachedMaxAllowed(
                              contact
                            )}
                            getToolTipVariant={() => getToolTipVariant(contact)}
                          />
                        </td>
                        <td
                          className={`d-none d-lg-table-cell text-${
                            contact.waitingFeedback ? 'danger' : 'success'
                          }`}
                        >
                          {t(
                            `common:${contact.waitingFeedback ? 'yes' : 'no'}`
                          )}
                        </td>
                        <td>
                          <ListDetailsContact
                            contact={contact}
                            id={contact.phone}
                            afterClose={() => this.handleGetAll()}
                          />
                          <Button
                            title={t('common:list')}
                            variant="secondary"
                            as={Link}
                            to={`/contacts/${encodeURI(contact.phone)}/details`}
                            iconName={EIcons.listIcon}
                          />
                        </td>
                        <td>
                          <AskDelete
                            id={contact.idDetailContact}
                            title={t('deleteRecordWaitingFeedback')}
                            funcToCallAfterConfirmation={this.handleDelete}
                          />
                          <EditContact
                            id={contact.phone}
                            afterClose={this.handleGetAll}
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
      </ContainerCRUD>
    )
  }
}

CampaignListAllContacts.contextType = ApplicationContext

export default withTranslation([
  'contacts',
  'campaigns',
  'common',
  'detailsContacts',
  'languages',
  'status',
])(CampaignListAllContacts)
