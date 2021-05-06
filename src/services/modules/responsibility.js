import api from '../api'

const get = () => api.get('/responsibility')

const allExport = { get }

export default allExport
