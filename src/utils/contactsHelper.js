import {
  parseQuery,
  setFiltersToURL,
  formatDateDMYHHmm,
  diffDate,
} from './forms'
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
  some,
} from 'lodash/fp'
import {
  ID_STATUS_AVAILABLE,
  ID_STATUS_BIBLE_STUDY,
  ID_STATUS_RETURN_VISIT,
  ID_STATUS_SEND_TO_OTHER_CONG,
} from '../constants/status'
import { MAX_DAYS_ALLOWED_WITH_NUMBERS } from '../constants/application'

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

function getHeaders(t, isWaitingFeedback) {
  const headersGeneric = [
    { label: t('phone'), key: 'phone' },
    { label: t('name'), key: 'name' },
    { label: t('owner'), key: 'owner' },
    { label: t('gender'), key: 'gender' },
    { label: t('typeCompany'), key: 'typeCompany' },
    { label: t('language'), key: 'languageName' },
    { label: t('status'), key: 'statusDescription' },
    { label: t('location'), key: 'locationName' },
  ]

  return isWaitingFeedback
    ? [
        ...headersGeneric,
        {
          label: t('publisherCreatedBy'),
          key: 'publisherNameCreatedBy',
        },
        { label: t('publisherResponsible'), key: 'publisherName' },
      ]
    : [
        ...headersGeneric,
        {
          label: t('lastConversationsInDays'),
          key: 'lastConversationInDays',
        },
        { label: t('details'), key: 'details' },
      ]
}

export function parseDataCVS(componentReact, isWaitingFeedback) {
  const { t } = componentReact.props
  const { checksContactsPhones, data } = componentReact.state
  const headers = getHeaders(t, isWaitingFeedback)

  const dataCVS = map((phone) => {
    const contact = find((item) => item.phone === phone, data)
    const basicData = {
      ...contact,
      gender: t(contact.gender),
      typeCompany: t(`${contact.typeCompany ? 'commercial' : 'residential'}`),
      languageName: t(`languages:${contact.languageName}`),
      statusDescription: t(`status:${contact.statusDescription}`),
      locationName: isNil(contact.idLocation)
        ? t('unknownLocation')
        : `${contact.locationName} - ${contact.departmentName}`,
    }
    if (isWaitingFeedback) {
      return basicData
    } else {
      return {
        ...basicData,
        lastConversationInDays: t(`${contact.lastConversationInDays}`),
        details: t(`detailsContacts:${contact.information}`),
      }
    }
  }, checksContactsPhones)

  componentReact.setState({
    dataCVS,
    headers,
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

export function thisDateAlreadyReachedMaxAllowed(contact) {
  if (contact.waitingFeedback) {
    const days = diffDate(contact.createdAt)
    return days > MAX_DAYS_ALLOWED_WITH_NUMBERS
  } else {
    return (
      contact.lastConversationInDays !== '99999999999' &&
      contact.lastConversationInDays > MAX_DAYS_ALLOWED_WITH_NUMBERS
    )
  }
}

export function getStyleForFieldDays(contact) {
  return thisDateAlreadyReachedMaxAllowed(contact) ? 'link text-danger' : 'link'
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

export function getLastPublisherThatTouched({ detail, componentReact }) {
  const { t } = componentReact.props

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

export function isWaitingFeedback(response) {
  return some({ waitingFeedback: true }, getOr([], 'data.data.list', response))
}
