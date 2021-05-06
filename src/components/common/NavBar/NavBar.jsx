import React from 'react'
import { Navbar, Nav, NavDropdown, Image } from 'react-bootstrap'
import { get } from 'lodash/fp'
import {
  getUserData,
  hasToken,
  isAtLeastSM,
} from '../../../utils/loginDataManager'
import logo from '../../../assets/images/logo.png'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import Login from '../../Login/Login'
import Logout from '../../Logout/Logout'
import SystemLanguages from '../../SystemLanguages/SystemLanguages'
import {
  contactsPaths,
  publishersPaths,
  statusPaths,
  languagesPaths
} from "../../../routes/paths";

const MenuLogged = ({ t, ...props }) => (
  <>
    <Nav className="mr-auto">
      <NavDropdown title={t('contacts')}>
        {isAtLeastSM() && (
          <>
            <NavDropdown.Item as={Link} to={contactsPaths.CONTACTS_LIST_PATH}>
              {t('allContacts')}
            </NavDropdown.Item>
            <NavDropdown.Divider />
          </>
        )}
        <NavDropdown.Item
          as={Link}
          to={contactsPaths.CONTACTS_WAITING_FEEDBACK_LIST_PATH}
        >
          {t('allContactsWaitingFeedback')}
        </NavDropdown.Item>
      </NavDropdown>
      {isAtLeastSM() && (
        <NavDropdown title={t('admin')} id="collasible-nav-dropdown">
          <NavDropdown.Item as={Link} to={publishersPaths.PUBLISHERS_LIST_PATH}>
            {t('publishers')}
          </NavDropdown.Item>
          <NavDropdown.Divider />
          <NavDropdown.Item as={Link} to={statusPaths.STATUS_LIST_PATH}>
            {t('status')}
          </NavDropdown.Item>
          <NavDropdown.Item as={Link} to={languagesPaths.LANGUAGES_LIST_PATH}>
            {t("languages")}
          </NavDropdown.Item>
        </NavDropdown>
      )}
    </Nav>
    <Nav style={{ marginRight: '34px' }}>
      <NavDropdown title={get('name', getUserData())}>
        <Logout {...props} t={t} />
      </NavDropdown>
    </Nav>
    <Nav style={{ maxWidth: '60px' }}>
      <SystemLanguages {...props} />
    </Nav>
  </>
)

const MenuLogout = ({ t, ...props }) => (
  <>
    <Nav className="mr-auto" style={{ width: '70px' }}>
      <Login {...props} t={t} />
    </Nav>
    <Nav style={{ maxWidth: '70px' }} className="mt-1">
      <SystemLanguages {...props} />
    </Nav>
  </>
)

const NavBarMenu = (props) => {
  const { t } = useTranslation(['navBar'])
  return (
    <Navbar collapseOnSelect expand="lg" bg="light" variant="light">
      <Navbar.Brand as={Link} to="/">
        <Image src={logo} width="50px" alt="Agenda" roundedCircle />
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        {hasToken() ? (
          <MenuLogged {...props} t={t} />
        ) : (
          <MenuLogout {...props} t={t} />
        )}
      </Navbar.Collapse>
    </Navbar>
  )
}

export default NavBarMenu
