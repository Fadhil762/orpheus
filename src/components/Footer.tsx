import React from 'react'
import { Box, Typography, Link } from '@mui/material'

export default function Footer() {
  return (
    <Box component="footer" sx={{ mt: 6, py: 3, textAlign: 'center', color: 'text.secondary' }}>
      <Typography variant="body2">
        Data provided by <Link href="https://docs.api.jikan.moe/" target="_blank" rel="noopener">Jikan API</Link>
      </Typography>
      <Typography variant="caption" display="block">&copy;2025 Fadhil Ahmad. All rights reserved.</Typography>
    </Box>
  )
}
