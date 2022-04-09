import React from 'react'
import { SketchPicker } from 'react-color'
import { useTranslation } from 'react-i18next'
import { Form, Col, Row } from 'react-bootstrap'

import Button from '../common/Button/Button'
import SuperFormControl from '../common/SuperFormControl/SuperFormControl'

const LanguagesForm = (props) => {
  const { t } = useTranslation(['languages', 'common'])
  const {
    validator,
    handleInputChange,
    handleChangeColor,
    form,
    submitting,
    validated,
    onHide,
    handleSubmit,
  } = props
  return (
    <Form>
      <Row>
        <Col xs={12} lg={6}>
          <SuperFormControl
            type="text"
            name="name"
            label={t('nameLabel')}
            validator={validator}
            validated={validated}
            placeholder={t('namePlaceHolder')}
            value={form.name}
            onChange={handleInputChange}
            rules="required|max:25"
          />
        </Col>
        <Col xs={12} lg={6}>
          <Form.Group controlId={'color'}>
            <Form.Label>{t('colorLabel')}</Form.Label>
            <SketchPicker
              color={form.color}
              onChangeComplete={handleChangeColor}
            />
          </Form.Group>
        </Col>
      </Row>

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

export default LanguagesForm
