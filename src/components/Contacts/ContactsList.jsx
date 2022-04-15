import React from 'react'
import { Row, Col } from 'react-bootstrap'
import { withTranslation } from 'react-i18next'
import { getOr, isEmpty, isEqual } from 'lodash/fp'

import {
  handleFilter,
  uncheckCheckboxSelectAll,
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

import Table from './Table'
import Icon from '../common/Icon/Icon'
import FilterData from '../common/FilterData/FilterData'
import ContainerCRUD from '../common/ContainerCRUD/ContainerCRUD'
import './styles.css'

const sortDuringCampaign =
  '"waitingFeedback":DESC,"idStatus":ASC,name:IS NULL DESC,name:ASC'
const sortNoCampaign =
  '"idStatus":ASC,"lastConversationInDays":DESC,name:IS NULL DESC,name:ASC'

const modeAllContactsEnable = '-1'
const modeAllContactsDisabled = '0'

class Contacts extends React.Component {
  constructor(props) {
    super(props)

    const modeAllContacts = props.modeAllContacts
      ? modeAllContactsEnable
      : modeAllContactsDisabled

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
        sort: sortNoCampaign,
        perPage: RECORDS_PER_PAGE,
        currentPage: 1,
        filters: JSON.stringify({
          name: '',
          owner: '',
          phone: '',
          note: '',
          typeCompany: props.modeAllContacts ? '-1' : '0',
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
    this.updateSortState = this.updateSortState.bind(this)
  }

  async handleGetAll(newQueyParams) {
    this.setState({ loading: true, checksContactsPhones: [] })
    uncheckCheckboxSelectAll()
    const { t } = this.props
    try {
      const queryParams =
        getQueryParamsFromURL(this.props) || this.state.queryParams
      const lastQueryParams = newQueyParams || queryParams

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

  updateSortState(newSort) {
    const { campaignActive } = this.context
    const { modeAllContacts } = this.props
    const { queryParams } = this.state

    const defaultSort =
      !campaignActive && !modeAllContacts ? sortNoCampaign : sortDuringCampaign
    const sort = newSort || defaultSort
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
      const queryParams =
        getQueryParamsFromURL(this.props) || this.updateSortState()
      this.handleGetAll(queryParams)
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

    return onlyText ? fullTitle : <Icon name={iconName} label={fullTitle} />
  }

  getFilterQueryParams() {
    const { campaignActive } = this.context
    const { modeAllContacts } = this.props

    const modeAllContactsForURL = modeAllContacts
      ? modeAllContactsEnable
      : modeAllContactsDisabled

    return campaignActive && !modeAllContacts
      ? {
          toOmit: JSON.stringify(['campaigns']),
          modeAllContacts: modeAllContactsForURL,
        }
      : { modeAllContacts: modeAllContactsForURL }
  }

  render() {
    const { modeAllContacts } = this.props
    const {
      data,
      pagination,
      loading,
      checksContactsPhones,
      error,
      hiddenFilter,
      headers,
      dataCVS,
      queryParams: { filters, sort },
    } = this.state
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
            <Table
              filtersParsed={filtersParsed}
              modeAllContacts={modeAllContacts}
              data={data}
              checksContactsPhones={checksContactsPhones}
              loading={loading}
              dataCVS={dataCVS}
              headers={headers}
              componentReact={this}
              pagination={pagination}
              handleGetAll={this.handleGetAll}
              handleDelete={this.handleDelete}
              currentSort={sort}
              updateSortState={this.updateSortState}
              history={this.props.history}
            />
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
  'sendPhones',
])(Contacts)
