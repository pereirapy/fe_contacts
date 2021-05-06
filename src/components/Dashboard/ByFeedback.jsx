import React from 'react'
import { Col, Card } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { PieChart } from 'react-minimal-pie-chart'
import { get, isEmpty, getOr, compact } from 'lodash/fp'
import { round } from 'lodash'
import ReactPlaceholder from 'react-placeholder'
import { isAtLeastElder } from '../../utils/loginDataManager'

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
  const offsetLG = isAtLeastElder() ? 2 : 3
  return (
    <Col
      xs={{ span: 8, offset: 2 }}
      lg={{ span: 2, offset: offsetLG }}
      className="mt-2"
    >
      <Card>
        <Card.Header className="text-center" style={{ minHeight: '73px' }}>
          {t('titleChartWaitingFeedback')}
        </Card.Header>
        <Card.Body>
          <ReactPlaceholder
            showLoadingAnimation={true}
            type="round"
            style={{ width: 230, height: 230 }}
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
