import React from 'react'
import { BrowserRouter } from 'react-router-dom'

import Home from "../pages/Home/Home";
import Dashboard from "../pages/Dashboard/Dashboard";
import ContactsRoutes from "./modules/contacts/Contacts";
import PublishersRoutes from "./modules/publishers/Publishers";
import StatusRoutes from "./modules/status/Status";
import LanguageRoutes from "./modules/languages/Languages"

import PrivateRoute from '../utils/privateRoute'
import PublicRoute from '../utils/publicRoute'

const Routes = () => (
  <BrowserRouter>
    <PublicRoute exact path="/" component={Home} />
    <PrivateRoute exact path="/dashboard" component={Dashboard} />
    <ContactsRoutes />
    <PublishersRoutes />
    <StatusRoutes />
    <LanguageRoutes />
  </BrowserRouter>
)

export default Routes
