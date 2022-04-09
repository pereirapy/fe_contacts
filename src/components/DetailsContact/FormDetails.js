import React from 'react'
import { Radio } from 'pretty-checkbox-react'
import { useTranslation } from 'react-i18next'
import ReactPlaceholder from 'react-placeholder'
import { Form, Row, Col } from 'react-bootstrap'

import { EIcons } from '../../enums/icons'

import Button from '../common/Button/Button'
import SuperSelect from '../common/SuperSelect/SuperSelect'
import GenderSelect from '../common/GenderSelect/GenderSelect'
import StatusSelect from '../common/StatusSelect/StatusSelect'
import SuperFormControl from '../common/SuperFormControl/SuperFormControl'
import LanguageSelect from '../common/LanguageSelect/LanguageSelect'

const FormDetails = (props) => {
  const { t } = useTranslation(['detailsContacts', 'common', 'contacts'])
  const { validator } = props
  const {
    form,
    loading,
    submitting,
    publishersOptions,
    handleSubmit,
    onHide,
    handleInputChange,
    validated,
    history,
    locationsOptions,
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
          <Col xs={6} lg={3}>
            <Form.Group controlId="typeCompanyResidential0">
              <Radio
                name="typeCompany"
                color="success"
                bigger
                checked={form.typeCompany === false || form.typeCompany === '0'}
                value={'0'}
                onChange={handleInputChange}
              >
                {t('contacts:residential')}
              </Radio>
            </Form.Group>
          </Col>
          <Col xs={6} lg={3}>
            <Form.Group controlId="typeCompanyCommercial1">
              <Radio
                name="typeCompany"
                color="warning"
                bigger
                validator={validator}
                checked={form.typeCompany === true || form.typeCompany === '1'}
                value={'1'}
                onChange={handleInputChange}
              >
                {t('contacts:commercial')}
              </Radio>
            </Form.Group>
          </Col>
          <Col xs={12} lg={6}>
            <SuperSelect
              name="idLocation"
              label={t('contacts:location')}
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
          <Col xs={12}>
            <SuperFormControl
              type="text"
              name="name"
              label={t('contacts:name')}
              validator={validator}
              validated={validated}
              value={form.name}
              onChange={handleInputChange}
            />
          </Col>
        </Row>
        {(form.typeCompany === true || form.typeCompany === '1') && (
          <Row>
            <Col xs={12}>
              <SuperFormControl
                type="text"
                name="owner"
                label={t('contacts:owner')}
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
            <LanguageSelect
              validator={validator}
              validated={validated}
              value={form.idLanguage}
              onChange={handleInputChange}
            />
          </Col>
          <Col xs={12} lg={6}>
            <SuperSelect
              name="idPublisher"
              label={t('publisher')}
              validator={validator}
              validated={validated}
              value={form.idPublisher}
              options={publishersOptions}
              onChange={handleInputChange}
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
              rules="required"
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <SuperFormControl
              as="textarea"
              name="information"
              rows={3}
              label={t('informationLabel')}
              validator={validator}
              validated={validated}
              placeholder={t('informationPlaceHolder')}
              value={form.information}
              onChange={handleInputChange}
              rules="required|min:5|max:500"
            />
          </Col>
        </Row>
        <Row>
          <Col xs={12} md={{ order: 'first', span: 3 }}>
            <Button
              disabled={submitting}
              submitting={submitting}
              variant="primary"
              onClick={() => handleSubmit(onHide)}
              text={t('common:btnSubmit')}
              textLoading={t('common:btnSubmitting')}
              behavior="submit"
              animate
            />

            {history && (
              <Button
                title={t('common:back')}
                submitting={submitting}
                variant="secondary"
                onClick={() => history.goBack()}
                iconName={EIcons.arrowLeftIcon}
              />
            )}
          </Col>
          <Col xs={{ order: 'first', span: 12 }} md={9} className="text-right">
            <Form.Text muted>{form.lastPublisherThatTouched}</Form.Text>
          </Col>
        </Row>
      </Form>
    </ReactPlaceholder>
  )
}

export default FormDetails
