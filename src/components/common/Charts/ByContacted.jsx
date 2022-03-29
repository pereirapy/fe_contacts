import React from 'react'
import { round } from 'lodash'
import { Col, Card } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import ReactPlaceholder from 'react-placeholder'
import { get, isEmpty, getOr, compact } from 'lodash/fp'
import { PieChart } from 'react-minimal-pie-chart'

const getByContacted = (t, data) => {
  if (
    getOr(0, 'totalPercentContacted', data) === 0 &&
    getOr(0, 'totalPercentWithoutContacted', data) === 0
  )
    return []

  return compact([
    getOr(0, 'totalPercentContacted', data) > 0
      ? {
          label: t('contacted'),
          title: `${round(
            getOr(0, 'totalPercentContacted', data),
            2
          )}% (${getOr(0, 'totalContactsContacted', data)}) ${t('contacted')}`,
          value: getOr(0, 'totalPercentContacted', data),
          color: '#28a745',
        }
      : null,
    getOr(0, 'totalPercentWithoutContacted', data) > 0
      ? {
          label: t('withoutContact'),
          title: `${round(
            getOr(0, 'totalPercentWithoutContacted', data),
            2
          )}% (${getOr(0, 'totalContactsWithoutContact', data)}) ${t(
            'withoutContact'
          )}`,
          value: getOr(0, 'totalPercentWithoutContacted', data),
          color: '#f73939',
        }
      : null,
  ])
}

const ByContacted = (props) => {
  const { t } = useTranslation(['dashboard', 'common'])
  const byContacted = getByContacted(t, get('data', props))

  return (
    <Col
      xs={{ span: 8, offset: 2 }}
      md={{ span: 4, offset: 2 }}
      lg={{ span: 4, offset: 0 }}
      xl={{ span: 4, offset: 0 }}
      className="mt-2"
    >
      <Card>
        <Card.Header className="text-center" style={{ minHeight: '87px' }}>
          {t('titleChartContacts')}
        </Card.Header>
        <Card.Body style={{ textAlign: '-webkit-center' }}>
          <ReactPlaceholder
            showLoadingAnimation={true}
            type="round"
            className="size-react-placeholder"
            ready={!props.loading}
            rows={1}
          >
            {!isEmpty(byContacted) ? (
              <PieChart
                animate={true}
                data={byContacted}
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

export default ByContacted
