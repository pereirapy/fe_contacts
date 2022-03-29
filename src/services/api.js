import axios from 'axios'
import urlJoin from 'url-join'

import { getToken } from '../utils/loginDataManager'
import { API_TIMEOUT_MILLISECONDS } from '../constants/application'

function getAPIBaseURL() {
  const { REACT_APP_API_URL, REACT_APP_API_PATH } = process.env
  return urlJoin(REACT_APP_API_URL, REACT_APP_API_PATH)
}

function createAPIInstance() {
  return axios.create({
    baseURL: getAPIBaseURL(),
    timeout: API_TIMEOUT_MILLISECONDS,
  })
}

const apiInstance = createAPIInstance()

apiInstance.interceptors.request.use((config) => {
  const token = getToken()
  config.headers['Cache-Control'] = 'no-cache'
  config.headers['Pragma'] = 'no-cache'
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`
  }
  return config
})

apiInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error)
  }
)

export default apiInstance
