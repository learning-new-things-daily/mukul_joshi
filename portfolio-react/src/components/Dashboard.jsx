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
  const [done, setDone] = useState(0)

  const runPipeline = () => {
    if(running) return
    setRunning(true)
    setProgress(0)
    setDone(0)
    const total = steps.length
    let p = 0, d = 0
    const timer = setInterval(()=>{
      p += 10
      if(p >= 100){
        p = 0
        d += 1
      }
      setProgress((d/total)*100 + (p/total))
      setDone(d)
      if(d >= total){
        clearInterval(timer)
        setRunning(false)
      }
    }, 250)
  }

  // Listen for terminal-triggered pipeline runs
  useEffect(()=>{
    const handler = () => runPipeline()
    document.addEventListener('pipeline-run', handler)
    return () => document.removeEventListener('pipeline-run', handler)
  }, [])

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
          {steps.map((s, i) => (
            <span key={s} className={`px-2 py-1 rounded-full border text-xs ${i < done ? 'bg-green-100 border-green-300' : 'bg-slate-100 border-slate-300'}`}>{s}</span>
          ))}
        </div>
        <div className="h-2 bg-slate-100 rounded"><div className="h-2 bg-brand rounded" style={{width: `${Math.min(100, progress)}%`}}/></div>
        <button className="btn mt-3" onClick={runPipeline} disabled={running}>{running?'Running…':'Run Pipeline'}</button>
      </div>
    </section>
  )
}
