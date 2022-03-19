import React, { useState, useEffect } from 'react'
import { get } from 'lodash/fp'
import { useTranslation } from 'react-i18next'
import { Row, Col, Container, Card } from 'react-bootstrap'

import useApplicationContext from '../../../hooks/useApplicationContext'
import { showError, parseErrorMessage } from '../../../utils/generic'
import { diffDate } from '../../../utils/forms'
import { contacts, campaigns } from '../../../services'
import './charts.styles.css'

import ChartByContacted from './ByContacted'
import ChartByFeedback from './ByFeedback'
import ChartByGender from './ByGender'
import ChartByLanguage from './ByLanguage'
import ChartByPublishers from './ByPublishers'
import ChartByLocations from './ByLocations'
import ChartByType from './ByType'
import ShowErrorComponent from '../ShowError/ShowError'

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
  isAtLeastElder,
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
          isAtLeastElder={isAtLeastElder}
        />
      </Card.Body>
    </Card>
  )
}

function RenderOnlyCharts({ data, loading, isAtLeastElder }) {
  return (
    <React.Fragment>
      <Row className="mt-4">
        <ChartByContacted data={data} loading={loading} />
        <ChartByGender data={data} loading={loading} />
        <ChartByLanguage data={data} loading={loading} />
      </Row>
      <Row className="mt-4">
        <ChartByFeedback data={data} loading={loading} />
        <ChartByType data={data} loading={loading} />
        <ChartByLocations data={data} loading={loading} />
        {isAtLeastElder && <ChartByPublishers data={data} loading={loading} />}
      </Row>
    </React.Fragment>
  )
}

function RenderCharts({
  data,
  loading,
  isAtLeastElder,
  campaignActive,
  campaignNext,
  t,
}) {
  return campaignActive || campaignNext ? (
    <RenderChartsWithCampaign
      data={data}
      loading={loading}
      isAtLeastElder={isAtLeastElder}
      campaignActive={campaignActive}
      campaignNext={campaignNext}
      t={t}
    />
  ) : (
    <RenderOnlyCharts
      data={data}
      loading={loading}
      isAtLeastElder={isAtLeastElder}
    />
  )
}

const Charts = () => {
  const [data, setData] = useState([])
  const [campaignActiveData, setCampaignActiveData] = useState({})
  const [campaignNextData, setCampaignNextData] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const { isAtLeastElder, updateContext, hasToken } = useApplicationContext()
  const { t } = useTranslation(['dashboard', 'common'])

  useEffect(() => {
    async function handleGetSummary() {
      setLoading(true)
      try {
        const responseActive = await campaigns.getDetailsActive()
        const campaignActive = responseActive.data.data || null
        const responseNext = await campaigns.getDetailsNext()
        const campaignNext = responseNext.data.data || null

        const response = await contacts.getWhichSummary(campaignActive?.id)
        const dataSummary = get('data', response)

        updateContext((previous) => ({
          ...previous,
          campaignActive,
          campaignNext,
        }))
        setData(dataSummary)
        setCampaignActiveData(campaignActive)
        setCampaignNextData(campaignNext)

        setLoading(false)
      } catch (error) {
        setLoading(false)
        setError(t(`common:${parseErrorMessage(error)}`))
        showError(error, t, 'dashboard')
      }
    }

    if (hasToken) handleGetSummary()
  }, [hasToken, updateContext, t])

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
          isAtLeastElder={isAtLeastElder}
          campaignActive={campaignActiveData}
          campaignNext={campaignNextData}
          t={t}
        />
      )}
    </Container>
  )
}

export default Charts
