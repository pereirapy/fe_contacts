import React from 'react'
import { withTranslation } from 'react-i18next'
import { languages } from '../../services'
import { get, omit } from 'lodash/fp'
import SimpleReactValidator from 'simple-react-validator'
import { getLocale, handleInputChangeGeneric } from '../../utils/forms'
import OurModal from '../common/OurModal/OurModal'
import ElementError from '../common/ElementError/ElementError'
import { faEdit, faLanguage } from '@fortawesome/free-solid-svg-icons'
import LanguagesForm from './LanguagesForm.jsx'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { showError, showSuccessful } from '../../utils/generic'

const fields = {
  name: '',
  color: '',
}

class StatusEdit extends React.Component {
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
      element: (message) => <ElementError message={message} />,
    })
    this.resetForm = this.resetForm.bind(this)
    this.handleChangeColor = this.handleChangeColor.bind(this)
    this.onEnter = this.onEnter.bind(this)
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
    if (!this.validator.allValid()) {
      this.validator.showMessages()
      return true
    }

    this.setState({ loading: true })

    const { form } = this.state
    const { t } = this.props

    try {
      const data = omit(['id'], form)
      await languages.updateOne(get('id', form), data)
      showSuccessful(t)
      onHide()
      this.resetForm()
    } catch (error) {
      this.setState({ loading: false })
      showError(error, t, 'languages')
    }
  }

  onEnter() {
    const { data } = this.props
    this.setState({ form: data })
  }

  render() {
    const { form, validated } = this.state
    const { t, afterClose } = this.props
    const title = (
      <React.Fragment>
        {' '}
        <FontAwesomeIcon icon={faLanguage} />{' '}
        {`${t('common:edit')} ${t('titleModal')}`}{' '}
      </React.Fragment>
    )

    return (
      <OurModal
        body={LanguagesForm}
        validator={this.validator}
        validated={validated}
        handleSubmit={this.handleSubmit}
        handleInputChange={this.handleInputChange}
        handleChangeColor={this.handleChangeColor}
        form={form}
        onExit={afterClose}
        onEnter={this.onEnter}
        onClose={this.resetForm}
        title={title}
        buttonText={<FontAwesomeIcon icon={faEdit} />}
        buttonVariant="success"
      />
    )
  }
}
export default withTranslation(['languages', 'common'])(StatusEdit)
