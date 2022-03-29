import React from 'react'

import publishersPaths from './path'
import PrivateRoute from '../../../utils/privateRoute'

import Publishers from '../../../pages/Publishers/Publishers'

const Routes = () => [
  <PrivateRoute
    exact
    key={publishersPaths.PUBLISHERS_LIST_PATH}
    path={publishersPaths.PUBLISHERS_LIST_PATH}
    component={Publishers}
  />,
  <PrivateRoute
    exact
    key={publishersPaths.PUBLISHERS_NEW_PATH}
    path={publishersPaths.PUBLISHERS_NEW_PATH}
    component={Publishers}
  />,
  <PrivateRoute
    exact
    key={publishersPaths.PUBLISHERS_EDIT_PATH}
    path={publishersPaths.PUBLISHERS_EDIT_PATH}
    component={Publishers}
  />,
]

export default Routes
