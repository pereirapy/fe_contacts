import React from 'react'
import { withTranslation } from 'react-i18next'
import ContainerCRUD from '../../../components/common/ContainerCRUD/ContainerCRUD'
import ElementError from '../../../components/common/ElementError/ElementError'
import SimpleReactValidator from 'simple-react-validator'
import { getOr, pick, get } from 'lodash/fp'
import FormDetails from '../FormDetails'
import { getLocale, handleInputChangeGeneric } from '../../../utils/forms'
import { details, publishers, contacts, locations } from '../../../services'
import { reducePublishers } from '../../../stateReducers/publishers'
import {
  showError,
  showSuccessful,
  ifEmptySetNull,
} from '../../../utils/generic'
import { Container } from 'react-bootstrap'
import { GENDER_UNKNOWN } from '../../../constants/contacts'
import { reduceLocations } from '../../../stateReducers/locations'
import {
  ID_LANGUAGE_DEFAULT,
  ID_GENDER_DEFAULT,
  ID_STATUS_DEFAULT,
  ID_LOCATION_DEFAULT,
} from '../../../constants/valuesPredefined'
import { faAddressCard } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const fields = {
  information: '',
  idPublisher: '',
  idStatus: ID_STATUS_DEFAULT,
  idLanguage: ID_LANGUAGE_DEFAULT,
  idLocation: ID_LOCATION_DEFAULT,
  gender: ID_GENDER_DEFAULT,
  name: '',
  owner: '',
  typeCompany: '0',
}

class NewDetailsContact extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      form: fields,
      loading: false,
      validated: false,
      publishersOptions: [],
      locationsOptions: [],
      phone: getOr(0, 'match.params.phone', props),
    }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleGetOneContact = this.handleGetOneContact.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
    this.validator = new SimpleReactValidator({
      autoForceUpdate: this,
      locale: getLocale(this.props),
      element: (message) => <ElementError message={message} />,
    })
  }

  async handleGetOneContact() {
    const { phone } = this.state
    this.setState({ loading: true })

    const contact = await contacts.getOne(phone)
    const publishersOptions = reducePublishers(await publishers.getAll())
    const locationsOptions = reduceLocations(await locations.getAll())

    const form = getOr(fields, 'data.data', contact)
    const newForm = {
      ...fields,
      ...form,
    }
    this.setState({
      form: newForm,
      publishersOptions,
      loading: false,
      locationsOptions,
    })
  }

  async componentDidMount() {
    this.handleGetOneContact()
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
    this.setState({ loading: true })

    const { form, phone } = this.state
    const { history } = this.props
    const { t } = this.props
    const gender =
      form.typeCompany === true || form.typeCompany === '1'
        ? GENDER_UNKNOWN
        : form.gender
    const owner =
      form.typeCompany === true || form.typeCompany === '1' ? form.owner : null

    const data = {
      detailsContact: {
        ...pick(['idPublisher', 'information'], form),
        phoneContact: phone,
      },
      contact: {
        idStatus: get('idStatus', form),
        idLanguage: get('idLanguage', form),
        phone,
        gender,
        owner,
        name: ifEmptySetNull(getOr('', 'name', form)),
        idLocation: ifEmptySetNull(getOr('', 'idLocation', form)),
        typeCompany: get('typeCompany', form),
      },
    }
    try {
      await details.create(data)
      this.setState({ loading: false })
      history.goBack()
      showSuccessful(t)
    } catch (error) {
      this.setState({ loading: false })
      showError(error, t, 'detailsContacts')
    }
  }

  render() {
    const {
      form,
      validated,
      publishersOptions,
      loading,
      locationsOptions,
      phone,
    } = this.state
    const { t, history } = this.props
    const title = (
      <React.Fragment>
        {' '}
        <FontAwesomeIcon icon={faAddressCard} />{' '}
        {`${t('common:new')} ${t('detailsContacts:title')} #${phone}`}
      </React.Fragment>
    )

    return (
      <ContainerCRUD title={title} {...this.props}>
        <Container className="border p-4">
          <FormDetails
            validator={this.validator}
            loading={loading}
            validated={validated}
            handleSubmit={this.handleSubmit}
            handleInputChange={this.handleInputChange}
            form={form}
            locationsOptions={locationsOptions}
            publishersOptions={publishersOptions}
            onSubmit={this.handleSubmit}
            history={history}
          />
        </Container>
      </ContainerCRUD>
    )
  }
}

export default withTranslation(['contacts', 'common'])(NewDetailsContact)
