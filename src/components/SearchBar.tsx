import React from 'react'
import { TextField, Box } from '@mui/material'

type Props = {
  value: string
  onChange: (_: string) => void
}

export default function SearchBar({ value, onChange }: Props) {
  return (
    <Box mb={2}>
      <TextField
        fullWidth
        label="Search anime"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        variant="outlined"
      />
    </Box>
  )
}
