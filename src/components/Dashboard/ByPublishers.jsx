import React from 'react'
import { Col, Card, Row, ListGroup } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { PieChart } from 'react-minimal-pie-chart'
import { get, isEmpty, getOr, map } from 'lodash/fp'
import { round } from 'lodash'
import { randomColor } from '../../utils/generic'
import { generateLabel } from '../../stateReducers/dashboard'
import ReactPlaceholder from 'react-placeholder'

const getByPublishers = (t, data) =>
  map(
    (dataPublisher) => ({
      title: `${round(getOr(0, 'percent', dataPublisher), 2)}% (${getOr(
        0,
        'count',
        dataPublisher
      )}) ${getOr(t('noName'), 'publisherName', dataPublisher)}`,
      value: getOr(0, 'percent', dataPublisher),
      label: generateLabel(t, dataPublisher, 'publisherName'),
      color: randomColor(),
    }),
    getOr([], 'totalsContactsWaitingFeedbackByPublisher', data)
  )

const ByPublishers = (props) => {
  const { t } = useTranslation(['dashboard', 'common'])
  const byPublishers = getByPublishers(t, get('data', props))

  return (
    <Col
      xs={{ span: 8, offset: 2 }}
      lg={{ span: 2, offset: 0 }}
      className="mt-2"
    >
      <Card>
        <Card.Header className="text-center" style={{ minHeight: '73px' }}>
          {t('titleChartWaitingFeedbackByPublishers')}
        </Card.Header>
        <Card.Body>
          <ReactPlaceholder
            showLoadingAnimation={true}
            type="round"
            style={{ width: 230, height: 230 }}
            ready={!props.loading}
            rows={1}
          >
            {!isEmpty(byPublishers) ? (
              <>
                <Row>
                  <Col>
                    <PieChart
                      animate={true}
                      data={byPublishers}
                      totalValue={100}
                    />
                  </Col>
                </Row>
                <Row className="mt-2">
                  <Col>
                    <ListGroup>
                      {map(
                        (dataPublisher) => (
                          <ListGroup.Item
                            key={get('color', dataPublisher)}
                            style={{
                              backgroundColor: get('color', dataPublisher),
                            }}
                          >
                            {dataPublisher.title}
                          </ListGroup.Item>
                        ),
                        byPublishers
                      )}
                    </ListGroup>
                  </Col>
                </Row>
              </>
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

export default ByPublishers
