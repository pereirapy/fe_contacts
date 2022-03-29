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
  handleOnClick,
  uncheckCheckboxSelectAll,
  setBackgroundForbidden,
  getInformationAboveName,
  setSubRowVisible,
  setRowColor,
  showInformationAboutCampaign,
  setTitleWhenNumberWasContactedDuringCampaign,
  verifyIfWasContactedDuringCurrentCampaign,
} from '../../utils/contactsHelper'
import {
  ID_STATUS_NO_VISIT,
  ID_STATUS_SEND_TO_OTHER_CONG,
} from '../../constants/status'
import { contacts } from '../../services'
import { EIcons } from '../../enums/icons'
import { showError } from '../../utils/generic'
import { getQueryParamsFromURL } from '../../utils/forms'
import { RECORDS_PER_PAGE } from '../../constants/application'
import { ApplicationContext } from '../../contexts/application'

import NewContact from './NewContact'
import EditContact from './EditContact'
import Icon from '../common/Icon/Icon'
import Button from '../common/Button/Button'
import Search from '../common/Search/Search'
import SendPhones from './SendPhones/SendPhones'
import AskDelete from '../common/AskDelete/AskDelete'
import NoRecords from '../common/NoRecords/NoRecords'
import BatchChanges from './BatchChanges/BatchChanges'
import Pagination from '../common/Pagination/Pagination'
import FilterData from '../common/FilterData/FilterData'
import ContainerCRUD from '../common/ContainerCRUD/ContainerCRUD'
import ListDetailsContact from '../DetailsContact/Modal/ListDetailsContact'
import './styles.css'

const defaultSort =
  '"waitingFeedback":DESC,"idStatus":ASC,name:IS NULL DESC,name:ASC'
const sortNoCampaign =
  '"idStatus":ASC,"lastConversationInDays":DESC,name:IS NULL DESC,name:ASC'

class Contacts extends React.Component {
  constructor(props) {
    super(props)

    const modeAllContacts = props.modeAllContacts ? '-1' : '0'

    this.state = {
      data: [],
      headers: [],
      dataCVS: [],
      error: false,
      hiddenFilter: false,
      checksContactsPhones: [],
      loading: false,
      pagination: {},
      statusForbidden: [ID_STATUS_NO_VISIT, ID_STATUS_SEND_TO_OTHER_CONG],
      queryParams: {
        sort: defaultSort,
        perPage: RECORDS_PER_PAGE,
        currentPage: 1,
        filters: JSON.stringify({
          name: '',
          owner: '',
          phone: '',
          note: '',
          typeCompany: '-1',
          modeAllContacts,
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

  async handleGetAll(newQueyParams) {
    this.setState({ loading: true, checksContactsPhones: [] })
    uncheckCheckboxSelectAll()
    const { t } = this.props
    try {
      const queryParams = getQueryParamsFromURL(this.props)
        ? getQueryParamsFromURL(this.props)
        : this.state.queryParams
      const lastQueryParams = newQueyParams ? newQueyParams : queryParams
      const response = await contacts.getAll(lastQueryParams)
      const error = getOr([], 'data.errors[0]', response)
      if (isEmpty(error)) {
        this.setState({
          data: getOr([], 'data.data.data.data.list', response),
          pagination: getOr({}, 'data.data.data.data.pagination', response),
          loading: false,
          error: false,
          queryParams: lastQueryParams,
        })
      } else {
        this.setState({
          error,
          loading: false,
        })
        showError(error, t, 'contacts')
      }
    } catch (error) {
      this.setState({
        error,
        loading: false,
      })
      showError(error, t, 'contacts')
    }
  }

  async handleDelete(id) {
    const { t } = this.props
    this.setState({ loading: true })
    await contacts
      .dellOne(id)
      .then(() => {
        this.handleGetAll()
      })
      .catch((error) => {
        this.setState({ loading: false })
        showError(error, t, 'contacts')
      })
  }

  updateSort() {
    const { campaignActive } = this.context
    const { modeAllContacts } = this.props
    const { queryParams } = this.state

    const sort =
      !campaignActive && !modeAllContacts ? sortNoCampaign : defaultSort
    const newQueyParams = {
      ...queryParams,
      sort,
    }

    this.setState({
      queryParams: newQueyParams,
    })
    return newQueyParams
  }

  componentDidMount() {
    const { isPublisher } = this.context
    const { history } = this.props

    if (isPublisher) {
      history.push('/')
    } else {
      const newQueyParams = this.updateSort()
      this.handleGetAll(newQueyParams)
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
    const { t, modeAllContacts } = this.props
    const title = modeAllContacts ? 'listAllTitle' : 'listTitle'
    const iconName = modeAllContacts
      ? EIcons.globeAmericasIcon
      : EIcons.checkDoubleIcon

    const { campaignActive } = this.context
    const campaignName =
      campaignActive && !modeAllContacts ? ` - ${campaignActive.name}` : ''
    const fullTitle = `${t(title)}${campaignName}`

    return onlyText ? (
      fullTitle
    ) : (
      <React.Fragment>
        <Icon name={iconName} />
        {fullTitle}
      </React.Fragment>
    )
  }

  getFilterQueryParams() {
    const { campaignActive } = this.context
    const { modeAllContacts } = this.props
    return campaignActive && !modeAllContacts
      ? {
          toOmit: JSON.stringify(['campaigns']),
        }
      : {}
  }

  render() {
    const { t, modeAllContacts } = this.props
    const { isAtLeastElder } = this.context
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
    const title = this.getTitle()
    const titleOnlyText = this.getTitle(true)
    const filtersParams = this.getFilterQueryParams()
    const filtersParsed = JSON.parse(filters)
    return (
      <ContainerCRUD
        color={modeAllContacts ? 'gray-dark' : 'success'}
        title={title}
        titleOnlyText={titleOnlyText}
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
              getFilters={() => contacts.getAllFilters(filtersParams)}
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
                    {t('lastConversationsInDays')}
                  </th>
                  {modeAllContacts && (
                    <th className="d-none d-lg-table-cell">
                      {t('waitingFeedback')}
                    </th>
                  )}
                  <th style={{ minWidth: '116px' }}>{t('details')}</th>
                  <th style={{ minWidth: '189px' }}>
                    <NewContact afterClose={this.handleGetAll} />
                    <SendPhones
                      checksContactsPhones={checksContactsPhones}
                      contactsData={data}
                      afterClose={this.handleGetAll}
                    />
                    {isAtLeastElder && (
                      <BatchChanges
                        checksContactsPhones={checksContactsPhones}
                        contactsData={data}
                        afterClose={this.handleGetAll}
                      />
                    )}
                    <CSVLink
                      data={dataCVS}
                      headers={headers}
                      filename={`${t(
                        modeAllContacts ? 'listAllTitle' : 'listTitle'
                      )}.csv`}
                      title={t('titleExportToCVS')}
                      onClick={() => parseDataCVS(this, false)}
                    >
                      <Button
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
                        title={setTitleWhenNumberWasContactedDuringCampaign({
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
                            disabled={verifyIfWasContactedDuringCurrentCampaign({contact, componentReact: this})}
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
                          {showInformationAboutCampaign({
                            detailContact: contact,
                            componentReact: this,
                            modeAllContacts,
                          })}
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
                          {t(contact.lastConversationInDays)}
                        </td>
                        {modeAllContacts && (
                          <td
                            className={`d-none d-lg-table-cell text-${
                              contact.waitingFeedback ? 'danger' : 'success'
                            }`}
                          >
                            {t(
                              `common:${contact.waitingFeedback ? 'yes' : 'no'}`
                            )}
                          </td>
                        )}
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
                          {!modeAllContacts && (
                            <EditContact
                              id={contact.phone}
                              afterClose={() => this.handleGetAll()}
                            />
                          )}
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

Contacts.contextType = ApplicationContext

export default withTranslation([
  'contacts',
  'common',
  'detailsContacts',
  'languages',
  'status',
])(Contacts)
