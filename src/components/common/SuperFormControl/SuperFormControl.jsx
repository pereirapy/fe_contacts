import React, { useState, useEffect, useCallback } from 'react'
import { Form } from 'react-bootstrap'
import moment from 'moment'

const SuperFormControl = (props) => {
  const {
    validator,
    onChange,
    onKeyUp,
    name,
    value,
    validated,
    label,
    endLabel,
    as,
    rows,
    placeholder,
    onBlur,
    type,
    rules,
    autocomplete,
    disabled = false,
  } = props

  const [touched, setTouched] = useState(false)
  const [classField, setClassField] = useState('')

  const onBlurLocal = (e) => {
    if (!value) setTouched(false)
    if (value && validated && !validator.fieldValid(name)) {
      validator.showMessageFor(name)
    }
    setClassField(getClass())

    if (typeof onBlur === 'function') {
      onBlur(e)
    }
  }

  const onKeyUpLocal = (e) => {
    setTouched(true)
    if (!validator.fieldValid(name)) validator.showMessageFor(name)
    setClassField(getClass())
    if (typeof onKeyUp === 'function') {
      onKeyUp(e)
    }
  }
  const parsedValue =
    type === 'date' && moment(value).isValid()
      ? moment(value, 'YYYY-MM-DD')
      : value

  const getClass = useCallback(() => {
    return (validated || touched) && rules && !validator.fieldValid(name)
      ? 'is-invalid'
      : (validated || touched) &&
        ((rules && validator.fieldValid(name)) || !rules)
      ? 'is-valid'
      : ''
  },[name, rules, touched, validated, validator])

  useEffect(() => {
    validator.hideMessageFor(name)
  }, [name, validator])

  useEffect(() => {
    setClassField(getClass())
  }, [getClass])

  return (
    <Form.Group controlId={name}>
      <Form.Label>
        {label} {endLabel ? endLabel : null}
      </Form.Label>
      <Form.Control
        as={as}
        rows={rows}
        name={name}
        type={type || 'text'}
        placeholder={placeholder}
        autoComplete={autocomplete}
        onChange={onChange}
        onKeyUp={onKeyUpLocal}
        onBlur={onBlurLocal}
        defaultValue={value}
        disabled={disabled}
        className={classField}
      />
      {rules && validator.message(name, parsedValue, rules)}
    </Form.Group>
  )
}

export default SuperFormControl
