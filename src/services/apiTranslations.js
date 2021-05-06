import axios from 'axios'
import urlJoin from 'url-join'
import { API_TIMEOUT_MILLISECONDS } from '../constants/application'

function getAPIBaseURL() {
  const { __API_TRANSLATION, __API_PATH } = window
  return urlJoin(__API_TRANSLATION, __API_PATH)
}

function createAPIInstance() {
  return axios.create({
    baseURL: getAPIBaseURL(),
    timeout: API_TIMEOUT_MILLISECONDS,
  })
}

const apiInstance = createAPIInstance()

apiInstance.interceptors.request.use((config) => {
  config.headers['Cache-Control'] = 'no-cache'
  config.headers['Pragma'] = 'no-cache'
  return config
})

apiInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // eslint-disable-next-line no-console
    console.error('API error:', error)
    return Promise.reject(error)
  }
)

export default apiInstance
