import { Routes, Route, Link, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
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
  return (
    <div className="mx-auto max-w-5xl p-4">
      {/* Apply saved theme on load */}
      {useEffect(()=>{
        const saved = localStorage.getItem('theme')
        if(saved === 'dark'){ document.documentElement.classList.add('theme-dark') }
      }, [])}
      <header className="site-header flex items-center justify-between py-3">
        <div><strong>Mukul Joshi</strong> · DevOps Engineer</div>
        <nav className="site-nav flex gap-3">
          <Link className="btn" to="/">Home</Link>
          <Link className="btn" to="/projects">Projects</Link>
          <Link className="btn" to="/designs">Designs</Link>
          <Link className="btn" to="/iac">IaC</Link>
          <Link className="btn" to="/runbooks">Runbooks</Link>
          <Link className="btn" to="/security">Security</Link>
          <Link className="btn" to="/cost">Cost</Link>
          <Link className="btn" to="/blog">Blog</Link>
          <Link className="btn" to="/resume">Resume (ATS)</Link>
          <Link className="btn" to="/resume/preview">Resume Preview</Link>
          <Link className="btn" to="/admin">Admin</Link>
        </nav>
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
