import React from 'react'
import { withTranslation } from 'react-i18next'
import SimpleReactValidator from 'simple-react-validator'
import { getOr, get } from 'lodash/fp'

import {
  getLocale,
  handleInputChangeGeneric,
  numberStartsWithInvalidCharacter,
} from '../../utils/forms'
import {
  ID_LANGUAGE_DEFAULT,
  ID_GENDER_DEFAULT,
  ID_STATUS_DEFAULT,
  ID_LOCATION_DEFAULT,
} from '../../constants/valuesPredefined'
import { EIcons } from '../../enums/icons'
import { GENDER_UNKNOWN } from '../../constants/contacts'
import { reduceLocations } from '../../stateReducers/locations'
import { contacts, publishers, locations } from '../../services'
import { reducePublishers } from '../../stateReducers/publishers'
import { showError, showSuccessful, ifEmptySetNull } from '../../utils/generic'

import Icon from '../common/Icon/Icon'
import FormContacts from './FormContacts'
import OurModal from '../common/OurModal/OurModal'
import ElementError from '../common/ElementError/ElementError'

const fields = {
  phone: '',
  phone2: '',
  name: '',
  owner: '',
  note: '',
  idLocation: ID_LOCATION_DEFAULT,
  email: null,
  typeCompany: false,
  gender: ID_GENDER_DEFAULT,
  idStatus: ID_STATUS_DEFAULT,
  idLanguage: ID_LANGUAGE_DEFAULT,
}

class NewContact extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      form: fields,
      submitting: false,
      loading: false,
      validated: false,
      publishersOptions: [],
      statusOptions: [],
      locationsOptions: [],
    }

    this.handleSubmit = this.handleSubmit.bind(this)
    this.onOpen = this.onOpen.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
    this.resetForm = this.resetForm.bind(this)

    this.validator = new SimpleReactValidator({
      autoForceUpdate: this,
      locale: getLocale(this.props),
      element: (message) => <ElementError message={message} />,
      validators: {
        numberStartsWithInvalidCharacter:
          numberStartsWithInvalidCharacter(this),
      },
    })
  }

  async onOpen() {
    this.setState({ loading: true })
    try {
      const publishersOptions = reducePublishers(await publishers.getAll())
      const locationsOptions = reduceLocations(await locations.getAll())
      this.setState({
        publishersOptions,
        locationsOptions,
        loading: false,
      })
    } catch (error) {
      const { t } = this.props

      this.setState({
        loading: false,
      })

      showError(error, t, 'contacts')
    }
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
    const { t } = this.props

    const gender =
      form.typeCompany === true || form.typeCompany === '1'
        ? GENDER_UNKNOWN
        : form.gender
    const owner =
      form.typeCompany === true || form.typeCompany === '1' ? form.owner : null

    const data = {
      ...form,
      name: ifEmptySetNull(getOr('', 'name', form)),
      phone2: ifEmptySetNull(getOr('', 'phone2', form)),
      idLocation: ifEmptySetNull(getOr('', 'idLocation', form)),
      gender,
      owner,
    }

    try {
      await contacts.create(data)
      showSuccessful(t)
      onHide()
    } catch (error) {
      this.setState({ submitting: false })
      const contact = getOr(0, 'response.data.extra.contact', error)
      const name = get('name', contact)
      const phone = get('phone', contact)
      if (name || phone) {
        const paramsExtraForTranslation = { name, phone }
        showError(error, t, 'contacts', {
          paramsExtraForTranslation,
        })
      } else showError(error, t, 'contacts')
      this.setState({ submitting: false })
    }
  }

  resetForm() {
    this.setState({ form: fields, submitting: false, validated: false })
    this.validator.hideMessages()
  }

  render() {
    const {
      form,
      validated,
      publishersOptions,
      statusOptions,
      submitting,
      locationsOptions,
      loading,
    } = this.state
    const { t, afterClose } = this.props
    const title = (
      <React.Fragment>
        <Icon name={EIcons.userPlusIcon} />
        {`${t('common:new')} ${t('titleCrud')}`}
      </React.Fragment>
    )

    return (
      <OurModal
        body={FormContacts}
        validator={this.validator}
        submitting={submitting}
        loading={loading}
        validated={validated}
        handleSubmit={this.handleSubmit}
        handleInputChange={this.handleInputChange}
        locationsOptions={locationsOptions}
        disablePhone={false}
        form={form}
        onExit={afterClose}
        onEnter={this.onOpen}
        onClose={this.resetForm}
        publishersOptions={publishersOptions}
        statusOptions={statusOptions}
        buttonTitle={t('common:new')}
        title={title}
        buttonIcon={EIcons.plusSquareIcon}
      />
    )
  }
}

export default withTranslation(['contacts', 'common'])(NewContact)
