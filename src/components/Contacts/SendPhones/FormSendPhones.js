import React from 'react'
import { Button, Form, Row, Col } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import SuperSelect from '../../common/SuperSelect/SuperSelect'

const FormSendPhones = (props) => {
  const { t } = useTranslation(['sendPhones', 'common'])
  const { validator } = props
  const {
    form,
    submitting,
    handleSubmit,
    onHide,
    handleInputChange,
    validated,
    publishersOptions,
    phones,
  } = props

  return (
    <Form>
      <Row>
        <Col lg={7} xs={12} scroll="true">
          <h6>{t('numbersSelected')}</h6>
          <div style={{ overflowY: 'auto', maxHeight: '150px' }}>{phones}</div>
        </Col>
        <Col lg={5} xs={12}>
          <h6> {t('sendTo')}</h6>
          <SuperSelect
            name="idPublisher"
            label={t('labelPublisher')}
            validator={validator}
            validated={validated}
            value={form.idPublisher}
            options={publishersOptions}
            onChange={handleInputChange}
            rules="required"
            size="sm"
          />
        </Col>
      </Row>{' '}
      <Button
        style={{ marginTop: '20px' }}
        disabled={submitting}
        variant="primary"
        onClick={() => handleSubmit(onHide)}
      >
        {t(submitting ? 'common:btnSubmitting' : 'common:btnSubmit')}
      </Button>{' '}
    </Form>
  )
}

export default FormSendPhones
