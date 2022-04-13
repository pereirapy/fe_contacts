import React, { useState, useEffect } from 'react'
import { get } from 'lodash/fp'
import { useTranslation } from 'react-i18next'
import { Row, Col, Container, Card } from 'react-bootstrap'

import { contacts } from '../../../services'
import { diffDate } from '../../../utils/forms'
import { showError, parseErrorMessage } from '../../../utils/generic'
import useApplicationContext from '../../../hooks/useApplicationContext'

import ChartByType from './ByType'
import ChartByGender from './ByGender'
import ChartByLanguage from './ByLanguage'
import ChartByFeedback from './ByFeedback'
import ChartByLocations from './ByLocations'
import ChartByContacted from './ByContacted'
import ChartByPublishers from './ByPublishers'
import ChartByGoalReached from './ByGoalReached'
import ShowErrorComponent from '../ShowError/ShowError'
import './styles.css'

const calculateHowManyDays = (date) => {
  const diffInDays = diffDate(date, false)
  const diffInDaysPositive = Math.abs(diffInDays)

  if (diffInDays > 0) return 0
  else
    return diffInDaysPositive % 1 === 0
      ? diffInDaysPositive
      : Math.round(diffInDaysPositive) + 1
}

function CardHeaderCampaignActiveNext({
  name,
  date,
  color,
  translationKey,
  t,
}) {
  return (
    <Card.Header as="h5" className={`text-center bg-${color} text-white`}>
      {t(translationKey, {
        name: name,
        count: calculateHowManyDays(date),
      })}
    </Card.Header>
  )
}

function CardHeaderCampaign({ campaignActive, campaignNext, t }) {
  return campaignActive ? (
    <CardHeaderCampaignActiveNext
      name={campaignActive.name}
      date={campaignActive.dateFinal}
      color="success"
      translationKey="daysToFinishActiveCampaign"
      t={t}
    />
  ) : (
    <CardHeaderCampaignActiveNext
      name={campaignNext.name}
      date={campaignNext.dateStart}
      color="warning"
      translationKey="daysToStartNextCampaign"
      t={t}
    />
  )
}

function RenderChartsWithCampaign({
  data,
  loading,
  hasCampaign,
  campaignActive,
  campaignNext,
  t,
}) {
  return (
    <Card>
      {!loading && (
        <CardHeaderCampaign
          campaignActive={campaignActive}
          campaignNext={campaignNext}
          t={t}
        />
      )}
      <Card.Body>
        <RenderOnlyCharts
          data={data}
          loading={loading}
          hasCampaign={hasCampaign}
        />
      </Card.Body>
    </Card>
  )
}

function RenderOnlyCharts({ data, loading, hasCampaign }) {
  return (
    <React.Fragment>
      <Row className="mt-4">
        <ChartByContacted data={data} loading={loading} hasCampaign={hasCampaign} />
        <ChartByGender data={data} loading={loading} hasCampaign={hasCampaign} />
        <ChartByLanguage data={data} loading={loading} hasCampaign={hasCampaign} />
        {hasCampaign && <ChartByGoalReached data={data} loading={loading} />}
      </Row>
      <Row className="mt-4">
        <ChartByFeedback data={data} loading={loading} />
        <ChartByType data={data} loading={loading} />
        <ChartByLocations data={data} loading={loading} />
        <ChartByPublishers data={data} loading={loading} />
      </Row>
    </React.Fragment>
  )
}

function RenderCharts({
  data,
  loading,
  hasCampaign,
  campaignActive,
  campaignNext,
  t,
}) {
  return campaignActive || campaignNext ? (
    <RenderChartsWithCampaign
      data={data}
      loading={loading}
      hasCampaign={hasCampaign}
      campaignActive={campaignActive}
      campaignNext={campaignNext}
      t={t}
    />
  ) : (
    <RenderOnlyCharts
      data={data}
      loading={loading}
      hasCampaign={hasCampaign}
    />
  )
}

const Charts = ({ campaign }) => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const {
    updateContext,
    hasToken,
    campaignActive,
    campaignNext,
  } = useApplicationContext()
  const { t } = useTranslation(['dashboard', 'common'])

  useEffect(() => {
    async function handleGetSummary() {
      setLoading(true)
      try {
        const idCampaign = campaignActive?.id || campaign?.id
        const response = await contacts.getWhichSummary(idCampaign)
        const dataSummary = get('data', response)
        setData(dataSummary)
        setLoading(false)
      } catch (error) {
        setLoading(false)
        setError(t(`common:${parseErrorMessage(error)}`))
        showError(error, t, 'dashboard')
      }
    }

    if (hasToken) handleGetSummary()
  }, [hasToken, campaignActive, updateContext, t, campaign])

  const hasCampaign = campaignActive?.id || campaign?.id

  return (
    <Container>
      {error ? (
        <Row className="text-center">
          <Col>
            <ShowErrorComponent error={error} />
          </Col>
        </Row>
      ) : (
        <RenderCharts
          data={data}
          loading={loading}
          hasCampaign={hasCampaign}
          campaignActive={campaignActive}
          campaignNext={campaignNext}
          t={t}
        />
      )}
    </Container>
  )
}

export default Charts
