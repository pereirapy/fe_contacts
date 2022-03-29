import React from 'react'

import statusPath from './path'
import PrivateRoute from '../../../utils/privateRoute'

import StatusList from '../../../pages/Status/StatusList'

const Routes = () => [
  <PrivateRoute
    exact
    path={statusPath.STATUS_LIST_PATH}
    key={statusPath.STATUS_LIST_PATH}
    component={StatusList}
  />,
]

export default Routes
