import React from 'react'
import { Button, Form, Row, Col } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import moment from 'moment'

import SuperFormControl from '../common/SuperFormControl/SuperFormControl'

const CampaignForm = (props) => {
  const { t } = useTranslation(['campaigns', 'common'])
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
      <Row className="mb-2">
        <Col xs={12}>
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
      </Row>
      <Row className="mb-2">
        <Col xs={12} lg={6}>
          <SuperFormControl
            type="date"
            name="dateStart"
            label={t('dateStart')}
            validator={validator}
            validated={validated}
            placeholder={t('dateStartPlaceHolder')}
            value={form.dateStart}
            onChange={handleInputChange}
            rules="required"
          />
        </Col>
        <Col xs={12} lg={6}>
          <SuperFormControl
            type="date"
            name="dateFinal"
            label={t('dateFinal')}
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
          />
        </Col>
      </Row>

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

export default CampaignForm
