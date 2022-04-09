import React from 'react'
import { Link } from 'react-router-dom'
import { map, isEmpty } from 'lodash/fp'
import { withTranslation } from 'react-i18next'
import ReactPlaceholder from 'react-placeholder'
import { Table, Container } from 'react-bootstrap'

import { EIcons } from '../../enums/icons'
import { campaigns } from '../../services'
import { showError } from '../../utils/generic'
import { formatDateDMY } from '../../utils/forms'
import { ApplicationContext } from '../../contexts/application'

import Icon from '../common/Icon/Icon'
import CampaignNew from './CampaignNew'
import CampaignEdit from './CampaignEdit'
import Button from '../common/Button/Button'
import NoRecords from '../common/NoRecords/NoRecords'
import AskDelete from '../common/AskDelete/AskDelete'
import ContainerCRUD from '../common/ContainerCRUD/ContainerCRUD'

class CampaignsList extends React.Component {
  constructor(props) {
    super(props)
    this.state = { data: [], loading: false }
    this.handleGetAll = this.handleGetAll.bind(this)
    this.handleDelete = this.handleDelete.bind(this)
    this.updateCampaignActive = this.updateCampaignActive.bind(this)
  }

  async handleGetAll() {
    try {
      this.setState({ loading: true })
      this.updateCampaignActive()
      const response = await campaigns.getAll()
      this.setState({ data: response.data.data, loading: false })
    } catch (error) {
      const { t } = this.props
      this.setState({ loading: false })
      showError(error, t, 'campaigns')
    }
  }

  async updateCampaignActive() {
    const { updateContext } = this.context
    const responseActive = await campaigns.getDetailsActive()
    const campaignActive = responseActive.data.data || null
    const responseNext = await campaigns.getDetailsNext()
    const campaignNext = responseNext.data.data || null
    updateContext((previous) => ({ ...previous, campaignActive, campaignNext }))
  }

  async handleDelete(id) {
    const { t } = this.props
    try {
      this.setState({ loading: true })
      await campaigns.dellOne(id)
      this.handleGetAll()
    } catch (error) {
      this.setState({ loading: false })
      showError(error, t, 'campaigns')
    }
  }

  async componentDidMount() {
    this.handleGetAll()
  }

  getTitle(onlyText) {
    const { t } = this.props
    const title = t('titleList')
    return onlyText ? title : <Icon name={EIcons.bullhornIcon} label={title} />
  }

  render() {
    const { t } = this.props
    const { data, loading } = this.state
    const colSpan = 4

    return (
      <ContainerCRUD
        color="indigo"
        title={this.getTitle()}
        titleOnlyText={this.getTitle(true)}
        {...this.props}
      >
        <Container>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>{t('name')}</th>
                <th>{t('dateStart')}</th>
                <th>{t('dateFinal')}</th>
                <th>
                  <CampaignNew afterClose={this.handleGetAll} />
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={colSpan}>
                    <ReactPlaceholder
                      showLoadingAnimation={true}
                      type="text"
                      ready={!loading}
                      rows={5}
                    />
                  </td>
                </tr>
              ) : !isEmpty(data) ? (
                map(
                  (campaign) => (
                    <tr key={campaign.id}>
                      <td>{campaign.name}</td>
                      <td>{t(formatDateDMY(campaign.dateStart))}</td>
                      <td>{t(formatDateDMY(campaign.dateFinal))}</td>
                      <td style={{ minWidth: '114px' }}>
                        <CampaignEdit
                          data={campaign}
                          afterClose={this.handleGetAll}
                        />
                        <AskDelete
                          id={campaign.id}
                          funcToCallAfterConfirmation={this.handleDelete}
                        />
                        <Button
                          title={t('seeCampaignDetails')}
                          variant="primary"
                          as={Link}
                          to={`/campaigns/${campaign.id}/all`}
                          iconName={EIcons.searchPlusIcon}
                        />
                        <Button
                          title={t('seeCampaignCharts')}
                          variant="warning"
                          as={Link}
                          to={`/campaigns/${campaign.id}/charts`}
                          iconName={EIcons.chartPieIcon}
                        />
                      </td>
                    </tr>
                  ),
                  data
                )
              ) : (
                <NoRecords cols={colSpan} />
              )}
            </tbody>
          </Table>
        </Container>
      </ContainerCRUD>
    )
  }
}
CampaignsList.contextType = ApplicationContext

export default withTranslation(['campaigns', 'common'])(CampaignsList)
