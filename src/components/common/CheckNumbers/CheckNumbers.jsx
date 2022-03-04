import React from 'react'
import { Button } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons'
import { URL_SEND_MESSAGE } from '../../../constants/settings'
import { isEmpty } from 'lodash/fp'

const CheckNumber = (props) => {
  const { t } = useTranslation([
    'publishers',
    'responsibility',
    'detailsContacts',
    'common',
    'contacts',
  ])
  const { text, phone } = props
  const textToSend = text ? text : t('works')

  const check = () =>
    window.open(`${URL_SEND_MESSAGE}?phone=${phone}&text=${textToSend}`)

  return (
    <Button
      style={{ position: 'relative', marginBottom: '-16px', top: '-17px' }}
      variant="success"
      disabled={isEmpty(phone)}
      onClick={() => check()}
    >
      <FontAwesomeIcon icon={faWhatsapp} />
    </Button>
  )
}

export default CheckNumber
