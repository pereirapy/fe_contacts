import React from 'react'
import PrivateRoute from '../../../utils/privateRoute'

import ContactsList from '../../../pages/Contacts/ContactsList'
import ContactsWaitingFeedbackList from '../../../pages/Contacts/ContactsWaitingFeedbackList'
import ListDetailsContact from '../../../pages/DetailsContact/ListDetailsContact'
import EditDetailsContact from '../../../pages/DetailsContact/EditDetailsContact'
import NewDetailsContact from '../../../pages/DetailsContact/NewDetailsContact'

import contactsPaths from './path'

const Routes = () => (
  <>
    <PrivateRoute
      exact
      path={contactsPaths.CONTACTS_LIST_PATH}
      component={ContactsList}
    />
    <PrivateRoute
      exact
      path={contactsPaths.CONTACTS_WAITING_FEEDBACK_LIST_PATH}
      component={ContactsWaitingFeedbackList}
    />
    <PrivateRoute
      exact
      path={contactsPaths.CONTACTS_DETAILS_LIST_PATH}
      component={ListDetailsContact}
    />
    <PrivateRoute
      exact
      path={contactsPaths.CONTACTS_DETAILS_NEW_PATH}
      component={NewDetailsContact}
    />
    <PrivateRoute
      exact
      path={contactsPaths.CONTACTS_DETAILS_EDIT_PATH}
      component={EditDetailsContact}
    />
  </>
)

export default Routes
