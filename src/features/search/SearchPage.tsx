import React, { useEffect, useRef } from 'react'
import { Box, Paper, Typography, CircularProgress, Chip, Stack } from '@mui/material'
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks'
import useDebouncedValue from '../../hooks/useDebouncedValue'
import { setQuery, setPage, fetchSearch } from './searchSlice'
import SearchBar from '../../components/SearchBar'
import SearchResults from '../../components/SearchResults'
import PaginationControls from '../../components/Pagination'
import EmptyState from '../../components/EmptyState'
import { useSearchParams } from 'react-router-dom'

export default function SearchPage() {
  const dispatch = useAppDispatch()
  const { query, page, results, loading, error, lastPage } = useAppSelector((s) => s.search)
  const debounced = useDebouncedValue(query, 250)
  const lastRequestRef = useRef<{ abort?: () => void } | null>(null)
  const [searchParams, setSearchParams] = useSearchParams()

  useEffect(() => {
    if (!debounced) return
    if (lastRequestRef.current?.abort) lastRequestRef.current.abort()
    const p = dispatch(fetchSearch({ query: debounced, page }))
    lastRequestRef.current = p
    return () => {
      p.abort && p.abort()
    }
  }, [debounced, page, dispatch])

  // read initial q/page from URL on mount
  useEffect(() => {
    const q = searchParams.get('q') || ''
    const p = parseInt(searchParams.get('page') || '1', 10)
    if (q && q !== query) dispatch(setQuery(q))
    if (!Number.isNaN(p) && p !== page) dispatch(setPage(p))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // keep URL in sync with query & page
  useEffect(() => {
    const params: Record<string, string> = {}
    if (query) params.q = query
    if (page && page > 1) params.page = String(page)
    setSearchParams(params)
  }, [query, page, setSearchParams])

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
          {popular.map((p) => {
            const selected = p.toLowerCase() === query.toLowerCase()
            return (
              <Chip
                key={p}
                label={p}
                clickable
                onClick={() => dispatch(setQuery(p))}
                variant={selected ? 'filled' : 'outlined'}
                sx={(theme) => ({
                  flex: '0 0 auto',
                  mr: 1,
                  backgroundColor: selected ? theme.palette.primary.main : 'transparent',
                  color: selected ? theme.palette.primary.contrastText : theme.palette.text.primary,
                  borderColor: selected ? 'transparent' : undefined,
                })}
              />
            )
          })}
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
