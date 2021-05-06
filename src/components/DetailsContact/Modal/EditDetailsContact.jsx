import React from 'react'
import { withTranslation } from 'react-i18next'
import OurModal from '../../common/OurModal/OurModal'
import { getOr, pick, get } from 'lodash/fp'
import SimpleReactValidator from 'simple-react-validator'
import { getLocale, handleInputChangeGeneric } from '../../../utils/forms'
import { details, publishers, locations } from '../../../services'
import FormDetails from '../FormDetails'
import { faEdit } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  showError,
  showSuccessful,
  ifEmptySetNull,
} from '../../../utils/generic'
import { WAITING_FEEDBACK, GENDER_UNKNOWN } from '../../../constants/contacts'
import { reducePublishers } from '../../../stateReducers/publishers'
import { reduceLocations } from '../../../stateReducers/locations'

const fields = {
  information: '',
  idPublisher: '',
  idStatus: '',
  idLanguage: null,
  idLocation: null,
  gender: '',
  name: '',
  owner: '',
  typeCompany: '0',
}

class EditDetailsContact extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      form: fields,
      loading: false,
      validated: false,
      publishersOptions: [],
      locationsOptions: [],
    }
    this.handleGetOne = this.handleGetOne.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
    this.validator = new SimpleReactValidator({
      autoForceUpdate: this,
      locale: getLocale(this.props),
      element: (message) => <div className="text-danger">{message}</div>,
    })
  }

  async handleGetOne() {
    const { t } = this.props

    try {
      this.setState({ loading: true })
      const id = getOr(0, 'props.id', this)
      const response = await details.getOne(id)
      const data = getOr(fields, 'data.data', response)
      const form = {
        ...data,
        information:
          getOr('', 'information', data) === WAITING_FEEDBACK
            ? ''
            : getOr('', 'information', data),
      }
      const publishersOptions = reducePublishers(await publishers.getAll())
      const locationsOptions = reduceLocations(await locations.getAll())

      this.setState({
        form,
        publishersOptions,
        locationsOptions,
        loading: false,
      })
    } catch (error) {
      this.setState({ loading: false })
      showError(error, t, 'detailsContacts')
    }
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
    this.setState({ loading: true })

    const { form } = this.state
    const { t, contact } = this.props
    const id = getOr(0, 'props.id', this)

    const gender =
      form.typeCompany === true || form.typeCompany === '1'
        ? GENDER_UNKNOWN
        : form.gender
    const owner =
      form.typeCompany === true || form.typeCompany === '1' ? form.owner : null

    const data = {
      detailsContact: pick(['idPublisher', 'information'], form),
      contact: {
        idStatus: get('idStatus', form),
        idLanguage: get('idLanguage', form),
        gender,
        owner,
        phone: get('phone', contact),
        name: ifEmptySetNull(getOr('', 'name', form)),
        idLocation: ifEmptySetNull(getOr('', 'idLocation', form)),
        typeCompany: get('typeCompany', form),
      },
    }
    try {
      await details.updateOneContactDetail(id, data)
      showSuccessful(t)
      onHide()
      this.setState({ form: fields, loading: false, validated: false })
      this.validator.hideMessages()
    } catch (error) {
      this.setState({ loading: false })
      showError(error, t, 'detailsContacts')
    }
  }

  render() {
    const { form, validated, publishersOptions, loading, locationsOptions } = this.state
    const { t, afterClose, contact } = this.props
    return (
      <OurModal
        body={FormDetails}
        onEnter={this.handleGetOne}
        onExit={afterClose}
        validator={this.validator}
        loading={loading}
        validated={validated}
        handleSubmit={this.handleSubmit}
        handleInputChange={this.handleInputChange}
        form={form}
        locationsOptions={locationsOptions}
        publishersOptions={publishersOptions}
        title={`${t('common:edit')} ${t('titleCrud')} #${get(
          'phone',
          contact
        )}`}
        buttonTitle={t('common:edit')}
        buttonText={<FontAwesomeIcon variant="success" icon={faEdit} />}
        buttonVariant="success"
      />
    )
  }
}

export default withTranslation(['detailsContacts', 'common'])(
  EditDetailsContact
)
