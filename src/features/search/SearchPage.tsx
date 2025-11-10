import React, { useEffect, useRef } from 'react'
import { Box, Paper, Typography, CircularProgress, Chip, Stack } from '@mui/material'
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks'
import useDebouncedValue from '../../hooks/useDebouncedValue'
import { setQuery, setPage, fetchSearch } from './searchSlice'
import SearchBar from '../../components/SearchBar'
import SearchResults from '../../components/SearchResults'
import PaginationControls from '../../components/Pagination'
import EmptyState from '../../components/EmptyState'

export default function SearchPage() {
  const dispatch = useAppDispatch()
  const { query, page, results, loading, error, lastPage } = useAppSelector((s) => s.search)
  const debounced = useDebouncedValue(query, 250)
  const lastRequestRef = useRef<any>(null)

  useEffect(() => {
    if (!debounced) return
    if (lastRequestRef.current?.abort) lastRequestRef.current.abort()
    const p = dispatch(fetchSearch({ query: debounced, page }))
    lastRequestRef.current = p
    return () => {
      p.abort && p.abort()
    }
  }, [debounced, page, dispatch])

  const popular = ['Naruto', 'One Piece', 'Jujutsu', 'Attack on Titan', 'My Hero Academia']

  return (
    <Box sx={{ py: 4 }}>
      <Paper sx={{ p: { xs: 1, sm: 2 }, mb: 3, borderRadius: 2 }} elevation={1}>
        <SearchBar value={query} onChange={(v) => dispatch(setQuery(v))} />
        <Stack
          direction="row"
          spacing={1}
          sx={{ mt: 1, flexWrap: 'wrap', gap: 1, overflowX: { xs: 'auto', sm: 'visible' }, py: 0.5 }}
        >
          {popular.map((p) => (
            <Chip
              key={p}
              label={p}
              clickable
              onClick={() => dispatch(setQuery(p))}
              variant={p.toLowerCase() === query.toLowerCase() ? 'filled' : 'outlined'}
              sx={{ flex: '0 0 auto' }}
            />
          ))}
        </Stack>
      </Paper>

      {loading && (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      )}

      {error && <Typography color="error">{error}</Typography>}

      {!loading && results.length === 0 ? <EmptyState /> : <SearchResults items={results} />}

      <Box mt={2} display="flex" justifyContent="center">
        <PaginationControls current={page} last={lastPage} onChange={(p) => dispatch(setPage(p))} />
      </Box>
    </Box>
  )
}
