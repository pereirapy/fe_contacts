import React from 'react'
import { withTranslation } from 'react-i18next'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBullhorn } from '@fortawesome/free-solid-svg-icons'
import { getOr, isEmpty } from 'lodash/fp'

import { campaigns } from '../../services'
import { showError } from '../../utils/generic'
import ContainerCRUD from '../common/ContainerCRUD/ContainerCRUD'
import Loading from '../common/Loading/Loading'

import Charts from '../common/Charts/Charts'
import { ApplicationContext } from '../../contexts/application'

class CampaignCharts extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      data: {},
      error: false,
      loading: true,
    }
    this.handleGetAll = this.handleGetAll.bind(this)
  }

  async handleGetAll() {
    this.setState({ loading: true })
    const { t } = this.props
    try {
      const id = getOr(0, 'props.match.params.id', this)
      const response = await campaigns.getOne(id)
      const error = getOr([], 'data.errors[0]', response)
      if (isEmpty(error)) {
        this.setState({
          data: getOr({}, 'data.data', response),
          loading: false,
          error: false,
        })
      } else {
        this.setState({
          error,
          loading: false,
        })
        showError(error, t, 'campaigns')
      }
    } catch (error) {
      this.setState({
        error,
        loading: false,
      })
      showError(error, t, 'campaigns')
    }
  }

  getTitle() {
    const { t } = this.props
    const { data } = this.state
    return (
      <React.Fragment>
        <FontAwesomeIcon icon={faBullhorn} />{' '}
        {t('chartsTitle', { campaign: data?.name })}
      </React.Fragment>
    )
  }

  componentDidMount() {
    this.handleGetAll()
  }

  render() {
    const { data, loading } = this.state

    return (
      <ContainerCRUD
        color={'gray-dark'}
        title={this.getTitle()}
        {...this.props}
      >
        {loading ? <Loading /> : <Charts campaign={data} />}
      </ContainerCRUD>
    )
  }
}

CampaignCharts.contextType = ApplicationContext

export default withTranslation(['campaigns', 'common'])(CampaignCharts)
