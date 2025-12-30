import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { connect, getDb } from './db.js'

const app = express()

const PORT = process.env.PORT || 4000
const ORIGIN = process.env.CORS_ORIGIN || '*'
const MONGODB_URI = process.env.MONGODB_URI
const MONGODB_DB = process.env.MONGODB_DB || 'portfolio'

if(!MONGODB_URI){
  console.error('Missing MONGODB_URI env var')
  process.exit(1)
}

// Allow multiple origins via comma-separated list in CORS_ORIGIN
const allowedOrigins = (!ORIGIN || ORIGIN === '*')
  ? '*'
  : ORIGIN.split(',').map(s => s.trim()).filter(Boolean)

app.use(cors({ origin: allowedOrigins, methods: ['GET'], credentials: false }))
app.use(express.json())

app.get('/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() })
})

app.get('/meta', async (req, res) => {
  const db = getDb()
  const [postCount, projectCount, latestPost] = await Promise.all([
    db.collection('posts').countDocuments({}),
    db.collection('projects').countDocuments({}),
    db.collection('posts').find({ date: { $exists: true } }).sort({ date: -1 }).limit(1).toArray()
  ])
  const lastUpdated = latestPost?.[0]?.date || new Date().toISOString()
  // Match frontend expectations
  res.json({
    version: 'db',
    lastUpdated,
    posts: postCount,
    projects: projectCount,
    source: 'mongodb'
  })
})

app.get('/posts', async (req, res) => {
  const { tag, q, page = 1, limit = 50 } = req.query
  const db = getDb()
  const filter = {}
  if(tag) filter.tags = tag
  if(q){
    filter.$or = [
      { title: { $regex: q, $options: 'i' } },
      { summary: { $regex: q, $options: 'i' } }
    ]
  }
  const l = Math.min(parseInt(limit, 10) || 50, 100)
  const p = Math.max(parseInt(page, 10) || 1, 1)
  const cursor = db.collection('posts')
    .find(filter)
    .sort({ date: -1, title: 1 })
    .skip((p - 1) * l)
    .limit(l)
  const items = await cursor.toArray()
  res.json(items)
})

app.get('/posts/:slug', async (req, res) => {
  const db = getDb()
  const doc = await db.collection('posts').findOne({ slug: req.params.slug })
  if(!doc) return res.status(404).json({ error: 'Not found' })
  res.json(doc)
})

app.get('/projects', async (req, res) => {
  const db = getDb()
  const items = await db.collection('projects').find({}).sort({ title: 1 }).toArray()
  res.json(items)
})

connect(MONGODB_URI, MONGODB_DB)
  .then(() => app.listen(PORT, () => console.log(`API listening on :${PORT}`)))
  .catch(err => { console.error('Failed to start API', err); process.exit(1) })
