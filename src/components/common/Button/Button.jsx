import React from 'react'
import { Button } from 'react-bootstrap'

import { EIcons } from '../../../enums/icons'

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
  animate = false,
  behavior = 'normal'
}) {
  const newClassName = `${margin ? ' m-1 ' : ''}${className || ''}`
  const label = loading || submitting ? textLoading : text
  const icon = behavior === 'submit' && (loading || submitting) ? EIcons.spinner : iconName

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
      {icon ? (
        <Icon noMarginRight={Boolean(!text)} name={icon} label={label} animate={animate} />
      ) : (
        label
      )}
    </Button>
  )
}
