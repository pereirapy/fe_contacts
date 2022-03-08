import React from 'react'
import { Row, Col, Image, Button } from 'react-bootstrap'
import { withTranslation } from 'react-i18next'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons'

import logo from '../../assets/images/logo.png'
import ContainerWithNavBar from '../common/ContainerWithNavBar/ContainerWithNavBar'

const Landing = (props) => {
  const { history, t } = props

  const toHome = () => {
    history.push('/')
  }

  return (
    <ContainerWithNavBar {...props} titleOnlyText={t('pageNotFound')}>
      <Row className="text-center">
        <Col lg={{ span: 3, offset: 2 }} xs={12}>
          <h1 style={{ marginTop: '25%' }}>
            <FontAwesomeIcon icon={faExclamationTriangle} /> {t('pageNotFound')}
          </h1>
          <Button onClick={toHome}>{t('goToHome')}</Button>
        </Col>
        <Col lg={{ span: 3, offset: 1 }} xs={12}>
          <Image src={logo} fluid />
        </Col>
      </Row>
    </ContainerWithNavBar>
  )
}

export default withTranslation(['common'])(Landing)
