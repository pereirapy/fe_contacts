import React, { useState } from 'react'
import { round } from 'lodash'
import { useTranslation } from 'react-i18next'
import ReactPlaceholder from 'react-placeholder'
import { PieChart } from 'react-minimal-pie-chart'
import { Col, Card, Row, ListGroup } from 'react-bootstrap'
import { get, isEmpty, getOr, map, isNil, pipe, orderBy } from 'lodash/fp'

import { randomColor } from '../../../utils/generic'

import Button from '../Button/Button'

const getByLocations = (t, data) =>
  pipe(orderBy(['percent'], 'desc'), (data) => parseLocationsData(t, data))(
    getOr([], 'totalContactsByLocationContacted', data)
  )

const parseLocationsData = (t, data) =>
  map(
    (dataLocation) => ({
      title: `${round(getOr(0, 'percent', dataLocation), 2)}% (${getOr(
        0,
        'count',
        dataLocation
      )}) ${
        isNil(get('locationName', dataLocation))
          ? t('unknown')
          : getOr(t('noName'), 'locationName', dataLocation) +
            ' - ' +
            getOr(t('noName'), 'departmentName', dataLocation)
      } `,
      value: getOr(0, 'percent', dataLocation),
      label: isNil(get('locationName', dataLocation))
        ? t('unknown')
        : get('locationName', dataLocation),
      color: randomColor(),
    }),
    data
  )

const ByLocations = (props) => {
  const { t } = useTranslation(['dashboard', 'common'])
  const byLocations = getByLocations(t, get('data', props))
  const [detailsByLocations, toggleDetailsByPLocations] = useState(false)

  return (
    <Col
      xs={{ span: 8, offset: 2 }}
      md={{ span: 4, offset: 2 }}
      lg={{ span: 3, offset: 0 }}
      xl={{ span: 3, offset: 0 }}
      className="mt-2"
    >
      <Card>
        <Card.Header className="text-center" style={{ minHeight: '87px' }}>
          <Button
            variant="link"
            title={t('moreInformation')}
            onClick={() => toggleDetailsByPLocations((prevState) => !prevState)}
            text={t('titleChartByLocationsContacted')}
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
            {!isEmpty(byLocations) ? (
              <React.Fragment>
                <Row>
                  <Col>
                    <PieChart
                      animate={true}
                      data={byLocations}
                      totalValue={100}
                    />
                  </Col>
                </Row>
                <Row
                  className="mt-2"
                  style={{ display: detailsByLocations ? 'block' : 'none' }}
                >
                  <Col>
                    <ListGroup>
                      {map(
                        (dataLocation) => (
                          <ListGroup.Item
                            key={get('color', dataLocation)}
                            style={{
                              backgroundColor: get('color', dataLocation),
                            }}
                          >
                            {dataLocation.title}
                          </ListGroup.Item>
                        ),
                        byLocations
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

export default ByLocations
