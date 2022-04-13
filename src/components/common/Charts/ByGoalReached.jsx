import React from 'react'
import { round } from 'lodash'
import { Col, Card } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import ReactPlaceholder from 'react-placeholder'
import { PieChart } from 'react-minimal-pie-chart'
import { get, isEmpty, getOr, compact } from 'lodash/fp'

const getByGoalReached = (t, data) => {
  if (
    getOr(0, 'totalPercentContactsReachedGoal', data) === 0 &&
    getOr(0, 'totalPercentContactsNoReachedGoal', data) === 0
  )
    return []

  return compact([
    getOr(0, 'totalPercentContactsReachedGoal', data) > 0
      ? {
          label: t('contactsReachedGoal'),
          title: `${round(
            getOr(0, 'totalPercentContactsReachedGoal', data),
            2
          )}% (${getOr(0, 'totalContactsReachedGoal', data)}) ${t(
            'contactsReachedGoal'
          )}`,
          value: getOr(0, 'totalPercentContactsReachedGoal', data),
          color: '#28a745',
        }
      : null,
    getOr(0, 'totalPercentContactsNoReachedGoal', data) > 0
      ? {
          label: t('contactsNoReachedGoal'),
          title: `${round(
            getOr(0, 'totalPercentContactsNoReachedGoal', data),
            2
          )}% (${getOr(0, 'totalContactsNoReachedGoal', data)}) ${t('contactsNoReachedGoal')}`,
          value: getOr(0, 'totalPercentContactsNoReachedGoal', data),
          color: '#f73939',
        }
      : null,
  ])
}

const ByGoalReached = (props) => {
  const { t } = useTranslation(['dashboard', 'common'])
  const byGoalReached = getByGoalReached(t, get('data', props))

  return (
    <Col
      xs={{ span: 8, offset: 2 }}
      md={{ span: 4, offset: 0 }}
      lg={{ span: 3, offset: 0 }}
      xl={{ span: 3, offset: 0 }}
      className="mt-2"
    >
      <Card>
        <Card.Header className="text-center" style={{ minHeight: '87px' }}>
          {t('titleChartContactsGoalReached')}
        </Card.Header>
        <Card.Body style={{ textAlign: '-webkit-center' }}>
          <ReactPlaceholder
            showLoadingAnimation={true}
            type="round"
            className="size-react-placeholder"
            ready={!props.loading}
            rows={1}
          >
            {!isEmpty(byGoalReached) ? (
              <PieChart
                animate={true}
                data={byGoalReached}
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

export default ByGoalReached
