import api from '../api'
import { toQueryString } from '../../utils/forms'

const getAll = () => api.get('/campaigns')
const getDetailsActive = () => api.get('/campaigns/active/details')
const getOne = (id) => api.get(`/campaigns/${id}`)
const getAllContactsOne = (id, params) =>
  api.get(`/campaigns/${id}/all${toQueryString(params)}`)
const getAllContactsOneFilters = (id) => api.get(`/campaigns/${id}/all/filters`)

const updateOne = (id, data) => api.put(`/campaigns/${id}`, data)

const create = (data) => api.post(`/campaigns`, data)

const dellOne = (id) => api.delete(`/campaigns/${id}`)

const allExport = {
  getAll,
  getAllContactsOne,
  getDetailsActive,
  getAllContactsOneFilters,
  getOne,
  dellOne,
  updateOne,
  create,
}

export default allExport
