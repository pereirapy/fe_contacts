import React from 'react'
import { Helmet } from 'react-helmet'
import { Container } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'

import Footer from '../Footer/Footer'
import NavBarMenu from '../NavBar/NavBar'

const ContainerWithNavBar = (props) => {
  const { t, i18n } = useTranslation('common')
  return (
    <React.Fragment>
      <Helmet htmlAttributes={{ lang: i18n.language }}>
        <title>{`${props.titleOnlyText || t('home')} - ${t('appName')}`}</title>
        <meta name="description" content={t('appDescription')} />
      </Helmet>

      <NavBarMenu {...props} />
      <Container fluid className="mt-2" style={{ minHeight: '80vh' }}>
        {props.children}
      </Container>
      <Footer {...props} />
    </React.Fragment>
  )
}

export default ContainerWithNavBar
