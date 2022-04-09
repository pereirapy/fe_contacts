import React from 'react'
import { Radio } from 'pretty-checkbox-react'
import { useTranslation } from 'react-i18next'
import { Form, Row, Col } from 'react-bootstrap'
import ReactPlaceholder from 'react-placeholder'

import Button from '../common/Button/Button'
import CheckNumber from '../common/CheckNumbers/CheckNumbers'
import SuperFormControl from '../common/SuperFormControl/SuperFormControl'
import ResponsibilitySelect from '../common/ResponsibilitySelect/ResponsibilitySelect'

const FormPublishers = (props) => {
  const { t } = useTranslation([
    'publishers',
    'responsibility',
    'detailsContacts',
    'common',
    'contacts',
  ])
  const {
    form,
    validator,
    loading,
    submitting,
    handleSubmit,
    onHide,
    handleInputChange,
    validated,
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
          <Col xs={6} lg={2}>
            <Form.Group controlId="publisherInactive">
              <Radio
                disabled={form.disabled}
                color="danger"
                bigger
                name="active"
                checked={form.active === false || form.active === '0'}
                value={0}
                onChange={handleInputChange}
              >
                {t('inactive')}
              </Radio>
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="publisherActive">
              <Radio
                disabled={form.disabled}
                color="success"
                bigger
                name="active"
                validator={validator}
                checked={form.active === true || form.active === '1'}
                value={1}
                onChange={handleInputChange}
              >
                {t('active')}
              </Radio>
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col xs={12} lg={6}>
            <SuperFormControl
              type="text"
              name="name"
              label={t('name')}
              validator={validator}
              validated={validated}
              value={form.name}
              onChange={handleInputChange}
              disabled={form.disabled}
              rules="required"
            />
          </Col>
          <Col xs={12} lg={6}>
            <SuperFormControl
              type="number"
              name="phone"
              label={t('phone')}
              endLabel={<CheckNumber phone={form.phone} />}
              validator={validator}
              validated={validated}
              value={form.phone}
              onChange={handleInputChange}
              rules="required|min:10"
              disabled={form.disabled}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={12} lg={6}>
            <SuperFormControl
              type="email"
              name="email"
              label={t('email')}
              validator={validator}
              validated={validated}
              value={form.email}
              onChange={handleInputChange}
              rules="email"
              disabled={form.disabled}
            />
          </Col>
          <Col xs={12} lg={6}>
            <ResponsibilitySelect
              name="idResponsibility"
              label={t('responsibility')}
              validator={validator}
              validated={validated}
              value={form.idResponsibility}
              onChange={handleInputChange}
              justAllowedForMe={form.justAllowedForMe}
              rules="required"
              disabled={form.disabled}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={12} lg={6}>
            <SuperFormControl
              type="password"
              name="password"
              label={t('password')}
              validator={validator}
              validated={validated}
              placeholder={t('password')}
              value={form.password}
              onChange={handleInputChange}
              disabled={form.disabled}
              rules="min:8"
            />
          </Col>
          <Col xs={12} lg={6}>
            <SuperFormControl
              type="password"
              name="repeatPassword"
              label={t('repeatPasswordLabel')}
              validator={validator}
              validated={validated}
              placeholder={t('repeatPasswordPlaceHolder')}
              value={form.repeatPassword}
              onChange={handleInputChange}
              rules="min:8|mustBeEqualFieldPassword"
              extraRules={form.password}
              disabled={form.disabled}
            />
          </Col>
        </Row>
        <Button
          disabled={form.disabled || submitting}
          submitting={submitting}
          variant="primary"
          onClick={() => handleSubmit(onHide)}
          text={t('common:btnSubmit')}
          textLoading={t('common:btnSubmitting')}
          behavior="submit"
          animate
        />
      </Form>
    </ReactPlaceholder>
  )
}

export default FormPublishers
