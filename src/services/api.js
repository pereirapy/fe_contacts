import axios from 'axios'
import urlJoin from 'url-join'
import { API_TIMEOUT_MILLISECONDS } from '../constants/application'
import { getToken } from '../utils/loginDataManager'

function getAPIBaseURL() {
  const { __API_URL, __API_PATH } = window
  return urlJoin(__API_URL, __API_PATH)
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
    // eslint-disable-next-line no-console
    console.error('API error:', error)

    // if (hasUserSessionExpired(error)) {
    //   store.dispatch("userSession/showLoginModal");
    // }

    // if (isRequestTimeout(error)) {
    //   const hostname = getServerHostname();
    //   error.code = ERROR_CONNECTION_TIMEOUT;
    //   error.message = {
    //     tag: ERROR_CONNECTION_TIMEOUT,
    //     tagParams: { hostname },
    //   };
    // }

    return Promise.reject(error)
  }
)

export default apiInstance
