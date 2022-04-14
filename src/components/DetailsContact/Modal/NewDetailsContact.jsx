import React from 'react'
import Swal from 'sweetalert2'
import { getOr, pick, get } from 'lodash/fp'
import { withTranslation } from 'react-i18next'
import OurModal from '../../common/OurModal/OurModal'
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
import Button from '../../common/Button/Button'
import ElementError from '../../common/ElementError/ElementError'

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
      showRadioButtonGoalReached: false,
      goalCampaign: '',
    }

    this.handleSubmit = this.handleSubmit.bind(this)
    this.onOpen = this.onOpen.bind(this)
    this.notificationNotAllowedNewDetails =
      this.notificationNotAllowedNewDetails.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
    this.resetForm = this.resetForm.bind(this)

    this.validator = new SimpleReactValidator({
      autoForceUpdate: this,
      locale: getLocale(this.props),
      element: (message) => <ElementError message={message} />,
    })
  }

  async onOpen() {
    const { t } = this.props
    const { campaignActive } = this.context
    const { phone } = this.props

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
      if (campaignActive) {
        goalCampaign = campaignActive.goal
      } else if (form.idCampaign) {
        const campaignResponse = await campaigns.getOne(form.idCampaign)
        const campaignData = getOr({ goal: '' }, 'data.data', campaignResponse)
        goalCampaign = campaignData.goal
      }

      this.setState({
        form: newForm,
        loading: false,
        publishersOptions,
        locationsOptions,
        showRadioButtonGoalReached,
        goalCampaign,
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
    this.setState({ submitting: true })

    const { form } = this.state
    const { contact, t } = this.props

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
        phoneContact: get('phone', contact),
      },
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
      await details.create(data)
      showSuccessful(t)
      onHide()
    } catch (error) {
      this.setState({ submitting: false })
      showError(error, t, 'detailsContacts')
    }
  }

  resetForm() {
    this.setState({ form: fields, submitting: false, validated: false })
    this.validator.hideMessages()
  }

  notificationNotAllowedNewDetails() {
    const { t } = this.props
    Swal.fire({
      icon: 'error',
      title: t('common:ops'),
      text: t('notificationNotAllowedNewDetails'),
    })
  }

  render() {
    const {
      form,
      validated,
      publishersOptions,
      loading,
      locationsOptions,
      submitting,
      showRadioButtonGoalReached,
      goalCampaign,
    } = this.state
    const { t, afterClose, waitingFeedback, contact } = this.props
    const title = (
      <Icon
        name={EIcons.addressCardIcon}
        label={`${t('common:new')} ${t('titleCrud')} #${get('phone', contact)}`}
      />
    )

    return waitingFeedback ? (
      <Button
        variant="primary"
        onClick={this.notificationNotAllowedNewDetails}
        iconName={EIcons.plusSquareIcon}
      />
    ) : (
      <OurModal
        body={FormDetails}
        validator={this.validator}
        loading={loading}
        submitting={submitting}
        validated={validated}
        handleSubmit={this.handleSubmit}
        handleInputChange={this.handleInputChange}
        form={form}
        onExit={afterClose}
        onEnter={this.onOpen}
        onClose={this.resetForm}
        locationsOptions={locationsOptions}
        publishersOptions={publishersOptions}
        title={title}
        buttonTitle={t('common:new')}
        buttonIcon={EIcons.plusSquareIcon}
        showRadioButtonGoalReached={showRadioButtonGoalReached}
        goalCampaign={goalCampaign}
      />
    )
  }
}

NewDetailsContact.contextType = ApplicationContext

export default withTranslation(['detailsContacts', 'common'])(NewDetailsContact)
