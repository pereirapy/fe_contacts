import React from 'react'
import { NavDropdown } from 'react-bootstrap'
import Swal from 'sweetalert2'
import { withTranslation } from 'react-i18next'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons'
import useApplicationContext from '../../hooks/useApplicationContext'
import { buildContextData } from '../../utils/loginDataManager'

const handleLogout = (props, dropToken, updateContext) => {
  const { history, t } = props

  dropToken()
  const newContext = buildContextData()
  updateContext(() => newContext)
  history.push('/')
  Swal.fire({
    title: t('YouWasLogoutSuccessfully'),
    icon: 'success',
    timer: 2000,
    timerProgressBar: true,
  })
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
