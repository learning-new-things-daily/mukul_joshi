export default function Runbooks(){
  const items = [
    {
      title: 'Rollback Deployment',
      steps: [
        'Identify failing version and impacted service',
        'Scale down new version; scale up previous stable',
        'Invalidate caches/CDN if applicable',
        'Notify stakeholders; open incident ticket',
        'Post-mortem: capture diffs and root cause'
      ]
    },
    {
      title: 'Hotfix Procedure',
      steps: [
        'Create hotfix branch from stable',
        'Implement targeted fix with tests',
        'Run CI gates (lint, unit, SAST)',
        'Deploy to canary; monitor metrics',
        'Promote to production upon validation'
      ]
    },
    {
      title: 'Secret Rotation',
      steps: [
        'Issue new secret in vault; set activation window',
        'Update deployments via CI with zero-downtime',
        'Rotate consumers incrementally; monitor failures',
        'Revoke old secret and audit access logs'
      ]
    }
  ]
  return (
    <section className="grid gap-4">
      <h2 className="text-xl text-brand">Runbooks</h2>
      <p className="text-sm text-slate-600">Common operational playbooks for incidents and maintenance.</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {items.map((i)=> (
          <div key={i.title} className="bg-white border rounded p-3">
            <h3 className="font-semibold text-brand mb-2">{i.title}</h3>
            <ol className="text-sm list-decimal ml-5">
              {i.steps.map((s, idx)=> (<li key={idx}>{s}</li>))}
            </ol>
          </div>
        ))}
      </div>
    </section>
  )
}
