import React from 'react'
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

  const [touched, setTouched] = React.useState(false)

  const onBlurLocal = (e) => {
    setTouched(true)
    //validator.showMessageFor(name);
    if (typeof onBlur === 'function') {
      onBlur(e)
    }
  }
  const parsedValue =
    type === 'date' && moment(value).isValid()
      ? moment(value, 'YYYY-MM-DD')
      : value
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
        onKeyUp={onKeyUp}
        onBlur={onBlurLocal}
        defaultValue={value}
        disabled={disabled}
        className={
          (validated || touched) && rules && !validator.fieldValid(name)
            ? 'is-invalid'
            : (validated || touched) &&
              ((rules && validator.fieldValid(name)) || !rules)
            ? 'is-valid'
            : ''
        }
      />
      {rules && validator.message(name, parsedValue, rules)}
    </Form.Group>
  )
}

export default SuperFormControl
