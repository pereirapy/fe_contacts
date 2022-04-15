import React from 'react'
import { getOr, pick, get } from 'lodash/fp'
import { Container } from 'react-bootstrap'
import { withTranslation } from 'react-i18next'
import SimpleReactValidator from 'simple-react-validator'

import {
  showError,
  showSuccessful,
  ifEmptySetNull,
} from '../../../utils/generic'
import {
  ID_LANGUAGE_DEFAULT,
  ID_GENDER_DEFAULT,
  ID_STATUS_DEFAULT,
  ID_LOCATION_DEFAULT,
} from '../../../constants/valuesPredefined'
import {
  details,
  publishers,
  contacts,
  locations,
  campaigns,
} from '../../../services'
import { EIcons } from '../../../enums/icons'
import { ApplicationContext } from '../../../contexts/application'
import { reduceLocations } from '../../../stateReducers/locations'
import { reducePublishers } from '../../../stateReducers/publishers'
import { getLocale, handleInputChangeGeneric } from '../../../utils/forms'
import { GENDER_UNKNOWN, GOAL_REACHED } from '../../../constants/contacts'

import FormDetails from '../FormDetails'
import Icon from '../../common/Icon/Icon'
import ElementError from '../../common/ElementError/ElementError'
import ContainerCRUD from '../../common/ContainerCRUD/ContainerCRUD'

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
  goalReached: '0',
}

class NewDetailsContact extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      form: fields,
      loading: false,
      submitting: false,
      validated: false,
      publishersOptions: [],
      locationsOptions: [],
      phone: getOr(0, 'match.params.phone', props),
      showRadioButtonGoalReached: false,
      goalCampaign: '',
      campaignName: '',
    }
    this.getTitle = this.getTitle.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleGetOneContact = this.handleGetOneContact.bind(this)

    this.validator = new SimpleReactValidator({
      autoForceUpdate: this,
      locale: getLocale(this.props),
      element: (message) => <ElementError message={message} />,
    })
  }

  async handleGetOneContact() {
    const { phone } = this.state
    const { t } = this.props
    const { campaignActive } = this.context

    this.setState({ loading: true })
    try {
      const contact = await contacts.getOne(phone)
      const publishersOptions = reducePublishers(await publishers.getAll())
      const locationsOptions = reduceLocations(await locations.getAll())

      const form = getOr(fields, 'data.data', contact)
      const newForm = {
        ...fields,
        ...form,
        idCampaign: campaignActive?.id || null,
      }

      const showRadioButtonGoalReached = campaignActive || form.idCampaign

      let goalCampaign = ''
      let campaignName = ''
      if (campaignActive) {
        goalCampaign = campaignActive.goal
        campaignName = ` - ${campaignActive.name}`
      } else if (form.idCampaign) {
        const campaignResponse = await campaigns.getOne(form.idCampaign)
        const campaignData = getOr(
          { goal: '', name: '' },
          'data.data',
          campaignResponse
        )
        goalCampaign = campaignData.goal
        campaignName = ` - ${campaignData.name}`
      }

      this.setState({
        form: newForm,
        publishersOptions,
        loading: false,
        locationsOptions,
        showRadioButtonGoalReached,
        goalCampaign,
        campaignName,
      })
    } catch (error) {
      this.setState({ loading: false })
      showError(error, t, 'detailsContacts')
    }
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
    this.setState({ submitting: true })

    const { form, phone } = this.state
    const { history } = this.props
    const { t } = this.props

    const gender =
      form.typeCompany === true || form.typeCompany === '1'
        ? GENDER_UNKNOWN
        : form.gender

    const owner =
      form.typeCompany === true || form.typeCompany === '1' ? form.owner : null

    const information =
      form.goalReached === true || form.goalReached === '1'
        ? GOAL_REACHED
        : getOr('', 'information', form)

    const data = {
      detailsContact: {
        ...pick(['idPublisher', 'goalReached', 'idCampaign'], form),
        information,
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
      this.setState({ submitting: false })
      history.goBack()
      showSuccessful(t)
    } catch (error) {
      this.setState({ submitting: false })
      showError(error, t, 'detailsContacts')
    }
  }

  getTitle(onlyText) {
    const { phone, campaignName } = this.state
    const { t } = this.props
    const title = `${t('common:new')} ${t(
      'detailsContacts:title'
    )} #${phone}${campaignName}`

    return onlyText ? (
      title
    ) : (
      <Icon name={EIcons.addressCardIcon} label={title} />
    )
  }

  render() {
    const {
      form,
      validated,
      publishersOptions,
      loading,
      submitting,
      locationsOptions,
      showRadioButtonGoalReached,
      goalCampaign,
    } = this.state
    const { history } = this.props

    return (
      <ContainerCRUD
        title={this.getTitle()}
        titleOnlyText={this.getTitle(true)}
        {...this.props}
      >
        <Container className="border p-4">
          <FormDetails
            validator={this.validator}
            loading={loading}
            submitting={submitting}
            validated={validated}
            handleSubmit={this.handleSubmit}
            handleInputChange={this.handleInputChange}
            form={form}
            locationsOptions={locationsOptions}
            publishersOptions={publishersOptions}
            onSubmit={this.handleSubmit}
            history={history}
            showRadioButtonGoalReached={showRadioButtonGoalReached}
            goalCampaign={goalCampaign}
          />
        </Container>
      </ContainerCRUD>
    )
  }
}

NewDetailsContact.contextType = ApplicationContext

export default withTranslation(['contacts', 'common'])(NewDetailsContact)
