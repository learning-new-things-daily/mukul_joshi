export default function CostControls(){
  return (
    <section className="grid gap-4">
      <h2 className="text-xl text-brand">Cost Controls</h2>
      <p className="text-sm text-slate-600">Tagging, budgets, and rightsizing practices to manage cloud spend.</p>

      <div className="bg-white border rounded p-3">
        <h3 className="font-semibold text-brand mb-2">Tagging Policy</h3>
        <pre className="bg-slate-900 text-slate-100 p-3 rounded overflow-auto text-xs">
{`# Terraform example
resource "aws_instance" "app" {
  ami           = var.ami
  instance_type = var.type
  tags = {
    env      = var.env
    owner    = "platform"
    costcode = var.costcode
  }
}`}
        </pre>
        <p className="text-xs text-slate-600">Standard tags enable per-team and per-project cost allocation.</p>
      </div>

      <div className="bg-white border rounded p-3">
        <h3 className="font-semibold text-brand mb-2">Budgets & Alerts</h3>
        <pre className="bg-slate-900 text-slate-100 p-3 rounded overflow-auto text-xs">
{`# Pseudo CLI
cloud budgets create --project team-a --monthly 500 --alert 80% --email finops@example.com`}
        </pre>
        <p className="text-xs text-slate-600">Budget thresholds raise alerts before overspend; integrate with chat/ops.</p>
      </div>

      <div className="bg-white border rounded p-3">
        <h3 className="font-semibold text-brand mb-2">Rightsizing</h3>
        <pre className="bg-slate-900 text-slate-100 p-3 rounded overflow-auto text-xs">
{`# Example approach
# 1. Export utilization metrics
# 2. Detect under-utilized instances (<30% avg CPU)
# 3. Propose downsizing and schedule maintenance window`}
        </pre>
        <p className="text-xs text-slate-600">Automate recommendations using utilization and apply changes with approvals.</p>
      </div>
    </section>
  )
}
