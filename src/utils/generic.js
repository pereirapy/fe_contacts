import { get, getOr, isEmpty, isNumber } from 'lodash/fp'
import moment from 'moment'
import Swal from 'sweetalert2'

const formatDate = (date) =>
  date ? moment(date).format('DD/MM/YYYY HH:mm') : null

const randomColor = () =>
  `#${(Math.random() * 0xfffff * 1000000).toString(16).slice(0, 6)}`

const parseErrorMessage = (error) => {
  const message = get('message', error)
  const errorConstraint = get('response.data.error.constraint', error)
  const errorCode = get('response.data.error.code', error)
  const errorMessage = get('response.data.error', error)
  return errorConstraint
    ? errorConstraint
    : errorCode
    ? errorCode
    : errorMessage
    ? errorMessage
    : message
    ? message
    : 'errorTextUndefined'
}

const parseErrorMessageTranslated = (error, t, fileTranslationName, extra) => {
  const keyOfTranslationWhenNotFoundForTitleAlert = getOr(
    get('response.data.cod', error),
    'keyOfTranslationWhenNotFoundForTitleAlert',
    extra
  )
  const paramsExtraForTranslation = get('paramsExtraForTranslation', extra)

  const title = t(
    `${fileTranslationName}:${keyOfTranslationWhenNotFoundForTitleAlert}`,
    t(
      `common:${keyOfTranslationWhenNotFoundForTitleAlert}`,
      t(`common:errorTextUndefined`)
    )
  )

  const preText = t(
    `${fileTranslationName}:${parseErrorMessage(error)}`,
    paramsExtraForTranslation
      ? paramsExtraForTranslation
      : t(`common:${parseErrorMessage(error)}`)
  )

  const text = title !== preText ? preText : null

  return { title, text }
}

const showError = (error, t, fileTranslationName = 'common', extra) => {
  const { title, text } = parseErrorMessageTranslated(
    error,
    t,
    fileTranslationName,
    extra
  )

  Swal.fire({
    icon: 'error',
    title,
    text,
  })
}

const parseSuccessfulMessageTranslated = (
  t,
  keyTranslation,
  fileTranslationName
) => {
  const title = t(
    `${fileTranslationName ? fileTranslationName : 'common'}:${
      keyTranslation ? keyTranslation : 'dataSuccessfullySaved'
    }`
  )

  return { title }
}

const showSuccessful = (t, keyTranslation, fileTranslationName) => {
  const { title } = parseSuccessfulMessageTranslated(
    t,
    keyTranslation,
    fileTranslationName
  )
  Swal.fire({
    title,
    icon: 'success',
    timer: 2000,
    timerProgressBar: true,
  })
}

const ifEmptySetNull = (value) =>
  isEmpty(value) && !isNumber(value) ? null : value

export {
  randomColor,
  parseErrorMessage,
  formatDate,
  showError,
  showSuccessful,
  ifEmptySetNull,
}
