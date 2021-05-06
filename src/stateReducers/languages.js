import { get, map } from 'lodash/fp'

const reduceLanguages = (t, data) =>
  map(
    (option) => ({
      label: t(get('name', option)),
      value: get('id', option),
    }),
    data
  )

export { reduceLanguages }
