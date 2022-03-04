import React from 'react'
import { Container } from 'react-bootstrap'
import NavBarMenu from '../NavBar/NavBar'
import Footer from '../Footer/Footer'

const ContainerWithNavBar = (props) => (
  <React.Fragment>
    <NavBarMenu {...props} />
    <Container fluid className="mt-2" style={{ minHeight: '80vh' }}>
      {props.children}
    </Container>
    <Footer {...props} />
  </React.Fragment>
)

export default ContainerWithNavBar
