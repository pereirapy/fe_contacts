import { getOr, map, isNil } from 'lodash/fp'

const reduceLocations = (locations) =>
  map(
    ({ value, label }) => ({
      value,
      label,
    }),
    getOr([], 'data.data', locations)
  )

const reduceFiltersLocations = (filters, t) =>
  map(
    ({ value, label }) => ({
      value,
      label: isNil(value) ? t('unknown') : label,
    }),
    getOr([], 'locations', filters)
  )

export { reduceLocations, reduceFiltersLocations }
