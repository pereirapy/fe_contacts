import React from 'react'
import { Table, Container } from 'react-bootstrap'
import ContainerCRUD from '../../components/common/ContainerCRUD/ContainerCRUD'
import { withTranslation } from 'react-i18next'
import { status } from '../../services'
import { map, isEmpty } from 'lodash/fp'
import AskDelete from '../common/AskDelete/AskDelete'
import StatusEdit from './StatusEdit'
import StatusNew from './StatusNew'
import NoRecords from '../common/NoRecords/NoRecords'
import { showError } from '../../utils/generic'
import ReactPlaceholder from 'react-placeholder'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTags } from '@fortawesome/free-solid-svg-icons'

class StatusList extends React.Component {
  constructor(props) {
    super(props)
    this.state = { data: [], loading: false }
    this.handleGetAll = this.handleGetAll.bind(this)
    this.handleDelete = this.handleDelete.bind(this)
  }

  async handleGetAll() {
    try {
      this.setState({ loading: true })
      const response = await status.getAll('')
      this.setState({ data: response.data.data, loading: false })
    } catch (error) {
      const { t } = this.props
      this.setState({ loading: false })
      showError(error, t, 'status')
    }
  }

  async handleDelete(id) {
    const { t } = this.props
    try {
      this.setState({ loading: true })
      await status.dellOne(id)
      this.handleGetAll()
    } catch (error) {
      this.setState({ loading: false })
      showError(error, t, 'status')
    }
  }

  async componentDidMount() {
    this.handleGetAll()
  }

  render() {
    const { t } = this.props
    const { data, loading } = this.state
    const colSpan = 3
    const title = (
      <React.Fragment>
        {' '}
        <FontAwesomeIcon icon={faTags} /> {t('titleList')}{' '}
      </React.Fragment>
    )

    return (
      <ContainerCRUD color="purple" title={title} {...this.props}>
        <Container>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>{t('descriptionLabel')}</th>
                <th>{t('descriptionTraducedLabel')}</th>
                <th>
                  <StatusNew afterClose={this.handleGetAll} />
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
                  (status) => (
                    <tr key={status.id}>
                      <td>{status.description}</td>
                      <td>{t(status.description)}</td>
                      <td style={{ minWidth: '114px' }}>
                        <StatusEdit
                          data={status}
                          afterClose={this.handleGetAll}
                        />{' '}
                        <AskDelete
                          id={status.id}
                          funcToCallAfterConfirmation={this.handleDelete}
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
export default withTranslation(['status', 'common'])(StatusList)
