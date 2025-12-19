# Mukul Joshi Portfolio — Data-driven setup

## How to add or edit Projects
- Edit `data/projects.json` and add an object:
  - `id`: unique anchor id
  - `emoji`: optional emoji marker (e.g., "🔧")
  - `title`: project title
  - `summary`: one-line summary
  - `tags`: array of tags (strings)
  - `outcomes`: array of bullet points
  - `links`: array of `{ label, url }` objects
- The homepage renders cards from this JSON in the `#projects-list` grid.
- Detailed write-ups live in `projects.html` and can link back via `projects.html#<id>`.

## How to add or edit Blog posts
- Edit `data/posts.json` and add an object:
  - `title`, `url`, `summary`
  - Optional `date` and `tags`
  - Set `external: true` if the post is on another site (opens in new tab)
- The homepage renders the latest 3 into `#blog-list`.

## Renderer and offline
- `scripts/app.js` fetches JSON and renders content (progressive enhancement: static noscript fallbacks remain).
- `sw.js` caches core pages, icons, JSON data, and the renderer for offline resume access.

## Publishing notes
- If your base path changes on GitHub Pages, update `manifest.json` (`start_url`, `scope`).
- After pushing, validate social cards and test dark mode persistence.
