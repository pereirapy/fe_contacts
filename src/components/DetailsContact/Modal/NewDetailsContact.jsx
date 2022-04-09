import React from 'react'
import Swal from 'sweetalert2'
import { getOr, pick, get } from 'lodash/fp'
import { withTranslation } from 'react-i18next'
import OurModal from '../../common/OurModal/OurModal'
import SimpleReactValidator from 'simple-react-validator'

import {
  showError,
  showSuccessful,
  ifEmptySetNull,
} from '../../../utils/generic'
import {
  ID_LANGUAGE_DEFAULT,
  ID_GENDER_DEFAULT,
  ID_STATUS_DEFAULT,
  ID_LOCATION_DEFAULT,
} from '../../../constants/valuesPredefined'
import { EIcons } from '../../../enums/icons'
import { GENDER_UNKNOWN } from '../../../constants/contacts'
import { reduceLocations } from '../../../stateReducers/locations'
import { reducePublishers } from '../../../stateReducers/publishers'
import { getLocale, handleInputChangeGeneric } from '../../../utils/forms'
import { details, publishers, contacts, locations } from '../../../services'

import FormDetails from '../FormDetails'
import Icon from '../../common/Icon/Icon'
import Button from '../../common/Button/Button'
import ElementError from '../../common/ElementError/ElementError'

const fields = {
  information: '',
  idPublisher: '',
  idStatus: ID_STATUS_DEFAULT,
  idLanguage: ID_LANGUAGE_DEFAULT,
  idLocation: ID_LOCATION_DEFAULT,
  gender: ID_GENDER_DEFAULT,
  name: '',
  owner: '',
  typeCompany: '0',
}

class NewDetailsContact extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      form: fields,
      loading: false,
      submitting: false,
      validated: false,
      publishersOptions: [],
      locationsOptions: [],
    }

    this.handleSubmit = this.handleSubmit.bind(this)
    this.onOpen = this.onOpen.bind(this)
    this.notificationNotAllowedNewDetails =
      this.notificationNotAllowedNewDetails.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
    this.validator = new SimpleReactValidator({
      autoForceUpdate: this,
      locale: getLocale(this.props),
      element: (message) => <ElementError message={message} />,
    })
  }

  async onOpen() {
    this.setState({ loading: true })
    const { phone } = this.props
    const contact = await contacts.getOne(phone)
    const publishersOptions = reducePublishers(await publishers.getAll())
    const locationsOptions = reduceLocations(await locations.getAll())

    const form = getOr(fields, 'data.data', contact)
    const newForm = {
      ...fields,
      ...form,
    }
    this.setState({
      form: newForm,
      loading: false,
      publishersOptions,
      locationsOptions,
    })
  }

  handleInputChange(event) {
    handleInputChangeGeneric(event, this)
  }

  async handleSubmit(onHide) {
    this.setState({ validated: true })

    if (!this.validator.allValid()) {
      this.validator.showMessages()
      return true
    }
    this.setState({ submitting: true })

    const { form } = this.state
    const { contact, t } = this.props
    const gender =
      form.typeCompany === true || form.typeCompany === '1'
        ? GENDER_UNKNOWN
        : form.gender
    const owner =
      form.typeCompany === true || form.typeCompany === '1' ? form.owner : null

    const data = {
      detailsContact: {
        ...pick(['idPublisher', 'information'], form),
        phoneContact: get('phone', contact),
      },
      contact: {
        idStatus: get('idStatus', form),
        idLanguage: get('idLanguage', form),
        gender,
        owner,
        phone: get('phone', contact),
        name: ifEmptySetNull(getOr('', 'name', form)),
        idLocation: ifEmptySetNull(getOr('', 'idLocation', form)),
        typeCompany: get('typeCompany', form),
      },
    }

    try {
      await details.create(data)
      showSuccessful(t)
      onHide()
      this.setState({ form: fields, submitting: false, validated: false })
      this.validator.hideMessages()
    } catch (error) {
      this.setState({ submitting: false })
      showError(error, t, 'detailsContacts')
    }
  }

  notificationNotAllowedNewDetails() {
    const { t } = this.props
    Swal.fire({
      icon: 'error',
      title: t('common:ops'),
      text: t('notificationNotAllowedNewDetails'),
    })
  }

  render() {
    const {
      form,
      validated,
      publishersOptions,
      loading,
      locationsOptions,
      submitting,
    } = this.state
    const { t, afterClose, waitingFeedback, contact } = this.props
    const title = (
      <Icon
        name={EIcons.addressCardIcon}
        label={`${t('common:new')} ${t('titleCrud')} #${get('phone', contact)}`}
      />
    )

    return waitingFeedback ? (
      <Button
        variant="primary"
        onClick={this.notificationNotAllowedNewDetails}
        iconName={EIcons.plusSquareIcon}
      />
    ) : (
      <OurModal
        body={FormDetails}
        validator={this.validator}
        loading={loading}
        submitting={submitting}
        validated={validated}
        handleSubmit={this.handleSubmit}
        handleInputChange={this.handleInputChange}
        form={form}
        onExit={afterClose}
        onEnter={this.onOpen}
        locationsOptions={locationsOptions}
        publishersOptions={publishersOptions}
        title={title}
        buttonTitle={t('common:new')}
        buttonIcon={EIcons.plusSquareIcon}
      />
    )
  }
}

export default withTranslation(['detailsContacts', 'common'])(NewDetailsContact)
