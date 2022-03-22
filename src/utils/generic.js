import { get, getOr, isEmpty, isNumber, camelCase } from 'lodash/fp'
import { some } from 'lodash'
import Swal from 'sweetalert2'

const errorsCamelCase = [
  { name: 'timeoutOf1MsExceeded' },
  { name: 'networkError' },
]

const randomColor = () =>
  `#${(Math.random() * 0xfffff * 1000000).toString(16).slice(0, 6)}`

const parseMessageKey = (error) => {
  const message = get('message', error)
  const messageCamelCase = camelCase(message)
  const applyCamelCase = some(errorsCamelCase, { name: messageCamelCase })

  if (message.indexOf('select') !== -1) {
    const iniPos = message.indexOf(' - ')
    return message.slice(iniPos)
  }
  if (applyCamelCase) {
    return messageCamelCase
  }
  return message
}
const parseErrorMessage = (error) => {
  const message = parseMessageKey(error)
  const errorConstraint = getOr(
    get('response.data.error.constraint', error),
    'response.data.constraint',
    error
  )

  const errorCode = get('response.data.error.code', error)

  const errorMessage = isEmpty(get('response.data.error', error))
    ? null
    : get('response.data.error', error)
  if (errorConstraint) return errorConstraint
  if (errorCode) return errorCode
  if (errorMessage) return errorMessage
  if (message) return message
  return 'errorTextUndefined'
}

const getTitleTranslatedMessageError = (
  error,
  t,
  fileTranslationName,
  extra
) => {
  const keyOfTranslationWhenNotFoundForTitleAlert = get(
    'keyOfTranslationWhenNotFoundForTitleAlert',
    extra
  )
  const errorTextUndefinedTranslated = t(`common:errorTextUndefined`)

  const codText = getOr(get('response.data.cod', error), 'cod', error)

  const firstOptionForDefaultTranslation =
    keyOfTranslationWhenNotFoundForTitleAlert
      ? keyOfTranslationWhenNotFoundForTitleAlert
      : codText

  const defaultTranslation = t(
    `common:${firstOptionForDefaultTranslation}`,
    errorTextUndefinedTranslated
  )
  const title = t(
    `${fileTranslationName}:${keyOfTranslationWhenNotFoundForTitleAlert}`,
    defaultTranslation
  )
  return title
}

const parseErrorMessageTranslated = (error, t, fileTranslationName, extra) => {
  const title = getTitleTranslatedMessageError(
    error,
    t,
    fileTranslationName,
    extra
  )

  const paramsExtraForTranslation = get('paramsExtraForTranslation', extra)
  const errorParsed = parseErrorMessage(error)
  const errorText = `${fileTranslationName}:${errorParsed}`

  const errorParsedTranslated = t(`${errorParsed}`, paramsExtraForTranslation)

  const defaultMessageError = paramsExtraForTranslation
    ? paramsExtraForTranslation
    : errorParsedTranslated

  const defaultMessageErrorTranslated = t(
    `common:${defaultMessageError}`,
    defaultMessageError
  )

  const detailsMessage = t(errorText, {
    ...paramsExtraForTranslation,
    defaultValue: defaultMessageErrorTranslated,
  })

  const text = title !== detailsMessage ? detailsMessage : null

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
