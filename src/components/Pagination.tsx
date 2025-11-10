import React from 'react'
import { Pagination } from '@mui/material'

export default function PaginationControls({
  current,
  last,
  onChange,
}: {
  current: number
  last: number
  onChange: (_page: number) => void
}) {
  return <Pagination page={current} count={Math.max(1, last)} onChange={(e, page) => onChange(page)} />
}
