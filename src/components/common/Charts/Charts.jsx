import React from 'react'
import { get } from 'lodash/fp'
import { withTranslation } from 'react-i18next'
import { Row, Col, Container, Card } from 'react-bootstrap'

import { ApplicationContext } from '../../../contexts/application'
import { showError, parseErrorMessage } from '../../../utils/generic'
import { diffDate } from '../../../utils/forms'
import { contacts } from '../../../services'
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

function CardHeaderCampaign({ campaign, campaignNext, t }) {
  return campaign ? (
    <CardHeaderCampaignActiveNext
      name={campaign.name}
      date={campaign.dateFinal}
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
  campaign,
  campaignNext,
  t,
}) {
  return (
    <Card>
      <CardHeaderCampaign
        campaign={campaign}
        campaignNext={campaignNext}
        t={t}
      />
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
  campaign,
  t,
  campaignNext,
}) {
  return campaign || campaignNext ? (
    <RenderChartsWithCampaign
      data={data}
      loading={loading}
      isAtLeastElder={isAtLeastElder}
      campaign={campaign}
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

class Charts extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      data: [],
      loading: true,
      error: false,
    }
    this.handleGetSummary = this.handleGetSummary.bind(this)
  }

  async handleGetSummary() {
    this.setState({ loading: true })
    const { campaign } = this.props
    const getData = campaign?.id
      ? contacts.getSummaryOneCampaign
      : contacts.getSummary

    try {
      const response = await getData(campaign?.id)
      const data = get('data', response)

      this.setState({
        data,
        loading: false,
      })
    } catch (error) {
      const { t } = this.props

      this.setState({
        error: t(`common:${parseErrorMessage(error)}`),
        loading: false,
      })
      showError(error, t, 'dashboard')
    }
  }

  buildSubTitleMessage = () =>
    `${this.props.t('welcome')}, ${get('name', this.context.user)}`

  componentDidMount() {
    this.handleGetSummary()
  }

  render() {
    const { data, loading, error } = this.state
    const { isAtLeastElder, campaignNext } = this.context
    const { t, campaign } = this.props
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
            campaign={campaign}
            campaignNext={campaignNext}
            t={t}
          />
        )}
      </Container>
    )
  }
}

Charts.contextType = ApplicationContext

export default withTranslation(['dashboard', 'common'])(Charts)
