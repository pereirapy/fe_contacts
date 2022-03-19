import { get, getOr, isEmpty, isNumber } from 'lodash/fp'
import Swal from 'sweetalert2'

const randomColor = () =>
  `#${(Math.random() * 0xfffff * 1000000).toString(16).slice(0, 6)}`

const parseErrorMessage = (error) => {
  const message = get('message', error)
  const errorConstraint = getOr(
    get('response.data.error.constraint', error),
    'response.data.constraint',
    error
  )

  const errorCode = getOr(
    get('response.data.cod', error),
    'response.data.error.code',
    error
  )
  const errorMessage = isEmpty(get('response.data.error', error))
    ? null
    : get('response.data.error', error)

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
  const translationAlternativeTwo = t(`common:errorTextUndefined`)
  const translationAlternativeOne = t(
    `common:${keyOfTranslationWhenNotFoundForTitleAlert}`,
    translationAlternativeTwo
  )
  const title = t(
    `${fileTranslationName}:${keyOfTranslationWhenNotFoundForTitleAlert}`,
    translationAlternativeOne
  )
  const errorParsed = parseErrorMessage(error)
  const hasErrorFileTranslationName = errorParsed.indexOf(':') !== -1
  const errorFirstOption = hasErrorFileTranslationName
    ? errorParsed
    : `${fileTranslationName}:${errorParsed}`
  const errorParsedTranslated = t(`${errorParsed}`)

  const secondMessageError = paramsExtraForTranslation
    ? paramsExtraForTranslation
    : errorParsedTranslated
  const appendNameSpace =
    secondMessageError === 'Network Error' ? '' : 'common:'
  const secondMessageErrorTranslated = t(
    `${appendNameSpace}${secondMessageError}`
  )
  const preText = t(errorFirstOption, secondMessageErrorTranslated)

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
  showError,
  showSuccessful,
  ifEmptySetNull,
}
