export default function InfoTip({ text, className = '' }){
  return (
    <span className={`inline-flex items-center gap-1 relative group ${className}`} aria-label="Info">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-80">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="16" x2="12" y2="12"/>
        <line x1="12" y1="8" x2="12" y2="8"/>
      </svg>
      <span className="absolute left-5 top-1 z-20 hidden group-hover:block bg-slate-900 text-white text-xs rounded px-2 py-1 border border-slate-700 shadow-lg max-w-xs">
        {text}
      </span>
    </span>
  )
}
