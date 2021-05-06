import React from 'react'
import { get } from 'lodash/fp'
import { withTranslation } from 'react-i18next'
import { Row, Col } from 'react-bootstrap'
import { getUserData, isAtLeastElder } from '../../utils/loginDataManager'
import { contacts } from '../../services'
import ChartByContacted from './ByContacted'
import ChartByFeedback from './ByFeedback'
import ChartByGender from './ByGender'
import ChartByLanguage from './ByLanguage'
import ChartByPublishers from './ByPublishers'
import ChartByLocations from './ByLocations'
import ChartByType from './ByType'
import { showError, parseErrorMessage } from '../../utils/generic'
import ShowErrorComponent from '../common/ShowError/ShowError'

class Charts extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      data: [],
      loading: false,
      error: false,
    }
    this.handleGetSummary = this.handleGetSummary.bind(this)
  }

  async handleGetSummary() {
    this.setState({ loading: true })
    try {
      const response = await contacts.getSummary()
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
    `${this.props.t('welcome')}, ${get('name', getUserData())}`

  componentDidMount() {
    this.handleGetSummary()
  }

  render() {
    const { data, loading, error } = this.state
    return (
      <>
        {error ? (
          <Row className="text-center">
            <Col>
              <ShowErrorComponent error={error} />
            </Col>
          </Row>
        ) : (
          <>
            <Row className="mt-4">
              <ChartByContacted data={data} loading={loading} />
              <ChartByGender data={data} loading={loading} />
              <ChartByLanguage data={data} loading={loading} />
            </Row>
            <Row className="mt-4">
              <ChartByFeedback data={data} loading={loading} />
              <ChartByType data={data} loading={loading} />
              <ChartByLocations data={data} loading={loading} />
              {isAtLeastElder() && (
                <ChartByPublishers data={data} loading={loading} />
              )}
            </Row>
          </>
        )}
      </>
    )
  }
}

export default withTranslation(['dashboard', 'common'])(Charts)
