import React from 'react'
import { withTranslation } from 'react-i18next'
import { languages } from '../../services'
import SimpleReactValidator from 'simple-react-validator'
import { getLocale, handleInputChangeGeneric } from '../../utils/forms'
import OurModal from '../common/OurModal/OurModal'
import { faPlusSquare } from '@fortawesome/free-solid-svg-icons'
import LanguagesForm from './LanguagesForm.jsx'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { showError, showSuccessful } from '../../utils/generic'

const fields = {
  name: '',
  color: '#000000',
}

class StatusNew extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      form: fields,
      loading: false,
      validated: false,
    }
    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.validator = new SimpleReactValidator({
      autoForceUpdate: this,
      locale: getLocale(this.props),
      element: (message) => <div className="text-danger">{message}</div>,
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
    this.setState({ form: fields, loading: false, validated: false })
    this.validator.hideMessages()
  }

  async handleSubmit(onHide) {
    this.setState({ validated: true })

    if (!this.validator.allValid()) {
      this.validator.showMessages()
      return true
    }

    this.setState({ loading: true })

    const { form } = this.state
    const { t } = this.props

    try {
      await languages.create(form)
      showSuccessful(t)
      onHide()
      this.resetForm()
    } catch (error) {
      this.setState({ loading: false })
      showError(error, t, 'languages')
    }
  }

  render() {
    const { form, validated, loading } = this.state
    const { t, afterClose } = this.props

    return (
      <OurModal
        body={LanguagesForm}
        validator={this.validator}
        loading={loading}
        validated={validated}
        handleSubmit={this.handleSubmit}
        handleInputChange={this.handleInputChange}
        handleChangeColor={this.handleChangeColor}
        form={form}
        onExit={afterClose}
        onClose={this.resetForm}
        title={`${t('common:new')} ${t('titleModal')}`}
        buttonText={<FontAwesomeIcon icon={faPlusSquare} />}
      />
    )
  }
}
export default withTranslation(['languages', 'common'])(StatusNew)
