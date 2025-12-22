import { useEffect, useRef, useState } from 'react'
import { fetchLatestWorkflowRuns } from '../utils/github.js'
import { readVitals } from '../utils/webVitals.js'

function Sparkline({ values }){
  // Simple sparkline using inline SVG
  const w = 200, h = 40
  const max = Math.max(1, ...values)
  const pts = values.map((v, i) => `${(i/(values.length-1))*w},${h - (v/max)*h}`).join(' ')
  return (
    <svg width={w} height={h} className="bg-slate-50 border rounded">
      <polyline points={pts} fill="none" stroke="#0a3d62" strokeWidth="2" />
    </svg>
  )
}

export default function Dashboard(){
  const [cpu, setCpu] = useState([10,20,15,30,25,35,28])
  const [mem, setMem] = useState([40,42,41,45,47,46,48])
  const [dep, setDep] = useState([0,1,0,2,1,3,2])
  const [cpuVal, setCpuVal] = useState(cpu[cpu.length-1])
  const [memVal, setMemVal] = useState(mem[mem.length-1])
  const [depVal, setDepVal] = useState(dep[dep.length-1])

  useEffect(()=>{
    const t = setInterval(()=>{
      setCpu(prev => {
        const next = Math.max(5, Math.min(95, Math.round(prev[prev.length-1] + (Math.random()*10 - 5))))
        setCpuVal(next)
        return [...prev.slice(1), next]
      })
      setMem(prev => {
        const next = Math.max(20, Math.min(95, Math.round(prev[prev.length-1] + (Math.random()*6 - 3))))
        setMemVal(next)
        return [...prev.slice(1), next]
      })
      setDep(prev => {
        const inc = Math.random() > 0.7 ? 1 : 0
        const next = prev[prev.length-1] + inc
        setDepVal(next)
        return [...prev.slice(1), next]
      })
    }, 1200)
    return ()=>clearInterval(t)
  }, [])

  // Pipeline animation
  const [steps, setSteps] = useState(['Checkout','Build','Test','Deploy'])
  const [running, setRunning] = useState(false)
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState(Array(steps.length).fill('pending')) // pending|in-progress|success|failed
  const [logLines, setLogLines] = useState([])
  const logRef = useRef(null)
  const [history, setHistory] = useState([])
  const [deployments, setDeployments] = useState([]) // { id, name, url, time, template }
  const [lastTemplate, setLastTemplate] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [failedIndex, setFailedIndex] = useState(null)
  // GitHub Actions runs
  const [ghRuns, setGhRuns] = useState({ configured: false, runs: [], error: null })
  // Web Vitals
  const [vitals, setVitals] = useState(readVitals())
  // Contact pipeline
  const [contactEmail, setContactEmail] = useState('')
  const [approvalOpen, setApprovalOpen] = useState(false)
  const [approvalClosing, setApprovalClosing] = useState(false)
  const [approvalForm, setApprovalForm] = useState({ email: '', name: '', message: '' })
  const approvalResolveRef = useRef(null)

  const appendLog = (line) => {
    const ts = new Date().toLocaleTimeString()
    setLogLines(prev => [...prev, `[${ts}] ${line}`])
  }

  useEffect(()=>{ if(logRef.current){ logRef.current.scrollTop = logRef.current.scrollHeight } }, [logLines])

  const wait = (ms) => new Promise(res => setTimeout(res, ms))

  // Approval modal helpers
  const waitForApproval = (init) => {
    setApprovalForm(init)
    setApprovalClosing(false)
    setApprovalOpen(true)
    return new Promise(resolve => { approvalResolveRef.current = resolve })
  }
  const submitApproval = () => {
    setApprovalClosing(true)
    setTimeout(()=> setApprovalOpen(false), 160)
    const data = { approved: true, ...approvalForm }
    if(approvalResolveRef.current) approvalResolveRef.current(data)
  }
  const cancelApproval = () => {
    setApprovalClosing(true)
    setTimeout(()=> setApprovalOpen(false), 160)
    if(approvalResolveRef.current) approvalResolveRef.current({ approved: false })
  }

  const runPipeline = async (template, startIndex = 0) => {
    if(running) return
    setRunning(true)
    if(startIndex === 0){
      setProgress(0)
      setStatus(Array(steps.length).fill('pending'))
      setLogLines([])
      appendLog(`Pipeline started${template ? ` for sandbox '${template}'` : ''}.`)
    } else {
      const base = (startIndex/steps.length)*100
      setProgress(base)
      appendLog(`Resuming pipeline at step ${steps[startIndex]}${template ? ` for sandbox '${template}'` : ''}.`)
    }
    const start = Date.now()
    let localStatus = Array(steps.length).fill('pending')
    let failed = false
    setLastTemplate(template || null)
    setFailedIndex(null)

    for(let i=startIndex;i<steps.length;i++){
      localStatus = localStatus.map((s, idx) => idx===i ? 'in-progress' : (idx<i ? s : 'pending'))
      setStatus(localStatus.slice())
      appendLog(`Starting ${steps[i]}…`)
      // Emit a couple of synthetic logs per step
      appendLog(`${steps[i]}: initializing environment…`)
      await wait(250 + Math.random()*250)
      appendLog(`${steps[i]}: running tasks…`)
      await wait(400 + Math.random()*600)

      const failChance = steps[i] === 'Test' ? 0.25 : 0.08
      const willFail = Math.random() < failChance
      if(willFail){
        localStatus[i] = 'failed'
        setStatus(localStatus.slice())
        appendLog(`[ERROR] ${steps[i]} failed. See diagnostics.`)
        setFailedIndex(i)
        failed = true
        break
      } else {
        localStatus[i] = 'success'
        setStatus(localStatus.slice())
        appendLog(`${steps[i]} completed successfully.`)
        setProgress(((i+1)/steps.length)*100)
        // On Deploy step, create a session-only sandbox artifact
        if(steps[i] === 'Deploy' && template){
          appendLog(`Deploying sandbox '${template}'…`)
          const html = createSandboxHTML(template)
          const blob = new Blob([html], { type: 'text/html' })
          const url = URL.createObjectURL(blob)
          const id = Date.now()
          const name = `${template}-${new Date(id).toISOString().slice(11,19).replace(/:/g,'')}`
          const item = { id, name, url, time: new Date(id), template }
          setDeployments(prev => [item, ...prev].slice(0,6))
          appendLog(`Sandbox deployed: ${name} → ${url}`)
        }
      }
    }

    const end = Date.now()
    const durationMs = end - start
    if(failed){ appendLog(`Pipeline FAILED in ${(durationMs/1000).toFixed(1)}s.`) }
    else { appendLog(`Pipeline SUCCEEDED in ${(durationMs/1000).toFixed(1)}s.`) }
    setRunning(false)
    setHistory(prev => [{ id: end, time: new Date(end), success: !failed, durationMs, stepStatuses: localStatus.slice() }, ...prev].slice(0,6))
  }

  // Contact pipeline (no random failure; validates email, collects message, sends)
  const runContactPipeline = async (emailParam) => {
    if(running) return
    const contactSteps = ['Checkout','Validate Email','Approval','Deploy']
    setSteps(contactSteps)
    setRunning(true)
    setProgress(0)
    setStatus(Array(contactSteps.length).fill('pending'))
    setLogLines([])
    setFailedIndex(null)
    appendLog(`Contact pipeline started for '${emailParam}'.`)
    const start = Date.now()
    let localStatus = Array(contactSteps.length).fill('pending')
    let failed = false

    // Checkout
    localStatus[0] = 'in-progress'; setStatus(localStatus.slice()); appendLog('Checkout starting…')
    await wait(300)
    localStatus[0] = 'success'; setStatus(localStatus.slice()); appendLog('Checkout completed.')
    setProgress((1/contactSteps.length)*100)

    // Validate Email
    localStatus[1] = 'in-progress'; setStatus(localStatus.slice()); appendLog('Validating email…')
    const email = (emailParam || '').trim()
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    await wait(200)
    if(!re.test(email)){
      localStatus[1] = 'failed'; setStatus(localStatus.slice()); appendLog('[ERROR] Invalid email address.'); setFailedIndex(1); failed = true
    } else { localStatus[1] = 'success'; setStatus(localStatus.slice()); appendLog('Email is valid.'); setProgress((2/contactSteps.length)*100) }
    if(failed){
      const end = Date.now(); const durationMs = end - start
      appendLog(`Contact pipeline FAILED in ${(durationMs/1000).toFixed(1)}s.`)
      setRunning(false)
      setHistory(prev => [{ id: end, time: new Date(end), success: false, durationMs, stepStatuses: localStatus.slice() }, ...prev].slice(0,6))
      setSteps(['Checkout','Build','Test','Deploy'])
      return
    }

    // Approval
    localStatus[2] = 'in-progress'; setStatus(localStatus.slice()); appendLog('Awaiting approval and message…')
    const approval = await waitForApproval({ email, name: '', message: '' })
    if(!approval.approved || !approval.message?.trim()){
      localStatus[2] = 'failed'; setStatus(localStatus.slice()); appendLog('[ERROR] Approval declined or message empty.'); setFailedIndex(2); failed = true
    } else {
      localStatus[2] = 'success'; setStatus(localStatus.slice()); appendLog('Approval received.'); setProgress((3/contactSteps.length)*100)
    }
    if(failed){
      const end = Date.now(); const durationMs = end - start
      appendLog(`Contact pipeline FAILED in ${(durationMs/1000).toFixed(1)}s.`)
      setRunning(false)
      setHistory(prev => [{ id: end, time: new Date(end), success: false, durationMs, stepStatuses: localStatus.slice() }, ...prev].slice(0,6))
      setSteps(['Checkout','Build','Test','Deploy'])
      return
    }

    // Deploy (send to Formspree)
    localStatus[3] = 'in-progress'; setStatus(localStatus.slice()); appendLog('Sending message…')
    try{
      const resp = await fetch('https://formspree.io/f/xvzpzkzp', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: approval.email, name: approval.name, message: approval.message }) })
      if(!resp.ok) throw new Error('Network error')
      localStatus[3] = 'success'; setStatus(localStatus.slice()); appendLog('Message sent successfully.')
      setProgress(100)
    } catch(err){
      localStatus[3] = 'failed'; setStatus(localStatus.slice()); appendLog('[ERROR] Failed to send message.')
      setFailedIndex(3); failed = true
    }

    const end = Date.now(); const durationMs = end - start
    appendLog(`Contact pipeline ${failed?'FAILED':'SUCCEEDED'} in ${(durationMs/1000).toFixed(1)}s.`)
    setRunning(false)
    setHistory(prev => [{ id: end, time: new Date(end), success: !failed, durationMs, stepStatuses: localStatus.slice() }, ...prev].slice(0,6))
    setSteps(['Checkout','Build','Test','Deploy'])
  }

  // Listen for terminal-triggered pipeline runs
  useEffect(()=>{
    const handler = () => runPipeline()
    document.addEventListener('pipeline-run', handler)
    return () => document.removeEventListener('pipeline-run', handler)
  }, [])

  // Fetch GitHub Actions latest runs
  useEffect(()=>{
    let active = true
    fetchLatestWorkflowRuns({ perPage: 5 }).then(res => { if(active) setGhRuns(res) })
    const t = setInterval(()=> fetchLatestWorkflowRuns({ perPage: 5 }).then(res => { if(active) setGhRuns(res) }), 60_000)
    return ()=>{ active = false; clearInterval(t) }
  }, [])

  // Listen to Web Vitals updates
  useEffect(()=>{
    const handler = (e) => setVitals(e.detail)
    document.addEventListener('web-vitals-updated', handler)
    return ()=> document.removeEventListener('web-vitals-updated', handler)
  }, [])

  // Listen for deploy requests from Terminal
  useEffect(()=>{
    const handler = (e) => runPipeline(e.detail?.template)
    document.addEventListener('deploy-request', handler)
    return () => document.removeEventListener('deploy-request', handler)
  }, [])

  // Listen for open preview (last or index)
  useEffect(()=>{
    const handler = (e) => {
      const which = e.detail?.which
      const items = deployments
      if(!items.length) return
      if(which === 'last'){ setPreviewUrl(items[0].url) }
      else if(typeof which === 'number'){ const d = items[which]; if(d) setPreviewUrl(d.url) }
    }
    document.addEventListener('deploy-open', handler)
    return () => document.removeEventListener('deploy-open', handler)
  }, [deployments])

  // Listen for retry request
  useEffect(()=>{
    const handler = () => runPipeline(lastTemplate)
    document.addEventListener('pipeline-retry', handler)
    return () => document.removeEventListener('pipeline-retry', handler)
  }, [lastTemplate])

  // Listen for contact pipeline request
  useEffect(()=>{
    const handler = (e) => runContactPipeline(e.detail?.email)
    document.addEventListener('contact-request', handler)
    return () => document.removeEventListener('contact-request', handler)
  }, [])

  // Listen for resume from failed step
  useEffect(()=>{
    const handler = () => {
      if(failedIndex !== null){ runPipeline(lastTemplate, failedIndex) }
    }
    document.addEventListener('pipeline-resume', handler)
    return () => document.removeEventListener('pipeline-resume', handler)
  }, [failedIndex, lastTemplate])

  // Expose deployments for Terminal 'deploy list'
  useEffect(()=>{
    window.__sessionDeployments = deployments
    document.dispatchEvent(new Event('deployments-changed'))
  }, [deployments])

  function createSandboxHTML(template){
    const base = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>Sandbox ${template}</title><style>body{font-family:ui-sans-serif,system-ui,Segoe UI,Roboto,Arial;background:#0b0f14;color:#e5eefc;margin:0;padding:20px} .card{background:#0f172a;border:1px solid #334155;border-radius:8px;padding:16px} a{color:#7dd3fc}</style></head><body><div class="card"><h1>Sandbox: ${template}</h1><p>Session-only deployment generated at ${new Date().toLocaleString()}.</p>__CONTENT__<p style="margin-top:10px"><a href="#" onclick="window.close()">Close</a></p></div></body></html>`
    if(template==='hello'){
      return base.replace('__CONTENT__', '<p>Hello from your ephemeral micro-app! 🚀</p>')
    } else if(template==='chart'){
      const content = `<canvas id="c" width="400" height="160" style="background:#0b0f14;border:1px solid #334155"></canvas><script>const ctx=document.getElementById('c').getContext('2d');const w=400,h=160;ctx.strokeStyle='#7dd3fc';ctx.lineWidth=2;let x=0;const vals=Array.from({length:60},()=>Math.random());ctx.beginPath();vals.forEach((v,i)=>{const y=h-(v*120+20);ctx.lineTo(i*(w/60),y)});ctx.stroke();</script>`
      return base.replace('__CONTENT__', content)
    } else if(template==='terminal'){
      const content = `<pre id="t" style="background:#0b0f14;color:#cfe4ff;padding:10px;height:160px;overflow:auto">$ echo \"Hello sandbox\"\nHello sandbox\n$ date\n${new Date().toString()}</pre>`
      return base.replace('__CONTENT__', content)
    } else if(template==='markdown'){
      const md = `# Sandbox Markdown\n\n- Built at ${new Date().toLocaleString()}\n- This preview renders static Markdown.\n\n**Enjoy!**`
      const html = `<div id="md" class="card"></div><script>const md=${JSON.stringify(md)};document.getElementById('md').innerText=md;</script>`
      return base.replace('__CONTENT__', html)
    } else if(template==='table'){
      const rows = Array.from({length:6}, (_,i)=>({ id:i+1, name:'Item '+(i+1), value:(Math.random()*100).toFixed(2) }))
      const html = `<table style="width:100%;border-collapse:collapse"><thead><tr><th style="border:1px solid #334155;padding:6px">ID</th><th style="border:1px solid #334155;padding:6px">Name</th><th style="border:1px solid #334155;padding:6px">Value</th></tr></thead><tbody>${rows.map(r=>`<tr><td style=\"border:1px solid #334155;padding:6px\">${r.id}</td><td style=\"border:1px solid #334155;padding:6px\">${r.name}</td><td style=\"border:1px solid #334155;padding:6px\">${r.value}</td></tr>`).join('')}</tbody></table>`
      return base.replace('__CONTENT__', html)
    }
    return base.replace('__CONTENT__', '<p>Unknown template.</p>')
  }

  return (
    <section className="grid gap-4">
      <h2 className="text-xl text-brand">Live Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="border rounded-lg p-3 bg-white">
          <div className="font-semibold text-brand">CPU</div>
          <div className="text-2xl">{cpuVal}%</div>
          <Sparkline values={cpu} />
        </div>
        <div className="border rounded-lg p-3 bg-white">
          <div className="font-semibold text-brand">Memory</div>
          <div className="text-2xl">{memVal}%</div>
          <Sparkline values={mem} />
        </div>
        <div className="border rounded-lg p-3 bg-white">
          <div className="font-semibold text-brand">Deployments</div>
          <div className="text-2xl">{depVal}</div>
          <Sparkline values={dep} />
        </div>
      </div>
      {/* GitHub Actions Status */}
      <div className="border rounded-lg p-3 bg-white">
        <h3 className="font-semibold text-brand mb-2">CI/CD — Latest Workflow Runs</h3>
        {!ghRuns.configured ? (
          <p className="text-sm text-slate-600">Configure GitHub owner/repo in <code>src/config/siteConfig.js</code> to show workflow runs.</p>
        ) : ghRuns.error ? (
          <p className="text-sm text-red-600">{ghRuns.error}</p>
        ) : ghRuns.runs.length === 0 ? (
          <p className="text-sm text-slate-600">No runs found.</p>
        ) : (
          <ul className="text-sm space-y-2">
            {ghRuns.runs.map(r => (
              <li key={r.id} className="flex flex-wrap items-center gap-2">
                <a className="text-brand font-semibold" href={r.html_url} target="_blank" rel="noopener noreferrer">#{r.run_number} {r.name}</a>
                <span className="text-xs text-slate-500">{r.branch}@{r.sha}</span>
                <span className={`px-2 py-1 rounded-full text-xs border ${r.conclusion==='success'?'bg-green-100 border-green-300': r.conclusion==='failure' ? 'bg-red-100 border-red-300' : 'bg-slate-100 border-slate-300'}`}>{r.conclusion || r.status}</span>
                {r.durationSec != null && (<span className="text-xs">· {r.durationSec.toFixed(1)}s</span>)}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Web Vitals */}
      <div className="border rounded-lg p-3 bg-white">
        <h3 className="font-semibold text-brand mb-2">Web Performance — Core Web Vitals</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {['LCP','FID','CLS','TTFB'].map(k => (
            <div key={k} className="border rounded p-2 bg-slate-50">
              <div className="text-xs text-slate-600">{k}</div>
              <div className="text-lg">{(vitals[k]?.at(-1)?.v ?? '—')}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="border rounded-lg p-3 bg-white">
        <h3 className="font-semibold text-brand mb-2">Pipeline Run</h3>
        <div className="flex flex-wrap gap-2 mb-2">
          {steps.map((s, i) => {
            const st = status[i]
            const cls = st==='success' ? 'bg-green-100 border-green-300' : st==='failed' ? 'bg-red-100 border-red-300' : st==='in-progress' ? 'bg-yellow-100 border-yellow-300' : 'bg-slate-100 border-slate-300'
            return <span key={s} className={`px-2 py-1 rounded-full border text-xs ${cls}`}>{s}</span>
          })}
        </div>
        <div className="h-2 bg-slate-100 rounded"><div className="h-2 bg-brand rounded" style={{width: `${Math.min(100, progress)}%`}}/></div>
        <div className="flex gap-2 mt-3">
          <button className="btn" onClick={()=>runPipeline()} disabled={running}>{running?'Running…':'Run Pipeline'}</button>
          <button className="btn" onClick={()=>runPipeline(lastTemplate)} disabled={running || history.length===0}>Retry Last</button>
          <button className="btn" onClick={()=>runPipeline(lastTemplate, failedIndex)} disabled={running || failedIndex===null}>Resume Failed Step</button>
        </div>
        {/* Contact pipeline trigger */}
        <div className="mt-3 flex flex-wrap gap-2">
          <input className="px-3 py-2 rounded-md border" placeholder="enter email for contact pipeline" value={contactEmail} onChange={e=>setContactEmail(e.target.value)} />
          <button className="btn" onClick={()=>runContactPipeline(contactEmail)} disabled={running || !contactEmail.trim()}>Run Contact Pipeline</button>
        </div>

        {/* Logs */}
        <div ref={logRef} className="mt-3 bg-[#0b0f14] text-[#cfe4ff] rounded p-2 font-mono h-40 overflow-auto border border-[#132235]">
          <pre className="whitespace-pre-wrap">{logLines.join('\n')}</pre>
        </div>
      </div>

      {/* History */}
      <div className="border rounded-lg p-3 bg-white">
        <h3 className="font-semibold text-brand mb-2">Run History</h3>
        {history.length === 0 ? (
          <p className="text-sm text-slate-600">No runs yet.</p>
        ) : (
          <ul className="text-sm space-y-2">
            {history.map(h => (
              <li key={h.id} className="flex flex-wrap items-center gap-2">
                <span className={`px-2 py-1 rounded-full text-xs border ${h.success ? 'bg-green-100 border-green-300' : 'bg-red-100 border-red-300'}`}>{h.success ? 'Success' : 'Failed'}</span>
                <span>{h.time.toLocaleString()}</span>
                <span>· {(h.durationMs/1000).toFixed(1)}s</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Session Deployments */}
      <div className="border rounded-lg p-3 bg-white">
        <h3 className="font-semibold text-brand mb-2">Session Deployments</h3>
        {deployments.length === 0 ? (
          <p className="text-sm text-slate-600">No deployments yet. Use the terminal: deploy sandbox --template hello</p>
        ) : (
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {deployments.map(d => (
              <li key={d.id} className="border rounded p-2 bg-slate-50 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-brand">{d.name}</div>
                  <div className="text-xs text-slate-600">{d.time.toLocaleString()}</div>
                </div>
                <div className="flex gap-2">
                  <a className="btn" href={d.url} target="_blank" rel="noopener noreferrer">Open</a>
                  <button className="btn" onClick={()=>setPreviewUrl(d.url)}>Preview</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Preview Modal */}
      {previewUrl && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
          <div className="bg-white border rounded-lg w-[90vw] h-[80vh] relative">
            <button className="btn absolute top-2 right-2" onClick={()=>setPreviewUrl(null)}>Close</button>
            <iframe title="sandbox-preview" src={previewUrl} className="w-full h-full rounded-b" />
          </div>
        </div>
      )}

      {/* Approval Modal */}
      {approvalOpen && (
        <div className={`fixed inset-0 z-50 bg-black/60 modal-overlay backdrop-blur-sm flex items-center justify-center ${approvalClosing ? 'animate-modal-overlay-out' : 'animate-modal-overlay-in'}`}>
          <div className={`bg-white border rounded-lg w-[90vw] max-w-xl p-4 modal-card ${approvalClosing ? 'animate-modal-card-out' : 'animate-modal-card-in'}`}>
            <h3 className="text-brand font-semibold mb-2">Approval: Send Message</h3>
            <div className="grid gap-2">
              <label className="text-sm">Email
                <input className="w-full px-3 py-2 rounded-md border" value={approvalForm.email} onChange={e=>setApprovalForm(f=>({...f, email:e.target.value}))} />
              </label>
              <label className="text-sm">Name
                <input className="w-full px-3 py-2 rounded-md border" value={approvalForm.name} onChange={e=>setApprovalForm(f=>({...f, name:e.target.value}))} />
              </label>
              <label className="text-sm">Message
                <textarea className="w-full px-3 py-2 rounded-md border" rows={4} value={approvalForm.message} onChange={e=>setApprovalForm(f=>({...f, message:e.target.value}))} />
              </label>
            </div>
            <div className="mt-3 flex gap-2">
              <button className="btn" onClick={submitApproval}>Approve & Continue</button>
              <button className="btn" onClick={cancelApproval}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
