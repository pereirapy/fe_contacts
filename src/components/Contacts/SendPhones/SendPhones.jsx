import React from 'react'
import { withTranslation } from 'react-i18next'
import OurModal from '../../common/OurModal/OurModal'
import ElementError from '../../common/ElementError/ElementError'
import {
  getOr,
  map,
  get,
  find,
  pipe,
  join,
  compact,
  isEmpty,
  isNil,
} from 'lodash/fp'
import SimpleReactValidator from 'simple-react-validator'
import {
  getLocale,
  handleInputChangeGeneric,
  formatDateDMYHHmm,
} from '../../../utils/forms'
import { contacts, publishers } from '../../../services'
import FormSendPhones from './FormSendPhones'
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { URL_SEND_MESSAGE } from '../../../constants/settings'
import { showError, showSuccessful } from '../../../utils/generic'
import { reducePublishers } from '../../../stateReducers/publishers'
import Swal from 'sweetalert2'
import { ApplicationContext } from '../../../contexts/application'

const fields = {
  idPublisher: '',
}

class SendPhones extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      form: fields,
      submitting: false,
      loading: false,
      validated: false,
      publishersOptions: [],
    }

    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleGetPublishers = this.handleGetPublishers.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
    this.mappingContactsPhones = this.mappingContactsPhones.bind(this)
    this.getInformation = this.getInformation.bind(this)
    this.verifyIfThisUserHasPhone = this.verifyIfThisUserHasPhone.bind(this)
    this.onEnter = this.onEnter.bind(this)
    this.verifyIfSomePhoneIsWaitingFeedback =
      this.verifyIfSomePhoneIsWaitingFeedback.bind(this)
    this.getPhonesWaitingOrNotFeedback =
      this.getPhonesWaitingOrNotFeedback.bind(this)
    this.getTitle = this.getTitle.bind(this)

    this.validator = new SimpleReactValidator({
      autoForceUpdate: this,
      locale: getLocale(this.props),
      element: (message) => <ElementError message={message} />,
    })
  }

  onEnter() {
    this.verifyIfSomePhoneIsWaitingFeedback()
    this.handleGetPublishers()
  }

  async handleGetPublishers() {
    this.setState({ loading: true })
    const publishersOptions = reducePublishers(await publishers.getAllActives())

    this.setState({
      publishersOptions,
      loading: false,
    })
  }

  handleInputChange(event) {
    handleInputChangeGeneric(event, this)
  }

  getPhonesWaitingOrNotFeedback(waitingOrNot) {
    const { checksContactsPhones, contactsData } = this.props

    return pipe(
      map((phone) => {
        const contact = find((contact) => contact.phone === phone, contactsData)
        return contact && contact.waitingFeedback === waitingOrNot
          ? contact.phone
          : null
      }),
      compact
    )(checksContactsPhones)
  }

  verifyIfSomePhoneIsWaitingFeedback() {
    const phonesWaitingFeedback = this.getPhonesWaitingOrNotFeedback(true)
    if (phonesWaitingFeedback.length > 0) {
      const { t } = this.props
      const text =
        phonesWaitingFeedback.length > 1
          ? 'warningPhonesWaitingFeedback'
          : 'warningPhoneWaitingFeedback'
      Swal.fire({
        title: t('common:warning'),
        html: `${t(text, {
          total: phonesWaitingFeedback.length,
        })}<br/>${join(', ', phonesWaitingFeedback)}`,
        icon: 'warning',
      })
    }
  }

  getDataPublisherSelected(idPublisher) {
    const { publishersOptions } = this.state
    return pipe(
      find((publisher) => publisher.value === idPublisher),
      getOr(0, 'data')
    )(publishersOptions)
  }

  getInformation(contact) {
    const { t } = this.props
    const contactName = !isEmpty(contact.name)
      ? ` ${t('contacts:name') + ':'} ${contact.name} - `
      : ''
    const contactLanguage = !isEmpty(contact.languageName)
      ? ` ${t('languages:labelSelect') + ':'}  ${t(
          `languages:${contact.languageName}`
        )} - `
      : ''
    const contactGender = !isEmpty(contact.gender)
      ? ` ${t('contacts:gender') + ':'} ${t(`contacts:${contact.gender}`)} - `
      : ''

    const lastInformation = !isEmpty(contact.information)
      ? `${t(`contacts:${contact.information}`)} - ${formatDateDMYHHmm(
          contact.createdAtDetailsContacts
        )}`
      : t('withoutDetails')
    return contactName + contactGender + contactLanguage + lastInformation
  }

  mappingContactsPhones({ checksContactsPhones, contactsData }) {
    return map((phone) => {
      const contact = find((contact) => contact.phone === phone, contactsData)
      return `*${phone}:* ${this.getInformation(contact)}`
    }, checksContactsPhones)
  }

  parsePhonesToBeEasierToRead() {
    const { checksContactsPhones, contactsData } = this.props
    return pipe(
      this.mappingContactsPhones,
      join('\n'),
      (data) => '\n\n' + data,
      encodeURIComponent
    )({ checksContactsPhones, contactsData })
  }

  verifyIfThisUserHasPhone() {
    const { form } = this.state
    const { t } = this.props
    const idPublisher = get('idPublisher', form)
    const publisherData = this.getDataPublisherSelected(idPublisher)
    if (
      isEmpty(get('phone', publisherData)) ||
      isNil(get('phone', publisherData))
    ) {
      Swal.fire({
        title: t('noPhone'),
        icon: 'error',
      })
      return false
    }
    return true
  }

  sendMessage() {
    const { t } = this.props
    const { form } = this.state
    const idPublisher = get('idPublisher', form)
    const publisherData = this.getDataPublisherSelected(idPublisher)
    const textToSend = `${encodeURIComponent(
      t('messageToSend', { name: publisherData.name })
    )}: ${this.parsePhonesToBeEasierToRead()} `
    window.open(
      `${URL_SEND_MESSAGE}?phone=${publisherData.phone}&text=${textToSend}`
    )
  }

  async handleSubmit(onHide) {
    this.setState({ validated: true })

    if (!this.validator.allValid()) {
      this.validator.showMessages()
      return true
    }
    if (!this.verifyIfThisUserHasPhone()) return

    this.setState({ submitting: true })

    const { form } = this.state
    const { t } = this.props
    const { campaignActive } = this.context
    const idPublisher = get('idPublisher', form)
    const phones = this.getPhonesWaitingOrNotFeedback(false)
    const idCampaign = campaignActive ? campaignActive.id : null
    const dataAssign = {
      phones,
      idPublisher,
      idCampaign,
    }

    try {
      if (getOr([], 'phones', dataAssign).length > 0)
        await contacts.assign(dataAssign)
      this.sendMessage()
      this.setState({ submitting: false })
      showSuccessful(t)
      onHide()
      this.setState({ form: fields, submitting: false, validated: false })
      this.validator.hideMessages()
    } catch (error) {
      const phone = getOr(0, 'response.data.extra.phone', error)
      this.setState({ submitting: false })
      showError(error, t, 'sendPhones', {
        paramsExtraForTranslation: { phone },
      })
    }
  }

  getTitle() {
    const { t } = this.props
    const { campaignActive } = this.context
    const titleWithCampaignName = campaignActive
      ? `${t('title')} - ${campaignActive.name}`
      : t('title')
    return titleWithCampaignName
  }

  render() {
    const { form, validated, publishersOptions } = this.state
    const { t, checksContactsPhones, afterClose } = this.props
    return (
      <OurModal
        body={FormSendPhones}
        validator={this.validator}
        validated={validated}
        handleSubmit={this.handleSubmit}
        handleInputChange={this.handleInputChange}
        form={form}
        phones={join(', ', checksContactsPhones)}
        publishersOptions={publishersOptions}
        onExit={afterClose}
        onEnter={this.onEnter}
        title={this.getTitle()}
        buttonTitle={t('common:sendOverWhatsApp')}
        buttonText={<FontAwesomeIcon icon={faWhatsapp} />}
        buttonDisabled={checksContactsPhones.length === 0}
        buttonVariant="success"
      />
    )
  }
}

SendPhones.contextType = ApplicationContext

export default withTranslation([
  'sendPhones',
  'common',
  'contacts',
  'languages',
])(SendPhones)
