import React from 'react'
import { get } from 'lodash/fp'
import { Col, Row, Image } from 'react-bootstrap'
import { withTranslation } from 'react-i18next'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPhoneVolume } from '@fortawesome/free-solid-svg-icons'

import { ApplicationContext } from '../../contexts/application'

import ContainerWithNavBar from '../common/ContainerWithNavBar/ContainerWithNavBar'
import Charts from '../common/Charts/Charts'
import logo from '../../assets/images/logo.png'

class Dashboard extends React.Component {
  buildSubTitleMessage = () => {
    const { user } = this.context
    return `${this.props.t('welcome')}, ${get('name', user)}`
  }

  render() {
    const { t } = this.props
    const { campaignActive } = this.context

    return (
      <ContainerWithNavBar {...this.props} titleOnlyText={t('titleOnlyText')}>
        <Row className="mt-4">
          <Col
            xl={{ span: 4, offset: 2 }}
            lg={{ span: 5, offset: 1 }}
            md={{ span: 5, offset: 0 }}
            xs={12}
          >
            <Row>
              <Col className="text-center" style={{ marginTop: '31%' }}>
                <h1>
                  <FontAwesomeIcon icon={faPhoneVolume} /> {t('title')}
                </h1>
                <h2>{t('titleCongregation')}</h2>
                <h3>{this.buildSubTitleMessage()}</h3>
              </Col>
            </Row>
          </Col>
          <Col
            xl={{ span: 4, offset: 0 }}
            lg={{ span: 5, offset: 0 }}
            md={{ span: 6, offset: 0 }}
            xs={{ span: 8, offset: 2 }}
          >
            <Image src={logo} fluid />
          </Col>
        </Row>
        <Charts campaign={campaignActive} />
      </ContainerWithNavBar>
    )
  }
}

Dashboard.contextType = ApplicationContext

export default withTranslation(['dashboard', 'common'])(Dashboard)
