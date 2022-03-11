import {
  map,
  getOr,
  isEmpty,
  pipe,
  uniq,
  compact,
  remove,
  find,
  isNil,
  contains,
} from 'lodash/fp'
import { parseQuery, setFiltersToURL, formatDateDMYHHmm, formatDateDMY, diffDate } from './forms'
import { MAX_DAYS_ALLOWED_WITH_NUMBERS } from '../constants/application'
import {
  ID_STATUS_AVAILABLE,
  ID_STATUS_BIBLE_STUDY,
  ID_STATUS_RETURN_VISIT,
  ID_STATUS_SEND_TO_OTHER_CONG,
} from '../constants/status'

export function handleFilter({ objQuery, componentReact }) {
  const queryParams = parseQuery(objQuery, componentReact.state)
  setFiltersToURL(queryParams, componentReact.props)
}

export function uncheckCheckboxSelectAll() {
  const checkAllEl = document.getElementById('checkall')
  if (checkAllEl) checkAllEl.checked = false
}

export function handleOnClick({ event, componentReact }) {
  const {
    target: { value, checked },
  } = event
  const newValues = checked
    ? pipe(uniq, compact)([...componentReact.state.checksContactsPhones, value])
    : remove(
        (valueSaved) => valueSaved === value,
        componentReact.state.checksContactsPhones
      )

  componentReact.setState({
    checksContactsPhones: newValues,
  })
}

export function toggleFilter(componentReact) {
  componentReact.setState({
    hiddenFilter: !getOr(false, 'hiddenFilter', componentReact.state),
  })
}

export function parseDataCVS(componentReact) {
  const { t } = componentReact.props
  const { checksContactsPhones, data } = componentReact.state
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
  componentReact.setState({
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

export function setRowColor(idStatus) {
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

export function setSubRowVisible(contact) {
  if (
    contact.idStatus === ID_STATUS_SEND_TO_OTHER_CONG ||
    ((contact.idStatus === ID_STATUS_RETURN_VISIT ||
      contact.idStatus === ID_STATUS_BIBLE_STUDY) &&
      !isEmpty(getOr('', 'publisherName', contact)))
  ) {
    return {}
  }
  return { visibility: 'hidden' }
}

export function thisDateAlreadyReachedMaxAllowed({
  waitingFeedback,
  lastConversationInDays,
}) {
  return (
    waitingFeedback &&
    lastConversationInDays !== '99999999999' &&
    lastConversationInDays > MAX_DAYS_ALLOWED_WITH_NUMBERS
  )
}

export function getStyleForFieldDays(contact) {
  return thisDateAlreadyReachedMaxAllowed(contact) ? ' text-danger' : ''
}

export function setBackgroundForbidden({ contact, componentReact }) {
  return contains(contact.idStatus, componentReact.state.statusForbidden)
    ? 'bg-danger'
    : ''
}

export function getInformationAboveName({ contact, componentReact }) {
  const { t } = componentReact.props
  return (
    <span className="text-light ml-1">
      {setBackgroundForbidden({ contact, componentReact }) === 'bg-danger'
        ? t('common:updatedByAt', {
            name: contact.publisherNameUpdatedBy,
            date: formatDateDMYHHmm(contact.updatedAt),
          })
        : `${t('lastSpokeToPublisherName')}: ${contact.publisherName}`}
    </span>
  )
}

export function handleCheckAll({ event, componentReact }) {
  const {
    target: { checked },
  } = event

  const newValues = checked
    ? map((contact) => contact.phone, componentReact.state.data)
    : []
  componentReact.setState({ checksContactsPhones: newValues })
}

export function showInformationAboutCampaign({
  detailContact,
  componentReact,
}) {
  const { t } = componentReact.props
  const { campaignActive } = componentReact.context

  return (
    !campaignActive &&
    detailContact.campaignName && (
      <p className="contactedDuringCampaign ml-1">
        <small>
          {t('detailsContacts:campaignName', {
            campaignName: detailContact.campaignName,
          })}
        </small>
      </p>
    )
  )
}

export function getDateWithDays(date) {
  const { t } = this.props

  return `${formatDateDMY(date)} (${t('diffDate', {
    days: diffDate(date),
  })})`
}
