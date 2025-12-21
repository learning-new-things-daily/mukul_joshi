import { Link } from 'react-router-dom'
import posts from '../data/posts.json'

export default function Blog(){
  return (
    <div className="grid gap-3">
      <h1 className="text-2xl text-brand">Blog</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {posts.map(p => (
          p.external ? (
            <a key={p.title} href={p.url} target="_blank" rel="noopener noreferrer" className="bg-white border rounded-lg p-3">
              <h3 className="font-semibold">{p.title}</h3>
              <p className="text-sm text-slate-600">{p.summary}</p>
            </a>
          ) : (
            <Link key={p.title} to={`/blog/${p.url.replace('.html','')}`} className="bg-white border rounded-lg p-3">
              <h3 className="font-semibold">{p.title}</h3>
              <p className="text-sm text-slate-600">{p.summary}</p>
            </Link>
          )
        ))}
      </div>
    </div>
  )
}
