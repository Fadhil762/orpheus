export type AnimeSummary = {
  mal_id: number
  title: string
  images?: ImageSet
  synopsis?: string
  episodes?: number
  score?: number
  url?: string
}

export type SearchResponse = {
  data: AnimeSummary[]
  pagination?: { last_visible_page?: number; has_next_page?: boolean }
}

export type Genre = { mal_id: number; name: string }

export type ImageSet = { jpg?: { image_url?: string }; webp?: { image_url?: string } }

export type Person = { mal_id?: number; url?: string; images?: ImageSet; name?: string }

export type AnimeDetail = {
  mal_id: number
  url?: string
  title: string
  title_english?: string | null
  title_japanese?: string | null
  images?: ImageSet
  trailer?: { youtube_id?: string; url?: string; embed_url?: string }
  synopsis?: string | null
  background?: string | null
  type?: string | null
  episodes?: number | null
  duration?: string | null
  rating?: string | null
  score?: number | null
  rank?: number | null
  popularity?: number | null
  aired?: { from?: string | null; to?: string | null; string?: string }
  producers?: Person[]
  licensors?: Person[]
  studios?: Person[]
  genres?: Genre[]
}

const BASE = 'https://api.jikan.moe/v4'

export const PAGE_SIZE = 8

export async function searchAnime(query: string, page = 1, signal?: AbortSignal, limit = PAGE_SIZE) {
  const q = encodeURIComponent(query)
  // Jikan supports a 'limit' query param to control items per page
  const res = await fetch(`${BASE}/anime?q=${q}&page=${page}&limit=${limit}`, { signal })
  if (!res.ok) throw new Error(`API error ${res.status}`)
  const json: SearchResponse = await res.json()
  return json
}

export async function getAnimeById(id: string | number, signal?: AbortSignal) {
  const res = await fetch(`${BASE}/anime/${id}`, { signal })
  if (!res.ok) throw new Error(`API error ${res.status}`)
  const json = await res.json()
  const data: AnimeDetail = json.data
  return data
}
