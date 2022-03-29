import React from 'react'
import { useTranslation } from 'react-i18next'

import { EIcons } from '../../enums/icons'

import Icon from '../common/Icon/Icon'
import OurModal from '../common/OurModal/OurModal'
import FormSystemLanguages from './FormSystemLanguages'
import useApplicationContext from '../../hooks/useApplicationContext'

const SystemLanguages = () => {
  const { t, i18n } = useTranslation('languages')
  const { setSettings, updateContext } = useApplicationContext()

  const languagesOptions = () => [
    { label: t('languageOptionEnglish'), value: 'en-GB' },
    { label: t('languageOptionPortuguese'), value: 'pt-BR' },
  ]

  const handleInputChange = ({ target: { value } }) => {
    i18n.changeLanguage(value)
    const settings = { language: value }
    setSettings(settings)
    updateContext((previous) => ({ ...previous, settings }))
  }

  const title = (
    <React.Fragment>
      <Icon name={EIcons.languageIcon} />
      {`${t('title')}`}
    </React.Fragment>
  )

  return (
    <OurModal
      body={FormSystemLanguages}
      size="sm"
      title={title}
      valueSelected={i18n.language}
      optionsLanguages={languagesOptions()}
      handleInputChange={handleInputChange}
      buttonIcon={EIcons.languageIcon}
      buttonVariant="primary"
    />
  )
}

export default SystemLanguages
