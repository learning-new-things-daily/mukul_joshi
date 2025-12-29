import { Routes, Route, Link, Navigate } from 'react-router-dom'
import { useEffect, useState, useRef } from 'react'
import Home from './pages/Home.jsx'
import Projects from './pages/Projects.jsx'
import Blog from './pages/Blog.jsx'
import Resume from './pages/Resume.jsx'
import ResumePreview from './pages/ResumePreview.jsx'
import PostDetail from './pages/PostDetail.jsx'
import Designs from './pages/Designs.jsx'
import IaC from './pages/IaC.jsx'
import Runbooks from './pages/Runbooks.jsx'
import SecurityGates from './pages/SecurityGates.jsx'
import CostControls from './pages/CostControls.jsx'
import Admin from './pages/Admin.jsx'

export default function App(){
  const [menuOpen, setMenuOpen] = useState(false)
  const [moreOpen, setMoreOpen] = useState(false)
  const moreRef = useRef(null)
  useEffect(()=>{
    const onDocClick = (e) => { if(moreRef.current && !moreRef.current.contains(e.target)) setMoreOpen(false) }
    const onKey = (e) => { if(e.key === 'Escape') setMoreOpen(false) }
    document.addEventListener('click', onDocClick)
    document.addEventListener('keydown', onKey)
    return ()=> { document.removeEventListener('click', onDocClick); document.removeEventListener('keydown', onKey) }
  }, [])
  return (
    <div className="w-full px-3 sm:px-4 lg:px-8">
      {/* Apply saved theme on load */}
      {useEffect(()=>{
        const saved = localStorage.getItem('theme')
        if(saved === 'dark'){ document.documentElement.classList.add('theme-dark') }
      }, [])}
      <header className="site-header sticky top-0 z-40 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/70 border-b flex flex-wrap items-center justify-between gap-2 py-3">
        <div className="flex items-center gap-2">
          <strong>Mukul Joshi</strong>
          <span className="hidden sm:inline">· DevOps Engineer</span>
        </div>
        {/* Mobile: hamburger toggles full list */}
        <button
          className="md:hidden inline-flex items-center justify-center px-3 py-2 rounded-md border border-slate-700 bg-brand text-white focus:outline-none focus:ring-2 focus:ring-brand"
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen ? 'true' : 'false'}
          onClick={()=>setMenuOpen(v=>!v)}
        >
          {/* three lines icon */}
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
        </button>
        <nav className={`site-nav ${menuOpen ? 'flex' : 'hidden'} md:hidden w-full flex-col gap-2 overflow-x-auto no-scrollbar`}>          
          <Link className="btn btn-sm" to="/">Home</Link>
          <Link className="btn btn-sm" to="/projects">Projects</Link>
          <Link className="btn btn-sm" to="/designs">Designs</Link>
          <Link className="btn btn-sm" to="/iac">IaC</Link>
          <Link className="btn btn-sm" to="/runbooks">Runbooks</Link>
          <Link className="btn btn-sm" to="/security">Security</Link>
          <Link className="btn btn-sm" to="/cost">Cost</Link>
          <Link className="btn btn-sm" to="/blog">Blog</Link>
          <Link className="btn btn-sm" to="/resume">Resume (ATS)</Link>
          <Link className="btn btn-sm" to="/resume/preview">Resume Preview</Link>
          <Link className="btn btn-sm" to="/admin">Admin</Link>
        </nav>
        {/* Desktop: show primary links + More dropdown */}
        <div className="hidden md:flex items-center gap-2 relative" ref={moreRef}>
          <nav className="flex items-center gap-2">
            <Link className="btn btn-sm" to="/">Home</Link>
            <Link className="btn btn-sm" to="/projects">Projects</Link>
            <Link className="btn btn-sm" to="/blog">Blog</Link>
          </nav>
          <button
            className="inline-flex items-center justify-center px-3 py-2 rounded-md border border-slate-700 bg-brand text-white focus:outline-none focus:ring-2 focus:ring-brand"
            aria-label="Open more pages"
            aria-expanded={moreOpen ? 'true':'false'}
            onClick={()=>setMoreOpen(v=>!v)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          </button>
          {moreOpen && (
            <div role="menu" className="absolute right-0 mt-2 w-64 menu-card z-50">
              <div className="text-xs text-slate-500 px-3 pb-2">More</div>
              <div className="flex flex-col divide-y divide-slate-200">
                <Link role="menuitem" className="menu-item" to="/designs" onClick={()=>setMoreOpen(false)}>Designs</Link>
                <Link role="menuitem" className="menu-item" to="/iac" onClick={()=>setMoreOpen(false)}>IaC</Link>
                <Link role="menuitem" className="menu-item" to="/runbooks" onClick={()=>setMoreOpen(false)}>Runbooks</Link>
                <Link role="menuitem" className="menu-item" to="/security" onClick={()=>setMoreOpen(false)}>Security</Link>
                <Link role="menuitem" className="menu-item" to="/cost" onClick={()=>setMoreOpen(false)}>Cost</Link>
                <Link role="menuitem" className="menu-item" to="/resume" onClick={()=>setMoreOpen(false)}>Resume (ATS)</Link>
                <Link role="menuitem" className="menu-item" to="/resume/preview" onClick={()=>setMoreOpen(false)}>Resume Preview</Link>
                <Link role="menuitem" className="menu-item" to="/admin" onClick={()=>setMoreOpen(false)}>Admin</Link>
              </div>
            </div>
          )}
        </div>
      </header>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/designs" element={<Designs />} />
        <Route path="/iac" element={<IaC />} />
        <Route path="/runbooks" element={<Runbooks />} />
        <Route path="/security" element={<SecurityGates />} />
        <Route path="/cost" element={<CostControls />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<PostDetail />} />
        <Route path="/resume" element={<Resume />} />
        <Route path="/resume/preview" element={<ResumePreview />} />
        <Route path="/admin" element={<Admin />} />
        {/* Legacy static paths → SPA routes */}
        <Route path="/pages/resume.html" element={<Navigate to="/resume" replace />} />
        <Route path="/pages/resume/preview.html" element={<Navigate to="/resume/preview" replace />} />
        <Route path="/pages/projects.html" element={<Navigate to="/projects" replace />} />
        <Route path="/pages/post-terraform-modules.html" element={<Navigate to="/blog/post-terraform-modules" replace />} />
        <Route path="/pages/post-jenkins-k8s-ci.html" element={<Navigate to="/blog/post-jenkins-k8s-ci" replace />} />
      </Routes>
      <footer className="site-footer text-center text-xs text-slate-500 py-6">© Mukul Joshi · DevOps Engineer</footer>
    </div>
  )
}
