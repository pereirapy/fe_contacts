import React from 'react'
import { withTranslation } from 'react-i18next'
import { campaigns } from '../../services'
import { get, getOr } from 'lodash/fp'
import SimpleReactValidator from 'simple-react-validator'
import { getLocale, handleInputChangeGeneric } from '../../utils/forms'
import OurModal from '../common/OurModal/OurModal'
import ElementError from '../common/ElementError/ElementError'
import { faEdit, faBullhorn } from '@fortawesome/free-solid-svg-icons'
import CampaignForm from './CampaignForm.jsx'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { showError, showSuccessful } from '../../utils/generic'
import moment from 'moment'

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
      validated: false,
    }
    this.handleInputChange = this.handleInputChange.bind(this)
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
    const { data } = this.props
    const form = {
      ...data,
      dateStart: moment(data.dateStart).format('YYYY-MM-DD'),
      dateFinal: moment(data.dateFinal).format('YYYY-MM-DD'),
    }
    this.setState({ form })
  }

  render() {
    const { form, validated, submitting } = this.state
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
        validated={validated}
        handleSubmit={this.handleSubmit}
        handleInputChange={this.handleInputChange}
        form={form}
        onExit={afterClose}
        title={title}
        buttonText={<FontAwesomeIcon icon={faEdit} />}
        buttonVariant="success"
      />
    )
  }
}
export default withTranslation(['campaigns', 'common'])(CampaignEdit)
