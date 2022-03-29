import React from 'react'
import { getOr, omit, get } from 'lodash/fp'
import { withTranslation } from 'react-i18next'
import SimpleReactValidator from 'simple-react-validator'

import {
  getLocale,
  handleInputChangeGeneric,
  numberStartsWithInvalidCharacter,
  formatDateDMYHHmm,
} from '../../utils/forms'
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
  email: '',
  gender: '',
  idLocation: null,
  idStatus: null,
  idLanguage: null,
  typeCompany: false,
}

class EditContact extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      form: fields,
      loading: false,
      submitting: false,
      validated: false,
      publishersOptions: [],
      statusOptions: [],
      locationsOptions: [],
    }
    this.handleGetOne = this.handleGetOne.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
    this.getLastPublisherThatTouched =
      this.getLastPublisherThatTouched.bind(this)

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

  getLastPublisherThatTouched(form) {
    const { t } = this.props

    return form.contactUpdatedBy
      ? t('common:updatedByAt', {
          date: formatDateDMYHHmm(form.contactUpdatedAt),
          name: form.contactUpdatedBy,
        })
      : t('common:createdByAt', {
          date: formatDateDMYHHmm(form.contactCreatedAt),
          name: form.contactCreatedBy,
        })
  }

  async handleGetOne() {
    this.setState({ loading: true })
    try {
      const id = getOr(0, 'props.id', this)
      const response = await contacts.getOne(id)
      const form = {
        ...getOr(fields, 'data.data', response),
        lastPublisherThatTouched: this.getLastPublisherThatTouched(
          get('data.data', response)
        ),
      }
      const publishersOptions = reducePublishers(await publishers.getAll())
      const locationsOptions = reduceLocations(await locations.getAll())

      this.setState({
        form,
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

  onEnter() {
    this.handleGetOne()
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
    const id = getOr(0, 'props.id', this)
    const gender =
      form.typeCompany === true || form.typeCompany === '1'
        ? GENDER_UNKNOWN
        : form.gender
    const owner =
      form.typeCompany === true || form.typeCompany === '1' ? form.owner : null
    const data = {
      ...omit(
        [
          'details',
          'contactUpdatedAt',
          'contactUpdatedBy',
          'contactCreatedAt',
          'contactCreatedBy',
          'lastPublisherThatTouched',
        ],
        form
      ),
      name: ifEmptySetNull(getOr('', 'name', form)),
      phone2: ifEmptySetNull(getOr('', 'phone2', form)),
      idLocation: ifEmptySetNull(getOr('', 'idLocation', form)),
      gender,
      owner,
    }

    try {
      await contacts.updateContact(id, data)
      showSuccessful(t)
      onHide()
      this.setState({ form: fields, submitting: false, validated: false })
      this.validator.hideMessages()
    } catch (error) {
      const contact = getOr(0, 'response.data.extra.contact', error)
      const name = get('name', contact)
      const phone = get('phone', contact)
      if (phone) {
        showError(error, t, 'contacts', {
          paramsExtraForTranslation: { name, phone },
        })
      } else {
        showError(error, t, 'common')
      }

      this.setState({ submitting: false })
    }
  }

  render() {
    const {
      form,
      validated,
      publishersOptions,
      statusOptions,
      loading,
      submitting,
      locationsOptions,
    } = this.state
    const { t, afterClose } = this.props
    const title = (
      <React.Fragment>
        <Icon name={EIcons.userEditIcon} />
        {`${t('common:edit')} ${t('titleCrud')}`}
      </React.Fragment>
    )

    return (
      <OurModal
        body={FormContacts}
        validator={this.validator}
        loading={loading}
        submitting={submitting}
        validated={validated}
        handleSubmit={this.handleSubmit}
        handleInputChange={this.handleInputChange}
        locationsOptions={locationsOptions}
        disablePhone={true}
        form={form}
        onEnter={this.handleGetOne}
        onExit={afterClose}
        publishersOptions={publishersOptions}
        statusOptions={statusOptions}
        buttonTitle={t('common:edit')}
        title={title}
        buttonIcon={EIcons.editIcon}
        buttonVariant="success"
      />
    )
  }
}

export default withTranslation(['contacts', 'common'])(EditContact)
