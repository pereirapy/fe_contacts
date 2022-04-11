import React from 'react'
import moment from 'moment'
import { getOr } from 'lodash/fp'
import { withTranslation } from 'react-i18next'
import SimpleReactValidator from 'simple-react-validator'

import { EIcons } from '../../enums/icons'
import { campaigns } from '../../services'
import { showError, showSuccessful } from '../../utils/generic'
import { getLocale, handleInputChangeGeneric } from '../../utils/forms'

import Icon from '../common/Icon/Icon'
import CampaignForm from './CampaignForm.jsx'
import OurModal from '../common/OurModal/OurModal'
import ElementError from '../common/ElementError/ElementError'

const fields = {
  name: '',
  goal: '',
  dateStart: moment().format('YYYY-MM-DD'),
  dateFinal: moment().add(1, 'day').format('YYYY-MM-DD'),
}

class CampaignNew extends React.Component {
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
      await campaigns.create(form)
      showSuccessful(t)
      onHide()
    } catch (error) {
      this.setState({ submitting: false })
      const campaign = getOr(0, 'response.data.extra.name', error)
      if (campaign) {
        showError(error, t, 'campaigns', {
          paramsExtraForTranslation: { campaign },
        })
      } else {
        showError(error, t, 'common')
      }
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
      <Icon name={EIcons.bullhornIcon} label={`${t('new')} ${t('title')}`} />
    )

    return (
      <OurModal
        body={CampaignForm}
        validator={this.validator}
        submitting={submitting}
        validated={validated}
        handleSubmit={this.handleSubmit}
        handleInputChange={this.handleInputChange}
        form={form}
        onEnter={this.resetForm}
        onExit={afterClose}
        onClose={this.resetForm}
        title={title}
        buttonIcon={EIcons.plusSquareIcon}
      />
    )
  }
}
export default withTranslation(['campaigns', 'common'])(CampaignNew)
