import React from 'react'
import { withTranslation } from 'react-i18next'
import OurModal from '../../common/OurModal/OurModal'
import { join, get, pipe, values, omitBy, isNil, every } from 'lodash/fp'
import SimpleReactValidator from 'simple-react-validator'
import { getLocale, handleInputChangeGeneric } from '../../../utils/forms'
import { publishers, contacts } from '../../../services'
import FormBatchChanges from './FormBatchChanges'
import { faTasks } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { reducePublishers } from '../../../stateReducers/publishers'
import { showError, showSuccessful } from '../../../utils/generic'
import { GENDER_UNKNOWN } from '../../../constants/contacts'
import Swal from 'sweetalert2'

const fields = {
  idPublisher: '-1',
  idStatus: '-1',
  idLanguage: '-1',
  gender: '-1',
  typeCompany: '-1',
}

class BatchChanges extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      form: fields,
      loading: false,
      validated: false,
      publishersOptions: [],
    }

    this.handleSubmit = this.handleSubmit.bind(this)
    this.allFieldsIsOriginal = this.allFieldsIsOriginal.bind(this)
    this.onOpen = this.onOpen.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
    this.validator = new SimpleReactValidator({
      autoForceUpdate: this,
      locale: getLocale(this.props),
      element: (message) => <div className="text-danger">{message}</div>,
    })
  }

  async onOpen() {
    this.setState({ loading: true })
    const publishersOptions = reducePublishers(await publishers.getAll())

    this.setState({ loading: false, publishersOptions })
  }

  handleInputChange(event) {
    handleInputChangeGeneric(event, this)
  }

  allFieldsIsOriginal() {
    const { form } = this.state
    return pipe(values, (data) => every((value) => value === '-1', data))(form)
  }

  async handleSubmit(onHide) {
    this.setState({ validated: true })
    const { t, checksContactsPhones } = this.props

    if (!this.validator.allValid()) {
      this.validator.showMessages()
      return true
    }
    if (this.allFieldsIsOriginal()) {
      Swal.fire({
        icon: 'error',
        title: t('common:errorValidation'),
        text: t('common:allFieldsIsEmpty'),
      })
      return true
    }
    this.setState({ loading: true })

    const { form } = this.state
    const gender =
      form.typeCompany === true || form.typeCompany === '1'
        ? GENDER_UNKNOWN
        : form.gender

    const data = {
      phones: checksContactsPhones,
      detailsContacts: {
        idPublisher:
          get('idPublisher', form) !== '-1' ? get('idPublisher', form) : null,
      },
      contact: omitBy(isNil, {
        idStatus: get('idStatus', form) !== '-1' ? get('idStatus', form) : null,
        idLanguage:
          get('idLanguage', form) !== '-1' ? get('idLanguage', form) : null,
        gender: gender !== '-1' ? gender : null,
        typeCompany:
          get('typeCompany', form) !== '-1' ? get('typeCompany', form) : null,
      }),
    }
    try {
      await contacts.updateSome(data)
      showSuccessful(t)
      onHide()
      this.setState({ form: fields, loading: false, validated: false })
      this.validator.hideMessages()
    } catch (error) {
      this.setState({ loading: false })
      showError(error, t, 'bachChanges')
    }
  }

  render() {
    const { form, validated, publishersOptions, loading } = this.state
    const { t, afterClose, checksContactsPhones } = this.props

    return (
      <OurModal
        body={FormBatchChanges}
        validator={this.validator}
        loading={loading}
        validated={validated}
        buttonVariant="warning"
        handleSubmit={this.handleSubmit}
        handleInputChange={this.handleInputChange}
        form={form}
        onExit={afterClose}
        onEnter={this.onOpen}
        publishersOptions={publishersOptions}
        title={`${t('title')}`}
        buttonTitle={t('btnTitle')}
        buttonDisabled={checksContactsPhones.length === 0}
        phones={join(', ', checksContactsPhones)}
        buttonText={<FontAwesomeIcon icon={faTasks} />}
      />
    )
  }
}

export default withTranslation(['batchChanges', 'common'])(BatchChanges)
