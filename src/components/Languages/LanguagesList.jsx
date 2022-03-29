import React from 'react'
import { Table } from 'react-bootstrap'
import { map, isEmpty } from 'lodash/fp'
import { withTranslation } from 'react-i18next'
import ReactPlaceholder from 'react-placeholder'

import { EIcons } from '../../enums/icons'
import { languages } from '../../services'
import { showError } from '../../utils/generic'
import { RECORDS_PER_PAGE } from '../../constants/application'

import Icon from '../common/Icon/Icon'
import LanguagesNew from './LanguagesNew'
import LanguagesEdit from './LanguagesEdit'
import NoRecords from '../common/NoRecords/NoRecords'
import AskDelete from '../common/AskDelete/AskDelete'
import ContainerCRUD from '../common/ContainerCRUD/ContainerCRUD'

class LanguagesList extends React.Component {
  constructor(props) {
    super(props)
    this.state = { data: [], loading: false }
    this.handleGetAll = this.handleGetAll.bind(this)
    this.handleDelete = this.handleDelete.bind(this)
  }

  async handleGetAll() {
    try {
      this.setState({ loading: true })
      const response = await languages.getAll('')
      this.setState({ data: response.data.data, loading: false })
    } catch (error) {
      const { t } = this.props
      this.setState({ loading: false })
      showError(error, t, 'languages')
    }
  }

  async handleDelete(id) {
    const { t } = this.props
    this.setState({ loading: true })
    await languages
      .dellOne(id)
      .then(() => {
        this.handleGetAll()
      })
      .catch((error) => {
        this.setState({ loading: false })
        showError(error, t, 'languages')
      })
  }

  async componentDidMount() {
    this.handleGetAll()
  }

  getTitle(onlyText) {
    const { t } = this.props
    const title = t('titleCrud')

    return onlyText ? (
      title
    ) : (
      <React.Fragment>
        <Icon name={EIcons.languageIcon} />
        {title}
      </React.Fragment>
    )
  }

  render() {
    const { t } = this.props
    const { data, loading } = this.state
    const colSpan = '4'

    return (
      <ContainerCRUD
        color="teal"
        title={this.getTitle()}
        titleOnlyText={this.getTitle(true)}
        {...this.props}
      >
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>{t('descriptionLabel')}</th>
              <th>{t('descriptionTraducedLabel')}</th>
              <th>{t('colorLabel')}</th>
              <th>
                <LanguagesNew afterClose={this.handleGetAll} />
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
                    rows={RECORDS_PER_PAGE}
                  />
                </td>
              </tr>
            ) : !isEmpty(data) ? (
              map(
                (language) => (
                  <tr key={language.id}>
                    <td>{language.name}</td>
                    <td>{t(language.name)}</td>
                    <td style={{ backgroundColor: `${language.color}` }}>
                      {t('colorLabel')}
                    </td>
                    <td>
                      <LanguagesEdit
                        data={language}
                        afterClose={this.handleGetAll}
                      />
                      <AskDelete
                        id={language.id}
                        funcToCallAfterConfirmation={this.handleDelete}
                      />
                    </td>
                  </tr>
                ),
                data
              )
            ) : (
              <NoRecords cols={4} />
            )}
          </tbody>
        </Table>
      </ContainerCRUD>
    )
  }
}
export default withTranslation(['languages', 'common'])(LanguagesList)
