import React from 'react'
import { round } from 'lodash'
import { Col, Card } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import ReactPlaceholder from 'react-placeholder'
import { PieChart } from 'react-minimal-pie-chart'
import { get, isEmpty, getOr, compact } from 'lodash/fp'

const getByFeedback = (t, data) => {
  if (
    getOr(0, 'totalPercentContactsAssignByMeWaitingFeedback', data) === 0 &&
    getOr(0, 'totalPercentContactsAssignByOthersWaitingFeedback', data) === 0
  )
    return []

  return compact([
    getOr(0, 'totalPercentContactsAssignByMeWaitingFeedback', data) > 0
      ? {
          label: t('totalContactsAssignByMeWaitingFeedback'),
          value: getOr(
            0,
            'totalPercentContactsAssignByMeWaitingFeedback',
            data
          ),
          title: `${round(
            getOr(0, 'totalPercentContactsAssignByMeWaitingFeedback', data),
            2
          )}% (${getOr(0, 'totalContactsAssignByMeWaitingFeedback', data)}) ${t(
            'totalContactsAssignByMeWaitingFeedback'
          )}`,
          color: '#007bff',
        }
      : null,
    getOr(0, 'totalPercentContactsAssignByOthersWaitingFeedback', data) > 0
      ? {
          label: t('totalContactsWaitingFeedback'),
          title: `${round(
            getOr(0, 'totalPercentContactsAssignByOthersWaitingFeedback', data),
            2
          )}% (${getOr(
            0,
            'totalContactsAssignByOthersWaitingFeedback',
            data
          )}) ${t('totalContactsWaitingFeedback')}`,
          value: getOr(
            0,
            'totalPercentContactsAssignByOthersWaitingFeedback',
            data
          ),
          color: '#6610f2',
        }
      : null,
  ])
}

const ByFeedback = (props) => {
  const { t } = useTranslation(['dashboard', 'common'])
  const byFeedback = getByFeedback(t, get('data', props))


  return (
    <Col
      xs={{ span: 8, offset: 2 }}
      md={{ span: 4, offset: 2 }}
      lg={{ span: 3, offset: 0 }}
      xl={{ span: 3, offset: 0 }}
      className="mt-2"
    >
      <Card>
        <Card.Header
          className="text-center titleCard"
          style={{ minHeight: '87px' }}
        >
          {t('titleChartWaitingFeedback')}
        </Card.Header>
        <Card.Body style={{ textAlign: '-webkit-center' }}>
          <ReactPlaceholder
            showLoadingAnimation={true}
            type="round"
            className="size-react-placeholder"
            ready={!props.loading}
            rows={1}
          >
            {!isEmpty(byFeedback) ? (
              <PieChart
                animate={true}
                data={byFeedback}
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

export default ByFeedback
