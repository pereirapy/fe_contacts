import React from 'react'
import { withTranslation } from 'react-i18next'
import { Row, Col, Image } from 'react-bootstrap'

import { EIcons } from '../../enums/icons'

import Icon from '../common/Icon/Icon'
import Button from '../common/Button/Button'
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
            <Icon name={EIcons.exclamationTriangleIcon} />
            {t('pageNotFound')}
          </h1>
          <Button onClick={toHome} text={t('goToHome')}></Button>
        </Col>
        <Col lg={{ span: 3, offset: 1 }} xs={12}>
          <Image src={logo} fluid />
        </Col>
      </Row>
    </ContainerWithNavBar>
  )
}

export default withTranslation(['common'])(Landing)
