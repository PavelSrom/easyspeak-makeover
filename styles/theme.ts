import { createTheme } from '@mui/material/styles'
import { red } from '@mui/material/colors'

export const theme = createTheme({
  palette: {
    primary: {
      main: '#FF0000',
    },
    secondary: {
      main: '#19857b',
    },
    error: {
      main: red.A400,
    },
  },
})
