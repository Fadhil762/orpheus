import React, { useEffect } from 'react'
import { useParams, Link as RouterLink } from 'react-router-dom'
import { Container, Typography, Box, CircularProgress, Grid, Chip, Button, Skeleton } from '@mui/material'
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks'
import { fetchAnime } from './animeSlice'

export default function AnimeDetail() {
  const { id } = useParams<{ id: string }>()
  const dispatch = useAppDispatch()
  const { data, loading, error } = useAppSelector((s) => s.anime)

  useEffect(() => {
    if (!id) return
    dispatch(fetchAnime(id))
  }, [id, dispatch])

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {loading && (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      )}

      {error && <Typography color="error">{error}</Typography>}

      {data && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
              {data.images?.jpg?.image_url && (
                <Box sx={{ width: '100%' }}>
                  <Skeleton variant="rectangular" animation="wave" sx={{ display: data ? 'block' : 'none' }} />
                  <Box
                    component="img"
                    src={data.images.jpg.image_url}
                    alt={`${data.title} cover`}
                    loading="lazy"
                    sx={{ width: '100%', borderRadius: 1 }}
                    onLoad={(e: any) => {
                      const img = e.currentTarget as HTMLImageElement
                      img.style.opacity = '1'
                    }}
                  />
                </Box>
              )}
          </Grid>

          <Grid item xs={12} md={8}>
            <Typography variant="h4" component="h1">
              {data.title}
            </Typography>

            <Box sx={{ mt: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {data.type && <Chip label={data.type} size="small" />}
              {data.episodes != null && <Chip label={`Episodes: ${data.episodes}`} size="small" />}
              {data.score != null && <Chip label={`Score: ${data.score}`} size="small" />}
            </Box>

            {data.genres && data.genres.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2">Genres</Typography>
                <Box sx={{ mt: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {data.genres.map((g: any) => (
                    <Chip key={g.mal_id ?? g.name} label={g.name} size="small" />
                  ))}
                </Box>
              </Box>
            )}

            <Box sx={{ mt: 2 }}>
              <Typography>{data.synopsis}</Typography>
            </Box>

            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
              {data.url && (
                <Button component={RouterLink} to={data.url} target="_blank" rel="noopener" variant="outlined">
                  Read on MyAnimeList
                </Button>
              )}
              <Button component={RouterLink} to="/" variant="text">
                Back to search
              </Button>
            </Box>
          </Grid>
        </Grid>
      )}
    </Container>
  )
}
