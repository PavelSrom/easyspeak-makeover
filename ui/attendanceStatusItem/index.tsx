import { makeStyles } from '@mui/styles'
import clsx from 'clsx'
import React from 'react'
import { theme } from 'styles/theme'

const useStyles = makeStyles({
  box: {
    display: 'flex',
    gap: 4,
    border: 1,
    borderStyle: 'solid',
    borderRadius: 5,
    paddingTop: 4,
    paddingBottom: 4,
    paddingLeft: 8,
    paddingRight: 8,
  },
  success: {
    color: theme.palette.success.main,
    borderColor: theme.palette.success.main,
  },
  error: {
    color: theme.palette.error.main,
  },
})

export const AttendanceStatusItem = ({
  status,
  children,
}: {
  status: 'error' | 'success' | 'neutral'
  children: React.ReactNode
}) => {
  const classes = useStyles()
  return <div className={`${classes[status]} ${classes.box}`}>{children}</div>
}
