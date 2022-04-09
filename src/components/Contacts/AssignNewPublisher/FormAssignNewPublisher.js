import React from 'react'
import { useTranslation } from 'react-i18next'
import { Form, Row, Col } from 'react-bootstrap'
import ReactPlaceholder from 'react-placeholder'

import Button from '../../common/Button/Button'
import SuperSelect from '../../common/SuperSelect/SuperSelect'

const FormAssignNewPublisher = (props) => {
  const { t } = useTranslation(['batchChanges', 'common', 'contacts'])
  const {
    form,
    loading,
    submitting,
    publishersOptions,
    handleSubmit,
    onHide,
    handleInputChange,
    validated,
    validator,
    phones,
  } = props
  return (
    <ReactPlaceholder
      showLoadingAnimation={true}
      type="text"
      ready={!loading}
      rows={12}
    >
      <Form>
        <Row className="mb-2">
          <Col lg={12} xs={12} scroll="true">
            <h6>{t('phonesSelected')}</h6>
            <div style={{ overflowY: 'auto', maxHeight: '150px' }}>
              {phones}
            </div>
          </Col>
        </Row>
        <Row className="mb-2" style={{ borderBottom: '1px solid #dee2e6' }}>
          <hr />
        </Row>
        <Row>
          <Col xs={12} lg={6}>
            <SuperSelect
              name="idPublisher"
              label={t('contacts:publisher')}
              validator={validator}
              validated={validated}
              value={form.idPublisher}
              options={publishersOptions}
              onChange={handleInputChange}
              placeHolderSelect="same"
              rules="required"
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <Button
              disabled={submitting}
              submitting={submitting}
              variant="success"
              onClick={() => handleSubmit(onHide)}
              text={t('common:btnSubmit')}
              textLoading={t('common:btnSubmitting')}
              behavior="submit"
              animate
            />
          </Col>
        </Row>
      </Form>
    </ReactPlaceholder>
  )
}

export default FormAssignNewPublisher
