import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const HELP = `Available commands:\nwhoami\nskills --list\nexperience --show\nopen <resume|preview|projects|blog>\nprint <resume|preview>\ntheme --set <dark|light>\ntheme --status\nabout\ncerts --list\npipeline --run\npipeline --retry\npipeline --resume\ncontact --run <email>\ndeploy sandbox --template <hello|chart|terminal|markdown|table>\ndeploy open <last|index>\ndeploy list\nhistory\nclear\nreboot`;

export default function Terminal(){
  const navigate = useNavigate()
  const [lines, setLines] = useState(['Type "help" to get started.'])
  const [cmd, setCmd] = useState('')
  const [history, setHistory] = useState([])

  const run = (text) => {
    const t = text.trim()
    if(!t) return
    let out = ''
    if(t === 'help'){ out = HELP }
    else if(t === 'help --verbose'){
      out = HELP + `\n\nExamples:\nopen resume\nprint preview\ntheme --set dark\npipeline --run\nreboot`;
    }
    else if(t === 'whoami'){ out = 'Mukul Joshi — DevOps Engineer (CI/CD, Cloud, Automation)'}
    else if(t.startsWith('skills')){ out = 'Cloud: AWS, GCP\nCI/CD: Jenkins, GitHub Actions\nIaC: Terraform, Ansible\nContainers: Docker, Kubernetes' }
    else if(t.startsWith('experience')){ out = 'Opstree (2023–Present): Terraform on AWS, Jenkins pipelines, K8s/OpenShift\nKMC Electronics (2019–2022): Reporting & dashboards\nK.F.T. (2017–2018): Customer support' }
    else if(t.startsWith('open ')){
      const dest = t.split(' ')[1]
      if(['resume','preview','projects','blog'].includes(dest)){
        navigate(dest === 'preview' ? '/resume/preview' : `/${dest}`)
        out = `Navigated to ${dest}`
      } else { out = 'Usage: open <resume|preview|projects|blog>' }
    }
    else if(t.startsWith('print ')){
      const which = t.split(' ')[1]
      if(which === 'resume'){ navigate('/resume'); setTimeout(()=>window.print(), 200); out='Printing resume...' }
      else if(which === 'preview'){ navigate('/resume/preview'); setTimeout(()=>window.print(), 200); out='Printing preview...' }
      else { out = 'Usage: print <resume|preview>' }
    }
    else if(t.startsWith('theme')){
      if(t.includes('--set')){
        if(t.includes('dark')){ document.documentElement.classList.add('theme-dark'); localStorage.setItem('theme','dark'); out='Theme: dark' }
        else if(t.includes('light')){ document.documentElement.classList.remove('theme-dark'); localStorage.setItem('theme','light'); out='Theme: light' }
        else { out='Usage: theme --set <dark|light>' }
      } else if(t.includes('--status')) {
        out = document.documentElement.classList.contains('theme-dark') ? 'Theme: dark' : 'Theme: light'
      } else { out = 'Usage: theme --set <dark|light> | theme --status' }
    }
    else if(t === 'about'){
      out = 'DevOps Engineer with 5.6 years overall and 2+ in Cloud/DevOps; AWS/GCP, Terraform, Jenkins, Docker, Kubernetes.'
    }
    else if(t.startsWith('certs')){
      out = 'Certifications: AWS, GCP, Kubernetes, Docker, DevOps'
    }
    else if(t === 'pipeline --run'){
      document.dispatchEvent(new CustomEvent('pipeline-run'))
      out = 'Triggered pipeline run.'
    }
    else if(t === 'pipeline --retry'){
      document.dispatchEvent(new Event('pipeline-retry'))
      out = 'Requested retry of last pipeline.'
    }
    else if(t === 'pipeline --resume'){
      document.dispatchEvent(new Event('pipeline-resume'))
      out = 'Requested resume from failed step.'
    }
    else if(t.startsWith('contact --run')){
      const m = t.match(/contact\s+--run\s+(\S+)/)
      const email = m?.[1]
      if(email){
        document.dispatchEvent(new CustomEvent('contact-request', { detail: { email } }))
        out = `Triggered contact pipeline for '${email}'.`
      } else {
        out = 'Usage: contact --run <email>'
      }
    }
    else if(t.startsWith('deploy sandbox')){
      const match = t.match(/--template\s+(\w+)/)
      const tpl = match?.[1]
      if(['hello','chart','terminal','markdown','table'].includes(tpl)){
        document.dispatchEvent(new CustomEvent('deploy-request', { detail: { template: tpl } }))
        out = `Requested deployment for sandbox template '${tpl}'. Watch the Pipeline Run panel.`
      } else {
        out = "Usage: deploy sandbox --template <hello|chart|terminal|markdown|table>"
      }
    }
    else if(t.startsWith('deploy open')){
      const arg = t.split(' ')[2]
      if(arg === 'last'){ document.dispatchEvent(new CustomEvent('deploy-open', { detail: { which: 'last' } })); out='Opening last deployment preview.' }
      else {
        const idx = parseInt(arg, 10)
        if(Number.isFinite(idx)){
          document.dispatchEvent(new CustomEvent('deploy-open', { detail: { which: idx } })); out=`Opening deployment #${idx} preview.`
        } else { out='Usage: deploy open <last|index>' }
      }
    }
    else if(t === 'deploy list'){
      const items = window.__sessionDeployments || []
      out = items.length ? items.map((d,i)=>`${i+1}. ${d.name} → ${d.url}`).join('\n') : 'No deployments.'
    }
    else if(t === 'history'){
      out = history.length ? history.map((h,i)=>`${i+1}. ${h}`).join('\n') : 'No history.'
    }
    else if(t === 'reboot'){
      out = 'Rebooting terminal...';
      // Give users a moment to see the message before reload
      setTimeout(()=>{ try { window.location.reload(); } catch(e){} }, 600)
    }
    else if(t === 'clear'){ setLines([]); return }
    else if(t === 'cls'){ setLines([]); return }
    else { out = `Command not found: ${t}\nType 'help' for options.` }
    setLines(prev => [...prev, `$ ${t}`, out])
    setHistory(prev => [...prev, t])
  }

  return (
    <section className="grid gap-2">
      <h2 className="text-xl text-brand">Terminal</h2>
      <div className="bg-[#0b0f14] text-[#b8d3ff] border border-[#132235] rounded-lg p-3 font-mono">
        <div className="min-h-[120px] whitespace-pre-wrap">{lines.join('\n\n')}</div>
        <input
          className="w-full mt-3 px-3 py-2 rounded-md border border-[#25425f] bg-[#091019] text-[#cfe4ff]"
          placeholder="$ enter command (help for list)"
          value={cmd}
          onChange={e=>setCmd(e.target.value)}
          onKeyDown={e=>{ if(e.key==='Enter'){ run(cmd); setCmd('') } }}
          aria-label="Terminal input"
        />
      </div>
    </section>
  )
}
