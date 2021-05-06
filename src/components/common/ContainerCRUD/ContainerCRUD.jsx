import React from 'react'
import './styles.css'
import { Row, Col } from 'react-bootstrap'
import ContainerWithNavBar from '../ContainerWithNavBar/ContainerWithNavBar'

const ContainerCRUD = (props) => (
  <ContainerWithNavBar {...props}>
    <Row className="mt-4">
      <Col className="page-header">
        <h1>{props.title}</h1>
      </Col>
    </Row>
    <Row className="mt-4">
      <Col xs={12}>{props.children}</Col>
    </Row>
  </ContainerWithNavBar>
)

export default ContainerCRUD
