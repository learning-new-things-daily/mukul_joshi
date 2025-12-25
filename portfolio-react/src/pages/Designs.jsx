import { useEffect } from 'react'

function Mermaid({ code }){
  useEffect(() => {
    (async () => {
      if(!window.mermaid){
        const s = document.createElement('script')
        s.src = 'https://unpkg.com/mermaid@10/dist/mermaid.min.js'
        s.onload = () => { window.mermaid?.initialize({ startOnLoad: true, theme: 'neutral' }) }
        document.head.appendChild(s)
      } else {
        window.mermaid?.initialize({ startOnLoad: true, theme: 'neutral' })
      }
    })()
  }, [])
  return (
    <pre className="mermaid bg-white border rounded p-3 overflow-auto">{code}</pre>
  )
}

export default function Designs(){
  const aws = `flowchart LR\n  subgraph AWS[VPC]\n    IGW(Internet Gateway)-->ALB(Application Load Balancer)\n    ALB-->EC2\n    EC2-->RDS[(RDS)]\n    EC2-->S3[(S3)]\n  end\n  Dev(Developer)-->CI[CI/CD]\n  CI-->ALB\n  classDef primary fill:#eef3f7,stroke:#cbd5e1,color:#0f172a`;

  const gcp = `flowchart LR\n  subgraph GCP[Cloud Monitoring]\n    App(App)-->Metrics\n    Metrics-->Dashboards\n    Metrics-->Alerts\n  end\n  OnCall(On-call)-->Alerts\n  Dashboards-->Product(Product Team)`;

  const ocp = `flowchart LR\n  subgraph OpenShift\n    Dev(Developer)-->Git-->CI[Pipeline]\n    CI-->Build-->Quay[(Registry)]\n    Quay-->Deploy-->Cluster(Clusters)\n    CI-->Scan[Security Scans]\n  end`;

  return (
    <section className="grid gap-4">
      <h2 className="text-xl text-brand">Architecture Designs</h2>
      <p className="text-sm text-slate-600">Mermaid-rendered diagrams for selected projects.</p>

      <div className="bg-white border rounded p-3">
        <h3 className="font-semibold text-brand mb-2">AWS Infrastructure Automation</h3>
        <Mermaid code={aws} />
      </div>

      <div className="bg-white border rounded p-3">
        <h3 className="font-semibold text-brand mb-2">GCP Monitoring</h3>
        <Mermaid code={gcp} />
      </div>

      <div className="bg-white border rounded p-3">
        <h3 className="font-semibold text-brand mb-2">OpenShift CI/CD Automation</h3>
        <Mermaid code={ocp} />
      </div>
    </section>
  )
}
