# Mukul Joshi Portfolio — DevOps & Usage Guide

## Overview
This repository hosts two parts:
- A static site at the root (HTML/CSS/JS + JSON data).
- A modern React app in `portfolio-react` built with Vite and containerized with Nginx.

CI/CD, Docker, and Compose are included to showcase DevOps practices.

## Folder structure
- `index.html` — root homepage
- `pages/` — all other pages (projects, resumes, posts)
- `assets/`
  - `css/` — shared styles
  - `js/` — renderer scripts
  - `icons/` — favicons and app icons
  - `images/` — social cover and future images
- `data/` — JSON content sources
- `manifest.json`, `sw.js`, `robots.txt`, `sitemap.xml` — remain at root for correct scope and crawler discovery

- `portfolio-react/` — React app
  - `src/` — React source
  - `dist/` — production build output
  - `Dockerfile`, `docker-compose.yml`, `nginx.conf` — container runtime

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

## Quick start (React app)
Requirements: Node.js 20.19+ or 22.12+ (Vite requirement) and npm.

Local development:

```bash
cd portfolio-react
npm ci
# Point the UI at your API (required; app reads data from API)
echo 'VITE_API_BASE_URL=http://localhost:4000' > .env
npm run dev
```

Production build (requires API URL):

```bash
cd portfolio-react
npm ci
VITE_API_BASE_URL=https://<your-api-host> npm run build
```

## Docker
Build and run the containerized app (served by Nginx):

```bash
cd portfolio-react
docker build -t portfolio-react:latest .
docker run -d --rm -p 8080:80 --name portfolio-react portfolio-react:latest
curl -sSf http://localhost:8080/ | head
docker stop portfolio-react
```

## Docker Compose
One-command local orchestration:

```bash
cd portfolio-react
docker compose up --build -d
docker compose down
```

## MongoDB migration (Atlas)
You can migrate the current JSON content to MongoDB Atlas and serve data via an API.

### What I need from you
- Connection string: the full `mongodb+srv://...` URI for your Atlas cluster (Database Access user with password).
- Database name: e.g., `portfolio` (we default to this in scripts).
- Network access: either allow your local IP temporarily to run the seed, or run from a host already allowed in Atlas.
- Optional: the public egress IP(s) of the API host (to add to Atlas IP allowlist when deploying the backend).

### How to seed your data
1. Create `portfolio-react/.env` from the provided example:

  ```bash
  cp portfolio-react/.env.example portfolio-react/.env
  # Edit and set MONGODB_URI and MONGODB_DB
  ```

2. Install dependencies and run the seed script:

  ```bash
  npm --prefix portfolio-react install
  MONGODB_URI="<your-uri>" MONGODB_DB="portfolio" npm --prefix portfolio-react run seed:mongo
  ```

This will upsert documents into two collections: `posts` and `projects`, and create helpful indexes.

### Security best practices
- Create a least-privilege Atlas user with `readWrite` on only your content database (e.g., `portfolio`).
- Keep secrets out of git: `.env` is ignored; only commit `.env.example`.
- Use environment variables in your hosting provider (Render/Railway/Vercel/Azure) to store `MONGODB_URI`.
- Restrict network access in Atlas to the IPs of your API host; remove 0.0.0.0/0 after seeding.
- Rotate credentials periodically; consider short-lived secrets where possible.
- Prefer a backend API (Express/Serverless) over direct client connections to avoid exposing Mongo credentials.

## Makefile (root)
Common DevOps tasks are available via the root `Makefile`:

```bash
# Install, build, and run dev server
make install
make build
make dev

# Build and run via Docker
make docker-build
make docker-run PORT=8080
make docker-stop

# Orchestrate with Compose
make compose-up
make compose-down

# Generate sitemap (root script)
make sitemap

# Clean build output
make clean

# Run local CI steps (lint/test if present + build + sitemap)
make ci-local
```

## CI/CD
GitHub Actions pipeline builds the React app, optionally lints/tests, caches dependencies, and uploads the build artifact. See [.github/workflows/ci.yml](.github/workflows/ci.yml).

## Publishing notes
- If your base path changes on GitHub Pages, update `manifest.json` (`start_url`, `scope`).
- After pushing, validate social cards and test dark mode persistence.
 - Keep `robots.txt` and `sitemap.xml` at the site root to avoid crawler issues.

## Content management (static site)
The static site is data-driven via JSON.

### How to add or edit Projects
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

### How to add or edit Blog posts
- Edit `data/posts.json` and add an object:
  - `title`, `url`, `summary`
  - Optional `date` and `tags`
  - Set `external: true` if the post is on another site (opens in new tab)
- The homepage renders the latest 3 into `#blog-list`.

### Renderer and offline
- `assets/js/app.js` fetches JSON and renders content (progressive enhancement: static noscript fallbacks remain).
- `sw.js` caches core pages, icons, JSON data, and the renderer for offline resume access.

