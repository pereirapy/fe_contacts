import React from 'react'
import ContactsList from '../../components/Contacts/ContactsList'

const ContactsListAvailablePage = (props) => (
  <ContactsList {...props} modeAllContacts={false} />
)

export default ContactsListAvailablePage
