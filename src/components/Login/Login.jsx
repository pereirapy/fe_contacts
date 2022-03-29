import React from 'react'
import { get } from 'lodash/fp'
import { withTranslation } from 'react-i18next'
import SimpleReactValidator from 'simple-react-validator'

import { EIcons } from '../../enums/icons'
import { auth, campaigns } from '../../services'
import { getLocale, handleInputChangeGeneric } from '../../utils/forms'
import { showSuccessful, showError } from '../../utils/generic'
import { buildContextData } from '../../utils/loginDataManager'
import { ApplicationContext } from '../../contexts/application'

import FormLogin from './FormLogin'
import Icon from '../common/Icon/Icon'
import OurModal from '../common/OurModal/OurModal'
import ElementError from '../common/ElementError/ElementError'

const fields = {
  email: '',
  password: '',
}

class LoginPopup extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      form: fields,
      modalShow: false,
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

  async handleSubmit() {
    this.setState({ validated: true })
    if (!this.validator.allValid()) {
      this.validator.showMessages()
      return true
    }

    this.setState({ submitting: true })

    const { form } = this.state
    const { history, t } = this.props

    try {
      const authRes = await auth.authenticate(form)
      const { updateContext, setCookieLoginData } = this.context
      const user = get('data.data', authRes)
      setCookieLoginData(user)
      const newContext = buildContextData()
      const response = await campaigns.getDetailsActive()
      const campaignActive = response.data.data || null
      updateContext(() => ({ ...newContext, campaignActive }))

      showSuccessful(t, get('data.cod', authRes), 'login')
      history.push('/dashboard')
    } catch (error) {
      this.setState({ submitting: false })
      showError(error, t, 'login', {
        keyOfTranslationWhenNotFoundForTitleAlert: 'errorTryLogIn',
      })
    }
  }

  render() {
    const { submitting, validated, form } = this.state
    const { t } = this.props
    const title = (
      <React.Fragment>
        <Icon name={EIcons.signInAltIcon} />
        {t('titleModal')}
      </React.Fragment>
    )

    return (
      <OurModal
        body={FormLogin}
        size="sm"
        title={title}
        form={form}
        validator={this.validator}
        submitting={submitting}
        validated={validated}
        handleSubmit={this.handleSubmit}
        handleInputChange={this.handleInputChange}
        buttonText={t('btnOpenModal')}
        buttonIcon={EIcons.signInAltIcon}
        buttonVariant="primary"
      />
    )
  }
}
LoginPopup.contextType = ApplicationContext

export default withTranslation(['login', 'common'])(LoginPopup)
