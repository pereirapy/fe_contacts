import React from 'react'
import SuperSelect from '../SuperSelect/SuperSelect'
import { useTranslation } from 'react-i18next'
import { orderBy } from 'lodash/fp'

const GenderSelect = (props) => {
  const { t } = useTranslation(['contacts', 'common'])

  const { validator } = props
  const { value, onChange, validated } = props

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
    />
  )
}

export default GenderSelect
