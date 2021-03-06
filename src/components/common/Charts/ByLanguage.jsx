import React from 'react'
import { round } from 'lodash'
import { Col, Card } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import ReactPlaceholder from 'react-placeholder'
import { PieChart } from 'react-minimal-pie-chart'
import { get, isEmpty, map, getOr } from 'lodash/fp'

import { randomColor } from '../../../utils/generic'
import { generateLabel } from '../../../stateReducers/dashboard'

const getByLanguage = (t, data) =>
  map(
    (dataLanguage) => ({
      title: `${round(getOr(0, 'percent', dataLanguage), 2)}% (${getOr(
        0,
        'count',
        dataLanguage
      )}) ${t('languages:' + getOr('noName', 'languageName', dataLanguage))}`,
      value: getOr(0, 'percent', dataLanguage),
      label: generateLabel(t, dataLanguage, 'languageName'),
      color: getOr(randomColor(), 'languageColor', dataLanguage),
    }),
    getOr([], 'totalContactsByLanguageContacted', data)
  )

const ByLanguage = ({ data, loading, hasCampaign }) => {
  const { t } = useTranslation(['dashboard', 'common', 'languages'])
  const byLanguage = getByLanguage(t, data)
  const LgXlSpan = hasCampaign ? 3 : 4

  return (
    <Col
      xs={{ span: 8, offset: 2 }}
      md={{ span: 4, offset: 2, order: 'first' }}
      lg={{ span: LgXlSpan, offset: 0 }}
      xl={{ span: LgXlSpan, offset: 0 }}
      className="mt-2"
    >
      <Card>
        <Card.Header className="text-center" style={{ minHeight: '87px' }}>
          {t('titleChartLanguage')}
        </Card.Header>
        <Card.Body style={{ textAlign: '-webkit-center' }}>
          <ReactPlaceholder
            showLoadingAnimation={true}
            type="round"
            className="size-react-placeholder"
            ready={!loading}
            rows={1}
          >
            {!isEmpty(byLanguage) ? (
              <PieChart
                animate={true}
                data={byLanguage}
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

export default ByLanguage
