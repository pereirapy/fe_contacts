import React from 'react'
import { Spinner } from 'react-bootstrap'

const style = {
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
}

const Loading = () => (
  <div style={style}>
    <Spinner animation="grow" variant="primary" />
    <Spinner animation="grow" variant="secondary" />
    <Spinner animation="grow" variant="success" />
    <Spinner animation="grow" variant="danger" />
    <Spinner animation="grow" variant="warning" />
    <Spinner animation="grow" variant="info" />
    <Spinner animation="grow" variant="light" />
    <Spinner animation="grow" variant="dark" />
  </div>
)

export default Loading
