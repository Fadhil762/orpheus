import React, { useState } from 'react'
import {
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  Button,
  Box,
  Collapse,
  Skeleton,
} from '@mui/material'
import type { AnimeSummary } from '../api/jikan'
import { Link } from 'react-router-dom'

function ResultCard({ a }: { a: AnimeSummary }) {
  const [expanded, setExpanded] = useState(false)

  const synopsisId = `synopsis-${a.mal_id}`

  const [imageLoaded, setImageLoaded] = useState(false)

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 200ms ease, box-shadow 200ms ease',
        '&:hover': {
          transform: 'translateY(-6px)',
          boxShadow: 6,
        },
      }}
    >
      {a.images?.jpg?.image_url ? (
        <Box sx={{ position: 'relative' }}>
          {!imageLoaded && <Skeleton variant="rectangular" sx={{ height: { xs: 160, sm: 180, md: 220 } }} />}
          <CardMedia
            component="img"
            image={a.images!.jpg!.image_url}
            alt={a.title}
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
            sx={{
              display: imageLoaded ? 'block' : 'none',
              width: '100%',
              height: { xs: 160, sm: 180, md: 220 },
              objectFit: 'cover',
            }}
          />
        </Box>
      ) : (
        <Skeleton variant="rectangular" sx={{ height: { xs: 160, sm: 180, md: 220 } }} />
      )}

  <CardContent sx={{ flex: '1 1 auto' }}>
        <Typography variant="subtitle1" component={Link} to={`/anime/${a.mal_id}`} sx={{ textDecoration: 'none' }}>
          {a.title}
        </Typography>

        <Box sx={{ mt: 1 }}>
          {!expanded && (
            <Typography
              id={synopsisId}
              variant="body2"
              color="text.secondary"
              sx={{
                display: '-webkit-box',
                WebkitLineClamp: 5,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {a.synopsis ?? 'No description available.'}
            </Typography>
          )}

          <Collapse in={expanded} timeout={300} unmountOnExit>
            <Typography variant="body2" color="text.secondary">
              {a.synopsis ?? 'No description available.'}
            </Typography>
          </Collapse>
        </Box>
      </CardContent>

      <CardActions
        sx={{
          justifyContent: 'space-between',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 1,
          px: 2,
          pb: 2,
        }}
      >
        <Button
          size="small"
          onClick={() => setExpanded((s) => !s)}
          aria-expanded={expanded}
          aria-controls={synopsisId}
          sx={{ width: { xs: '100%', sm: 'auto' } }}
        >
          {expanded ? 'Show less' : 'Read more'}
        </Button>
        <Button
          size="small"
          component={Link}
          to={`/anime/${a.mal_id}`}
          variant="contained"
          sx={{ width: { xs: '100%', sm: 'auto' } }}
        >
          View details
        </Button>
      </CardActions>
    </Card>
  )
}

export default function SearchResults({ items }: { items: AnimeSummary[] }) {
  return (
    <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ mt: 1 }}>
      {items.map((a) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={a.mal_id}>
          <ResultCard a={a} />
        </Grid>
      ))}
    </Grid>
  )
}
