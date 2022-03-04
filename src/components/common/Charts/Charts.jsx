import React from 'react'
import { get } from 'lodash/fp'
import { withTranslation } from 'react-i18next'
import { Row, Col, Container, Card } from 'react-bootstrap'

import { contacts } from '../../../services'
import { showError, parseErrorMessage } from '../../../utils/generic'
import { diffDate } from '../../../utils/forms'
import ShowErrorComponent from '../ShowError/ShowError'
import { ApplicationContext } from '../../../contexts/application'

import ChartByContacted from './ByContacted'
import ChartByFeedback from './ByFeedback'
import ChartByGender from './ByGender'
import ChartByLanguage from './ByLanguage'
import ChartByPublishers from './ByPublishers'
import ChartByLocations from './ByLocations'
import ChartByType from './ByType'
import './charts.styles.css'

function RenderChartsWithCampaign({
  data,
  loading,
  isAtLeastElder,
  campaign,
  t,
}) {
  return (
    <Card>
      <Card.Header as="h5" className="text-center bg-success text-white">
        {campaign.name} -{' '}
        <span>
          {t('daysToFinishActiveCampaign', {
            days: diffDate(campaign.dateFinal),
          })}
        </span>
      </Card.Header>
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

function RenderCharts({ data, loading, isAtLeastElder, campaign, t }) {
  return campaign ? (
    <RenderChartsWithCampaign
      data={data}
      loading={loading}
      isAtLeastElder={isAtLeastElder}
      campaign={campaign}
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
    const getData = campaign?.id ? contacts.getSummaryOneCampaign : contacts.getSummary

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
    const { isAtLeastElder } = this.context
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
            t={t}
          />
        )}
      </Container>
    )
  }
}

Charts.contextType = ApplicationContext

export default withTranslation(['dashboard', 'common'])(Charts)
