import React from 'react'
import { Button, Form, Row, Col } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import SuperSelect from '../../common/SuperSelect/SuperSelect'
import GenderSelect from '../../common/GenderSelect/GenderSelect'
import StatusSelect from '../../common/StatusSelect/StatusSelect'
import LanguageSelect from '../../common/LanguageSelect/LanguageSelect'
import ReactPlaceholder from 'react-placeholder'

const FormBatchChanges = (props) => {
  const { t } = useTranslation(['batchChanges', 'common', 'contacts'])
  const {
    form,
    loading,
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
        <Row className="mb-2">
          <Col xs={3} lg={2}>
            <Form.Group controlId="typeCompanySame">
              <Form.Check
                type="radio"
                name="typeCompany"
                label={t('common:same')}
                checked={form.typeCompany === '-1'}
                value={'-1'}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Col>
          <Col xs={3} lg={2}>
            <Form.Group controlId="typeCompanyResidential0">
              <Form.Check
                type="radio"
                name="typeCompany"
                label={t('contacts:residential')}
                checked={form.typeCompany === false || form.typeCompany === '0'}
                value={'0'}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Col>
          <Col xs={6} lg={2}>
            <Form.Group controlId="typeCompanyCommercial1">
              <Form.Check
                type="radio"
                name="typeCompany"
                label={t('contacts:commercial')}
                validator={validator}
                checked={form.typeCompany === true || form.typeCompany === '1'}
                value={'1'}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col xs={12} lg={6}>
            <LanguageSelect
              validator={validator}
              validated={validated}
              value={form.idLanguage}
              onChange={handleInputChange}
              placeHolderSelect="same"
            />
          </Col>
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
          {(form.typeCompany === false || form.typeCompany === '0') && (
            <Col xs={12} lg={6}>
              <GenderSelect
                validator={validator}
                validated={validated}
                value={form.gender}
                onChange={handleInputChange}
              />
            </Col>
          )}
          <Col xs={12} lg={6}>
            <StatusSelect
              name="idStatus"
              label={t('contacts:status')}
              validator={validator}
              validated={validated}
              value={form.idStatus}
              onChange={handleInputChange}
              placeHolderSelect="same"
              rules="required"
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <Button
              disabled={loading}
              variant="primary"
              onClick={() => handleSubmit(onHide)}
            >
              {t(loading ? 'common:btnSubmitting' : 'common:btnSubmit')}
            </Button>
          </Col>
        </Row>
      </Form>
    </ReactPlaceholder>
  )
}

export default FormBatchChanges
