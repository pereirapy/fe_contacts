import React from 'react'
import { round } from 'lodash'
import { Col, Card } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import ReactPlaceholder from 'react-placeholder'
import { PieChart } from 'react-minimal-pie-chart'
import { get, isEmpty, find, getOr, pipe, curry, filter } from 'lodash/fp'

import useApplicationContext from '../../../hooks/useApplicationContext'

const getByType = (t, data) => {
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

  const objectTypeCompany = pipe(
    find((object) => object.typeCompany === true),
    curry(parseObject)('commercial', '#FFC433')
  )(getOr({}, 'totalContactsByType', data))

  const objectTypeResidential = pipe(
    find((object) => object.typeCompany === false),
    curry(parseObject)('residential', '#3ED1F5')
  )(getOr({}, 'totalContactsByType', data))

  return filter(
    (typeCompany) => typeCompany.value > 0,
    [objectTypeCompany, objectTypeResidential]
  )
}

const ByType = (props) => {
  const { t } = useTranslation(['dashboard', 'common', 'contacts'])
  const byType = getByType(t, get('data', props))
  const { isAtLeastElder } = useApplicationContext()

  const spanLG = isAtLeastElder ? 3 : 4
  const spanXL = isAtLeastElder ? 3 : 4

  return (
    <Col
      xs={{ span: 8, offset: 2 }}
      md={{ span: 4, offset: 0 }}
      lg={{ span: spanLG, offset: 0 }}
      xl={{ span: spanXL, offset: 0 }}
      className="mt-2"
    >
      <Card>
        <Card.Header className="text-center" style={{ minHeight: '87px' }}>
          {t('titleChartType')}
        </Card.Header>
        <Card.Body style={{ textAlign: '-webkit-center' }}>
          <ReactPlaceholder
            showLoadingAnimation={true}
            type="round"
            className="size-react-placeholder"
            ready={!props.loading}
            rows={1}
          >
            {!isEmpty(byType) ? (
              <PieChart
                animate={true}
                data={byType}
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

export default ByType
