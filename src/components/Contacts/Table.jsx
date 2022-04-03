import React from 'react'
import { CSVLink } from 'react-csv'
import { Link } from 'react-router-dom'
import { Table, Form } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import ReactPlaceholder from 'react-placeholder'
import { Checkbox } from 'pretty-checkbox-react'
import { map, isEmpty, contains } from 'lodash/fp'

import {
  handleFilter,
  toggleFilter,
  handleCheckAll,
  parseDataCVS,
  handleOnClick,
  setBackgroundForbidden,
  getInformationAboveName,
  setSubRowVisible,
  setRowColor,
  showInformationAboutCampaign,
  setTitleWhenNumberWasContactedDuringCampaign,
  verifyIfWasContactedDuringCurrentCampaign,
} from '../../utils/contactsHelper'
import { EIcons } from '../../enums/icons'
import { RECORDS_PER_PAGE } from '../../constants/application'
import useApplicationContext from '../../hooks/useApplicationContext'

import NewContact from './NewContact'
import EditContact from './EditContact'
import Button from '../common/Button/Button'
import Search from '../common/Search/Search'
import SendPhones from './SendPhones/SendPhones'
import NoRecords from '../common/NoRecords/NoRecords'
import AskDelete from '../common/AskDelete/AskDelete'
import BatchChanges from './BatchChanges/BatchChanges'
import Pagination from '../common/Pagination/Pagination'
import ListDetailsContact from '../DetailsContact/Modal/ListDetailsContact'
import './styles.css'

export default function TableComponent({
  filtersParsed,
  modeAllContacts,
  data,
  checksContactsPhones,
  loading,
  dataCVS,
  headers,
  componentReact,
  pagination,
  handleGetAll,
  handleDelete,
}) {
  const { t } = useTranslation(['contacts', 'common'])
  const { isAtLeastElder } = useApplicationContext()
  const colSpan = '10'

  return (
    <Table striped bordered hover responsive size="sm">
      <thead>
        <Search
          filters={filtersParsed}
          onFilter={(objQuery) =>
            handleFilter({
              objQuery,
              componentReact,
            })
          }
          fields={['name', 'phone', 'note', 'owner']}
          colspan={colSpan}
          toggleFilter={() => toggleFilter(componentReact)}
        />
        <tr>
          <th style={{ width: '60px' }}>
            <Checkbox
              id="checkall"
              name="all"
              value="all"
              onClick={(event) =>
                handleCheckAll({
                  event,
                  componentReact,
                })
              }
              color="success"
              className="marginLeftCheckbox"
              bigger
              animation="pulse"
            />
          </th>
          <th>{t('phone')}</th>
          <th className="d-none d-sm-table-cell">{t('name')}</th>
          <th className="d-none d-lg-table-cell">{t('typeCompany')}</th>
          <th className="d-none d-lg-table-cell">{t('language')}</th>
          <th className="d-none d-lg-table-cell">{t('status')}</th>
          <th
            style={{ maxWidth: '90px' }}
            className="d-none d-lg-table-cell text-center"
          >
            {t('lastConversationsInDays')}
          </th>
          {modeAllContacts && (
            <th className="d-none d-lg-table-cell">{t('waitingFeedback')}</th>
          )}
          <th style={{ minWidth: '116px' }}>{t('details')}</th>
          <th style={{ minWidth: '189px' }}>
            <NewContact afterClose={handleGetAll} />
            <SendPhones
              checksContactsPhones={checksContactsPhones}
              contactsData={data}
              afterClose={handleGetAll}
            />
            {isAtLeastElder && (
              <BatchChanges
                checksContactsPhones={checksContactsPhones}
                contactsData={data}
                afterClose={handleGetAll}
              />
            )}
            <CSVLink
              data={dataCVS}
              headers={headers}
              filename={`${t(
                modeAllContacts ? 'listAllTitle' : 'listTitle'
              )}.csv`}
              title={t('titleExportToCVS')}
              onClick={() => parseDataCVS(componentReact, false)}
            >
              <Button
                iconName={EIcons.fileExcelIcon}
                className={`${
                  checksContactsPhones.length > 0 ? '' : 'disabled'
                }`}
              />
            </CSVLink>
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
            (contact) => (
              <tr
                key={contact.phone}
                className={setBackgroundForbidden({
                  contact,
                  componentReact,
                })}
                title={setTitleWhenNumberWasContactedDuringCampaign({
                  contact,
                  componentReact,
                })}
              >
                <td style={{ minWidth: '60px' }}>
                  <Checkbox
                    checked={contains(contact.phone, checksContactsPhones)}
                    name="checksContactsPhones"
                    disabled={verifyIfWasContactedDuringCurrentCampaign({
                      contact,
                      componentReact,
                    })}
                    value={contact.phone}
                    color="success"
                    className="marginLeftCheckbox"
                    bigger
                    onChange={(event) =>
                      handleOnClick({
                        event,
                        componentReact,
                      })
                    }
                  />
                </td>
                <td>{contact.phone}</td>
                <td className="d-none d-sm-table-cell verticalBottom">
                  <span>{contact.name}</span>
                  <div style={setSubRowVisible(contact)}>
                    <Form.Text
                      className={`text-muted ${setRowColor(contact.idStatus)}`}
                    >
                      {getInformationAboveName({
                        contact,
                        componentReact,
                      })}
                    </Form.Text>
                  </div>
                  {showInformationAboutCampaign({
                    detailContact: contact,
                    componentReact,
                    modeAllContacts,
                  })}
                </td>
                <td className="d-none d-lg-table-cell">
                  {t(`${contact.typeCompany ? 'commercial' : 'residential'}`)}
                </td>
                <td className="d-none d-lg-table-cell">
                  {t(`languages:${contact.languageName}`)}
                </td>
                <td
                  className={`d-none d-lg-table-cell ${setRowColor(
                    contact.idStatus
                  )}`}
                >
                  {t(`status:${contact.statusDescription}`)}
                </td>
                <td className="d-none d-lg-table-cell">
                  {t(contact.lastConversationInDays)}
                </td>
                {modeAllContacts && (
                  <td
                    className={`d-none d-lg-table-cell text-${
                      contact.waitingFeedback ? 'danger' : 'success'
                    }`}
                  >
                    {t(`common:${contact.waitingFeedback ? 'yes' : 'no'}`)}
                  </td>
                )}
                <td>
                  <ListDetailsContact
                    contact={contact}
                    id={contact.phone}
                    afterClose={handleGetAll}
                  />
                  <Button
                    title={t('common:list')}
                    variant="secondary"
                    as={Link}
                    to={`/contacts/${encodeURI(contact.phone)}/details`}
                    iconName={EIcons.listIcon}
                  />
                </td>
                <td>
                  {!modeAllContacts && (
                    <EditContact id={contact.phone} afterClose={handleGetAll} />
                  )}
                  <AskDelete
                    id={contact.phone}
                    funcToCallAfterConfirmation={handleDelete}
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
      <tfoot>
        <tr>
          <td colSpan={colSpan} style={{ border: 0 }}>
            <Pagination
              pagination={pagination}
              onClick={(objQuery) =>
                handleFilter({
                  objQuery,
                  componentReact,
                })
              }
              loading={loading}
            />
          </td>
        </tr>
      </tfoot>
    </Table>
  )
}
