import React from 'react'
import ReactDOM from 'react-dom'
import App from './App.jsx'
import * as serviceWorker from './serviceWorker'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'react-placeholder/lib/reactPlaceholder.css'

import './i18n'
import './utils/Validator.en'
import './utils/Validator.pt'

ReactDOM.render(<App />, document.getElementById('root'))
serviceWorker.register()
