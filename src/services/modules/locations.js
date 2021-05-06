import api from '../api'

const getAll = () => api.get('/locations')

const allExport = { getAll }

export default allExport
