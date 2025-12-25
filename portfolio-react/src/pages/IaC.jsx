export default function IaC(){
  return (
    <section className="grid gap-4">
      <h2 className="text-xl text-brand">Infrastructure as Code Showcase</h2>
      <p className="text-sm text-slate-600">Selected snippets: Terraform modules, Jenkins pipelines, and Helm charts.</p>

      <div className="bg-white border rounded p-3">
        <h3 className="font-semibold text-brand mb-2">Terraform: Reusable VPC Module</h3>
        <pre className="bg-slate-900 text-slate-100 p-3 rounded overflow-auto text-xs">
{`module "vpc" {
  source   = "github.com/org/terraform-aws-vpc"
  name     = var.name
  cidr     = var.cidr
  azs      = data.aws_availability_zones.available.names
  public_subnets  = var.public_subnets
  private_subnets = var.private_subnets
  enable_nat_gateway = true
  tags = {
    env = var.env
    owner = "platform"
  }
}`}
        </pre>
        <p className="text-xs text-slate-600">Pattern: inputs via variables, outputs consumed by downstream modules; standardized tagging.</p>
      </div>

      <div className="bg-white border rounded p-3">
        <h3 className="font-semibold text-brand mb-2">Jenkins: CI/CD Pipeline (Declarative)</h3>
        <pre className="bg-slate-900 text-slate-100 p-3 rounded overflow-auto text-xs">
{`pipeline {
  agent any
  stages {
    stage('Checkout') { steps { checkout scm } }
    stage('Build')    { steps { sh 'make build' } }
    stage('Test')     { steps { sh 'make test' } }
    stage('Scan')     { steps { sh 'trivy image $IMAGE' } }
    stage('Deploy')   {
      when { branch 'main' }
      steps { sh './scripts/deploy.sh' }
    }
  }
  post { failure { mail to: 'oncall@example.com', subject: 'Pipeline failed', body: currentBuild.fullDisplayName } }
}`}
        </pre>
        <p className="text-xs text-slate-600">Gates: security scan and branch protection; notifications on failure.</p>
      </div>

      <div className="bg-white border rounded p-3">
        <h3 className="font-semibold text-brand mb-2">Helm: Service Template</h3>
        <pre className="bg-slate-900 text-slate-100 p-3 rounded overflow-auto text-xs">
{`apiVersion: v1
kind: Service
metadata:
  name: {{ include "app.fullname" . }}
spec:
  type: ClusterIP
  selector:
    app.kubernetes.io/name: {{ include "app.name" . }}
  ports:
    - port: 80
      targetPort: http
      protocol: TCP
      name: http`}
        </pre>
        <p className="text-xs text-slate-600">Helm helpers used for consistent naming and labels.</p>
      </div>
    </section>
  )
}
