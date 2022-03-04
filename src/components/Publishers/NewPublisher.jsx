import React from 'react'
import { withTranslation } from 'react-i18next'
import OurModal from '../common/OurModal/OurModal'
import ElementError from '../common/ElementError/ElementError'
import { omit, getOr } from 'lodash/fp'
import SimpleReactValidator from 'simple-react-validator'
import {
  getLocale,
  handleInputChangeGeneric,
  mustBeEqualFieldPassword,
} from '../../utils/forms'
import { publishers } from '../../services'
import FormPublisher from './FormPublisher'
import { faPlusSquare, faUserPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { showError, showSuccessful, ifEmptySetNull } from '../../utils/generic'

const fields = {
  name: '',
  phone: '',
  password: null,
  repeatPassword: null,
  email: null,
  idResponsibility: '',
  active: '1',
  justAllowedForMe: true,
}

class NewPublisher extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      form: fields,
      loading: false,
      validated: false,
    }

    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
    this.resetForm = this.resetForm.bind(this)

    this.validator = new SimpleReactValidator({
      autoForceUpdate: this,
      locale: getLocale(this.props),
      element: (message) => <ElementError message={message} />,
      validators: {
        mustBeEqualFieldPassword: mustBeEqualFieldPassword(this),
      },
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
    this.setState({ loading: true })

    const { form } = this.state
    const { t } = this.props
    const data = {
      ...omit(['justAllowedForMe', 'repeatPassword', 'disabled'], form),
      password: ifEmptySetNull(getOr('', 'password', form)),
      email: ifEmptySetNull(getOr('', 'email', form)),
    }

    try {
      await publishers.create(data)
      showSuccessful(t)
      onHide()
      this.resetForm()
    } catch (error) {
      this.setState({ loading: false })
      showError(error, t, 'publishers')
    }
  }

  resetForm() {
    this.setState({ form: fields, loading: false, validated: false })
    this.validator.hideMessages()
  }

  render() {
    const { form, validated, loading } = this.state
    const { t, afterClose } = this.props
    const title = (
      <React.Fragment>
        {' '}
        <FontAwesomeIcon icon={faUserPlus} />{' '}
        {`${t('common:new')} ${t('titleCrud')}`}{' '}
      </React.Fragment>
    )

    return (
      <OurModal
        body={FormPublisher}
        validator={this.validator}
        loading={loading}
        validated={validated}
        handleSubmit={this.handleSubmit}
        handleInputChange={this.handleInputChange}
        form={form}
        onExit={afterClose}
        onClose={this.resetForm}
        buttonTitle={t('common:new')}
        title={title}
        buttonText={<FontAwesomeIcon icon={faPlusSquare} />}
      />
    )
  }
}

export default withTranslation(['publishers', 'common'])(NewPublisher)
