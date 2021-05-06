import React from 'react'
import { Button, Form, Row, Col } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import SuperFormControl from '../common/SuperFormControl/SuperFormControl'
import GenderSelect from '../common/GenderSelect/GenderSelect'
import StatusSelect from '../common/StatusSelect/StatusSelect'
import LanguageSelect from '../common/LanguageSelect/LanguageSelect'
import ReactPlaceholder from 'react-placeholder'
import SuperSelect from '../common/SuperSelect/SuperSelect'

const FormDetails = (props) => {
  const { t } = useTranslation(['contacts', 'common'])
  const {
    form,
    loading,
    handleSubmit,
    onHide,
    handleInputChange,
    validated,
    validator,
    disablePhone,
    locationsOptions
  } = props

  return (
    <ReactPlaceholder
      showLoadingAnimation={true}
      type="text"
      ready={!loading}
      rows={18}
    >
      <Form>
        <Row className="mb-2">
          <Col xs={6} lg={2}>
            <Form.Group controlId="typeCompanyResidential">
              <Form.Check
                type="radio"
                name="typeCompany"
                label={t('residential')}
                checked={form.typeCompany === false || form.typeCompany === '0'}
                value={0}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="typeCompanyCommercial">
              <Form.Check
                type="radio"
                name="typeCompany"
                label={t('commercial')}
                validator={validator}
                checked={form.typeCompany === true || form.typeCompany === '1'}
                value={1}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col xs={6} lg={6}>
            <SuperFormControl
              type="number"
              name="phone"
              label={t('phone')}
              validator={validator}
              validated={validated}
              value={form.phone}
              disabled={disablePhone}
              onChange={handleInputChange}
              rules="required|min:10"
            />
          </Col>
          <Col xs={6} lg={6}>
            <SuperFormControl
              type="number"
              name="phone2"
              label={t('phone2')}
              validator={validator}
              validated={validated}
              value={form.phone2}
              onChange={handleInputChange}
              rules="min:10"
            />
          </Col>
        </Row>
        <Row>
          <Col xs={12} lg={12}>
            <SuperFormControl
              type="text"
              name="name"
              label={t('name')}
              validator={validator}
              validated={validated}
              value={form.name}
              onChange={handleInputChange}
            />
          </Col>
        </Row>
        {(form.typeCompany === true || form.typeCompany === '1') && (
          <Row>
            <Col xs={12} lg={12}>
              <SuperFormControl
                type="text"
                name="owner"
                label={t('owner')}
                validator={validator}
                validated={validated}
                value={form.owner}
                onChange={handleInputChange}
              />
            </Col>
          </Row>
        )}
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
            />
          </Col>
          <Col xs={12} lg={6}>
            <SuperSelect
              name="idLocation"
              label={t('location')}
              validator={validator}
              validated={validated}
              isClearable={true}
              value={form.idLocation}
              options={locationsOptions}
              onChange={handleInputChange}
            />
          </Col>
        </Row>
        <Row>
          <Col
            xs={12}
            lg={4}
            className={
              form.typeCompany === true || form.typeCompany === '1'
                ? 'd-none'
                : ''
            }
          >
            <GenderSelect
              validator={validator}
              validated={validated}
              value={form.gender}
              onChange={handleInputChange}
              rules="required"
            />
          </Col>
          <Col
            xs={12}
            lg={form.typeCompany === true || form.typeCompany === '1' ? 6 : 4}
          >
            <LanguageSelect
              validator={validator}
              validated={validated}
              value={form.idLanguage}
              onChange={handleInputChange}
              rules="required"
            />
          </Col>
          <Col
            xs={12}
            lg={form.typeCompany === true || form.typeCompany === '1' ? 6 : 4}
          >
            <StatusSelect
              name="idStatus"
              label={t('status')}
              validator={validator}
              validated={validated}
              value={form.idStatus}
              onChange={handleInputChange}
              rules="required"
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <SuperFormControl
              as="textarea"
              name="note"
              rows={3}
              label={t('noteLabel')}
              validator={validator}
              validated={validated}
              placeholder={t('notePlaceHolder')}
              value={form.note}
              onChange={handleInputChange}
              rules="max:250"
            />
          </Col>
        </Row>
        <Button
          disabled={loading}
          variant="primary"
          onClick={() => handleSubmit(onHide)}
        >
          {t(loading ? 'common:btnSubmitting' : 'common:btnSubmit')}
        </Button>{' '}
      </Form>
    </ReactPlaceholder>
  )
}

export default FormDetails
