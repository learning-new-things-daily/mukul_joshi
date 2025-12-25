import Ajv from 'ajv'
import { SITE } from '../config/siteConfig.js'
import postSchema from '../data/schemas/post.schema.json'
import projectSchema from '../data/schemas/project.schema.json'

const ajv = new Ajv({ allErrors: true })
const validatePosts = ajv.compile(postSchema)
const validateProjects = ajv.compile(projectSchema)

const cache = { posts: null, projects: null }
const overrides = (()=>{
  try{ return JSON.parse(localStorage.getItem('dataOverrides') || '{}') } catch { return {} }
})()

function buildUrl(name){
  const base = import.meta.env.BASE_URL || '/'
  const root = SITE.dataRoot?.replace(/^\/+|\/+$/g, '') || 'data'
  return `${base}${root}/${name}.json`
}

async function loadJson(name){
  const url = buildUrl(name)
  const resp = await fetch(url, { cache: 'no-store' })
  if(!resp.ok) throw new Error(`Failed to load ${name} from ${url}`)
  return await resp.json()
}

async function loadBundled(name){
  if(name === 'posts'){ const mod = await import('../data/posts.json'); return mod.default }
  if(name === 'projects'){ const mod = await import('../data/projects.json'); return mod.default }
  throw new Error('Unknown bundle name')
}

async function loadApi(name){
  const base = SITE.apiBase?.replace(/\/$/, '')
  if(!base) throw new Error('apiBase not configured')
  const resp = await fetch(`${base}/${name}`)
  if(!resp.ok) throw new Error(`API error: ${resp.status}`)
  return await resp.json()
}

function maybeValidate(name, data){
  if(!SITE.validateData) return
  try{
    const ok = name === 'posts' ? validatePosts(data) : validateProjects(data)
    if(!ok){
      const msg = ajv.errorsText((name==='posts'?validatePosts:validateProjects).errors)
      console.warn(`[dataService] ${name} schema validation failed: ${msg}`)
    }
  } catch(err){ console.warn('[dataService] validation error', err) }
}

export async function getPosts(){
  if(overrides.posts) return overrides.posts
  if(cache.posts) return cache.posts
  let data
  const src = SITE.dataSource || 'json'
  if(src === 'json') data = await loadJson('posts')
  else if(src === 'bundled') data = await loadBundled('posts')
  else if(src === 'api') data = await loadApi('posts')
  else throw new Error(`Unknown dataSource: ${src}`)
  maybeValidate('posts', data)
  cache.posts = data
  return data
}

export async function getProjects(){
  if(overrides.projects) return overrides.projects
  if(cache.projects) return cache.projects
  let data
  const src = SITE.dataSource || 'json'
  if(src === 'json') data = await loadJson('projects')
  else if(src === 'bundled') data = await loadBundled('projects')
  else if(src === 'api') data = await loadApi('projects')
  else throw new Error(`Unknown dataSource: ${src}`)
  maybeValidate('projects', data)
  cache.projects = data
  return data
}

export function clearCache(){ cache.posts = null; cache.projects = null }

export async function getMeta(){
  if(overrides.meta) return overrides.meta
  const src = SITE.dataSource || 'json'
  if(src === 'json') return await loadJson('meta')
  if(src === 'bundled') { const mod = await import('../data/meta.json'); return mod.default }
  if(src === 'api') { const base = SITE.apiBase?.replace(/\/$/, ''); const resp = await fetch(`${base}/meta`); if(!resp.ok) throw new Error('API meta error'); return await resp.json() }
  return { version: 'unknown', lastUpdated: new Date().toISOString() }
}

export function setOverride(name, data){
  overrides[name] = data
  try { localStorage.setItem('dataOverrides', JSON.stringify(overrides)) } catch {}
}

export function clearOverride(name){
  delete overrides[name]
  try { localStorage.setItem('dataOverrides', JSON.stringify(overrides)) } catch {}
}

export function getOverride(name){ return overrides[name] }
