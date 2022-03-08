import React, { Suspense, useState, useEffect } from 'react'

import Routes from './routes/routes'
import { ApplicationContext } from './contexts/application'
import { buildContextData } from './utils/loginDataManager'
import { campaigns } from './services/'

import Loading from './components/common/Loading/Loading'

const App = () => {
  const [context, setContext] = useState(buildContextData())
  const initContext = { ...context, updateContext: setContext }
  const { hasToken } = context

  useEffect(() => {
    async function fetchCampaignActive() {
      const responseActive = await campaigns.getDetailsActive()
      const campaignActive = responseActive.data.data || null
      const responseNext = await campaigns.getDetailsNext()
      const campaignNext = responseNext.data.data || null
      setContext((previous) => ({ ...previous, campaignActive, campaignNext }))
    }
    if (hasToken) fetchCampaignActive()
  }, [hasToken])

  return (
    <Suspense fallback={<Loading />}>
      <ApplicationContext.Provider value={initContext}>
        <Routes />
      </ApplicationContext.Provider>
    </Suspense>
  )
}

export default App
