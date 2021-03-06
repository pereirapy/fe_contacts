import React from 'react'
import { toNumber, isNil } from 'lodash/fp'
import { Pagination } from 'react-bootstrap'
import { withTranslation } from 'react-i18next'
import ReactPlaceholder from 'react-placeholder'

import { ITEMS_PAGINATION } from '../../../constants/application'
import './styles.css'

const PaginationComponent = (props) => {
  const { lastPage, to, from, currentPage, totalRows } = props.pagination
  const { loading, t } = props
  let items = []

  if (!loading && !isNil(currentPage)) {
    const maxItems = ITEMS_PAGINATION
    const goBackStart = currentPage - 1 > 0 ? currentPage - 1 : 1
    const goBackEnd = currentPage - maxItems > 0 ? currentPage - maxItems : 1
    const goForwardStart =
      currentPage + 1 > lastPage ? lastPage : currentPage + 1
    const goForwardEnd =
      currentPage + maxItems > lastPage ? lastPage : currentPage + maxItems
    for (let number = goBackEnd; number <= goBackStart; number++) {
      items.push(
        <Pagination.Item
          key={number}
          active={number === toNumber(currentPage)}
          onClick={() => props.onClick({ currentPage: number })}
        >
          {number}
        </Pagination.Item>
      )
    }
    if (currentPage !== 1) {
      items.push(
        <Pagination.Item
          key={currentPage}
          active={currentPage === toNumber(currentPage)}
          onClick={() => props.onClick({ currentPage: currentPage })}
        >
          {currentPage}
        </Pagination.Item>
      )
    }
    if (goForwardStart > 1 && goForwardStart !== toNumber(currentPage)) {
      for (let number = goForwardStart; number <= goForwardEnd; number++) {
        items.push(
          <Pagination.Item
            key={number}
            active={number === toNumber(currentPage)}
            onClick={() => props.onClick({ currentPage: number })}
          >
            {number}
          </Pagination.Item>
        )
      }
    }
  }
  return (
    <ReactPlaceholder
      showLoadingAnimation={true}
      type="text"
      ready={!loading}
      rows={1}
    >
      <Pagination>
        <Pagination.First
          onClick={() =>
            currentPage !== 1 ? props.onClick({ currentPage: 1 }) : null
          }
        />
        <Pagination.Prev
          onClick={() =>
            currentPage !== from && from > 0
              ? props.onClick({ currentPage: from })
              : null
          }
        />
        {items}
        <Pagination.Next
          onClick={() =>
            currentPage !== to && to <= lastPage
              ? props.onClick({ currentPage: to })
              : null
          }
        />
        <Pagination.Last
          onClick={() =>
            currentPage !== lastPage
              ? props.onClick({ currentPage: lastPage })
              : null
          }
        />
      </Pagination>
      <span className="ml-2 mt-2 text-primary d-none d-sm-inline">
        - {t('total')}: {totalRows || 0}
      </span>
    </ReactPlaceholder>
  )
}
export default withTranslation(['common'])(PaginationComponent)
