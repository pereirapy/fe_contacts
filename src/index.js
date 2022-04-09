import React from 'react'
import ReactDOM from 'react-dom'
import '@djthoms/pretty-checkbox'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'react-placeholder/lib/reactPlaceholder.css'
import './assets/styles/global.css'
import './i18n'
import './utils/Validator.en'
import './utils/Validator.pt'
import * as serviceWorkerRegistration from './serviceWorkerRegistration'

import App from './App.jsx'

ReactDOM.render(<App />, document.getElementById('root'))
serviceWorkerRegistration.register()
