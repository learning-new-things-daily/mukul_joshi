# Portfolio API (MongoDB)

A minimal Express API that serves portfolio `posts` and `projects` from MongoDB Atlas.

## Endpoints
- GET `/health` — status check
- GET `/meta` — quick stats (counts)
- GET `/posts?tag=&q=&page=&limit=` — list posts with optional tag/search/pagination
- GET `/posts/:slug` — get a single internal post by slug
- GET `/projects` — list projects

## Configuration
Create `.env` from `.env.example`:

```
MONGODB_URI=mongodb+srv://<user>:<pass>@<cluster-host>/portfolio?retryWrites=true&w=majority
MONGODB_DB=portfolio
PORT=4000
# In production, set this to your site origin (e.g., https://learning-new-things-daily.github.io)
CORS_ORIGIN=http://localhost:5173
```

## Run locally
```
npm install
npm start
```
Then set `VITE_API_BASE_URL=http://localhost:4000` for the React app and run it.

## Deploy
Any Node host works (Render/Railway/Vercel/Azure App Service). Set environment variables:
- `MONGODB_URI` — Atlas SRV URI for a least-privilege user (readWrite on `portfolio`)
- `MONGODB_DB` — `portfolio`
- `CORS_ORIGIN` — your site origin (e.g., `https://<username>.github.io`) to restrict requests

### Atlas network access
- Allowlist the egress IP(s) of your API host in Atlas IP Access List.
- Avoid wide-open `0.0.0.0/0` except briefly for initial tests.

### Quick test
```
curl -sSf http://localhost:4000/health
curl -sSf http://localhost:4000/posts | jq '. | length'
curl -sSf "http://localhost:4000/posts?tag=AWS" | jq '. | length'
curl -sSf http://localhost:4000/projects | jq '. | length'
```
