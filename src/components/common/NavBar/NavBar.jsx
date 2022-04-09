import React from 'react'
import { get } from 'lodash/fp'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Navbar, Nav, NavDropdown, Image, Col } from 'react-bootstrap'

import {
  contactsPaths,
  publishersPaths,
  statusPaths,
  languagesPaths,
  campaignsPaths,
} from '../../../routes/paths'
import { EIcons } from '../../../enums/icons'
import useApplicationContext from '../../../hooks/useApplicationContext'

import Login from '../../Login/Login'
import Icon from '../Icon/Icon'
import Logout from '../../Logout/Logout'
import logo from '../../../assets/images/logo.png'
import SystemLanguages from '../../SystemLanguages/SystemLanguages'
import './styles.css'

const MenuLogged = ({ t, user, isAtLeastSM, isAtLeastElder, ...props }) => {
  const contactsMenuItem = (
    <Icon name={EIcons.userFriendsIcon} label={t('contacts')} />
  )
  const adminMenuItem = <Icon name={EIcons.cogsIcon} label={t('admin')} />

  return (
    <React.Fragment>
      <Nav className="mr-auto">
        <NavDropdown title={contactsMenuItem}>
          {isAtLeastSM && (
            <React.Fragment>
              <NavDropdown.Item as={Link} to={contactsPaths.CONTACTS_LIST_PATH}>
                <Icon
                  name={EIcons.globeAmericasIcon}
                  label={t('allContacts')}
                />
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item
                as={Link}
                to={contactsPaths.CONTACTS_AVAILABLE_LIST_PATH}
              >
                <Icon
                  name={EIcons.checkDoubleIcon}
                  label={t('allContactsAvailable')}
                />
              </NavDropdown.Item>
              <NavDropdown.Divider />
            </React.Fragment>
          )}
          <NavDropdown.Item
            as={Link}
            to={contactsPaths.CONTACTS_WAITING_FEEDBACK_LIST_PATH}
          >
            <Icon
              name={EIcons.hourglassIcon}
              label={t('allContactsWaitingFeedback')}
            />
          </NavDropdown.Item>
        </NavDropdown>
        {isAtLeastElder && (
          <Nav.Link as={Link} to={campaignsPaths.CAMPAIGNS_LIST_PATH}>
            <Icon name={EIcons.bullhornIcon} label={t('campaigns')} />
          </Nav.Link>
        )}
        {isAtLeastSM && (
          <NavDropdown title={adminMenuItem} id="collasible-nav-dropdown">
            <NavDropdown.Item
              as={Link}
              to={publishersPaths.PUBLISHERS_LIST_PATH}
            >
              <Icon name={EIcons.briefcaseIcon} label={t('publishers')} />
            </NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item as={Link} to={statusPaths.STATUS_LIST_PATH}>
              <Icon name={EIcons.tagsIcon} label={t('status')} />
            </NavDropdown.Item>
            <NavDropdown.Item as={Link} to={languagesPaths.LANGUAGES_LIST_PATH}>
              <Icon name={EIcons.languageIcon} label={t('languages')} />
            </NavDropdown.Item>
          </NavDropdown>
        )}
      </Nav>
      <Nav style={{ marginRight: '34px' }}>
        <NavDropdown title={get('name', user)}>
          <Logout {...props} t={t} />
        </NavDropdown>
      </Nav>
      <Nav style={{ maxWidth: '60px' }}>
        <SystemLanguages {...props} />
      </Nav>
    </React.Fragment>
  )
}

const MenuLogout = ({ t, ...props }) => (
  <React.Fragment>
    <Nav className="mr-auto">
      <Col xs={7} sm={12}>
        <Login {...props} t={t} />
      </Col>
    </Nav>
    <Nav className="mt-1">
      <Col xs={7} sm={12}>
        <SystemLanguages {...props} />
      </Col>
    </Nav>
  </React.Fragment>
)

const NavBarMenu = (props) => {
  const { t } = useTranslation(['navBar'])
  const { user, isAtLeastSM, isAtLeastElder } = useApplicationContext()

  return (
    <Navbar collapseOnSelect expand="lg" bg="light" variant="light">
      <Navbar.Brand as={Link} to="/">
        <Image
          src={logo}
          width="50px"
          height="auto"
          alt="Agenda"
          roundedCircle
        />
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        {user ? (
          <MenuLogged
            {...props}
            user={user}
            isAtLeastSM={isAtLeastSM}
            isAtLeastElder={isAtLeastElder}
            t={t}
          />
        ) : (
          <MenuLogout {...props} t={t} />
        )}
      </Navbar.Collapse>
    </Navbar>
  )
}

export default NavBarMenu
