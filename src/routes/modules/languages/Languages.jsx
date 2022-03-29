import React from 'react'

import languagesPath from './path'
import PrivateRoute from '../../../utils/privateRoute'

import LanguageList from '../../../pages/Languages/LanguagesList'

const Routes = () => [
  <PrivateRoute
    exact
    key={languagesPath.LANGUAGES_LIST_PATH}
    path={languagesPath.LANGUAGES_LIST_PATH}
    component={LanguageList}
  />,
]

export default Routes
