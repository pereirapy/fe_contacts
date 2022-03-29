import { get, map, getOr, pipe, compact, orderBy } from 'lodash/fp'

import { getUserData } from '../utils/loginDataManager'

const reduceResponsibility = (
  t,
  justAllowedForMe = false,
  allResponsibility
) => {
  const idResponsibilityCurrentUser = getOr(
    0,
    'idResponsibility',
    getUserData()
  )
  return pipe(
    map((responsibility) => {
      return !justAllowedForMe ||
        responsibility.id <= idResponsibilityCurrentUser
        ? {
            label: t(get('description', responsibility)),
            value: get('id', responsibility),
          }
        : null
    }),
    compact,
    orderBy(['label'], ['asc'])
  )(getOr([], 'data.data', allResponsibility))
}

export { reduceResponsibility }
