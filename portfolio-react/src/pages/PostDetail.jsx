import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getPosts } from '../services/dataService.js'

export default function PostDetail(){
  const { slug } = useParams()
  const [post, setPost] = useState(null)
  useEffect(()=>{ getPosts().then(ps => setPost(ps.find(p => p.url.replace('.html','') === slug) || null)).catch(()=>setPost(null)) }, [slug])
  if(!post) return <p>Post not found.</p>
  return (
    <article className="prose">
      <h1 className="text-2xl text-brand">{post.title}</h1>
      <p className="text-sm text-slate-600">{post.summary}</p>
      <p className="mt-3 text-slate-500">This is a placeholder page. You can render Markdown or fetch HTML content for full posts.</p>
    </article>
  )
}
