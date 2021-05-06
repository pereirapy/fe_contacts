import api from '../apiTranslations'

const get = (language, file) => api.get(`/locales/${language}/${file}.json`)

const allExport = { get }

export default allExport
