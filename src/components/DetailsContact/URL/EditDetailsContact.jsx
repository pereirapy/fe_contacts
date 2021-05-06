import React from 'react'
import { withTranslation } from 'react-i18next'
import { details, publishers, locations } from '../../../services'
import ContainerCRUD from '../../../components/common/ContainerCRUD/ContainerCRUD'
import { getOr, pick, get } from 'lodash/fp'
import FormDetails from '../FormDetails'
import SimpleReactValidator from 'simple-react-validator'
import { getLocale, handleInputChangeGeneric } from '../../../utils/forms'
import {
  showError,
  showSuccessful,
  ifEmptySetNull,
} from '../../../utils/generic'
import { WAITING_FEEDBACK, GENDER_UNKNOWN } from '../../../constants/contacts'
import { Container } from 'react-bootstrap'
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
      phone: getOr(0, 'match.params.phone', props),
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
    const id = getOr(0, 'props.match.params.id', this)
    this.setState({ loading: true })
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
    const id = getOr(0, 'props.match.params.id', this)
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
      await details.updateOneContactDetail(id, data)
      this.setState({ loading: false })
      history.goBack()
      showSuccessful(t)
    } catch (error) {
      this.setState({ loading: false })
      showError(error, t, 'detailsContacts')
    }
  }

  componentDidMount() {
    this.handleGetOne()
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

    return (
      <>
        <ContainerCRUD title={t('title')} {...this.props}>
          <Container className="border p-4">
            <h1>{`${t('common:edit')} ${t('detailsContacts:title')} #${phone}`}</h1>
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
      </>
    )
  }
}

export default withTranslation(['contacts', 'common'])(EditDetailsContact)
