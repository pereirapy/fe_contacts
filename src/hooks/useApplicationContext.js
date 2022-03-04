import { useContext, useEffect } from 'react'

import { ApplicationContext } from '../contexts/application'

export default function useApplicationContext(initialProps) {
  const context = useContext(ApplicationContext)

  useEffect(
    () =>
      context.updateContext((previous) => ({ ...previous, ...initialProps })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  return context
}
