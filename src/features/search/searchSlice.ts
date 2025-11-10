import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { searchAnime, AnimeSummary } from '../../api/jikan'

type SearchState = {
  query: string
  page: number
  results: AnimeSummary[]
  lastPage: number
  loading: boolean
  error?: string | null
}

const initialState: SearchState = {
  query: '',
  page: 1,
  results: [],
  lastPage: 1,
  loading: false,
  error: null,
}

export const fetchSearch = createAsyncThunk(
  'search/fetch',
  async ({ query, page }: { query: string; page: number }, thunkAPI) => {
    const res = await searchAnime(query, page, thunkAPI.signal)
    return { data: res.data, pagination: res.pagination }
  }
)

const slice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setQuery(state, action: PayloadAction<string>) {
      state.query = action.payload
    },
    setPage(state, action: PayloadAction<number>) {
      state.page = action.payload
    },
    clearResults(state) {
      state.results = []
      state.lastPage = 1
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSearch.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchSearch.fulfilled, (state, action) => {
        state.loading = false
        state.results = action.payload.data
        state.lastPage = action.payload.pagination?.last_visible_page ?? 1
      })
      .addCase(fetchSearch.rejected, (state, action) => {
        state.loading = false
        // Ignore abort errors (user cancelled search) to avoid showing 'Aborted' to users
        const msg = action.error?.message ?? ''
        if (/abort(ed)?/i.test(msg)) {
          state.error = null
        } else {
          state.error = msg || 'Error'
        }
      })
  },
})

export const { setQuery, setPage, clearResults } = slice.actions

export default slice.reducer
