import React from 'react'
import { Container } from 'react-bootstrap'
import { getOr, pick, get } from 'lodash/fp'
import { withTranslation } from 'react-i18next'
import SimpleReactValidator from 'simple-react-validator'

import {
  getLocale,
  handleInputChangeGeneric,
  formatDateDMYHHmm,
} from '../../../utils/forms'
import {
  showError,
  showSuccessful,
  ifEmptySetNull,
} from '../../../utils/generic'
import {
  WAITING_FEEDBACK,
  GENDER_UNKNOWN,
  GOAL_REACHED,
} from '../../../constants/contacts'
import { EIcons } from '../../../enums/icons'
import { ApplicationContext } from '../../../contexts/application'
import { reduceLocations } from '../../../stateReducers/locations'
import { reducePublishers } from '../../../stateReducers/publishers'
import { details, publishers, locations, campaigns } from '../../../services'

import FormDetails from '../FormDetails'
import Icon from '../../common/Icon/Icon'
import ElementError from '../../common/ElementError/ElementError'
import ContainerCRUD from '../../common/ContainerCRUD/ContainerCRUD'

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
  updatedAt: '',
  publisherUpdatedBy: '',
  goalReached: '0',
}

class EditDetailsContact extends React.Component {
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
    this.getLastPublisherThatTouched =
      this.getLastPublisherThatTouched.bind(this)
    this.handleGetOne = this.handleGetOne.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)

    this.validator = new SimpleReactValidator({
      autoForceUpdate: this,
      locale: getLocale(this.props),
      element: (message) => <ElementError message={message} />,
    })
  }

  getLastPublisherThatTouched(form) {
    const { t } = this.props

    return form.publisherUpdatedBy
      ? t('common:updatedByAt', {
          date: formatDateDMYHHmm(form.updatedAt),
          name: form.publisherUpdatedBy,
        })
      : t('common:createdByAt', {
          date: formatDateDMYHHmm(form.createdAt),
          name: form.publisherCreatedBy,
        })
  }

  async handleGetOne() {
    const { campaignActive } = this.context
    const { t } = this.props

    const id = getOr(0, 'props.match.params.id', this)
    this.setState({ loading: true })
    try {
      const response = await details.getOne(id)
      const data = getOr(fields, 'data.data', response)
      const idCampaign = data.idCampaign || campaignActive?.id || null

      const form = {
        ...data,
        information:
          getOr('', 'information', data) === WAITING_FEEDBACK ||
          getOr('', 'information', data) === GOAL_REACHED
            ? ''
            : getOr('', 'information', data),
        idCampaign,
        lastPublisherThatTouched: this.getLastPublisherThatTouched(data),
      }
      const publishersOptions = reducePublishers(await publishers.getAll())
      const locationsOptions = reduceLocations(await locations.getAll())

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
        form,
        publishersOptions,
        locationsOptions,
        loading: false,
        showRadioButtonGoalReached,
        goalCampaign,
        campaignName,
      })
    } catch (error) {
      this.setState({ loading: false })
      showError(error, t, 'detailsContacts')
    }
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
    const id = getOr(0, 'props.match.params.id', this)

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
      await details.updateOneContactDetail(id, data)
      this.setState({ submitting: false })
      history.goBack()
      showSuccessful(t)
    } catch (error) {
      this.setState({ submitting: false })
      showError(error, t, 'detailsContacts')
    }
  }

  componentDidMount() {
    this.handleGetOne()
  }

  getTitle(onlyText) {
    const { t } = this.props
    const { campaignName, phone } = this.state
    const label = `${t('common:edit')} ${t(
      'detailsContacts:title'
    )} #${phone}${campaignName}`

    return onlyText ? (
      label
    ) : (
      <Icon name={EIcons.addressCardIcon} label={label} />
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

EditDetailsContact.contextType = ApplicationContext

export default withTranslation(['contacts', 'common'])(EditDetailsContact)
