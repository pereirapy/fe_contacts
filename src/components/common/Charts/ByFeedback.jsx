import React from 'react'
import { round } from 'lodash'
import { Col, Card } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import ReactPlaceholder from 'react-placeholder'
import { PieChart } from 'react-minimal-pie-chart'
import { get, isEmpty, getOr, compact } from 'lodash/fp'

import useApplicationContext from '../../../hooks/useApplicationContext'

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
  const { isAtLeastElder } = useApplicationContext()

  const offsetMD = isAtLeastElder ? 2 : 0
  const spanLG = isAtLeastElder ? 3 : 4
  const spanXL = isAtLeastElder ? 3 : 4

  return (
    <Col
      xs={{ span: 8, offset: 2 }}
      md={{ span: 4, offset: offsetMD }}
      lg={{ span: spanLG, offset: 0 }}
      xl={{ span: spanXL, offset: 0 }}
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
