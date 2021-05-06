import api from '../api'

const authenticate = (data) => api.post('/auth', data)

const allExport = {
  authenticate,
}

export default allExport
