import React from 'react'
import { get, omit } from 'lodash/fp'
import { withTranslation } from 'react-i18next'
import SimpleReactValidator from 'simple-react-validator'

import { languages } from '../../services'
import { EIcons } from '../../enums/icons'
import { showError, showSuccessful } from '../../utils/generic'
import { getLocale, handleInputChangeGeneric } from '../../utils/forms'

import Icon from '../common/Icon/Icon'
import LanguagesForm from './LanguagesForm.jsx'
import OurModal from '../common/OurModal/OurModal'
import ElementError from '../common/ElementError/ElementError'

const fields = {
  name: '',
  color: '',
}

class StatusEdit extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      form: fields,
      submitting: false,
      validated: false,
    }
    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleChangeColor = this.handleChangeColor.bind(this)
    this.onEnter = this.onEnter.bind(this)

    this.validator = new SimpleReactValidator({
      autoForceUpdate: this,
      locale: getLocale(this.props),
      element: (message) => <ElementError message={message} />,
    })
  }

  handleInputChange(event) {
    handleInputChangeGeneric(event, this)
  }

  handleChangeColor = ({ hex }) => {
    this.setState({
      form: {
        ...this.state.form,
        color: hex,
      },
    })
  }

  async handleSubmit(onHide) {
    if (!this.validator.allValid()) {
      this.validator.showMessages()
      return true
    }

    this.setState({ submitting: true })

    const { form } = this.state
    const { t } = this.props

    try {
      const data = omit(['id'], form)
      await languages.updateOne(get('id', form), data)
      this.setState({ submitting: false })
      showSuccessful(t)
      onHide()
    } catch (error) {
      this.setState({ submitting: false })
      showError(error, t, 'languages')
    }
  }

  onEnter() {
    const { data } = this.props
    this.setState({ form: data })
  }

  render() {
    const { form, validated, submitting } = this.state
    const { t, afterClose } = this.props
    const title = (
      <Icon
        name={EIcons.languageIcon}
        label={`${t('common:edit')} ${t('titleModal')}`}
      />
    )

    return (
      <OurModal
        body={LanguagesForm}
        validator={this.validator}
        validated={validated}
        submitting={submitting}
        handleSubmit={this.handleSubmit}
        handleInputChange={this.handleInputChange}
        handleChangeColor={this.handleChangeColor}
        form={form}
        onExit={afterClose}
        onEnter={this.onEnter}
        title={title}
        buttonIcon={EIcons.pencilAlt}
        buttonVariant="success"
      />
    )
  }
}
export default withTranslation(['languages', 'common'])(StatusEdit)
