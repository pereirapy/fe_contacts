import React from 'react'
import { Col, Card } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { PieChart } from 'react-minimal-pie-chart'
import { get, isEmpty, find, getOr, pipe, curry, filter } from 'lodash/fp'
import { round } from 'lodash'
import ReactPlaceholder from 'react-placeholder'

const getByGender = (t, data) => {
  const parseObject = (label, color, data) => ({
    label: `${t(`contacts:${label}`)}`,
    value: getOr(0, 'percent', data),
    title: `${round(getOr(0, 'percent', data), 2)}% (${getOr(
      0,
      'count',
      data
    )}) ${t(`contacts:${label}`)}`,
    color,
  })

  const objectGenderUndefined = pipe(
    find((object) => object.gender === 'unknown'),
    curry(parseObject)('unknown', '#6c757d')
  )(getOr({}, 'totalContactsByGenderContacted', data))

  const objectGenderFemale = pipe(
    find((object) => object.gender === 'female'),
    curry(parseObject)('female', '#f008d2')
  )(getOr({}, 'totalContactsByGenderContacted', data))

  const objectGenderMale = pipe(
    find((object) => object.gender === 'male'),
    curry(parseObject)('male', '#007bff')
  )(getOr({}, 'totalContactsByGenderContacted', data))

  return filter(
    (gender) => gender.value > 0,
    [objectGenderUndefined, objectGenderMale, objectGenderFemale]
  )
}

const ByGender = (props) => {
  const { t } = useTranslation(['dashboard', 'common', 'contacts'])
  const byGender = getByGender(t, get('data', props))

  return (
    <Col
      xs={{ span: 8, offset: 2 }}
      md={{ span: 4, offset: 0 }}
      lg={{ span: 4, offset: 0 }}
      xl={{ span: 4, offset: 0 }}
      className="mt-2"
    >
      <Card>
        <Card.Header className="text-center" style={{ minHeight: '87px' }}>
          {t('titleChartGender')}
        </Card.Header>
        <Card.Body style={{ textAlign: '-webkit-center' }}>
          <ReactPlaceholder
            showLoadingAnimation={true}
            type="round"
            className="size-react-placeholder"
            ready={!props.loading}
            rows={1}
          >
            {!isEmpty(byGender) ? (
              <PieChart
                animate={true}
                data={byGender}
                totalValue={100}
                label={({ dataEntry }) => get('label', dataEntry)}
                labelStyle={{
                  fontSize: '5px',
                }}
              />
            ) : (
              <Card.Text className="text-center">
                {t('common:noData')}
              </Card.Text>
            )}
          </ReactPlaceholder>
        </Card.Body>
      </Card>
    </Col>
  )
}

export default ByGender
