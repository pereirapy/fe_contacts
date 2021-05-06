import { getOr } from 'lodash/fp'

const generateLabel = (t, data, field) =>
  `${t('languages:' + getOr('noName', field, data))}`

export { generateLabel }
