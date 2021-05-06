import React from 'react'
import { get } from 'lodash/fp'
import { getUserData } from '../../utils/loginDataManager'
import { withTranslation } from 'react-i18next'
import ContainerWithNavBar from '../common/ContainerWithNavBar/ContainerWithNavBar'
import logo from '../../assets/images/logo.png'
import { Col, Row, Image } from 'react-bootstrap'
import Charts from './Charts'

class Dashboard extends React.Component {
  buildSubTitleMessage = () =>
    `${this.props.t('welcome')}, ${get('name', getUserData())}`

  render() {
    const { t } = this.props
    return (
      <ContainerWithNavBar {...this.props}>
        <Row className="mt-4">
          <Col lg={{ span: 4, offset: 1 }} xs={12}>
            <Row>
              <Col className="text-center" style={{ marginTop: '31%' }}>
                <h1>{t('title')}</h1>
                <h2>{t('titleCongregation')}</h2>
                <h3>{this.buildSubTitleMessage()}</h3>
              </Col>
            </Row>
          </Col>
          <Col lg={{ span: 4, offset: 1 }} xs={{ span: 8, offset: 2 }}>
            <Image src={logo} fluid />
          </Col>
        </Row>
        <Charts />
      </ContainerWithNavBar>
    )
  }
}

export default withTranslation(['dashboard', 'common'])(Dashboard)
