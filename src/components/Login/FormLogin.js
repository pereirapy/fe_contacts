import React from 'react'
import { Button, Form } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import SuperFormControl from '../common/SuperFormControl/SuperFormControl'

const FormLogin = (props) => {
  const { t } = useTranslation(['login', 'common'])
  const {
    validator,
    handleInputChange,
    form,
    submitting,
    validated,
    handleSubmit,
  } = props

  return (
    <Form>
      <SuperFormControl
        type="email"
        name="email"
        autocomplete="email"
        label={t('emailLabel')}
        validator={validator}
        validated={validated}
        placeholder={t('emailPlaceHolder')}
        value={form.email}
        onChange={handleInputChange}
        rules="required|email"
      />
      <SuperFormControl
        type="password"
        name="password"
        label={t('passwordLabel')}
        validator={validator}
        validated={validated}
        autocomplete="current-password"
        placeholder={t('passwordPlaceHolder')}
        value={form.password}
        onChange={handleInputChange}
        onKeyUp={(event) => {
          if (event.keyCode === 13) handleSubmit()
        }}
        rules="required"
      />

      <Button
        disabled={submitting}
        variant="primary"
        type="button"
        onClick={handleSubmit}
      >
        {t(submitting ? 'common:btnSubmitting' : 'common:btnSubmit')}
      </Button>
    </Form>
  )
}

export default FormLogin
