import { createTheme } from '@mui/material'

const theme = createTheme({
  palette: {
    primary: {
      main: '#1565c0',
    },
  },
  components: {
    MuiAppBar: {
      defaultProps: {
        elevation: 2,
      },
    },
  },
})

export default theme
