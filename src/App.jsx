import React, { Suspense, useState, useEffect } from 'react'
import Routes from './routes/routes'
import Loading from './components/common/Loading/Loading'
import { ApplicationContext } from './contexts/application'
import { buildContextData } from './utils/loginDataManager'
import { campaigns } from './services/'

const App = () => {
  const [context, setContext] = useState(buildContextData())
  const initContext = { ...context, updateContext: setContext }

  useEffect(() => {
    async function fetchCampaignActive() {
      const response = await campaigns.getDetailsActive()
      const campaignActive = response.data.data || null
      setContext((previous) => ({ ...previous, campaignActive }))
    }

    fetchCampaignActive()
  }, [])

  return (
    <Suspense fallback={<Loading />}>
      <ApplicationContext.Provider value={initContext}>
        <Routes />
      </ApplicationContext.Provider>
    </Suspense>
  )
}

export default App
