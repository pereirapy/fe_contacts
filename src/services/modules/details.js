import api from '../api'
import { toQueryString } from '../../utils/forms'

const getAllOneContact = (id, params) =>
  api.get(`/detailsContacts/oneContact/${id}/${toQueryString(params)}`)

const getOne = (id) => api.get(`/detailsContacts/${id}`)

const getAllWaitingFeedback = (params) =>
  api.get(`/detailsContacts/waitingFeedback${toQueryString(params)}`)

const getAllWaitingFeedbackFilters = () =>
  api.get(`/detailsContacts/filtersWaitingFeedback`)

const create = (data) => api.post(`/detailsContacts`, data)

const updateOneContactDetail = (id, data) =>
  api.put(`/detailsContacts/${id}`, data)

const dellOne = (id) => api.delete(`/detailsContacts/${id}`)

const allExport = {
  getOne,
  getAllOneContact,
  getAllWaitingFeedback,
  getAllWaitingFeedbackFilters,
  create,
  updateOneContactDetail,
  dellOne,
}

export default allExport
