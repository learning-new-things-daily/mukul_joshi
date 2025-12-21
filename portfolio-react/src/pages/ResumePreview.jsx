import { Link } from 'react-router-dom'

export default function ResumePreview(){
  return (
    <div className="max-w-3xl mx-auto grid gap-4">
      <div className="bg-white border rounded-lg p-6 shadow-sm">
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl text-brand font-semibold m-0">Mukul Joshi</h1>
            <p className="text-sm">DevOps Engineer</p>
            <p className="text-sm text-slate-600">Kotdwara, Uttarakhand, India</p>
          </div>
          <div className="text-sm">
            <p>📞 <a className="text-brand" href="tel:+918057290286">+91 8057290286</a></p>
            <p>✉️ <a className="text-brand" href="mailto:mukuljoshi50@gmail.com">mukuljoshi50@gmail.com</a></p>
            <p>🔗 <a className="text-brand" href="https://www.linkedin.com/in/mukulmj" target="_blank" rel="noopener noreferrer">linkedin.com/in/mukulmj</a></p>
            <p className="mt-2 no-print">
              <Link to="/" className="btn mr-2">← Back to Portfolio</Link>
              <button className="btn" onClick={()=>window.print()}>Download PDF</button>
            </p>
          </div>
        </div>
      </div>

      {/* Summary */}
      <section className="bg-white border rounded-lg p-6">
        <h2 className="text-xl text-brand mb-2 border-b border-brand/50 pb-1">Summary</h2>
        <p>
          DevOps Engineer with 5.6 years of IT experience, including 2+ years specializing in
          DevOps and Cloud Infrastructure. Experienced across AWS and GCP with strong hands-on
          expertise in Terraform, Jenkins, Docker, Kubernetes, and CI/CD automation.
          Passionate about infrastructure optimization, automation, and scalable cloud solutions.
        </p>
      </section>

      {/* Experience */}
      <section className="bg-white border rounded-lg p-6">
        <h2 className="text-xl text-brand mb-2 border-b border-brand/50 pb-1">Experience</h2>
        <div className="grid gap-4">
          <div>
            <h3 className="font-semibold">DevOps Engineer — Opstree</h3>
            <span className="text-xs text-slate-600">Jan 2023 – Present | Noida, Uttar Pradesh</span>
            <ul className="list-disc pl-5 mt-2 space-y-1 text-sm">
              <li>Designed and implemented Infrastructure as Code using Terraform for AWS CI/CD platforms</li>
              <li>Built and maintained Jenkins pipelines integrating Git, Docker, Ansible, and Kubernetes</li>
              <li>Worked extensively with OpenShift clusters for container orchestration and deployments</li>
              <li>Configured and managed Quay container registry and automated image lifecycle management</li>
              <li>Integrated Blackduck and Coverity scans into CI/CD pipelines for security compliance</li>
              <li>Contributed to GCP monitoring and documentation for ShareChat client</li>
              <li>Managed AWS infrastructure provisioning for Nxtpe client using Terraform</li>
              <li>Implemented monitoring using Prometheus, Grafana, and Cloud Monitoring</li>
              <li>Collaborated using JIRA, Confluence, and ServiceNow for change management</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold">MIS Executive — KMC Electronics Limited</h3>
            <span className="text-xs text-slate-600">Sep 2019 – Dec 2022 | Kotdwara, Uttarakhand</span>
            <ul className="list-disc pl-5 mt-2 space-y-1 text-sm">
              <li>Managed and analyzed production and operational data</li>
              <li>Created MIS reports and dashboards for management decision-making</li>
              <li>Supported system administration and internal IT coordination</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold">Customer Service Representative — K.F.T. Pvt. Ltd</h3>
            <span className="text-xs text-slate-600">Sep 2017 – Nov 2018 | Mohali, Punjab</span>
            <ul className="list-disc pl-5 mt-2 space-y-1 text-sm">
              <li>Handled customer queries and support requests</li>
              <li>Performed data entry, reporting, and documentation using Excel and MIS tools</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Projects */}
      <section className="bg-white border rounded-lg p-6">
        <h2 className="text-xl text-brand mb-2 border-b border-brand/50 pb-1">Projects</h2>
        <ul className="list-disc pl-5 space-y-1 text-sm">
          <li><strong>AWS Infrastructure Automation (Nxtpe):</strong> Built reusable Terraform modules for VPC, EC2, RDS, and IAM with Jenkins CI/CD integration</li>
          <li><strong>Google Cloud Monitoring (ShareChat):</strong> Configured GCP monitoring metrics, dashboards, and operational documentation</li>
          <li><strong>OpenShift CI/CD Automation (IFTAS / REBIT):</strong> Implemented CI/CD automation, security scans, and Quay registry management</li>
        </ul>
      </section>

      {/* Skills */}
      <section className="bg-white border rounded-lg p-6">
        <h2 className="text-xl text-brand mb-3 border-b border-brand/50 pb-1">Skills</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <h3 className="text-sm text-brand">☁️ Cloud & Platforms</h3>
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="px-2 py-1 rounded-full border text-xs">AWS</span>
              <span className="px-2 py-1 rounded-full border text-xs">GCP</span>
              <span className="px-2 py-1 rounded-full border text-xs">OpenShift</span>
              <span className="px-2 py-1 rounded-full border text-xs">Kubernetes</span>
            </div>
          </div>
          <div>
            <h3 className="text-sm text-brand">🧩 IaC & Config</h3>
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="px-2 py-1 rounded-full border text-xs">Terraform</span>
              <span className="px-2 py-1 rounded-full border text-xs">Ansible</span>
              <span className="px-2 py-1 rounded-full border text-xs">YAML</span>
              <span className="px-2 py-1 rounded-full border text-xs">JSON</span>
            </div>
          </div>
          <div>
            <h3 className="text-sm text-brand">🐳 Containers & Orchestration</h3>
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="px-2 py-1 rounded-full border text-xs">Docker</span>
              <span className="px-2 py-1 rounded-full border text-xs">Kubernetes</span>
              <span className="px-2 py-1 rounded-full border text-xs">OpenShift</span>
            </div>
          </div>
          <div>
            <h3 className="text-sm text-brand">🚀 CI/CD & VCS</h3>
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="px-2 py-1 rounded-full border text-xs">Jenkins</span>
              <span className="px-2 py-1 rounded-full border text-xs">Git</span>
              <span className="px-2 py-1 rounded-full border text-xs">GitHub</span>
              <span className="px-2 py-1 rounded-full border text-xs">GitLab</span>
              <span className="px-2 py-1 rounded-full border text-xs">Bitbucket</span>
            </div>
          </div>
          <div>
            <h3 className="text-sm text-brand">📊 Observability</h3>
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="px-2 py-1 rounded-full border text-xs">Prometheus</span>
              <span className="px-2 py-1 rounded-full border text-xs">Grafana</span>
              <span className="px-2 py-1 rounded-full border text-xs">ELK Stack</span>
            </div>
          </div>
          <div>
            <h3 className="text-sm text-brand">🧱 Artifacts & Quality</h3>
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="px-2 py-1 rounded-full border text-xs">Nexus</span>
              <span className="px-2 py-1 rounded-full border text-xs">Sonar</span>
            </div>
          </div>
          <div>
            <h3 className="text-sm text-brand">💻 Scripting & OS</h3>
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="px-2 py-1 rounded-full border text-xs">Bash</span>
              <span className="px-2 py-1 rounded-full border text-xs">Python</span>
              <span className="px-2 py-1 rounded-full border text-xs">Linux</span>
            </div>
          </div>
          <div>
            <h3 className="text-sm text-brand">🤝 Collaboration</h3>
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="px-2 py-1 rounded-full border text-xs">JIRA</span>
              <span className="px-2 py-1 rounded-full border text-xs">ServiceNow</span>
            </div>
          </div>
        </div>
      </section>

      {/* Education */}
      <section className="bg-white border rounded-lg p-6">
        <h2 className="text-xl text-brand mb-2 border-b border-brand/50 pb-1">Education</h2>
        <p><strong>Diploma in Mechanical Engineering</strong><br/>Blue Mountains Group of Colleges (2014 – 2017)</p>
        <p className="mt-2"><strong>High School Diploma</strong><br/>R.C.D Public School, Kotdwara (2008 – 2010)</p>
      </section>

      {/* Languages */}
      <section className="bg-white border rounded-lg p-6">
        <h2 className="text-xl text-brand mb-2 border-b border-brand/50 pb-1">Languages</h2>
        <p>English — Native</p>
        <p>Hindi — Native</p>
      </section>
    </div>
  )
}
