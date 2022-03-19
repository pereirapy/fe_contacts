import React, { Suspense, useState } from 'react'

import Routes from './routes/routes'
import { ApplicationContext } from './contexts/application'
import { buildContextData } from './utils/loginDataManager'

import Loading from './components/common/Loading/Loading'

const App = () => {
  const [context, setContext] = useState(buildContextData())
  const initContext = { ...context, updateContext: setContext }

  return (
    <Suspense fallback={<Loading />}>
      <ApplicationContext.Provider value={initContext}>
        <Routes />
      </ApplicationContext.Provider>
    </Suspense>
  )
}

export default App
