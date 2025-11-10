import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { getAnimeById } from '../../api/jikan'
import { AnimeDetail } from '../../api/jikan'

type AnimeState = {
  data: AnimeDetail | null
  loading: boolean
  error?: string | null
}

const initialState: AnimeState = { data: null, loading: false, error: null }

export const fetchAnime = createAsyncThunk<AnimeDetail, string>('anime/fetch', async (id: string, thunkAPI) => {
  const res = await getAnimeById(id, thunkAPI.signal)
  return res
})

const slice = createSlice({
  name: 'anime',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAnime.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchAnime.fulfilled, (state, action) => {
        state.loading = false
        state.data = action.payload
      })
      .addCase(fetchAnime.rejected, (state, action) => {
        state.loading = false
        const msg = action.error?.message ?? ''
        if (/abort(ed)?/i.test(msg)) {
          state.error = null
        } else {
          state.error = msg || 'Error'
        }
      })
  },
})

export default slice.reducer
