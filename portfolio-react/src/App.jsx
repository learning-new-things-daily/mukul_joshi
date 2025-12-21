import { Routes, Route, Link, Navigate } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Projects from './pages/Projects.jsx'
import Blog from './pages/Blog.jsx'
import Resume from './pages/Resume.jsx'
import ResumePreview from './pages/ResumePreview.jsx'
import PostDetail from './pages/PostDetail.jsx'

export default function App(){
  return (
    <div className="mx-auto max-w-5xl p-4">
      <header className="flex items-center justify-between py-3">
        <div><strong>Mukul Joshi</strong> · DevOps Engineer</div>
        <nav className="flex gap-3">
          <Link className="btn" to="/">Home</Link>
          <Link className="btn" to="/projects">Projects</Link>
          <Link className="btn" to="/blog">Blog</Link>
          <Link className="btn" to="/resume">Resume (ATS)</Link>
          <Link className="btn" to="/resume/preview">Resume Preview</Link>
        </nav>
      </header>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<PostDetail />} />
        <Route path="/resume" element={<Resume />} />
        <Route path="/resume/preview" element={<ResumePreview />} />
        {/* Legacy static paths → SPA routes */}
        <Route path="/pages/resume.html" element={<Navigate to="/resume" replace />} />
        <Route path="/pages/resume-preview.html" element={<Navigate to="/resume/preview" replace />} />
        <Route path="/pages/projects.html" element={<Navigate to="/projects" replace />} />
        <Route path="/pages/post-terraform-modules.html" element={<Navigate to="/blog/post-terraform-modules" replace />} />
        <Route path="/pages/post-jenkins-k8s-ci.html" element={<Navigate to="/blog/post-jenkins-k8s-ci" replace />} />
      </Routes>
      <footer className="text-center text-xs text-slate-500 py-6">© Mukul Joshi · DevOps Engineer</footer>
    </div>
  )
}
