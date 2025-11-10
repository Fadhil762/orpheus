import React from 'react'
import { AppBar, Toolbar, Typography, Box } from '@mui/material'
import logoUrl from '../assets/orpheus-logo.svg'

export default function Header() {
  return (
    <AppBar position="static" color="primary" elevation={1}>
      <Toolbar sx={{ gap: 2, py: { xs: 0.5, sm: 1 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box
            component="img"
            src={logoUrl}
            alt="Orpheus logo"
            sx={{ width: { xs: 22, sm: 28 }, height: { xs: 22, sm: 28 }, display: 'block' }}
          />
          <Typography variant="h6" component="div" sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>
            Orpheus
          </Typography>
        </Box>
        <Typography variant="body2" color="inherit" sx={{ ml: 2, display: { xs: 'none', sm: 'block' } }}>
          Gateway to information about your favorite anime
        </Typography>
      </Toolbar>
    </AppBar>
  )
}
