// Seed MongoDB with existing JSON data (posts, projects)
// Auto-load .env if present
import 'dotenv/config';
// Usage:
//   MONGODB_URI="<your-uri>" MONGODB_DB="portfolio" node scripts/seed-mongo.js

import { readFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { MongoClient } from 'mongodb';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT = path.resolve(__dirname, '..');
const SRC_DATA_DIR = path.join(ROOT, 'src', 'data');

function ensureEnv(name) {
  const val = process.env[name];
  if (!val) {
    console.error(`Missing required env var: ${name}`);
    process.exit(1);
  }
  return val;
}

function slugFromUrl(url) {
  if (!url) return null;
  try {
    // Internal pages are like "post-terraform-modules.html"
    const base = url.split('/').pop();
    return base?.endsWith('.html') ? base.replace(/\.html$/i, '') : base;
  } catch {
    return null;
  }
}

async function loadJson(relPath) {
  const fullPath = path.join(SRC_DATA_DIR, relPath);
  const buf = await readFile(fullPath, 'utf-8');
  return JSON.parse(buf);
}

async function ensureIndexes(db) {
  await db.collection('posts').createIndex({ slug: 1 }, { unique: true, sparse: true });
  await db.collection('posts').createIndex({ date: -1 });
  await db.collection('posts').createIndex({ tags: 1 });
  await db.collection('projects').createIndex({ id: 1 }, { unique: true });
}

async function seedPosts(db) {
  const raw = await loadJson('posts.json');
  const docs = raw.map((p) => ({
    title: p.title,
    summary: p.summary,
    url: p.url,
    date: p.date ?? null,
    tags: Array.isArray(p.tags) ? p.tags : [],
    external: Boolean(p.external),
    slug: p.external ? null : slugFromUrl(p.url)
  }));

  const col = db.collection('posts');
  let upserts = 0;
  for (const d of docs) {
    const filter = d.slug ? { slug: d.slug } : { url: d.url };
    const res = await col.updateOne(filter, { $set: d }, { upsert: true });
    if (res.upsertedCount || res.modifiedCount) upserts += 1;
  }
  console.log(`Seeded posts: ${docs.length} processed, ${upserts} upserts/updates.`);
}

async function seedProjects(db) {
  const raw = await loadJson('projects.json');
  const docs = raw.map((p) => ({
    id: p.id,
    emoji: p.emoji ?? null,
    title: p.title,
    summary: p.summary,
    tags: Array.isArray(p.tags) ? p.tags : [],
    outcomes: Array.isArray(p.outcomes) ? p.outcomes : [],
    links: Array.isArray(p.links) ? p.links : [],
    slug: (p.id || '').toString().toLowerCase()
  }));

  const col = db.collection('projects');
  let upserts = 0;
  for (const d of docs) {
    const res = await col.updateOne({ id: d.id }, { $set: d }, { upsert: true });
    if (res.upsertedCount || res.modifiedCount) upserts += 1;
  }
  console.log(`Seeded projects: ${docs.length} processed, ${upserts} upserts/updates.`);
}

async function main() {
  const uri = ensureEnv('MONGODB_URI');
  const dbName = process.env.MONGODB_DB || 'portfolio';

  const client = new MongoClient(uri, { serverSelectionTimeoutMS: 10000 });
  try {
    await client.connect();
    const db = client.db(dbName);
    await ensureIndexes(db);
    await seedPosts(db);
    await seedProjects(db);
    console.log('MongoDB seeding completed successfully.');
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exitCode = 1;
  } finally {
    await client.close();
  }
}

main();
