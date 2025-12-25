import { SITE } from '../config/siteConfig.js'

const API = 'https://api.github.com'

export async function fetchLatestWorkflowRuns({ perPage = 5 } = {}){
  const owner = SITE.githubOwner
  const repo = SITE.githubRepo
  if(!owner || !repo){
    return { configured: false, runs: [], error: 'GitHub owner/repo not configured' }
  }
  const token = import.meta.env.VITE_GITHUB_TOKEN
  const url = `${API}/repos/${owner}/${repo}/actions/runs?per_page=${perPage}`
  const headers = { 'Accept': 'application/vnd.github+json' }
  if(token){ headers['Authorization'] = `Bearer ${token}` }
  // Cache results in sessionStorage to avoid hitting rate limits when no token is present
  const cacheKey = `ci-runs:${owner}/${repo}`
  const now = Date.now()
  try{
    const cached = JSON.parse(sessionStorage.getItem(cacheKey) || 'null')
    // TTL 5 minutes
    if(cached && (now - cached.ts) < 5*60*1000){
      return { configured: true, runs: cached.runs }
    }
  } catch {}
  try{
    const resp = await fetch(url, { headers })
    if(!resp.ok){
      const text = await resp.text()
      return { configured: true, runs: [], error: `GitHub API error: ${resp.status} ${text}` }
    }
    const data = await resp.json()
    const runs = (data.workflow_runs || []).map(r => ({
      id: r.id,
      name: r.name || r.display_title || 'workflow',
      status: r.status,
      conclusion: r.conclusion,
      event: r.event,
      branch: r.head_branch,
      sha: r.head_sha?.slice(0,7),
      actor: r.actor?.login,
      created_at: r.created_at,
      updated_at: r.updated_at,
      html_url: r.html_url,
      run_number: r.run_number,
      durationSec: r.run_started_at && r.updated_at ? (new Date(r.updated_at) - new Date(r.run_started_at))/1000 : null,
    }))
    try{ sessionStorage.setItem(cacheKey, JSON.stringify({ ts: now, runs })) } catch {}
    return { configured: true, runs }
  } catch(err){
    return { configured: true, runs: [], error: err.message }
  }
}

export function shieldsBadgeUrl(type){
  const owner = SITE.githubOwner
  const repo = SITE.githubRepo
  if(!owner || !repo){ return null }
  if(type === 'build') return `https://img.shields.io/github/actions/workflow/status/${owner}/${repo}/ci.yml?branch=main&label=build`;
  if(type === 'license') return `https://img.shields.io/github/license/${owner}/${repo}`;
  if(type === 'release') return `https://img.shields.io/github/v/release/${owner}/${repo}?display_name=tag`;
  return null
}
