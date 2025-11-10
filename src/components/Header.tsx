import React from 'react'
import { AppBar, Toolbar, Typography, Box, useTheme } from '@mui/material'
import logoUrl from '../assets/orpheus-logo.svg'

export default function Header() {
  const theme = useTheme()

  return (
    <AppBar position="static" color="primary" elevation={1}>
      <Toolbar sx={{ gap: 2, py: { xs: 0.5, sm: 1 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box component="img" src={logoUrl} alt="Orpheus logo" sx={{ width: { xs: 34, sm: 44 }, height: { xs: 34, sm: 44 } }} />
          <Typography
            variant="h6"
            component="div"
            sx={{
              fontSize: { xs: '0.95rem', sm: '1.15rem' },
              fontWeight: 700,
              color: theme.palette.common.white,
              ml: 0.5,
            }}
          >
            Orpheus
          </Typography>
        </Box>
        <Typography variant="body2" color="inherit" sx={{ ml: 2, display: { xs: 'none', sm: 'block' } }}>
          Information gateway to your favorite anime
        </Typography>
      </Toolbar>
    </AppBar>
  )
}
