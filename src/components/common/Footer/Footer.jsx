import React from 'react'
import { Row, Col, Container } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'

const Footer = (props) => {
  const { t } = useTranslation(['footer'])

  return (
    <Container fluid>
      <Row className="bg-light mt-4">
        <Col className="mt-4 mb-4 text-center">{t('message')}</Col>
      </Row>
    </Container>
  )
}

export default Footer
