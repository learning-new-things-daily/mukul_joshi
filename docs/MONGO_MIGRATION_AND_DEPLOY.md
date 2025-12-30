# Mongo Migration & Secure Deployment (GitHub Pages + API)

This guide moves your site data from local JSON to MongoDB Atlas and serves it via a secure API, while keeping your static site on GitHub Pages.

## 1) Atlas Setup
- Create database: `portfolio`
- Create collections: `posts`, `projects`
- Create DB user: least-privilege user with `readWrite` on `portfolio` only
- Network Access:
  - Add your current IP temporarily for local seeding
  - Later add your API host egress IP(s) and remove your local IP

## 2) Seed Data
- From repo root:
```
# Install dependencies for the React project (seed script lives here)
npm --prefix portfolio-react install

# Configure env (or use inline vars)
cp portfolio-react/.env.example portfolio-react/.env
# edit .env with your Atlas SRV URI and DB name

# Run the seed
npm --prefix portfolio-react run seed:mongo
```
- Collections get indexes:
  - posts: unique sparse on `slug`, plus indexes on `date` and `tags`
  - projects: unique on `id`

## 3) Run API locally
```
cd server
cp .env.example .env
# Set MONGODB_URI, MONGODB_DB=portfolio, and CORS_ORIGIN=http://localhost:5173
npm install
npm start
```
- Test:
```
curl -sSf http://localhost:4000/health
curl -sSf http://localhost:4000/posts | jq '. | length'
```

## 4) Frontend (GitHub Pages) reads from API
- The frontend now always uses the API (no JSON fallback). Set `VITE_API_BASE_URL`:
```
echo 'VITE_API_BASE_URL=https://<your-api-host>' > portfolio-react/.env
```
- Builds will fail or the app will error if `VITE_API_BASE_URL` is not provided.

## 5) Deploy the API
- Choose a host: Render/Railway/Vercel/Azure App Service
- Set environment variables on the host:
  - `MONGODB_URI`
  - `MONGODB_DB=portfolio`
  - `CORS_ORIGIN=https://<username>.github.io` (or your custom domain)
- In Atlas, add your API host IP(s) to the IP Access List.

## 6) Deploy/Build the site
- Build the React app with `VITE_API_BASE_URL` set to your API URL:
```
cd portfolio-react
# For local preview:
VITE_API_BASE_URL=https://<your-api-host> npm run preview
# For production build:
VITE_API_BASE_URL=https://<your-api-host> npm run build
```
- Publish the `portfolio-react/dist` to GitHub Pages (via your existing workflow or Pages settings).

### Using GitHub Actions (recommended)
- Add a repository secret `API_URL` with your deployed API URL (e.g., `https://api.example.com`).
- The workflows `.github/workflows/pages.yml` and `pages-branch.yml` now inject `VITE_API_BASE_URL: ${{ secrets.API_URL }}` during build.
- If `API_URL` is not set, the app falls back to bundled/public JSON.

## 7) Security Checklist
- Do not commit secrets: `.env` files are git-ignored; only `.env.example` is committed
- Use least-privilege DB user (no admin)
- Restrict Atlas network to API host IPs; remove `0.0.0.0/0` after testing
- Rotate credentials periodically on the host
- Apply schema validation (optional) to Mongo collections to enforce shape

## 8) Optional: Schema Validation Commands
Run in MongoDB Shell or Atlas interface:
```
// posts validator
{
  collMod: 'posts',
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['title','summary','url'],
      properties: {
        title: { bsonType: 'string' },
        summary: { bsonType: 'string' },
        url: { bsonType: 'string' },
        date: { bsonType: 'string' },
        tags: { bsonType: 'array', items: { bsonType: 'string' } },
        external: { bsonType: 'bool' },
        slug: { bsonType: ['string','null'] }
      }
    }
  },
  validationLevel: 'moderate'
}

// projects validator
{
  collMod: 'projects',
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['id','title','summary'],
      properties: {
        id: { bsonType: 'string' },
        emoji: { bsonType: ['string','null'] },
        title: { bsonType: 'string' },
        summary: { bsonType: 'string' },
        tags: { bsonType: 'array', items: { bsonType: 'string' } },
        outcomes: { bsonType: 'array', items: { bsonType: 'string' } },
        links: { bsonType: 'array', items: { bsonType: 'object' } }
      }
    }
  },
  validationLevel: 'moderate'
}
```

## 9) Monitoring & Testing
- Verify API `/health` after deploy
- Test CORS from your Pages site
- Confirm posts/projects load and filters work

## Troubleshooting
- npm prefix path errors: run `npm install` from the folder containing `package.json`
- CORS blocked: ensure `CORS_ORIGIN` matches your site URL exactly
- Atlas connection refused: check IP allowlist and user permissions
