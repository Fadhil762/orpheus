export type AnimeSummary = {
  mal_id: number
  title: string
  images?: { jpg?: { image_url?: string } }
  synopsis?: string
  episodes?: number
  score?: number
  url?: string
}

export type SearchResponse = {
  data: AnimeSummary[]
  pagination?: { last_visible_page?: number; has_next_page?: boolean }
}

const BASE = 'https://api.jikan.moe/v4'

export async function searchAnime(query: string, page = 1, signal?: AbortSignal) {
  const q = encodeURIComponent(query)
  const res = await fetch(`${BASE}/anime?q=${q}&page=${page}`, { signal })
  if (!res.ok) throw new Error(`API error ${res.status}`)
  const json: SearchResponse = await res.json()
  return json
}

export async function getAnimeById(id: string | number, signal?: AbortSignal) {
  const res = await fetch(`${BASE}/anime/${id}`, { signal })
  if (!res.ok) throw new Error(`API error ${res.status}`)
  const json = await res.json()
  return json.data
}
