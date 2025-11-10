# Orpheus

Orpheus is a lightweight single-page application for discovering anime titles and viewing detailed information for each entry. The app is designed for fast, interactive searching with instant feedback and smooth transitions from search results to detail pages.

This repository contains the client-side application (frontend) and a small set of conventions and implementation notes intended to help contributors get started quickly.

## What Orpheus does

- Provide instant search-as-you-type for anime titles with client-side debouncing to reduce unnecessary requests.
- Cancel in-flight requests when a new search is issued so the UI stays responsive and avoids race conditions.
- Present paginated search results sourced from the Jikan (MyAnimeList) API and show a focused detail view for each anime with synopsis, genres, episodes, and a link to the MyAnimeList page.
- Prioritize accessibility and responsive layout so the app works well across desktop and mobile.

## Key features

- Debounced search input (short delay for immediate typing feedback).
- AbortController-driven cancellation of in-flight HTTP requests.
- Server-side pagination support and lightweight client-side paging controls.
- Skeleton loaders and lazy-loaded poster images to improve perceived performance.
- Truncated synopsis with a 'Read more' expand/collapse control for long descriptions.
- Accessible controls (ARIA attributes on toggle buttons, keyboard navigable focus states).

## Quick start (local development)

These commands work from the repository root. They assume Node.js and npm are available on your system.

PowerShell (Windows) / POSIX (macOS, Linux) commands:

```powershell
# install dependencies
npm install

# start dev server (Vite) — the app uses the configured dev port (4000)
npm run dev

# build for production
npm run build

# preview production build locally
npm run preview
```

If you encounter peer-dependency resolution errors during `npm install`, try:

```powershell
npm install --legacy-peer-deps
```

That resolves many peer resolution problems when using npm v7+ in mixed-version environments.

## Configuration & environment

- No API key is required to run the app locally — it uses the public Jikan endpoints. Be mindful of any rate limits and use the app responsibly.
- Dev server runs on port 4000 by default (see `package.json` / Vite config).

## How to use the app

- Type an anime title into the search box. Searches are debounced for a short interval to minimize spurious requests while typing.
- Use the pagination controls to move through server-side pages of results.
- Click a card or the "Details" action to open the anime detail page with a longer synopsis, genres and a link to the MyAnimeList entry.

## Architecture & implementation notes

This section is intended for contributors and maintainers to quickly understand the important design decisions.

- Networking: the app uses the browser fetch API with AbortController for cancellable requests. Each async thunk or request that issues network traffic accepts an AbortSignal so in-flight requests can be aborted when no longer relevant.
- Search behavior: a short client-side debounce (250ms) waits for typing to pause before dispatching the search action. Rapid typing cancels previous requests to avoid showing stale results.
- State: a centralized store keeps search and selected anime detail state. Async operations are implemented as thunks so they integrate with request cancellation and error handling.
- UI: components use lightweight skeleton placeholders while data is loading and lazy-load images to reduce bandwidth and improve perceived performance.

Edge cases handled intentionally:

- Aborted fetches are suppressed and do not surface as user-facing error messages.
- Empty search results show a friendly empty state with suggestions.
- Long descriptions are truncated in lists to keep the results compact; the detail page shows the full content.

## API attribution and rate limits

Orpheus consumes public data via the Jikan API, which aggregates information from MyAnimeList. When using this app or extending it, please:

- Respect Jikan and MyAnimeList terms of service and any applicable rate limits.
- Consider server-side caching or a small backend proxy if you expect high volumes to avoid hitting public API rate limits from many clients.

## Troubleshooting

- If the dev server fails to start due to plugin ESM/require errors (common with certain versions of Vite / plugin dependencies), the repository contains a workaround in the Vite config that dynamically imports the React plugin. If you still hit issues, try:

	- `npm install --legacy-peer-deps`
	- Delete `node_modules` and `package-lock.json`, then reinstall.

- If you see an "Aborted" error in the UI while typing quickly, that should be suppressed by the app — but if you see any unexpected errors, open the browser devtools console and copy the stack trace into an issue.

## Contributing

Contributions are welcome. A minimal workflow:

1. Fork the repo and create a feature branch (e.g., `feature/search-improvement`).
2. Run the app locally and add or update code.
3. Keep changes focused and add tests for new behaviors when practical.
4. Open a pull request describing the change and include screenshots or a short recording if the change affects UI/UX.

Suggested small improvements you can contribute right away:

- Add a test harness (Vitest) and unit tests for the search slice and the debounce hook.
- Add ESLint + Prettier configuration and a simple GitHub Actions workflow for CI.
- Export the logo to standard favicons and add a small `manifest.json` for PWA support.

## Project structure (high level)

- `src/` — application source code. Notable directories:
	- `src/api/` — network helpers and typed fetch wrappers.
	- `src/app/` — store setup and global wiring.
	- `src/features/search/` — search slice, page and result components.
	- `src/features/anime/` — detail slice and detail page.
	- `src/components/` — shared presentational components (Header, Footer, EmptyState, Pagination, etc.)

## License & acknowledgements

This project is provided under the MIT License. If you intend to adopt a different license, add a `LICENSE` file at the repository root.

Data and images are provided by the Jikan API and MyAnimeList — see https://jikan.moe/ for API documentation and terms.

## Contact / Help

If you need help or want to discuss features, open an issue and tag it with `help wanted` or `discussion`. For quick clarifications, include the OS, Node/npm versions, and the exact console output for any errors.

---

Thank you for checking out Orpheus — if you'd like, I can also add a Contributors guide, CI pipeline, or test harness next.

