import React from 'react'
import { useTranslation } from 'react-i18next'
import { Row, Col, Container } from 'react-bootstrap'

import packageInfo from '../../../../package.json'

const Footer = () => {
  const { t } = useTranslation(['footer'])
  const currentEnv = `${
    process.env.NODE_ENV === 'development'
      ? ` - development - v${packageInfo.version}`
      : ''
  }`

  return (
    <Container fluid>
      <Row className="bg-light mt-4">
        <Col className="mt-4 mb-4 text-center">
          {t('message')}
          {currentEnv}
        </Col>
      </Row>
    </Container>
  )
}

export default Footer
