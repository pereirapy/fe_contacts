import React from 'react'
import { useTranslation } from 'react-i18next'

import { isEmpty } from 'lodash/fp'
import { EIcons } from '../../../enums/icons'
import { URL_SEND_MESSAGE } from '../../../constants/settings'

import Button from '../Button/Button'

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
      iconName={EIcons.whatsappIcon}
    />
  )
}

export default CheckNumber
