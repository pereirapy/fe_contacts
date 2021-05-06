import api from '../api'
import { toQueryString } from '../../utils/forms'

const getAllWithPagination = (params) =>
  api.get(`/publishers/withPagination${toQueryString(params)}`)

const getAllFilters = () => api.get(`/publishers/filters`)

const getAll = () => api.get('/publishers')

const getAllActives = () => api.get('/publishers/actives')

const getOne = (id) => api.get(`/publishers/${id}`)

const create = (data) => api.post('/publishers', data)

const updatePublishers = (id, data) => api.put(`/publishers/${id}`, data)

const dellOne = (id) => api.delete(`/publishers/${id}`)

const allExport = {
  getAllWithPagination,
  getAllActives,
  getAll,
  getAllFilters,
  getOne,
  updatePublishers,
  dellOne,
  create,
}

export default allExport
