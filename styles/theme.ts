import { createTheme } from '@mui/material/styles'
import { red } from '@mui/material/colors'

export const theme = createTheme({
  palette: {
    neutral: {
      light: '#EBEBEB',
      main: '#757575',
      dark: '#515151',
    },
    primary: {
      light: '#009FB2',
      main: '#004662',
    },
    secondary: {
      light: '#FF9060',
      main: '#F0802B',
      dark: '#C75E00',
    },
    error: {
      main: red.A400,
      dark: '#940000',
    },
    success: {
      light: '#DBF9D8',
      main: '#4CAF50',
      dark: '#006B0E',
    },
    info: {
      light: '#F0FAFB',
      main: '#009FB2',
      dark: '#004662',
    },
    text:{
      primary: '#515151',
    }
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
})

declare module '@mui/material/styles' {
  interface Palette {
    neutral: Palette['primary'];
  }

  // allow configuration using `createTheme`
  interface PaletteOptions {
    neutral?: PaletteOptions['primary'];
  }
}
