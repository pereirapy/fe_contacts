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
  getColumnOrder,
  convertSortObjectToString,
  convertSortStringToObject,
} from '../../utils/contactsHelper'
import { EIcons } from '../../enums/icons'
import { setSearchToURL } from '../../utils/forms'
import { RECORDS_PER_PAGE } from '../../constants/application'
import useApplicationContext from '../../hooks/useApplicationContext'

import NewContact from './NewContact'
import EditContact from './EditContact'
import Button from '../common/Button/Button'
import Search from '../common/Search/Search'
import SendPhones from './SendPhones/SendPhones'
import SortIcon from '../common/SortIcon/SortIcon'
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
  updateSortState,
  currentSort,
  history,
}) {
  const { t } = useTranslation(['contacts', 'common'])
  const { isAtLeastElder } = useApplicationContext()
  const colSpan = '10'

  const handleSorter = (columnName) => {
    if (!columnName) return
    const currentObjectSort = convertSortStringToObject(currentSort)
    const order = getColumnOrder(currentObjectSort, columnName)

    const newOrders = {
      [columnName]: order,
    }

    const stringOrder = convertSortObjectToString(newOrders)
    const queryParams = updateSortState(stringOrder)
    setSearchToURL(queryParams, { history })
  }

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
          <th className="hand" onClick={() => handleSorter('phone')}>
            <SortIcon
              stringSort={currentSort}
              columnName="phone"
              columnNameTranslated={t('phone')}
            />
          </th>
          <th className="hand" onClick={() => handleSorter('name')}>
            <SortIcon
              stringSort={currentSort}
              columnName="name"
              columnNameTranslated={t('name')}
            />
          </th>
          <th className="hand" onClick={() => handleSorter('typeCompany')}>
            <SortIcon
              stringSort={currentSort}
              columnName="typeCompany"
              columnNameTranslated={t('typeCompany')}
            />
          </th>
          <th className="hand" onClick={() => handleSorter('languageName')}>
            <SortIcon
              stringSort={currentSort}
              columnName="languageName"
              columnNameTranslated={t('language')}
            />
          </th>
          <th
            className="hand"
            onClick={() => handleSorter('idStatus')}
          >
            <SortIcon
              stringSort={currentSort}
              columnName="idStatus"
              columnNameTranslated={t('status')}
            />
          </th>
          <th
            style={{ maxWidth: '90px' }}
            className="hand text-center"
            data-name="lastConversationInDays"
            onClick={() => handleSorter('lastConversationInDays')}
          >
            <SortIcon
              stringSort={currentSort}
              columnName="lastConversationInDays"
              columnNameTranslated={t('lastConversationInDays')}
            />
          </th>
          {modeAllContacts && (
            <th
              className="hand"
              data-name="waitingFeedback"
              onClick={() => handleSorter('waitingFeedback')}
            >
              <SortIcon
                stringSort={currentSort}
                columnName="waitingFeedback"
                columnNameTranslated={t('waitingFeedback')}
              />
            </th>
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
                <td className="verticalBottom">
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
                <td className="">
                  {t(`${contact.typeCompany ? 'commercial' : 'residential'}`)}
                </td>
                <td className="">{t(`languages:${contact.languageName}`)}</td>
                <td className={` ${setRowColor(contact.idStatus)}`}>
                  {t(`status:${contact.statusDescription}`)}
                </td>
                <td className="">{t(contact.lastConversationInDays)}</td>
                {modeAllContacts && (
                  <td
                    className={` text-${
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
