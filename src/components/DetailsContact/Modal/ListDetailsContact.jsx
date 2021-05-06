import React from 'react'
import { withTranslation } from 'react-i18next'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye } from '@fortawesome/free-solid-svg-icons'
import { details } from '../../../services'
import { getOr, isEmpty, some } from 'lodash/fp'
import OurModal from '../../common/OurModal/OurModal'
import ListDataDetailsContact from './ListDataDetailsContact'
import { showError } from '../../../utils/generic'

class ListDetailsContact extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      data: [],
      modalShow: false,
      waitingFeedback: false,
      submitting: false,
    }
    this.handleGetAllOneContact = this.handleGetAllOneContact.bind(this)
    this.handleDelete = this.handleDelete.bind(this)
  }

  isWaitingFeedback = (response) =>
    some({ waitingFeedback: true }, getOr([], 'data.data', response))

  async handleGetAllOneContact() {
    this.setState({ submitting: true })
    try {
      const id = getOr(0, 'props.id', this)
      const response = await details.getAllOneContact(id, {
        limit: 5,
        sort: '"detailsContacts"."createdAt":DESC',
      })
      this.setState({
        data: getOr([], 'data.data', response),
        waitingFeedback: this.isWaitingFeedback(response),
        submitting: false,
      })
    } catch (error) {
      const { t } = this.props
      showError(error, t, 'detailsContacts')
    }
  }

  async handleDelete(id) {
    const { t } = this.props
    this.setState({ submitting: true })
    await details
      .dellOne(id)
      .then(() => {
        this.handleGetAllOneContact()
        this.setState({ submitting: false })
      })
      .catch((error) => {
        this.setState({ submitting: false })
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
    const { data, waitingFeedback, submitting } = this.state
    return (
      <OurModal
        body={ListDataDetailsContact}
        contact={contact}
        submitting={submitting}
        waitingFeedback={waitingFeedback}
        data={data}
        title={`${t('title')} # ${contact.phone} ${this.getNameForTitle()}`}
        buttonTitle={t('common:list')}
        buttonText={<FontAwesomeIcon icon={faEye} />}
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
