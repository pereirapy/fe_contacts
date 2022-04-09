import React from 'react'

import { getSortIconName } from '../../../utils/contactsHelper'

import Icon from '../Icon/Icon'

export default function SortIcon({ stringSort, columnName, columnNameTranslated }) {
  const iconName = getSortIconName(stringSort, columnName)
  return iconName ? (
    <Icon name={iconName} label={columnNameTranslated} />
  ) : (
    columnNameTranslated
  )
}
