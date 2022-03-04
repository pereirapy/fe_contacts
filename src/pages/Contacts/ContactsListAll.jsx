import React from 'react'
import ContactsList from '../../components/Contacts/ContactsList'

const ContactsListAllPage = (props) => (
  <ContactsList {...props} modeAllContacts={true} />
)

export default ContactsListAllPage
