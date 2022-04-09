import React from 'react'
import { get, getOr } from 'lodash/fp'
import { withTranslation } from 'react-i18next'
import SimpleReactValidator from 'simple-react-validator'

import { EIcons } from '../../enums/icons'
import { campaigns, details } from '../../services'
import { showError, showSuccessful } from '../../utils/generic'
import { getLocale, handleInputChangeGeneric } from '../../utils/forms'

import Icon from '../common/Icon/Icon'
import CampaignForm from './CampaignForm.jsx'
import OurModal from '../common/OurModal/OurModal'
import ElementError from '../common/ElementError/ElementError'

const fields = {
  name: '',
  dateStart: '',
  dateFinal: '',
}

class CampaignEdit extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      form: fields,
      submitting: false,
      disableDateFields: false,
      loading: false,
      validated: false,
    }
    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleThatCampaignHasDetailsContacts =
      this.handleThatCampaignHasDetailsContacts.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
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
      await campaigns.updateOne(get('id', form), form)
      showSuccessful(t)
      onHide()
      this.setState({ form: fields, submitting: false, validated: false })
      this.validator.hideMessages()
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

  componentDidMount() {
    const { data: form } = this.props
    this.setState({ form })
  }

  async handleThatCampaignHasDetailsContacts() {
    const { t } = this.props
    const { form } = this.state

    this.setState({ loading: true })
    try {
      const response = await details.thatCampaignHasDetailsContacts(form.id)
      const disableDateFields = getOr(false, 'data.data.res', response)

      this.setState({ loading: false, disableDateFields })
    } catch (error) {
      this.setState({ loading: false })
      showError(error, t, 'common')
    }
  }

  render() {
    const { form, validated, submitting, disableDateFields, loading } =
      this.state
    const { t, afterClose } = this.props
    const title = (
      <Icon
        name={EIcons.bullhornIcon}
        label={`${t('common:edit')} ${t('title')}`}
      />
    )

    return (
      <OurModal
        body={CampaignForm}
        validator={this.validator}
        submitting={submitting}
        loading={loading}
        validated={validated}
        disableDateFields={disableDateFields}
        handleSubmit={this.handleSubmit}
        handleInputChange={this.handleInputChange}
        form={form}
        onEnter={this.handleThatCampaignHasDetailsContacts}
        onExit={afterClose}
        title={title}
        buttonIcon={EIcons.editIcon}
        buttonVariant="success"
      />
    )
  }
}
export default withTranslation(['campaigns', 'common'])(CampaignEdit)
