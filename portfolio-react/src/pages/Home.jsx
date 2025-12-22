import { Link } from 'react-router-dom'
import projects from '../data/projects.json'
import posts from '../data/posts.json'
import Dashboard from '../components/Dashboard.jsx'
import Terminal from '../components/UI/Terminal.jsx'
import Contact from '../components/Contact.jsx'
import DevOpsBadges from '../components/DevOpsBadges.jsx'

export default function Home(){
  return (
    <div className="grid gap-4">
      <section className="bg-white border rounded-lg p-4">
        <h1 className="text-2xl text-brand">Hello, I'm Mukul</h1>
        <p>Cloud automation, Kubernetes, and CI/CD at scale.</p>
        <p className="mt-2 flex gap-2">
          <Link className="btn" to="/resume">Download CV</Link>
          <Link className="btn" to="/projects">View Projects</Link>
          <a className="btn" href="mailto:mukuljoshi50@gmail.com">Contact Me</a>
        </p>
      </section>

      <Dashboard />
      <DevOpsBadges />
      <Terminal />

      <section className="bg-white border rounded-lg p-4">
        <h2 className="text-xl text-brand mb-2">Featured Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {projects.slice(0,2).map(p => (
            <div key={p.id} className="border rounded-lg p-3">
              <h3 className="font-semibold">{p.title}</h3>
              <p className="text-sm text-slate-600">{p.summary}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white border rounded-lg p-4">
        <h2 className="text-xl text-brand mb-2">Recent Posts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {posts.filter(p=>!p.external).slice(0,2).map(p => (
            <div key={p.title} className="border rounded-lg p-3">
              <h3 className="font-semibold"><Link to={`/blog/${p.url.replace('.html','')}`}>{p.title}</Link></h3>
              <p className="text-sm text-slate-600">{p.summary}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Timeline */}
      <section className="bg-white border rounded-lg p-4">
        <h2 className="text-xl text-brand mb-2">Experience Timeline</h2>
        <div className="relative pl-6">
          <div className="absolute left-2 top-0 bottom-0 w-0.5 bg-slate-200" />
          <div className="mb-3">
            <div className="font-semibold text-brand">DevOps Engineer — Opstree</div>
            <div className="text-xs text-slate-500">Jan 2023 – Present · Noida</div>
            <p>Terraform on AWS, Jenkins pipelines, Kubernetes/OpenShift, security gates.</p>
          </div>
          <div className="mb-3">
            <div className="font-semibold text-brand">MIS Executive — KMC Electronics</div>
            <div className="text-xs text-slate-500">Sep 2019 – Dec 2022 · Kotdwara</div>
            <p>Operational data analysis, reporting, dashboards.</p>
          </div>
          <div className="mb-3">
            <div className="font-semibold text-brand">Customer Service Representative — K.F.T. Pvt. Ltd</div>
            <div className="text-xs text-slate-500">Sep 2017 – Nov 2018 · Mohali</div>
            <p>Customer support, documentation, process tracking.</p>
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="bg-white border rounded-lg p-4">
        <h2 className="text-xl text-brand mb-2">Certifications</h2>
        <p className="flex flex-wrap gap-2">
          <span className="px-2 py-1 rounded-full border text-xs">AWS</span>
          <span className="px-2 py-1 rounded-full border text-xs">GCP</span>
          <span className="px-2 py-1 rounded-full border text-xs">Kubernetes</span>
          <span className="px-2 py-1 rounded-full border text-xs">Docker</span>
          <span className="px-2 py-1 rounded-full border text-xs">DevOps</span>
        </p>
      </section>

      <Contact />
    </div>
  )
}
