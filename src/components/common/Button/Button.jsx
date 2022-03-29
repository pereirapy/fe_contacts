import React from 'react'
import { Button } from 'react-bootstrap'
import Icon from '../Icon/Icon'

export default function ButtonComponent({
  variant = 'primary',
  loading = false,
  submitting = false,
  disabled,
  text = '',
  textLoading = '',
  onClick,
  iconName,
  as,
  to,
  title,
  className,
  style,
  margin = true,
}) {
  const newClassName = `${margin ? ' m-1 ' : ''}${className || ''}`
  return (
    <Button
      title={title}
      as={as}
      to={to}
      disabled={disabled}
      variant={variant}
      onClick={onClick}
      className={newClassName}
      style={style}
    >
      {iconName && <Icon noMarginRight={Boolean(!text)} name={iconName} />}
      {loading || submitting ? textLoading : text}
    </Button>
  )
}
