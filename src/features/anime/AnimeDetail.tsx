import React, { useEffect, useState } from 'react'
import { useParams, Link as RouterLink } from 'react-router-dom'
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Grid,
  Chip,
  Button,
  Skeleton,
  Breadcrumbs,
  Tooltip,
  IconButton,
} from '@mui/material'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import StarIcon from '@mui/icons-material/Star'
import TvIcon from '@mui/icons-material/Tv'
import ScheduleIcon from '@mui/icons-material/Schedule'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks'
import { fetchAnime } from './animeSlice'
// keep type import available for future stricter props; eslint will allow unused types
// (type-only import intentionally omitted to avoid unused-type lint noise)

export default function AnimeDetail() {
  const { id } = useParams<{ id: string }>()
  const dispatch = useAppDispatch()
  const { data, loading, error } = useAppSelector((s) => s.anime)
  const [showTrailer, setShowTrailer] = useState(false)
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    if (!id) return
    dispatch(fetchAnime(id))
  }, [id, dispatch])

  // SEO & Social meta: set document title, open graph tags and JSON-LD when data loads
  useEffect(() => {
    if (!data) return

    const title = data.title
    const description = data.synopsis ?? ''
    const image = data.images?.jpg?.image_url || data.images?.webp?.image_url || '/favicon-192.png'

    document.title = `${title} — Orpheus`

    // helper to upsert meta
    function upsertMeta(name, content, attr = 'property') {
      let m = document.head.querySelector(`meta[${attr}="${name}"]`)
      if (!m) {
        m = document.createElement('meta')
        m.setAttribute(attr, name)
        document.head.appendChild(m)
      }
      m.setAttribute('content', content)
    }

    upsertMeta('og:title', title)
    upsertMeta('og:description', description)
    upsertMeta('og:image', image)
    upsertMeta('og:type', 'website')
    upsertMeta('twitter:card', 'summary_large_image', 'name')
    upsertMeta('twitter:title', title, 'name')
    upsertMeta('twitter:description', description, 'name')
    upsertMeta('twitter:image', image, 'name')

    // JSON-LD structured data
    const ld = {
      '@context': 'https://schema.org',
      '@type': 'Movie',
      name: data.title,
      image: image,
      description: description,
      url: `https://your-app-host/${data.mal_id}`,
      genre: data.genres?.map((g) => g.name) ?? undefined,
    }

    let ldScript = document.getElementById('orpheus-jsonld')
    if (!ldScript) {
      ldScript = document.createElement('script')
      ldScript.id = 'orpheus-jsonld'
      ldScript.type = 'application/ld+json'
      document.head.appendChild(ldScript)
    }
    ldScript.textContent = JSON.stringify(ld)

    return () => {
      // optional: cleanup meta tags (left for persistence) — we won't remove to allow back/forward
    }
  }, [data])

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
            <Box sx={{ position: { md: 'sticky' }, top: { md: 92 }, alignSelf: 'flex-start' }}>
              {data.images?.jpg?.image_url ? (
                <Box sx={{ width: { xs: '100%', md: 260 } }}>
                  <Skeleton variant="rectangular" animation="wave" sx={{ display: loading ? 'block' : 'none', height: 360 }} />
                  {/* picture element with webp source (if available) to provide better compressed variant */}
                  <Box sx={{ position: 'relative' }}>
                    {/* low-quality blurred placeholder using same image URL as a quick LQIP */}
                    <Box
                      sx={{
                        width: '100%',
                        height: 360,
                        backgroundImage: `url(${data.images.jpg.image_url})`,
                        backgroundSize: 'cover',
                        filter: 'blur(12px) saturate(0.8)',
                        transform: 'scale(1.03)',
                        borderRadius: 1,
                        display: !loading ? 'none' : 'block',
                      }}
                    />

                    <picture>
                      {data.images.webp?.image_url && <source srcSet={data.images.webp.image_url} type="image/webp" />}
                      <Box
                        component="img"
                        src={data.images.jpg.image_url}
                        alt={`${data.title} cover`}
                        loading="lazy"
                        sx={{ width: '100%', borderRadius: 1, position: 'relative' }}
                        onLoad={(e: React.SyntheticEvent<HTMLImageElement>) => {
                          const img = e.currentTarget as HTMLImageElement
                          img.style.opacity = '1'
                        }}
                      />
                    </picture>
                  </Box>
                </Box>
              ) : (
                <Skeleton variant="rectangular" sx={{ width: { xs: '100%', md: 260 }, height: 360 }} />
              )}

              {/* Trailer thumbnail / lazy iframe */}
              {data.trailer?.youtube_id && (
                <Box sx={{ mt: 2 }}>
                  {!showTrailer ? (
                    <Box
                      role="button"
                      tabIndex={0}
                      aria-label={`Play trailer for ${data.title}`}
                      onClick={() => setShowTrailer(true)}
                      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setShowTrailer(true)}
                      sx={{ position: 'relative', cursor: 'pointer', borderRadius: 1, overflow: 'hidden' }}
                    >
                      <Box
                        component="img"
                        src={`https://img.youtube.com/vi/${data.trailer.youtube_id}/hqdefault.jpg`}
                        alt={`Trailer thumbnail for ${data.title}`}
                        loading="lazy"
                        sx={{ width: '100%', display: 'block' }}
                      />
                      <IconButton
                        aria-label="Play trailer"
                        sx={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'rgba(0,0,0,0.45)', color: 'white' }}
                      >
                        <PlayArrowIcon />
                      </IconButton>
                    </Box>
                  ) : (
                    <Box sx={{ position: 'relative', pt: '56.25%' }}>
                      <Box
                        component="iframe"
                        src={`https://www.youtube.com/embed/${data.trailer.youtube_id}?autoplay=1&rel=0`}
                        title={`Trailer for ${data.title}`}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        loading="lazy"
                        sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
                      />
                    </Box>
                  )}
                </Box>
              )}
            </Box>
          </Grid>

          <Grid item xs={12} md={8}>
            <Breadcrumbs aria-label="breadcrumb">
              <RouterLink to="/">Home</RouterLink>
              <RouterLink to="/">Search</RouterLink>
              <Typography color="text.primary">{data.title}</Typography>
            </Breadcrumbs>

            <Typography variant="h4" component="h1" sx={{ mt: 1 }}>
              {data.title}
            </Typography>

            <Box sx={{ mt: 1, display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
              {data.type && (
                <Tooltip title={data.type}>
                  <Chip icon={<TvIcon />} label={data.type} size="small" tabIndex={0} />
                </Tooltip>
              )}
              {data.episodes != null && (
                <Chip icon={<ScheduleIcon />} label={`Episodes: ${data.episodes}`} size="small" tabIndex={0} />
              )}
              {data.score != null && (
                <Chip icon={<StarIcon />} label={String(data.score)} size="small" tabIndex={0} />
              )}
              {data.studios && data.studios.length > 0 && (
                <Tooltip title={data.studios.map((s) => s.name).join(', ')}>
                  <Chip label={data.studios.map((s) => s.name).join(', ')} size="small" tabIndex={0} />
                </Tooltip>
              )}
            </Box>

            {data.genres && data.genres.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2">Genres</Typography>
                <Box sx={{ mt: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {data.genres.map((g) => (
                    <Chip key={g.mal_id ?? g.name} label={g.name} size="small" tabIndex={0} />
                  ))}
                </Box>
              </Box>
            )}

            <Box sx={{ mt: 2 }}>
              {/* Accessible read-more for synopsis */}
              <Box id={`synopsis-${data.mal_id}`}>
                {!expanded ? (
                  <>{/* show first 400 chars or first paragraph */}
                    {data.synopsis ? (
                      <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'left' }}>
                        {data.synopsis.length > 400 ? `${data.synopsis.slice(0, 400)}...` : data.synopsis}
                      </Typography>
                    ) : (
                      <Typography variant="body1" color="text.secondary">
                        No description available.
                      </Typography>
                    )}
                  </>
                ) : (
                  <Box>
                    {data.synopsis
                      ? data.synopsis.split(/\n\s*\n/).map((p, i) => (
                          <Typography key={i} paragraph variant="body1" color="text.secondary">
                            {p}
                          </Typography>
                        ))
                      : (
                        <Typography variant="body1" color="text.secondary">
                          No description available.
                        </Typography>
                      )}
                  </Box>
                )}

                <Box sx={{ mt: 1 }}>
                  <Button
                    size="small"
                    onClick={() => setExpanded((s) => !s)}
                    aria-expanded={expanded}
                    aria-controls={`synopsis-${data.mal_id}`}
                  >
                    {expanded ? 'Show less' : 'Read more'}
                  </Button>
                </Box>
              </Box>
            </Box>

            <Box sx={{ mt: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              {data.url && (
                <Button href={data.url} target="_blank" rel="noopener" variant="outlined" startIcon={<OpenInNewIcon />}>
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
