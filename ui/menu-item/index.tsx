import {
  MenuItem as MuiMenuItem,
  MenuItemProps as MuiMenuItemProps,
} from '@mui/material'
import clsx from 'clsx'
import React from 'react'
import { Text } from 'ui'

export type MenuItemProps = Omit<MuiMenuItemProps, 'color'> & {
  variant?: 'neutral' | 'danger'
  label?: string
  icon?: JSX.Element
  iconPosition?: 'left' | 'right'
}

export const MenuItem = ({
  variant,
  label,
  icon,
  iconPosition,
  ...rest
}: MenuItemProps) => (
  <MuiMenuItem
    className={clsx('gap-2', {
      'text-error': variant === 'danger',
      'flex-row-reverse': iconPosition === 'right',
    })}
    {...rest}
  >
    {icon}
    <Text>{label}</Text>
  </MuiMenuItem>
)
