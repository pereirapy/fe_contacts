import React from 'react'
import { useTranslation } from 'react-i18next'
import { Form, Row, Col } from 'react-bootstrap'
import ReactPlaceholder from 'react-placeholder'

import SuperSelect from '../../common/SuperSelect/SuperSelect'
import Button from '../../common/Button/Button'

const FormSendPhones = (props) => {
  const { t } = useTranslation(['sendPhones', 'common'])
  const { validator } = props
  const {
    form,
    submitting,
    loading,
    handleSubmit,
    onHide,
    handleInputChange,
    validated,
    publishersOptions,
    phones,
  } = props

  return (
    <ReactPlaceholder
      showLoadingAnimation={true}
      type="text"
      ready={!loading}
      rows={2}
    >
      <Form>
        <Row>
          <Col lg={7} xs={12} scroll="true">
            <h6>{t('numbersSelected')}</h6>
            <div style={{ overflowY: 'auto', maxHeight: '150px' }}>
              {phones}
            </div>
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
        </Row>
        <Button
          disabled={submitting}
          submitting={submitting}
          variant="success"
          onClick={() => handleSubmit(onHide)}
          text={t('common:btnSubmit')}
          textLoading={t('common:btnSubmitting')}
          behavior="submit"
          className='mt-1'
          animate
        />
      </Form>
    </ReactPlaceholder>
  )
}

export default FormSendPhones
