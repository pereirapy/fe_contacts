import React from 'react'
import Swal from 'sweetalert2'
import { withTranslation } from 'react-i18next'
import SimpleReactValidator from 'simple-react-validator'
import { join, get, pipe, values, every } from 'lodash/fp'

import { EIcons } from '../../../enums/icons'
import { publishers, contacts } from '../../../services'
import { showError, showSuccessful } from '../../../utils/generic'
import { reducePublishers } from '../../../stateReducers/publishers'
import { getLocale, handleInputChangeGeneric } from '../../../utils/forms'

import OurModal from '../../common/OurModal/OurModal'
import FormAssignNewPublisher from './FormAssignNewPublisher'
import ElementError from '../../common/ElementError/ElementError'

const fields = {
  idPublisher: '-1',
}

class AssignNewPublisher extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      form: fields,
      loading: false,
      submitting: false,
      validated: false,
      publishersOptions: [],
    }

    this.handleSubmit = this.handleSubmit.bind(this)
    this.allFieldsIsOriginal = this.allFieldsIsOriginal.bind(this)
    this.onOpen = this.onOpen.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
    this.resetForm = this.resetForm.bind(this)

    this.validator = new SimpleReactValidator({
      autoForceUpdate: this,
      locale: getLocale(this.props),
      element: (message) => <ElementError message={message} />,
    })
  }

  async onOpen() {
    this.setState({ loading: true })
    const publishersOptions = reducePublishers(await publishers.getAll())

    this.setState({ loading: false, publishersOptions, form: fields })
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
    this.setState({ submitting: true })

    const { form } = this.state

    const data = {
      phones: checksContactsPhones,
      detailsContacts: {
        idPublisher:
          get('idPublisher', form) !== '-1' ? get('idPublisher', form) : null,
      },
    }
    try {
      await contacts.updateSome(data)
      showSuccessful(t)
      onHide()
    } catch (error) {
      this.setState({ submitting: false })
      showError(error, t, 'assignNewPublisher')
    }
  }

  resetForm() {
    this.setState({ form: fields, submitting: false, validated: false })
    this.validator.hideMessages()
  }


  render() {
    const { form, validated, publishersOptions, loading, submitting } =
      this.state
    const { t, afterClose, checksContactsPhones } = this.props

    return (
      <OurModal
        body={FormAssignNewPublisher}
        validator={this.validator}
        loading={loading}
        submitting={submitting}
        validated={validated}
        buttonVariant="warning"
        handleSubmit={this.handleSubmit}
        handleInputChange={this.handleInputChange}
        form={form}
        onExit={afterClose}
        onEnter={this.onOpen}
        onClose={this.resetForm}
        publishersOptions={publishersOptions}
        title={`${t('title')}`}
        buttonTitle={t('btnTitle')}
        buttonDisabled={checksContactsPhones.length === 0}
        phones={join(', ', checksContactsPhones)}
        buttonIcon={EIcons.exchangeAltIcon}
      />
    )
  }
}

export default withTranslation(['assignNewPublisher', 'common'])(
  AssignNewPublisher
)
