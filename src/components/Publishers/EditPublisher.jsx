import React from 'react'
import { withTranslation } from 'react-i18next'
import OurModal from '../common/OurModal/OurModal'
import { getOr, isEmpty, omit } from 'lodash/fp'
import SimpleReactValidator from 'simple-react-validator'
import { getLocale, handleInputChangeGeneric } from '../../utils/forms'
import { publishers } from '../../services'
import FormPublisher from './FormPublisher'
import { faEdit } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { showError, showSuccessful, ifEmptySetNull } from '../../utils/generic'

const fields = {
  name: '',
  phone: '',
  password: null,
  repeatPassword: null,
  email: '',
  idResponsibility: '',
  active: 1,
  disabled: false,
  justAllowedForMe: false,
}

class EditContact extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      form: fields,
      loading: false,
      validated: false,
    }
    this.handleGetOne = this.handleGetOne.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
    this.validator = new SimpleReactValidator({
      autoForceUpdate: this,
      locale: getLocale(this.props),
      element: (message) => <div className="text-danger">{message}</div>,
      validators: {
        mustBeEqualFieldPassword: {
          message: this.props.t('mustBeEqualFieldPassword'),
          rule: (val) =>
            val === this.state.form.password ||
            isEmpty(this.state.form.password),
          required: true,
        },
      },
    })
  }

  async handleGetOne() {
    this.setState({ loading: true })
    try {
      const id = getOr(0, 'props.id', this)
      const response = await publishers.getOne(id)
      const form = { ...fields, ...getOr(fields, 'data.data', response) }
      this.setState({
        form,
        loading: false,
      })
    } catch (error) {
      const { t } = this.props
      this.setState({
        loading: false,
      })

      showError(error, t, 'publishers')
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
    const data = {
      ...omit(['justAllowedForMe', 'repeatPassword', 'disabled'], form),
      password: ifEmptySetNull(getOr('', 'password', form)),
      email: ifEmptySetNull(getOr('', 'email', form)),
    }

    try {
      await publishers.updatePublishers(id, data)
      showSuccessful(t)
      onHide()
      this.setState({ form: fields, loading: false, validated: false })
      this.validator.hideMessages()
    } catch (error) {
      this.setState({ loading: false })
      showError(error, t, 'publishers')
    }
  }

  render() {
    const { form, validated, loading } = this.state
    const { t, afterClose } = this.props
    return (
      <OurModal
        body={FormPublisher}
        loading={loading}
        validator={this.validator}
        validated={validated}
        handleSubmit={this.handleSubmit}
        handleInputChange={this.handleInputChange}
        form={form}
        onEnter={this.handleGetOne}
        onExit={afterClose}
        buttonTitle={t('common:edit')}
        title={`${t('common:edit')} ${t('titleCrud')}`}
        buttonText={<FontAwesomeIcon icon={faEdit} />}
        buttonVariant="success"
      />
    )
  }
}

export default withTranslation(['publishers', 'common'])(EditContact)
