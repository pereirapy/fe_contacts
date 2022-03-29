import React from 'react'
import { getOr, reduce } from 'lodash/fp'
import { Form, InputGroup } from 'react-bootstrap'
import { withTranslation } from 'react-i18next'

import { EIcons } from '../../../enums/icons'

import Icon from '../../common/Icon/Icon'
import Button from '../../common/Button/Button'

const Search = (props) => {
  const { onFilter, t, name, colspan, fields, toggleFilter, filters, history } =
    props
  const valueFromURL = filters ? filters[fields[0]] || '' : ''
  const sendSearch = (event) => {
    if (event.key === 'Enter') {
      toSearch(event)
    }
  }

  const toSearch = (event) => {
    const value = getOr('', 'target.value', event)
    const newValues = reduce(
      (result, current) => ({ ...result, [current]: value }),
      {},
      fields
    )
    onFilter({ filters: newValues, currentPage: 1 })
  }

  return (
    <React.Fragment>
      <tr>
        <th colSpan={colspan || '7'}>
          <InputGroup>
            <InputGroup.Prepend>
              {toggleFilter && (
                <Button
                  className=""
                  variant="outlined"
                  title={t('filter')}
                  onClick={toggleFilter}
                  margin={false}
                  iconName={EIcons.filterIcon}
                />
              )}
              {history && (
                <Button
                  title={t('common:back')}
                  variant="secondary"
                  margin={false}
                  onClick={() => history.goBack()}
                  iconName={EIcons.arrowLeftIcon}
                />
              )}
              <InputGroup.Text>
                <Icon noMarginRight name={EIcons.searchIcon} />
              </InputGroup.Text>
            </InputGroup.Prepend>
            <Form.Control
              name={name || 'search'}
              defaultValue={valueFromURL}
              type="text"
              placeholder={t('placeHolder')}
              onKeyPress={sendSearch}
            />
          </InputGroup>
        </th>
      </tr>
      <tr>
        <th colSpan={colspan || '7'} style={{ border: 0 }}></th>
      </tr>
    </React.Fragment>
  )
}

export default withTranslation(['search'])(Search)
