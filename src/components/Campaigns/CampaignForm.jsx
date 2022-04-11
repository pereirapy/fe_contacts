import React from 'react'
import moment from 'moment'
import { useTranslation } from 'react-i18next'
import { Form, Row, Col } from 'react-bootstrap'

import Button from '../common/Button/Button'
import SuperFormControl from '../common/SuperFormControl/SuperFormControl'

const CampaignForm = (props) => {
  const { t } = useTranslation(['campaigns', 'common'])
  const {
    validator,
    handleInputChange,
    form,
    submitting,
    loading,
    validated,
    onHide,
    handleSubmit,
    disableDateFields,
  } = props
  return (
    <Form>
      <Row className="mb-2">
      <Col xs={12} lg={6}>
          <SuperFormControl
            type="text"
            name="name"
            label={t('name')}
            validator={validator}
            validated={validated}
            placeholder={t('namePlaceHolder')}
            value={form.name}
            onChange={handleInputChange}
            rules="required|max:40"
          />
        </Col>
        <Col xs={12} lg={6}>
          <SuperFormControl
            type="text"
            name="goal"
            label={t('goal')}
            validator={validator}
            validated={validated}
            placeholder={t('goalPlaceHolder')}
            value={form.goal}
            onChange={handleInputChange}
            rules="required|max:50"
          />
        </Col>
      </Row>
      <Row className="mb-2">
        <Col xs={12} lg={6}>
          <SuperFormControl
            type="date"
            name="dateStart"
            label={t('dateStart')}
            loading={loading}
            validator={validator}
            validated={validated}
            placeholder={t('dateStartPlaceHolder')}
            value={form.dateStart}
            onChange={handleInputChange}
            rules="required"
            disabled={disableDateFields}
          />
        </Col>
        <Col xs={12} lg={6}>
          <SuperFormControl
            type="date"
            name="dateFinal"
            label={t('dateFinal')}
            loading={loading}
            validator={validator}
            validated={validated}
            placeholder={t('dateFinalPlaceHolder')}
            value={form.dateFinal}
            onChange={handleInputChange}
            rules={[
              { required: true },
              {
                after_or_equal: moment(form.dateStart, 'YYYY-MM-DD').add(
                  1,
                  'day'
                ),
              },
            ]}
            disabled={disableDateFields}
          />
        </Col>
      </Row>

      <Button
        disabled={submitting}
        submitting={submitting}
        variant="success"
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

export default CampaignForm
