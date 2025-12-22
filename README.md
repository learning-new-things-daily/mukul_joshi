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
npm run dev
```

Production build:

```bash
cd portfolio-react
npm ci
npm run build
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

