# VinylStore

VinylStore is a static frontend for displaying a record collection. The project started with a static dataset in [scripts/collection.js](scripts/collection.js) and now also supports loading your personal Discogs collection while keeping the current card layout and local UI interactions.

## Branches

- `main`: static baseline
- `feature/discogs-private-library`: Discogs integration and private library work
- Tag `static-v1`: snapshot of the original static state before the Discogs work started

## Project Structure

- [index.html](index.html): page shell and script loading order
- [script.js](script.js): bootstrap entry point
- [scripts/collection.js](scripts/collection.js): static fallback collection data
- [scripts/template.js](scripts/template.js): HTML templates for cards and comments
- [scripts/storage.js](scripts/storage.js): localStorage helpers
- [scripts/discogs-config.js](scripts/discogs-config.js): Discogs configuration
- [scripts/discogs.js](scripts/discogs.js): Discogs fetch, pagination, mapping, fallback handling
- [scripts/collection-ui.js](scripts/collection-ui.js): rendering and UI interactions

## Discogs Setup

Edit [scripts/discogs-config.js](scripts/discogs-config.js) and set at least your Discogs username:

```js
const DISCOGS_CONFIG = {
  enabled: true,
  username: "your-discogs-name",
  token: "",
  folderId: 0,
  page: 1,
  perPage: 100,
};
```

### Config Fields

- `enabled`: turns Discogs loading on or off
- `username`: Discogs username whose collection should be loaded
- `token`: optional personal access token
- `folderId`: Discogs collection folder, `0` is the default All folder
- `page`: start page for loading
- `perPage`: number of items per request, max 100

If `username` is empty, the app stays on the static or locally cached collection.

## Current Behavior

- Discogs data is mapped to the existing UI model
- Likes, comments, and favorites stay local in `localStorage`
- If Discogs fails, the app falls back to local or static data
- A status box above the collection shows whether static data, loading, success, or fallback is active
- Pagination is supported and loads all available pages starting from `page`

## Important Note About Discogs Auth

This project is currently a static frontend. That means:

- a token in [scripts/discogs-config.js](scripts/discogs-config.js) is visible in the browser and should only be used for private experiments
- a production-ready version should use a small backend or proxy for secure token handling
- some Discogs API behavior is easier to control server-side, especially authentication, headers, and rate-limit handling

## Local Development

You can open the project directly in the browser, but a local server is recommended.

Example with VS Code Live Server or any simple static server.

## Next Steps

- Move Discogs credentials out of the frontend and behind a backend proxy
- Add better empty states and retry controls
- Add filtering, sorting, and search for larger collections
