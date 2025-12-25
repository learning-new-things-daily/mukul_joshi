import { useEffect, useState } from 'react'
import Ajv from 'ajv'
import postSchema from '../data/schemas/post.schema.json'
import projectSchema from '../data/schemas/project.schema.json'
import { getPosts, getProjects, getMeta, setOverride, clearOverride, getOverride } from '../services/dataService.js'

function TextAreaEditor({ label, value, setValue }){
  return (
    <div className="grid gap-1">
      <label className="text-sm font-semibold text-brand">{label}</label>
      <textarea className="w-full h-40 border rounded p-2 font-mono" value={value} onChange={e=>setValue(e.target.value)} />
    </div>
  )
}

function toPrettyJson(obj){ try { return JSON.stringify(obj, null, 2) } catch { return '' } }
function parseJson(text){ try { return JSON.parse(text) } catch { return null } }
function download(name, obj){ const blob = new Blob([toPrettyJson(obj)], { type: 'application/json' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href=url; a.download=`${name}.json`; a.click(); URL.revokeObjectURL(url) }

export default function Admin(){
  const [postsText, setPostsText] = useState('')
  const [projectsText, setProjectsText] = useState('')
  const [metaText, setMetaText] = useState('')
  const [status, setStatus] = useState('')
  const [postsErrors, setPostsErrors] = useState([])
  const [projectsErrors, setProjectsErrors] = useState([])
  const [metaErrors, setMetaErrors] = useState([])

  const ajv = new Ajv({ allErrors: true, strict: false })
  const validatePostsSchema = ajv.compile({ type: 'array', items: postSchema })
  const validateProjectsSchema = ajv.compile({ type: 'array', items: projectSchema })
  const formatErrors = (errors) => (errors||[]).map(e => `${e.instancePath || ''} ${e.message}`.trim())

  useEffect(()=>{
    // Load current data (prefer overrides)
    (async ()=>{
      const posts = getOverride('posts') || await getPosts()
      const projects = getOverride('projects') || await getProjects()
      const meta = getOverride('meta') || await getMeta()
      setPostsText(toPrettyJson(posts))
      setProjectsText(toPrettyJson(projects))
      setMetaText(toPrettyJson(meta))
    })()
  }, [])

  const validateAll = () => {
    setPostsErrors([]); setProjectsErrors([]); setMetaErrors([])
    const p = parseJson(postsText)
    const r = parseJson(projectsText)
    const m = parseJson(metaText)
    if(!p || !Array.isArray(p)){ setPostsErrors(['Must be a JSON array']); return setStatus('Invalid posts JSON') }
    if(!r || !Array.isArray(r)){ setProjectsErrors(['Must be a JSON array']); return setStatus('Invalid projects JSON') }
    if(!m || typeof m !== 'object'){ setMetaErrors(['Must be a JSON object']); return setStatus('Invalid meta JSON') }
    const okP = validatePostsSchema(p)
    const okR = validateProjectsSchema(r)
    const metaErrs = []
    if(typeof m.version !== 'string') metaErrs.push('version must be a string')
    if(typeof m.lastUpdated !== 'string') metaErrs.push('lastUpdated must be an ISO string')
    setPostsErrors(okP ? [] : formatErrors(validatePostsSchema.errors))
    setProjectsErrors(okR ? [] : formatErrors(validateProjectsSchema.errors))
    setMetaErrors(metaErrs)
    if(okP && okR && metaErrs.length===0){ setStatus('Validation OK') }
    else { setStatus('Validation has issues') }
  }

  const applyOverrides = () => {
    const p = parseJson(postsText)
    const r = parseJson(projectsText)
    const m = parseJson(metaText)
    if(!p || !r || !m){ return setStatus('Fix JSON before applying overrides') }
    setOverride('posts', p)
    setOverride('projects', r)
    setOverride('meta', m)
    setStatus('Overrides applied (stored in localStorage).')
  }

  const clearOverridesAll = () => {
    clearOverride('posts'); clearOverride('projects'); clearOverride('meta')
    setStatus('Overrides cleared.')
  }

  return (
    <div className="grid gap-3">
      <h1 className="text-2xl text-brand">Admin — Content Editor</h1>
      <p className="text-sm text-slate-600">Edit JSON content in-browser. Apply overrides (stored locally) for preview; export files to update <code>public/data</code> or switch to an API later.</p>
      {status && (<div className="text-xs text-slate-600">{status}</div>)}

      <TextAreaEditor label="Posts (JSON array)" value={postsText} setValue={setPostsText} />
      {postsErrors.length>0 && (
        <ul className="text-xs text-red-600 list-disc pl-5">
          {postsErrors.map((e,i)=>(<li key={i}>{e}</li>))}
        </ul>
      )}
      <div className="flex gap-2">
        <button className="btn" onClick={()=>download('posts', parseJson(postsText) || [])}>Export Posts</button>
      </div>

      <TextAreaEditor label="Projects (JSON array)" value={projectsText} setValue={setProjectsText} />
      {projectsErrors.length>0 && (
        <ul className="text-xs text-red-600 list-disc pl-5">
          {projectsErrors.map((e,i)=>(<li key={i}>{e}</li>))}
        </ul>
      )}
      <div className="flex gap-2">
        <button className="btn" onClick={()=>download('projects', parseJson(projectsText) || [])}>Export Projects</button>
      </div>

      <TextAreaEditor label="Meta (JSON object)" value={metaText} setValue={setMetaText} />
      {metaErrors.length>0 && (
        <ul className="text-xs text-red-600 list-disc pl-5">
          {metaErrors.map((e,i)=>(<li key={i}>{e}</li>))}
        </ul>
      )}
      <div className="flex gap-2">
        <button className="btn" onClick={()=>download('meta', parseJson(metaText) || {})}>Export Meta</button>
      </div>

      <div className="flex flex-wrap gap-2 mt-3">
        <button className="btn" onClick={validateAll}>Validate JSON</button>
        <button className="btn" onClick={applyOverrides} disabled={postsErrors.length>0 || projectsErrors.length>0 || metaErrors.length>0}>Apply Overrides</button>
        <button className="btn" onClick={clearOverridesAll}>Clear Overrides</button>
      </div>

      <div className="text-xs text-slate-500">Note: Overrides are client-side only. For permanent updates, commit to <code>public/data</code> or enable the API in <code>siteConfig.js</code>.</div>
    </div>
  )
}
