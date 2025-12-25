export default function SecurityGates(){
  return (
    <section className="grid gap-4">
      <h2 className="text-xl text-brand">Security Gates</h2>
      <p className="text-sm text-slate-600">Examples of integrating SBOM, SAST, and container scans as CI/CD gates.</p>

      <div className="bg-white border rounded p-3">
        <h3 className="font-semibold text-brand mb-2">SBOM: Syft</h3>
        <pre className="bg-slate-900 text-slate-100 p-3 rounded overflow-auto text-xs">
{`syft packages dir:/app -o json > sbom.json
# Gate: fail if critical CVEs found via Grype
grype sbom:sbom.json --fail-on High`}
        </pre>
        <p className="text-xs text-slate-600">Generate SBOM and scan for vulnerabilities; fail on severity threshold.</p>
      </div>

      <div className="bg-white border rounded p-3">
        <h3 className="font-semibold text-brand mb-2">SAST: Semgrep</h3>
        <pre className="bg-slate-900 text-slate-100 p-3 rounded overflow-auto text-xs">
{`semgrep --config p/ci --error --exclude tests/ .`}
        </pre>
        <p className="text-xs text-slate-600">Run Semgrep with CI ruleset; fail on findings.</p>
      </div>

      <div className="bg-white border rounded p-3">
        <h3 className="font-semibold text-brand mb-2">Container: Trivy</h3>
        <pre className="bg-slate-900 text-slate-100 p-3 rounded overflow-auto text-xs">
{`trivy image $IMAGE --severity CRITICAL,HIGH --exit-code 1 --ignore-unfixed`}
        </pre>
        <p className="text-xs text-slate-600">Scan container images; block promotions on critical/high issues.</p>
      </div>
    </section>
  )
}
