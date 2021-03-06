import React from 'react'
import { orderBy } from 'lodash/fp'
import { useTranslation } from 'react-i18next'

import SuperSelect from '../SuperSelect/SuperSelect'

const GenderSelect = (props) => {
  const { t } = useTranslation(['contacts', 'common'])

  const { validator } = props
  const { value, onChange, validated, rules } = props

  const genderOptions = orderBy(
    ['label'],
    ['asc'],
    [
      { label: t('unknown'), value: 'unknown' },
      { label: t('male'), value: 'male' },
      { label: t('female'), value: 'female' },
    ]
  )

  return (
    <SuperSelect
      name="gender"
      label={t('gender')}
      isClearable={true}
      validator={validator}
      validated={validated}
      value={value}
      options={genderOptions}
      onChange={onChange}
      rules={rules}
    />
  )
}

export default GenderSelect
