import React from 'react'
import { useTranslation } from 'react-i18next'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLanguage } from '@fortawesome/free-solid-svg-icons'
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
      {' '}
      <FontAwesomeIcon icon={faLanguage} /> {`${t('title')}`}{' '}
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
      buttonText={<FontAwesomeIcon icon={faLanguage} />}
      buttonVariant="primary"
    />
  )
}

export default SystemLanguages
