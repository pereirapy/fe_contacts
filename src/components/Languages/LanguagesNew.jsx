import React from 'react'
import { withTranslation } from 'react-i18next'
import SimpleReactValidator from 'simple-react-validator'

import { EIcons } from '../../enums/icons'
import { languages } from '../../services'
import { showError, showSuccessful } from '../../utils/generic'
import { getLocale, handleInputChangeGeneric } from '../../utils/forms'

import Icon from '../common/Icon/Icon'
import OurModal from '../common/OurModal/OurModal'
import ElementError from '../common/ElementError/ElementError'
import LanguagesForm from './LanguagesForm.jsx'

const fields = {
  name: '',
  color: '#000000',
}

class StatusNew extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      form: fields,
      submitting: false,
      validated: false,
    }
    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.validator = new SimpleReactValidator({
      autoForceUpdate: this,
      locale: getLocale(this.props),
      element: (message) => <ElementError message={message} />,
    })
    this.resetForm = this.resetForm.bind(this)
    this.handleChangeColor = this.handleChangeColor.bind(this)
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

  resetForm() {
    this.setState({ form: fields, submitting: false, validated: false })
    this.validator.hideMessages()
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

    try {
      await languages.create(form)
      showSuccessful(t)
      onHide()
    } catch (error) {
      this.setState({ submitting: false })
      showError(error, t, 'languages')
    }
  }

  render() {
    const { form, validated, submitting } = this.state
    const { t, afterClose } = this.props
    const title = (
      <Icon
        name={EIcons.languageIcon}
        label={`${t('common:new')} ${t('titleModal')}`}
      />
    )

    return (
      <OurModal
        body={LanguagesForm}
        validator={this.validator}
        submitting={submitting}
        validated={validated}
        handleSubmit={this.handleSubmit}
        handleInputChange={this.handleInputChange}
        handleChangeColor={this.handleChangeColor}
        form={form}
        onExit={afterClose}
        onClose={this.resetForm}
        title={title}
        buttonIcon={EIcons.plusSquareIcon}
      />
    )
  }
}
export default withTranslation(['languages', 'common'])(StatusNew)
