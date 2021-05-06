import React from 'react'
import { Button, Form, Col, Row } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import SuperFormControl from '../common/SuperFormControl/SuperFormControl'
import ReactPlaceholder from 'react-placeholder'
import { SketchPicker } from 'react-color'

const LanguagesForm = (props) => {
  const { t } = useTranslation(['languages', 'common'])
  const {
    validator,
    handleInputChange,
    handleChangeColor,
    form,
    loading,
    validated,
    onHide,
    handleSubmit,
  } = props
  return (
    <ReactPlaceholder
      showLoadingAnimation={true}
      type="text"
      ready={!loading}
      rows={12}
    >
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
          disabled={loading}
          variant="primary"
          type="button"
          onClick={() => handleSubmit(onHide)}
        >
          {t(loading ? 'common:btnSubmitting' : 'common:btnSubmit')}
        </Button>
      </Form>
    </ReactPlaceholder>
  )
}

export default LanguagesForm
