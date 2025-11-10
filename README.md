# Orpheus

Orpheus is a single-page anime search app built with React + TypeScript. It provides a fast, responsive search experience across two pages: a search page with server-side pagination and an anime detail page. The app uses the Jikan API (Unofficial MyAnimeList API) for anime data.

---

## Project overview

- Two pages:
  - Search page: displays paginated search results and provides an instant search input with debouncing and request cancellation.
  - Detail page: shows details for the selected anime.
- API: https://docs.api.jikan.moe/#section/Information

Core constraints and stack
- React 18+ (hooks only)
- TypeScript
- react-router-dom for navigation
- Redux for state management
- UI library of your choice (e.g., MUI, Chakra UI, Ant Design)
- Single Page App only — no Next.js

Functionality highlights
- Server-side pagination on the search page (request pages from the API).
- Instant search with debouncing (250ms) and cancellation of in-flight requests when the user continues typing.
- All application state (search state, pagination, selected anime) managed via Redux.

Development setup (requirements)
- Use npm only. Do not use yarn or pnpm.
- Project must run with only these commands:

```bash
npm install
npm run dev
```

- The dev server must start on port 4000. Ensure the dev script or dev server configuration binds to port 4000 (example for Vite: `vite --port 4000`).
- Do not use environment variables — repository should work after installation out of the box.

Routing
- '/' — Search page (with query param handling for page and query, e.g. `/?q=naruto&page=2`).
- '/anime/:id' — Detail page for a single anime.

Contract (short)
- Inputs: user keystrokes in the search bar and pagination controls.
- Outputs: paginated list of anime search results and an anime detail view.
- Error modes: network errors, API rate-limits, empty results.
- Success criteria: debounce and cancel behavior works, server-side pagination works, redux holds search and pagination state, page navigation works.

Key implementation notes

- Debounce and cancellation
  - Debounce interval: 250ms.
  - Cancel any in-flight API request when the user continues typing.
  - Recommended approach: use the browser Fetch API + AbortController (native) or axios with cancellation. Example pattern with AbortController:

```ts
// useDebouncedSearch.ts (concept)
import { useEffect, useRef, useState } from 'react';

export function useDebouncedSearch(query: string, delay = 250) {
  const [debounced, setDebounced] = useState(query);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => setDebounced(query), delay);
    return () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    };
  }, [query, delay]);

  return debounced;
}

// Example of using AbortController in a thunk / effect:
// - create a new AbortController for each API call
// - attach signal to fetch
// - call controller.abort() when cancelling
```

- Server-side pagination
  - The search page must request pages from the API instead of fetching all results at once.
  - Use Redux to keep track of current page, total pages (if supplied by API), and active query.
  - Example URL pattern (depends on API): `GET /anime?q={query}&page={page}`

- Redux usage
  - Keep minimal UI state locally (e.g., controlled input value), but keep canonical search state (current query, debounced query or current results, current page, results list, loading state, error state) in Redux.
  - Use Redux Toolkit (recommended) with typed slices and createAsyncThunk for API calls.
  - Provide selectors for list, currentPage, totalPages, isLoading, error.

Typescript guidance
- Provide types for API responses. Avoid `any` — prefer generated or hand-written interfaces matching the Jikan API.
- Example minimal types:

```ts
export interface AnimeSummary {
  mal_id: number;
  title: string;
  url: string;
  image_url?: string;
  // add more fields you rely on
}

export interface SearchResponse {
  results: AnimeSummary[];
  pagination?: { has_next_page: boolean; current_page: number; last_visible_page?: number };
}
```

Folder structure suggestion

```
src/
  api/                # api client (fetch helpers), typed responses
  app/                # redux store setup
    store.ts
  features/
    search/
      searchSlice.ts
      SearchPage.tsx
      SearchResults.tsx
      SearchBar.tsx
    anime/
      animeSlice.ts
      AnimeDetail.tsx
  components/
    UI/                # small reusable presentational components (Card, Spinner, Pagination)
  hooks/
    useDebouncedValue.ts
  routes/
    AppRoutes.tsx
  types/
    index.ts
  main.tsx
  App.tsx
```

Components & responsibilities
- `SearchBar` — controlled input that updates local input state and triggers redux action with debounced value.
- `SearchResults` — lists paginated results and renders `Pagination` controls.
- `Pagination` — dispatches page change actions (stored in redux).
- `AnimeDetail` — fetches and displays details for a given `mal_id` (or id). Prefer re-using the API client and typed responses.

Performance and best practices
- Memoize list items where helpful (React.memo) to avoid unnecessary re-renders.
- Keep heavy logic in Redux thunks or in custom hooks so components stay declarative/presentational.
- Use selective selectors (reselect) to avoid unnecessary recomputation.

Testing and quality
- Add unit tests for:
  - debounce hook
  - searchSlice reducers and async thunks (mock API)
  - a smoke test for SearchPage rendering

Linting and formatting
- Add ESLint + Prettier (recommended). Use TypeScript rules and React hooks rules (eslint-plugin-react-hooks).

Developer checklist (PR review)
- All features work as described: instant search, cancellation, server-side pagination, navigation.
- TypeScript usage with minimal `any`.
- Folder structure follows separation of concerns and is easy to extend.
- Dev server runs on port 4000 with `npm run dev`.

Next steps & optional improvements
- Add example `package.json` scripts or a Vite setup that binds to port 4000 if you want me to scaffold it.
- Add ESLint/Prettier config and a simple test runner (Vitest or Jest + React Testing Library).

Contact / Contributing
- If you'd like, I can scaffold the project (Vite + TypeScript + React 18 + Redux Toolkit) and wire the dev server to port 4000 so everything runs out of the box. Ask me to scaffold and I'll create the app, scripts, and a minimal working example.

---

Created with the Orpheus project guidelines in mind — if you want, I can now scaffold a starter repository (Vite + RTK + react-router-dom + chosen UI library) that fulfills all constraints and run it locally to verify the dev server runs on port 4000.
