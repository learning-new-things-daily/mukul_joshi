import { useEffect, useState } from 'react'
import { getProjects } from '../services/dataService.js'

export default function Projects(){
  const [projects, setProjects] = useState([])
  useEffect(()=>{ getProjects().then(setProjects).catch(()=>setProjects([])) }, [])
  return (
    <div className="grid gap-3">
      <h1 className="text-2xl text-brand">Projects</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {projects.map(p => (
          <div key={p.id} className="bg-white border rounded-lg p-3">
            <h3 className="font-semibold">{p.title}</h3>
            <p className="text-sm text-slate-600">{p.summary}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {p.tags?.map(t => (<span key={t} className="px-2 py-1 rounded-full border text-xs">{t}</span>))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
