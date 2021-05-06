import React from 'react'
import { Jumbotron, Col, Row } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import SuperSelect from '../common/SuperSelect/SuperSelect'

const FormSystemLanguages = (props) => {
  const { t } = useTranslation(['languages'])
  const { valueSelected, handleInputChange, optionsLanguages } = props

  return (
    <Row className="justify-content-md-center">
      <Col>
        <Jumbotron>
          <SuperSelect
            name="systemLanguages"
            label={t('optionsLabel')}
            value={valueSelected}
            options={optionsLanguages}
            onChange={handleInputChange}
          />
        </Jumbotron>
      </Col>
    </Row>
  )
}

export default FormSystemLanguages
