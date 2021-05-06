import React from 'react'
import { NavDropdown } from 'react-bootstrap'
import { dropToken } from '../../utils/loginDataManager'
import Swal from 'sweetalert2'
import { withTranslation } from 'react-i18next'

const handleLogout = (props) => {
  const { history, t } = props
  dropToken()
  history.push('/')
  Swal.fire({
    title: t('YouWasLogoutSuccessfully'),
    icon: 'success',
    timer: 2000,
    timerProgressBar: true,
  })
}

const Logout = (props) => (
  <NavDropdown.Item onClick={() => handleLogout(props)}>
    {props.t('btnLogout')}
  </NavDropdown.Item>
)

export default withTranslation(['logout'])(Logout)
