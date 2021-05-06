import React from 'react'
import { withTranslation } from 'react-i18next'
import OurModal from '../common/OurModal/OurModal'
import { getOr, omit, get } from 'lodash/fp'
import SimpleReactValidator from 'simple-react-validator'
import { getLocale, handleInputChangeGeneric } from '../../utils/forms'
import { contacts, publishers, locations } from '../../services'
import FormContacts from './FormContacts'
import { faEdit } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { GENDER_UNKNOWN } from '../../constants/contacts'
import { showError, showSuccessful, ifEmptySetNull } from '../../utils/generic'
import { reducePublishers } from '../../stateReducers/publishers'
import { reduceLocations } from '../../stateReducers/locations'

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
      validated: false,
      publishersOptions: [],
      statusOptions: [],
      locationsOptions: [],
    }
    this.handleGetOne = this.handleGetOne.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
    this.validator = new SimpleReactValidator({
      autoForceUpdate: this,
      locale: getLocale(this.props),
      element: (message) => <div className="text-danger">{message}</div>,
    })
  }

  async handleGetOne() {
    this.setState({ loading: true })
    try {
      const id = getOr(0, 'props.id', this)
      const response = await contacts.getOne(id)
      const form = getOr(fields, 'data.data', response)
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
    this.setState({ loading: true })

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
      ...omit(['details'], form),
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
      this.setState({ form: fields, loading: false, validated: false })
      this.validator.hideMessages()
    } catch (error) {
      const contact = getOr(0, 'response.data.extra.contact', error)
      const name = get('name', contact)
      const phone = get('phone', contact)
      showError(error, t, 'contacts', {
        paramsExtraForTranslation: { name, phone },
      })
      this.setState({ loading: false })
    }
  }

  render() {
    const {
      form,
      validated,
      publishersOptions,
      statusOptions,
      loading,
      locationsOptions,
    } = this.state
    const { t, afterClose } = this.props
    return (
      <OurModal
        body={FormContacts}
        validator={this.validator}
        loading={loading}
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
        title={`${t('common:edit')} ${t('titleCrud')}`}
        buttonText={<FontAwesomeIcon icon={faEdit} />}
        buttonVariant="success"
      />
    )
  }
}

export default withTranslation(['contacts', 'common'])(EditContact)
