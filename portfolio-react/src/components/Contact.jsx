import { useState } from 'react'

export default function Contact(){
  const [status, setStatus] = useState(null)
  const [error, setError] = useState(null)

  async function handleSubmit(e){
    e.preventDefault()
    setStatus('sending')
    setError(null)
    const form = e.currentTarget
    const data = {
      email: form.email.value,
      message: form.message.value
    }
    try{
      const res = await fetch('https://formspree.io/f/xvzpzkzp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      if(res.ok){
        setStatus('sent')
        form.reset()
      }else{
        const txt = await res.text().catch(()=> '')
        setError(txt || 'Failed to send')
        setStatus('error')
      }
    }catch(err){
      setError(err?.message || 'Network error')
      setStatus('error')
    }
  }

  return (
    <section className="bg-white border rounded-lg p-4">
      <h2 className="text-xl text-brand mb-2">Contact</h2>
      <form onSubmit={handleSubmit} className="grid gap-2 max-w-md">
        <label htmlFor="email">Your email</label>
        <input id="email" name="email" type="email" required className="px-3 py-2 rounded-md border" />
        <label htmlFor="message">Message</label>
        <textarea id="message" name="message" rows="3" required className="px-3 py-2 rounded-md border" />
        <button className="btn" type="submit" disabled={status==='sending'}>{status==='sending'?'Sending…':'Send'}</button>
        {status==='sent' && <p className="text-sm text-green-600">Thanks! Your message was sent.</p>}
        {status==='error' && <p className="text-sm text-red-600">{error || 'Something went wrong.'}</p>}
      </form>
    </section>
  )
}
