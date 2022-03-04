import React from 'react'
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'

import Home from '../pages/Home/Home'
import NotFound from '../pages/NotFound/NotFound'
import Dashboard from '../pages/Dashboard/Dashboard'
import contactsRoutes from './modules/contacts/Contacts'
import publishersRoutes from './modules/publishers/Publishers'
import statusRoutes from './modules/status/Status'
import campaignsRoutes from './modules/campaigns/Campaigns'
import languageRoutes from './modules/languages/Languages'

import PrivateRoute from '../utils/privateRoute'
import PublicRoute from '../utils/publicRoute'

const Routes = () => (
  <BrowserRouter>
    <Switch>
      <PublicRoute exact key="/home" path="/" component={Home} />
      <PrivateRoute
        exact
        key="/dashboard"
        path="/dashboard"
        component={Dashboard}
      />
      {contactsRoutes()}
      {publishersRoutes()}
      {languageRoutes()}
      {statusRoutes()}
      {campaignsRoutes()}
      <Route key="/404" path="/404" component={NotFound} />
      <Redirect to="/404" />
    </Switch>
  </BrowserRouter>
)

export default Routes
