import React from 'react'
import { Button, Form } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import SuperFormControl from '../common/SuperFormControl/SuperFormControl'

const StatusForm = (props) => {
  const { t } = useTranslation(['status', 'common'])
  const {
    validator,
    handleInputChange,
    form,
    submitting,
    validated,
    onHide,
    handleSubmit,
  } = props

  return (
    <Form>
      <SuperFormControl
        type="text"
        name="description"
        label={t('descriptionLabel')}
        validator={validator}
        validated={validated}
        placeholder={t('descriptionPlaceHolder')}
        value={form.description}
        onChange={handleInputChange}
        rules="required|max:25"
      />
      <Button
        disabled={submitting}
        variant="primary"
        type="button"
        onClick={() => handleSubmit(onHide)}
      >
        {t(submitting ? 'common:btnSubmitting' : 'common:btnSubmit')}
      </Button>
    </Form>
  )
}

export default StatusForm
