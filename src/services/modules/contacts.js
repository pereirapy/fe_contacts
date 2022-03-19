import api from '../api'
import { buildGql } from '../../utils/forms'

const CONTACTS = [
  'name',
  'owner',
  'phone',
  'idStatus',
  'idLanguage',
  'gender',
  'typeCompany',
  'idLocation',
  'locationName',
  'departmentName',
  'email',
  'note',
  'languageName',
  'statusDescription',
  'createdAtDetailsContacts',
  'lastConversationInDays',
  'publisherName',
  'information',
  'waitingFeedback',
  'createdAtDetailsContacts',
  'updatedAt',
  'publisherNameUpdatedBy',
  'campaignName',
]
const PAGINATION = [
  'perPage',
  'currentPage',
  'from',
  'to',
  'totalRows',
  'lastPage',
]
const contactsWithPagination = [{ list: CONTACTS }, { pagination: PAGINATION }]
const responseSuccess = ['status', 'cod', { data: contactsWithPagination }]

const getAll = (filter) => {
  const query = buildGql('query', {
    name: 'data: getAll',
    find: responseSuccess,
    filter: { input: { ...filter } },
  })

  return api.get(`/contacts${query}`)
}
const getAllFilters = () => api.get(`/contacts/filters`)
const getSummary = () => api.get(`/contacts/summary`)
const getSummaryOneCampaign = (id) => api.get(`/contacts/${id}/summary`)
const getWhichSummary = (id) => {
  return id ? getSummaryOneCampaign(id) : getSummary()
}
const getOne = (id) => api.get(`/contacts/${id}`)

const create = (data) => api.post('/contacts', data)
const assign = (data) => api.post('/contacts/assign', data)

const updateContact = (id, data) => api.put(`/contacts/${id}`, data)
const updateSome = (data) => api.put(`/contacts/some`, data)

const dellOne = (id) => api.delete(`/contacts/${id}`)

const allExport = {
  getAll,
  getOne,
  create,
  updateContact,
  dellOne,
  getAllFilters,
  assign,
  updateSome,
  getSummary,
  getSummaryOneCampaign,
  getWhichSummary,
}

export default allExport
