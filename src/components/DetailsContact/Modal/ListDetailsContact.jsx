import React from 'react'
import { withTranslation } from 'react-i18next'
import { getOr, isEmpty, some } from 'lodash/fp'

import { details } from '../../../services'
import { EIcons } from '../../../enums/icons'
import { showError } from '../../../utils/generic'

import Icon from '../../common/Icon/Icon'
import OurModal from '../../common/OurModal/OurModal'
import ListDataDetailsContact from './ListDataDetailsContact'

class ListDetailsContact extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      data: [],
      modalShow: false,
      waitingFeedback: false,
      loading: false,
    }
    this.handleGetAllOneContact = this.handleGetAllOneContact.bind(this)
    this.handleDelete = this.handleDelete.bind(this)
  }

  isWaitingFeedback = (response) =>
    some({ waitingFeedback: true }, getOr([], 'data.data', response))

  async handleGetAllOneContact() {
    this.setState({ loading: true })
    try {
      const id = getOr(0, 'props.id', this)
      const response = await details.getAllOneContact(id, {
        limit: 5,
        sort: '"detailsContacts"."createdAt":DESC',
      })
      this.setState({
        data: getOr([], 'data.data', response),
        waitingFeedback: this.isWaitingFeedback(response),
        loading: false,
      })
    } catch (error) {
      const { t } = this.props
      this.setState({ loading: false })
      showError(error, t, 'detailsContacts')
    }
  }

  async handleDelete(id) {
    const { t } = this.props
    this.setState({ loading: true })
    await details
      .dellOne(id)
      .then(() => {
        this.handleGetAllOneContact()
        this.setState({ loading: false })
      })
      .catch((error) => {
        this.setState({ loading: false })
        showError(error, t, 'detailsContacts')
      })
  }

  setModalShow = (action) => this.setState({ modalShow: action })

  getNameForTitle() {
    const { contact } = this.props
    return !isEmpty(contact.name) ? `- ${contact.name}` : ''
  }

  render() {
    const { t, contact, afterClose } = this.props
    const { data, waitingFeedback, loading } = this.state
    const title = (
      <React.Fragment>
        <Icon name={EIcons.addressCardIcon} />
        {`${t('title')} # ${contact.phone} ${this.getNameForTitle()}`}
      </React.Fragment>
    )

    return (
      <OurModal
        body={ListDataDetailsContact}
        contact={contact}
        loading={loading}
        waitingFeedback={waitingFeedback}
        data={data}
        title={title}
        buttonTitle={t('common:list')}
        buttonIcon={EIcons.eyeIcon}
        buttonVariant="primary"
        afterClose={this.handleGetAllOneContact}
        onExit={afterClose}
        onEnter={this.handleGetAllOneContact}
        funcToCallAfterConfirmation={this.handleDelete}
      />
    )
  }
}

export default withTranslation(['detailsContacts', 'common'])(
  ListDetailsContact
)
