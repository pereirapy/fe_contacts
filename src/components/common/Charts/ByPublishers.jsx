import React, { useState } from 'react'
import { round } from 'lodash'
import { useTranslation } from 'react-i18next'
import ReactPlaceholder from 'react-placeholder'
import { PieChart } from 'react-minimal-pie-chart'
import { Col, Card, Row, ListGroup } from 'react-bootstrap'
import { get, isEmpty, getOr, map, pipe, orderBy } from 'lodash/fp'

import { randomColor } from '../../../utils/generic'
import { generateLabel } from '../../../stateReducers/dashboard'

import Button from '../Button/Button'

const getByPublishers = (t, data) =>
  pipe(orderBy(['percent'], 'desc'), (data) => parseDataPublishers(t, data))(
    getOr([], 'totalsContactsWaitingFeedbackByPublisher', data)
  )

const parseDataPublishers = (t, data) =>
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
    data
  )

const ByPublishers = (props) => {
  const { t } = useTranslation(['dashboard', 'common'])
  const byPublishers = getByPublishers(t, get('data', props))
  const [detailsByPublishers, toggleDetailsByPublisher] = useState(false)

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
          <Button
            variant="link"
            title={t('moreInformation')}
            onClick={() => toggleDetailsByPublisher((prevState) => !prevState)}
            className="titleCard"
            text={t('titleChartWaitingFeedbackByPublishers')}
          />
        </Card.Header>
        <Card.Body style={{ textAlign: '-webkit-center' }}>
          <ReactPlaceholder
            showLoadingAnimation={true}
            type="round"
            className="size-react-placeholder"
            ready={!props.loading}
            rows={1}
          >
            {!isEmpty(byPublishers) ? (
              <React.Fragment>
                <Row>
                  <Col>
                    <PieChart
                      animate={true}
                      data={byPublishers}
                      totalValue={100}
                    />
                  </Col>
                </Row>
                <Row
                  className="mt-2"
                  style={{ display: detailsByPublishers ? 'block' : 'none' }}
                >
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
              </React.Fragment>
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
