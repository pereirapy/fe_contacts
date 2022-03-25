import React from 'react'
import { get, getOr } from 'lodash/fp'
import { withTranslation } from 'react-i18next'
import SimpleReactValidator from 'simple-react-validator'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faBullhorn } from '@fortawesome/free-solid-svg-icons'

import { campaigns, details } from '../../services'
import { showError, showSuccessful } from '../../utils/generic'
import { getLocale, handleInputChangeGeneric } from '../../utils/forms'

import CampaignForm from './CampaignForm.jsx'
import OurModal from '../common/OurModal/OurModal'
import ElementError from '../common/ElementError/ElementError'

const fields = {
  name: '',
  dateStart: '',
  dateFinal: '',
  disableDateFields: false,
}

class CampaignEdit extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      form: fields,
      submitting: false,
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

      const newForm = {
        ...form,
        disableDateFields,
      }

      this.setState({ form: newForm, loading: false })
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
      <React.Fragment>
        <FontAwesomeIcon icon={faBullhorn} />{' '}
        {`${t('common:edit')} ${t('title')}`}
      </React.Fragment>
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
        buttonText={<FontAwesomeIcon icon={faEdit} />}
        buttonVariant="success"
      />
    )
  }
}
export default withTranslation(['campaigns', 'common'])(CampaignEdit)
