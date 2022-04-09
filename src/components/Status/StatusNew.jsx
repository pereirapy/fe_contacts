import React from 'react'
import { withTranslation } from 'react-i18next'
import SimpleReactValidator from 'simple-react-validator'

import { status } from '../../services'
import { EIcons } from '../../enums/icons'
import { showError, showSuccessful } from '../../utils/generic'
import { getLocale, handleInputChangeGeneric } from '../../utils/forms'

import Icon from '../common/Icon/Icon'
import StatusForm from './StatusForm.jsx'
import OurModal from '../common/OurModal/OurModal'
import ElementError from '../common/ElementError/ElementError'

const fields = {
  description: '',
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
    this.resetForm = this.resetForm.bind(this)

    this.validator = new SimpleReactValidator({
      autoForceUpdate: this,
      locale: getLocale(this.props),
      element: (message) => <ElementError message={message} />,
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

    this.setState({ submitting: true })

    const { form } = this.state
    const { t } = this.props

    try {
      await status.create(form)
      showSuccessful(t)
      onHide()
    } catch (error) {
      this.setState({ submitting: false })
      showError(error, t, 'status')
    }
  }

  resetForm() {
    this.setState({ form: fields, submitting: false, validated: false })
    this.validator.hideMessages()
  }

  render() {
    const { form, validated, submitting } = this.state
    const { t, afterClose } = this.props
    const title = (
      <Icon name={EIcons.tagsIcon} label={`${t('common:new')} ${t('title')}`} />
    )

    return (
      <OurModal
        body={StatusForm}
        validator={this.validator}
        submitting={submitting}
        validated={validated}
        handleSubmit={this.handleSubmit}
        handleInputChange={this.handleInputChange}
        form={form}
        onExit={afterClose}
        onClose={this.resetForm}
        title={title}
        buttonIcon={EIcons.plusSquareIcon}
      />
    )
  }
}
export default withTranslation(['status', 'common'])(StatusNew)
