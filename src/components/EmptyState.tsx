import React from 'react'
import { Box, Typography, Button } from '@mui/material'
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied'

export default function EmptyState() {
  return (
    <Box sx={{ textAlign: 'center', py: 6 }}>
      <SentimentDissatisfiedIcon sx={{ fontSize: 48, color: 'text.secondary' }} />
      <Typography variant="h6" sx={{ mt: 2 }}>
        No results
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 1, maxWidth: 600, mx: 'auto' }}>
        We could not find any anime matching that query. Try different keywords or remove filters.
      </Typography>
      <Box sx={{ mt: 2 }}>
        <Button variant="contained" onClick={() => window.location.reload()}>
          Reset
        </Button>
      </Box>
    </Box>
  )
}
