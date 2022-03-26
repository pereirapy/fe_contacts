import moment from 'moment'
import GqlBuilder from 'graphql-query-builder-v2'
import { getOr, omit, trim, isString, isEmpty, pipe, forEach } from 'lodash/fp'
import { startsWith } from 'lodash'
import { START_NUMBER_NOT_ALLOWED } from '../constants/contacts'

export const formatDateDMY = (date) =>
  moment(date, 'YYYY-MM-DD').format('DD/MM/YYYY')

export const formatDateDMYHHmm = (date) =>
  date ? moment(date).format('DD/MM/YYYY HH:mm') : null

export const diffDate = (date, truncate = true) => {
  const today = moment().format('YYYY-MM-DD')
  const now = moment(today, 'YYYY-MM-DD')
  const end = moment(date, 'YYYY-MM-DD')
  const duration = moment.duration(now.diff(end))
  const diff = duration.asDays()

  return truncate ? Math.trunc(diff) : diff
}

export const getLocale = (props) => props.i18n.language

export const handleInputChangeGeneric = (event, componentReact) => {
  const {
    target: { name, value },
  } = event
  const { form } = componentReact.state
  const valueTrim = isString(value) ? trim(value) : value
  componentReact.setState({
    form: {
      ...form,
      [name]: valueTrim,
    },
  })
}

export const getQueryParamsFromURL = (props) => {
  const { location } = props
  if (!isEmpty(location.search))
    return pipe(
      (search) => new URLSearchParams(search),
      (search) => search.get('search'),
      JSON.parse
    )(location.search)
  else return false
}

export const setFiltersToURL = (queryParams, props) => {
  const { history } = props

  const search = '?search=' + JSON.stringify(queryParams)
  history.push({ search })
}

export const parseQuery = (objQuery, state) => {
  return {
    ...getOr({}, 'queryParams', state),
    currentPage: 1,
    ...omit(['filters'], objQuery),
    ...appendFilters(objQuery, state),
  }
}

export const appendFilters = (filters, state) => {
  const newPreFilters = {
    ...JSON.parse(getOr('{}', 'queryParams.filters', state)),
    ...getOr({}, 'filters', filters),
  }

  return {
    filters: JSON.stringify(newPreFilters),
  }
}

export const toQueryString = (paramsObject) =>
  '?' +
  Object.keys(paramsObject)
    .map(
      (key) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(paramsObject[key])}`
    )
    .join('&')

export const buildGql = (type, { name, find, filter, variables = null }) => {
  const query = new GqlBuilder(name, variables)

  if (filter) {
    query.filter(filter)
  }

  if (find) {
    query.find(find)
  }

  return type === 'mutation'
    ? `
        ${type} {${query.toString()}}
      `.trim()
    : `
      ?${type}={${query.toString()}}
    `.trim()
}

const hasSomeNotAllowedStartNumber = (val) => {
  let has = false
  forEach((each) => {
    if (startsWith(val, each)) has = true
  }, START_NUMBER_NOT_ALLOWED)
  return has
}

export const numberStartsWithInvalidCharacter = (componentReact) => ({
  message: componentReact.props?.t('numberStartsWithInvalidCharacter', {
    character: START_NUMBER_NOT_ALLOWED.join(` ${componentReact.props?.t('common:or')} `),
  }),
  rule: (val) => !hasSomeNotAllowedStartNumber(val),
  required: true,
})

export const mustBeEqualFieldPassword = (componentReact) => ({
  message: componentReact.props?.t('mustBeEqualFieldPassword'),
  rule: (val) =>
    val === componentReact.state.form.password ||
    isEmpty(componentReact.state.form.password),
  required: true,
})
