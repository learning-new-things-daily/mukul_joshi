import { useEffect, useRef, useState } from 'react'

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
  const steps = ['Checkout','Build','Test','Deploy']
  const [running, setRunning] = useState(false)
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState(Array(steps.length).fill('pending')) // pending|in-progress|success|failed
  const [logLines, setLogLines] = useState([])
  const logRef = useRef(null)
  const [history, setHistory] = useState([])
  const [deployments, setDeployments] = useState([]) // { id, name, url, time }

  const appendLog = (line) => {
    const ts = new Date().toLocaleTimeString()
    setLogLines(prev => [...prev, `[${ts}] ${line}`])
  }

  useEffect(()=>{ if(logRef.current){ logRef.current.scrollTop = logRef.current.scrollHeight } }, [logLines])

  const wait = (ms) => new Promise(res => setTimeout(res, ms))

  const runPipeline = async (template) => {
    if(running) return
    setRunning(true)
    setProgress(0)
    setStatus(Array(steps.length).fill('pending'))
    setLogLines([])
    appendLog(`Pipeline started${template ? ` for sandbox '${template}'` : ''}.`)
    const start = Date.now()
    let localStatus = Array(steps.length).fill('pending')
    let failed = false

    for(let i=0;i<steps.length;i++){
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
          const item = { id, name, url, time: new Date(id) }
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

  // Listen for terminal-triggered pipeline runs
  useEffect(()=>{
    const handler = () => runPipeline()
    document.addEventListener('pipeline-run', handler)
    return () => document.removeEventListener('pipeline-run', handler)
  }, [])

  // Listen for deploy requests from Terminal
  useEffect(()=>{
    const handler = (e) => runPipeline(e.detail?.template)
    document.addEventListener('deploy-request', handler)
    return () => document.removeEventListener('deploy-request', handler)
  }, [])

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
        <button className="btn mt-3" onClick={runPipeline} disabled={running}>{running?'Running…':'Run Pipeline'}</button>

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
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
