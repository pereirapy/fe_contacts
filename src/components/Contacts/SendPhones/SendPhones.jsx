import React from 'react'
import Swal from 'sweetalert2'
import { withTranslation } from 'react-i18next'
import SimpleReactValidator from 'simple-react-validator'
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

import {
  getLocale,
  handleInputChangeGeneric,
  formatDateDMY,
} from '../../../utils/forms'
import { EIcons } from '../../../enums/icons'
import { contacts, publishers } from '../../../services'
import { URL_SEND_MESSAGE } from '../../../constants/settings'
import { WAITING_FEEDBACK } from '../../../constants/contacts'
import { showError, showSuccessful } from '../../../utils/generic'
import { ApplicationContext } from '../../../contexts/application'
import { reducePublishers } from '../../../stateReducers/publishers'

import FormSendPhones from './FormSendPhones'
import OurModal from '../../common/OurModal/OurModal'
import ElementError from '../../common/ElementError/ElementError'

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
    this.resetForm = this.resetForm.bind(this)


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

  getDetailsLastConversation({ information }) {
    const { t } = this.props

    return information === WAITING_FEEDBACK
      ? t(`contacts:${information}`)
      : information
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
      ? `${this.getDetailsLastConversation(contact)} - ${formatDateDMY(
          contact.createdAtDetailsContacts
        )}`
      : t('common:withoutDetails')
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
      showSuccessful(t)
      onHide()
    } catch (error) {
      const phone = getOr(0, 'response.data.extra.phone', error)
      this.setState({ submitting: false })
      if (phone)
        showError(error, t, 'sendPhones', {
          paramsExtraForTranslation: { phone },
        })
      else showError(error, t, 'sendPhones')
    }
  }

  resetForm() {
    this.setState({ form: fields, submitting: false, validated: false })
    this.validator.hideMessages()
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
    const { form, validated, publishersOptions, submitting, loading } =
      this.state
    const { t, checksContactsPhones, afterClose } = this.props
    return (
      <OurModal
        body={FormSendPhones}
        validator={this.validator}
        loading={loading}
        submitting={submitting}
        validated={validated}
        handleSubmit={this.handleSubmit}
        handleInputChange={this.handleInputChange}
        form={form}
        phones={join(', ', checksContactsPhones)}
        publishersOptions={publishersOptions}
        onExit={afterClose}
        onClose={this.resetForm}
        onEnter={this.onEnter}
        title={this.getTitle()}
        buttonTitle={t('common:sendOverWhatsApp')}
        buttonIcon={EIcons.whatsappIcon}
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
