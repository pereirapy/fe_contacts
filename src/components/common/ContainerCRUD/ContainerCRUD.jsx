import React from 'react'
import { Helmet } from 'react-helmet'
import { Row, Col } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'

import ContainerWithNavBar from '../ContainerWithNavBar/ContainerWithNavBar'
import './styles.css'

const ContainerCRUD = (props) => {
  const { t, i18n } = useTranslation('common')
  return (
    <ContainerWithNavBar {...props}>
      <Helmet htmlAttributes={{ lang: i18n.language }}>
        <title>
          {props.titleOnlyText ? `${props.titleOnlyText} - ` : ''}
          {t('appName')}
        </title>
        <meta name="description" content={t('appDescription')} />
      </Helmet>
      <Row className="mt-4">
        <Col className={`page-header bg-${props.color || 'info'}`}>
          <h1>{props.title}</h1>
        </Col>
      </Row>
      <Row className="mt-4">
        <Col xs={12}>{props.children}</Col>
      </Row>
    </ContainerWithNavBar>
  )
}
export default ContainerCRUD
