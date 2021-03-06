import React from 'react'
import { getOr, omit } from 'lodash/fp'
import { withTranslation } from 'react-i18next'
import SimpleReactValidator from 'simple-react-validator'

import {
  getLocale,
  handleInputChangeGeneric,
  mustBeEqualFieldPassword,
} from '../../utils/forms'
import { EIcons } from '../../enums/icons'
import { publishers } from '../../services'
import { showError, showSuccessful, ifEmptySetNull } from '../../utils/generic'

import Icon from '../common/Icon/Icon'
import FormPublisher from './FormPublisher'
import OurModal from '../common/OurModal/OurModal'
import ElementError from '../common/ElementError/ElementError'

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
      submitting: false,
      validated: false,
    }
    this.handleGetOne = this.handleGetOne.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)

    this.validator = new SimpleReactValidator({
      autoForceUpdate: this,
      locale: getLocale(this.props),
      element: (message) => <ElementError message={message} />,
      validators: {
        mustBeEqualFieldPassword: mustBeEqualFieldPassword(this),
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
    const data = {
      ...omit(['justAllowedForMe', 'repeatPassword', 'disabled'], form),
      password: ifEmptySetNull(getOr('', 'password', form)),
      email: ifEmptySetNull(getOr('', 'email', form)),
    }

    try {
      await publishers.updatePublishers(id, data)
      showSuccessful(t)
      onHide()
    } catch (error) {
      this.setState({ submitting: false })
      showError(error, t, 'publishers')
    }
  }


  render() {
    const { form, validated, loading, submitting } = this.state
    const { t, afterClose } = this.props
    const title = (
      <React.Fragment>
        <Icon name={EIcons.userEditIcon} />
        {`${t('common:edit')} ${t('titleCrud')}`}
      </React.Fragment>
    )

    return (
      <OurModal
        body={FormPublisher}
        loading={loading}
        submitting={submitting}
        validator={this.validator}
        validated={validated}
        handleSubmit={this.handleSubmit}
        handleInputChange={this.handleInputChange}
        form={form}
        onEnter={this.handleGetOne}
        onExit={afterClose}
        buttonTitle={t('common:edit')}
        title={title}
        buttonIcon={EIcons.pencilAlt}
        buttonVariant="success"
      />
    )
  }
}

export default withTranslation(['publishers', 'common'])(EditContact)
