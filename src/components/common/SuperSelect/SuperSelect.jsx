import React, { useState, useEffect, useCallback } from 'react'
import { Form } from 'react-bootstrap'
import Select from 'react-select'
import { find, map, includes } from 'lodash/fp'
import './style-super-select.css'
import ReactPlaceholder from 'react-placeholder'
import { withTranslation } from 'react-i18next'

const SuperSelect = (props) => {
  const {
    validator,
    onChange,
    name,
    value,
    options,
    validated,
    isClearable,
    label,
    rules,
    disabled = false,
    loading = false,
    isMulti = false,
    rows = 2,
    t,
    placeHolderSelect = 'placeHolderSelect',
  } = props

  const [touched, setTouched] = useState(false)
  const [classField, setClassField] = useState('')

  const onBlurLocal = (e) => {
    if (value && validated && !validator.fieldValid(name)) {
      validator.showMessageFor(name)
    }
    setClassField(getClass())
  }

  const setValue = () => {
    if (isMulti) {
      return (
        value &&
        options &&
        map((option) => {
          if (includes(option.value, value)) return option
        }, options)
      )
    } else {
      return (
        value &&
        value !== '' &&
        options &&
        find((option) => option.value === value, options)
      )
    }
  }
  const setOnChange = (paramValues) => {
    setTouched(true)

    if (isMulti) {
      const arrayOnlyValues = map((option) => option.value, paramValues)
      onChange({
        target: { name, value: paramValues ? arrayOnlyValues : [] },
      })
    } else {
      onChange({
        target: { name, value: paramValues ? paramValues.value : '' },
      })
    }
    setTimeout(() => {
      if (!validator.fieldValid(name)) validator.showMessageFor(name)
      setClassField(getClass())
    }, 100)
  }

  const getClass = useCallback(() => {
    return (validated || touched) && rules && !validator.fieldValid(name)
      ? 'is-invalid'
      : (validated || touched) &&
        ((rules && validator.fieldValid(name)) || !rules)
      ? 'is-valid'
      : ''
  }, [name, rules, touched, validated, validator])

  useEffect(() => {
    if (!loading && validator) {
      validator.hideMessageFor(name)
    }
  }, [name, validator, loading])

  useEffect(() => {
    if (!loading) {
      setClassField(getClass())
    }
  }, [getClass, loading])

  return (
    <ReactPlaceholder
      showLoadingAnimation={true}
      type="text"
      ready={!loading}
      rows={rows}
    >
      <Form.Group controlId={name} className={classField}>
        <Form.Label>{label}</Form.Label>
        <Select
          name={name}
          value={setValue()}
          options={options}
          isClearable={isClearable || false}
          placeholder={t(placeHolderSelect)}
          onBlur={onBlurLocal}
          onChange={setOnChange}
          classNamePrefix="react-select"
          isDisabled={disabled}
          isMulti={isMulti}
        />
        {rules && validator.message(name, value, rules)}
      </Form.Group>
    </ReactPlaceholder>
  )
}

export default withTranslation(['common'])(SuperSelect)
