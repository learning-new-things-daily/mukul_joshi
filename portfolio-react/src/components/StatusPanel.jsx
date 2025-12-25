import { useEffect, useRef, useState } from 'react'
import InfoTip from './UI/InfoTip.jsx'
import { SITE } from '../config/siteConfig.js'

export default function StatusPanel(){
  const [samples, setSamples] = useState([]) // { t, ms, ok }
  const [uptime, setUptime] = useState({ ok: 0, total: 0 })
  const timerRef = useRef(null)

  useEffect(()=>{
    const base = import.meta.env.BASE_URL || '/'
    const target = base + 'index.html'
    async function ping(){
      const start = performance.now()
      try{
        const resp = await fetch(target, { cache: 'no-store' })
        const ms = performance.now() - start
        const ok = resp.ok
        setSamples(prev => [ { t: new Date(), ms, ok }, ...prev ].slice(0,20))
        setUptime(u => ({ ok: u.ok + (ok?1:0), total: u.total + 1 }))
        if(!ok || ms > 1000){
          try { document.dispatchEvent(new CustomEvent('monitor-alert', { detail: { type: !ok ? 'down' : 'slow', latencyMs: ms } })) } catch {}
        }
      } catch{
        const ms = performance.now() - start
        setSamples(prev => [ { t: new Date(), ms, ok: false }, ...prev ].slice(0,20))
        setUptime(u => ({ ok: u.ok, total: u.total + 1 }))
        try { document.dispatchEvent(new CustomEvent('monitor-alert', { detail: { type: 'down', latencyMs: ms } })) } catch {}
      }
    }
    ping()
    timerRef.current = setInterval(ping, 15000)
    return ()=>{ if(timerRef.current){ clearInterval(timerRef.current) } }
  }, [])

  const pct = uptime.total ? Math.round((uptime.ok/uptime.total)*100) : 100
  const latest = samples[0]?.ms ?? null
  const avgMs = samples.length ? Math.round(samples.reduce((a,c)=>a+c.ms,0)/samples.length) : null

  return (
    <div className="border rounded-lg p-3 bg-white">
      <h3 className="font-semibold text-brand mb-2 flex items-center gap-2">Status Monitor <InfoTip text="Pings the site periodically to track latency and uptime (client-side sampling)." /></h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        <Card label="Uptime" value={`${pct}%`} />
        <Card label="Latest Latency" value={latest ? `${latest.toFixed(0)} ms` : '—'} />
        <Card label="Avg Latency" value={avgMs ? `${avgMs} ms` : '—'} />
        <Card label="Samples" value={samples.length} />
      </div>
      <div className="mt-2 text-xs text-slate-600">Last 20 samples shown; refreshes every ~15s.</div>
    </div>
  )
}

function Card({ label, value }){
  return (
    <div className="border rounded p-2 bg-slate-50">
      <div className="text-xs text-slate-600">{label}</div>
      <div className="text-lg">{value}</div>
    </div>
  )
}
