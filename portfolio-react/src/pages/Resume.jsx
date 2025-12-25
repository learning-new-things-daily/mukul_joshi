import { Link } from 'react-router-dom'

export default function Resume(){
  return (
    <div className="max-w-4xl mx-auto bg-white text-black p-6 rounded-lg border">
      <header className="flex flex-wrap justify-between items-start gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Mukul Joshi</h1>
          <p className="font-medium">DevOps Engineer</p>
          <p>Kotdwara, Uttarakhand, India</p>
        </div>
        <div className="text-sm">
          <p>📞 <a className="text-blue-700 hover:underline" href="tel:+918057290286">+91 8057290286</a></p>
          <p>✉️ <a className="text-blue-700 hover:underline" href="mailto:mukuljoshi50@gmail.com">mukuljoshi50@gmail.com</a></p>
          <p>🔗 <a className="text-blue-700 hover:underline" href="https://www.linkedin.com/in/mukulmj" target="_blank" rel="noopener noreferrer">linkedin.com/in/mukulmj</a></p>
          <div className="mt-2 flex gap-2 no-print">
            <Link to="/" className="btn">← Back to Portfolio</Link>
            <button className="btn" onClick={() => window.print()}>Download PDF</button>
            <Link to="/resume/preview" className="btn">View Styled Preview</Link>
          </div>
        </div>
      </header>

      <hr className="my-4"/>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold border-b pb-1">Summary</h2>
        <p>
          DevOps Engineer with 5.6 years of IT experience, including 2+ years specializing in DevOps and Cloud Infrastructure.
          Experienced across AWS and GCP with strong hands-on expertise in Terraform, Jenkins, Docker, Kubernetes, and CI/CD automation.
          Passionate about infrastructure optimization, automation, and scalable cloud solutions.
        </p>
      </section>

      <section className="mt-6 space-y-3">
        <h2 className="text-lg font-semibold border-b pb-1">Experience</h2>
        <div>
          <h3 className="font-semibold">DevOps Engineer — Opstree</h3>
          <p className="text-sm text-gray-700">Jan 2023 – Present | Noida, Uttar Pradesh</p>
          <ul className="list-disc ml-5 space-y-1">
            <li>Designed and implemented Infrastructure as Code using Terraform for AWS CI/CD platforms</li>
            <li>Built and maintained Jenkins pipelines integrating Git, Docker, Ansible, and Kubernetes</li>
            <li>Worked extensively with OpenShift clusters for container orchestration and deployments</li>
            <li>Configured and managed Quay container registry and automated image lifecycle management</li>
            <li>Integrated Blackduck and Coverity scans into CI/CD pipelines for security compliance</li>
            <li>Contributed to GCP monitoring and documentation for Client_2 client</li>
            <li>Managed AWS infrastructure provisioning for Client_1 client using Terraform</li>
            <li>Implemented monitoring using Prometheus, Grafana, and Cloud Monitoring</li>
            <li>Collaborated using JIRA, Confluence, and ServiceNow for change management</li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold">MIS Executive — KMC Electronics Limited</h3>
          <p className="text-sm text-gray-700">Sep 2019 – Dec 2022 | Kotdwara, Uttarakhand</p>
          <ul className="list-disc ml-5 space-y-1">
            <li>Managed and analyzed production and operational data</li>
            <li>Created MIS reports and dashboards for management decision-making</li>
            <li>Supported system administration and internal IT coordination</li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold">Customer Service Representative — K.F.T. Pvt. Ltd</h3>
          <p className="text-sm text-gray-700">Sep 2017 – Nov 2018 | Mohali, Punjab</p>
          <ul className="list-disc ml-5 space-y-1">
            <li>Handled customer queries and support requests</li>
            <li>Performed data entry, reporting, and documentation using Excel and MIS tools</li>
          </ul>
        </div>
      </section>

      <section className="mt-6 space-y-2">
        <h2 className="text-lg font-semibold border-b pb-1">Projects</h2>
        <ul className="list-disc ml-5 space-y-1">
          <li><span className="font-semibold">AWS Infrastructure Automation (Client_1):</span> Built reusable Terraform modules for VPC, EC2, RDS, and IAM with Jenkins CI/CD integration</li>
          <li><span className="font-semibold">Google Cloud Monitoring (Client_2):</span> Configured GCP monitoring metrics, dashboards, and operational documentation</li>
          <li><span className="font-semibold">OpenShift CI/CD Automation (Client_3 / Client_4):</span> Implemented CI/CD automation, security scans, and Quay registry management</li>
        </ul>
      </section>

      <section className="mt-6 grid gap-2">
        <h2 className="text-lg font-semibold border-b pb-1">Skills</h2>
        <div><span className="font-semibold">Cloud & Platforms:</span> AWS, GCP, OpenShift, Kubernetes</div>
        <div><span className="font-semibold">IaC & Config:</span> Terraform, Ansible, YAML, JSON</div>
        <div><span className="font-semibold">Containers & Orchestration:</span> Docker, Kubernetes, OpenShift</div>
        <div><span className="font-semibold">CI/CD & VCS:</span> Jenkins, Git, GitHub, GitLab, Bitbucket</div>
        <div><span className="font-semibold">Observability:</span> Prometheus, Grafana, ELK Stack</div>
        <div><span className="font-semibold">Artifacts & Quality:</span> Nexus, Sonar</div>
        <div><span className="font-semibold">Scripting & OS:</span> Bash, Python, Linux</div>
        <div><span className="font-semibold">Collaboration:</span> JIRA, ServiceNow</div>
      </section>

      <section className="mt-6 space-y-2">
        <h2 className="text-lg font-semibold border-b pb-1">Education</h2>
        <p><span className="font-semibold">Diploma in Mechanical Engineering</span><br/>Blue Mountains Group of Colleges (2014 – 2017)</p>
        <p><span className="font-semibold">High School Diploma</span><br/>R.C.D Public School, Kotdwara (2008 – 2010)</p>
      </section>

      <section className="mt-6 space-y-1">
        <h2 className="text-lg font-semibold border-b pb-1">Languages</h2>
        <p>English — Native</p>
        <p>Hindi — Native</p>
      </section>

      <footer className="mt-6 text-xs text-gray-700">© Mukul Joshi | DevOps Engineer</footer>
    </div>
  )
}
