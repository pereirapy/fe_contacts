import React from 'react'
import { NavDropdown } from 'react-bootstrap'
import { withTranslation } from 'react-i18next'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons'

import { showSuccessful } from '../../utils/generic'
import { buildContextData } from '../../utils/loginDataManager'
import useApplicationContext from '../../hooks/useApplicationContext'

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
      <FontAwesomeIcon icon={faSignOutAlt} /> {props.t('btnLogout')}
    </NavDropdown.Item>
  )
}

export default withTranslation(['logout'])(Logout)
