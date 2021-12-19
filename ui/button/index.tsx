import clsx from 'clsx'
import Link from 'next/link'
import {
  Button as MuiButton,
  ButtonProps as MuiButtonProps,
  CircularProgress,
} from '@mui/material'
import { Theme } from '@mui/material/styles'
import makeStyles from '@mui/styles/makeStyles'

type ThemeProps = {
  color?:
    | 'info'
    | 'error'
    | 'inherit'
    | 'primary'
    | 'secondary'
    | 'success'
    | 'warning'
}

const useStyles = makeStyles<Theme, ThemeProps>(() => ({
  buttonProgress: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
    color: 'inherit',
  },
}))

export type ButtonProps = Omit<MuiButtonProps, 'color'> & {
  color?:
    | 'info'
    | 'error'
    | 'inherit'
    | 'primary'
    | 'secondary'
    | 'success'
    | 'warning'
  loading?: boolean
  component?: React.ElementType
  href?: string
}

export const Button = ({
  color,
  variant = 'contained',
  loading = false,
  href,
  className,
  children,
  ...rest
}: ButtonProps) => {
  const classes = useStyles({ color })

  const button = (
    <MuiButton
      color={color}
      variant={variant}
      disabled={loading}
      className={clsx({
        'text-white': variant === 'contained',
        [className!]: !!className,
      })}
      {...rest}
    >
      {loading && (
        <CircularProgress size={24} className={classes.buttonProgress} />
      )}
      {children}
    </MuiButton>
  )

  return href ? <Link href={href}>{button}</Link> : button
}
