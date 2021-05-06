import React from 'react'
import { useTranslation } from 'react-i18next'

const NoRecords = ({ cols }) => {
  const { t } = useTranslation(['common'])

  return (
    <tr>
      <td className="text-center" colSpan={cols}>
        {t('noRecords')}
      </td>
    </tr>
  )
}

export default NoRecords
