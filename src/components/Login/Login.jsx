import React from 'react'
import { get } from 'lodash/fp'
import FormLogin from './FormLogin'
import { auth } from '../../services'
import { setLoginData } from '../../utils/loginDataManager'
import { withTranslation } from 'react-i18next'
import SimpleReactValidator from 'simple-react-validator'
import { getLocale, handleInputChangeGeneric } from '../../utils/forms'
import OurModal from '../common/OurModal/OurModal'
import { showSuccessful, showError } from '../../utils/generic'

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
      element: (message) => <div className="text-danger">{message}</div>,
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
      setLoginData(get('data.data', authRes))
      this.setState({ submitting: false })
      history.push('/dashboard')
      showSuccessful(t, get('data.cod', authRes), 'login')
    } catch (error) {
      this.setState({ submitting: false })
      showError(error, t, 'login', {
        keyOfTranslationWhenNotFoundForTitleAlert: 'errorTryLogIn',
      })
    }
  }

  render() {
    const { t } = this.props
    const { submitting, validated, form } = this.state
    return (
      <OurModal
        body={FormLogin}
        size="sm"
        title={t('titleModal')}
        form={form}
        validator={this.validator}
        submitting={submitting}
        validated={validated}
        handleSubmit={this.handleSubmit}
        handleInputChange={this.handleInputChange}
        buttonText={t('btnOpenModal')}
        buttonVariant="primary"
      />
    )
  }
}

export default withTranslation(['login', 'common'])(LoginPopup)
