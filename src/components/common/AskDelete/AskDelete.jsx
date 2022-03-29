import React from 'react'
import Swal from 'sweetalert2'
import { useTranslation } from 'react-i18next'

import { EIcons } from '../../../enums/icons'

import Button from '../Button/Button'

const AskDelete = ({ title, id, funcToCallAfterConfirmation }) => {
  const { t } = useTranslation(['common'])
  const newTitle = typeof title === 'string' ? title : t('askDeleteMessage')

  const askForSureWantDelete = () => {
    Swal.fire({
      title: newTitle,
      icon: 'question',
      showDenyButton: true,
      confirmButtonText: t('yes'),
      denyButtonText: t('no'),
    }).then(({ isConfirmed }) => {
      if (isConfirmed) {
        funcToCallAfterConfirmation(id)
      }
    })
  }

  return (
    <Button
      variant="danger"
      title={t('delete')}
      onClick={() => askForSureWantDelete()}
      iconName={EIcons.trashIcon}
    />
  )
}

export default AskDelete
