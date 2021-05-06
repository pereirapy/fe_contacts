import React, { Suspense } from 'react'
import Routes from './routes/routes'
import Loading from './components/common/Loading/Loading'

const App = () => (
  <Suspense fallback={<Loading />}>
    <Routes />
  </Suspense>
)

export default App
