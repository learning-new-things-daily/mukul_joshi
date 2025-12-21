import { useState } from 'react'

const HELP = `Available commands:\nwhoami\nskills --list\nexperience --show\nclear`;

export default function Terminal(){
  const [lines, setLines] = useState(['Type "help" to get started.'])
  const [cmd, setCmd] = useState('')

  const run = (text) => {
    const t = text.trim()
    if(!t) return
    let out = ''
    if(t === 'help'){ out = HELP }
    else if(t === 'whoami'){ out = 'Mukul Joshi — DevOps Engineer (CI/CD, Cloud, Automation)'}
    else if(t.startsWith('skills')){ out = 'Cloud: AWS, GCP\nCI/CD: Jenkins, GitHub Actions\nIaC: Terraform, Ansible\nContainers: Docker, Kubernetes' }
    else if(t.startsWith('experience')){ out = 'Opstree (2023–Present): Terraform on AWS, Jenkins pipelines, K8s/OpenShift\nKMC Electronics (2019–2022): Reporting & dashboards\nK.F.T. (2017–2018): Customer support' }
    else if(t === 'clear'){ setLines([]); return }
    else { out = `Command not found: ${t}\nType 'help' for options.` }
    setLines(prev => [...prev, `$ ${t}`, out])
  }

  return (
    <section className="grid gap-2">
      <h2 className="text-xl text-brand">Terminal</h2>
      <div className="bg-[#0b0f14] text-[#b8d3ff] border border-[#132235] rounded-lg p-3 font-mono">
        <div className="min-h-[120px] whitespace-pre-wrap">{lines.join('\n\n')}</div>
        <input
          className="w-full mt-3 px-3 py-2 rounded-md border border-[#25425f] bg-[#091019] text-[#cfe4ff]"
          placeholder="$ enter command (e.g., whoami, skills --list)"
          value={cmd}
          onChange={e=>setCmd(e.target.value)}
          onKeyDown={e=>{ if(e.key==='Enter'){ run(cmd); setCmd('') } }}
          aria-label="Terminal input"
        />
      </div>
    </section>
  )
}
