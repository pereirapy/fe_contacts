import React from 'react'
import PrivateRoute from '../../../utils/privateRoute'
import Publishers from '../../../pages/Publishers/Publishers'

import publishersPaths from './path'

const Routes = () => (
  <>
    <PrivateRoute
      exact
      path={publishersPaths.PUBLISHERS_LIST_PATH}
      component={Publishers}
    />
    <PrivateRoute
      exact
      path={publishersPaths.PUBLISHERS_NEW_PATH}
      component={Publishers}
    />
    <PrivateRoute
      exact
      path={publishersPaths.PUBLISHERS_EDIT_PATH}
      component={Publishers}
    />
  </>
)

export default Routes
