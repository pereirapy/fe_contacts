import React from 'react'
import { withTranslation } from 'react-i18next'
import { Table } from 'react-bootstrap'
import { map, isEmpty, truncate } from 'lodash/fp'
import moment from 'moment'
import NewDetailsContact from './NewDetailsContact'
import EditDetailsContact from './EditDetailsContact'
import AskDelete from '../../common/AskDelete/AskDelete'
import NoRecords from '../../common/NoRecords/NoRecords'
import ReactPlaceholder from 'react-placeholder'

class ListDataDetailsContact extends React.Component {
  render() {
    const {
      t,
      contact,
      data,
      afterClose,
      funcToCallAfterConfirmation,
      waitingFeedback,
      submitting,
    } = this.props
    const colSpan = 4

    return (
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>{t('publisher')}</th>
            <th>{t('date')}</th>
            <th>{t('information')}</th>
            <th>
              <NewDetailsContact
                afterClose={afterClose}
                contact={contact}
                phone={contact.phone}
                waitingFeedback={waitingFeedback}
              />
            </th>
          </tr>
        </thead>
        <tbody>
          {submitting ? (
            <tr>
              <td colSpan={colSpan}>
                <ReactPlaceholder
                  showLoadingAnimation={true}
                  type="text"
                  ready={!submitting}
                  rows={5}
                />
              </td>
            </tr>
          ) : !isEmpty(data) ? (
            map(
              (detail) => (
                <tr key={detail.id}>
                  <td>{detail.publisherName}</td>
                  <td>{moment(detail.createdAt).format('DD/MM/YYYY HH:mm')}</td>
                  <td>
                    {t(
                      detail.information,
                      truncate({ length: 45 }, detail.information)
                    )}
                  </td>
                  <td style={{ minWidth: '114px' }}>
                    <EditDetailsContact
                      data={detail}
                      contact={contact}
                      id={detail.id}
                      afterClose={afterClose}
                    />{' '}
                    <AskDelete
                      id={detail.id}
                      funcToCallAfterConfirmation={funcToCallAfterConfirmation}
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
    )
  }
}

export default withTranslation(['detailsContacts', 'common'])(
  ListDataDetailsContact
)
