import { createTheme } from '@mui/material/styles'
import { red } from '@mui/material/colors'

export const theme = createTheme({
  palette: {
    primary: {
      main: '#004662',
    },
    secondary: {
      main: '#F0802B',
    },
    error: {
      main: red.A400,
    },
  },
})
