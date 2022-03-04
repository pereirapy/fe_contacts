import React from 'react'
import ReactDOM from 'react-dom'
import App from './App.jsx'
import * as serviceWorkerRegistration from './serviceWorkerRegistration'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'react-placeholder/lib/reactPlaceholder.css'
import '@djthoms/pretty-checkbox'
import './i18n'
import './utils/Validator.en'
import './utils/Validator.pt'

ReactDOM.render(<App />, document.getElementById('root'))
serviceWorkerRegistration.register()
