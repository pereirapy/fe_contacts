import React from 'react'
import { Form, InputGroup, Button } from 'react-bootstrap'
import { getOr, reduce } from 'lodash/fp'
import { withTranslation } from 'react-i18next'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faSearch,
  faFilter,
  faArrowLeft,
} from '@fortawesome/free-solid-svg-icons'

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
                >
                  <FontAwesomeIcon icon={faFilter} />
                </Button>
              )}
              {history && (
                <>
                  {' '}
                  <Button
                    title={t('common:back')}
                    variant="secondary"
                    onClick={() => history.goBack()}
                  >
                    <FontAwesomeIcon icon={faArrowLeft} />
                  </Button>{' '}
                </>
              )}
              <InputGroup.Text>
                <FontAwesomeIcon icon={faSearch} />
              </InputGroup.Text>
            </InputGroup.Prepend>
            <Form.Control
              name={name || 'search'}
              defaultValue={valueFromURL}
              type="text"
              placeholder={t('placeHolder')}
              onKeyPress={sendSearch}
              // {onBlur={toSearch}}
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
