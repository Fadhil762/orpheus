import { createTheme } from '@mui/material'

// Palette updated to match badge logo (teal line-art)
const theme = createTheme({
  palette: {
    primary: {
      main: '#1f6f66',
      light: '#4aa89f',
      dark: '#124f4a',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#a7efe0',
      contrastText: '#053532',
    },
    background: {
      default: '#f6fbfb',
      paper: '#ffffff',
    },
    text: {
      primary: '#063935',
    },
  },
  typography: {
    fontFamily: 'Poppins, Roboto, Helvetica, Arial, sans-serif',
    h6: { fontWeight: 700 },
  },
  components: {
    MuiAppBar: {
      defaultProps: {
        elevation: 2,
      },
    },
    MuiButton: {
      styleOverrides: {
        containedPrimary: {
          background: 'linear-gradient(90deg, #1f6f66, #4aa89f)'
        }
      }
    }
  },
})

export default theme
