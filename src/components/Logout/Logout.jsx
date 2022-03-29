import React from 'react'
import { NavDropdown } from 'react-bootstrap'
import { withTranslation } from 'react-i18next'

import { EIcons } from '../../enums/icons'
import { showSuccessful } from '../../utils/generic'
import { buildContextData } from '../../utils/loginDataManager'
import useApplicationContext from '../../hooks/useApplicationContext'

import Icon from '../common/Icon/Icon'

const handleLogout = (props, dropToken, updateContext) => {
  const { history, t } = props

  dropToken()
  const newContext = buildContextData()
  updateContext(() => newContext)
  history.push('/')
  showSuccessful(t, 'YouWasLogoutSuccessfully', 'logout')
}

const Logout = (props) => {
  const { dropToken, updateContext } = useApplicationContext()

  return (
    <NavDropdown.Item
      onClick={() => handleLogout(props, dropToken, updateContext)}
    >
      <Icon name={EIcons.signOutAltIcon} />
      {props.t('btnLogout')}
    </NavDropdown.Item>
  )
}

export default withTranslation(['logout'])(Logout)
