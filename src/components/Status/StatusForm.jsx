import React from 'react'
import { Form } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import SuperFormControl from '../common/SuperFormControl/SuperFormControl'
import Button from '../common/Button/Button'

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
        submitting={submitting}
        variant="primary"
        type="button"
        onClick={() => handleSubmit(onHide)}
        text={t('common:btnSubmit')}
        textLoading={t('common:btnSubmitting')}
        behavior="submit"
        animate
      />
    </Form>
  )
}

export default StatusForm
