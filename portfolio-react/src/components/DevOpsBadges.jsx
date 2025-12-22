import { SITE } from '../config/siteConfig.js'
import { shieldsBadgeUrl } from '../utils/github.js'

export default function DevOpsBadges(){
  const build = shieldsBadgeUrl('build')
  const license = shieldsBadgeUrl('license')
  const release = shieldsBadgeUrl('release')
  const repoUrl = SITE.githubOwner && SITE.githubRepo ? `https://github.com/${SITE.githubOwner}/${SITE.githubRepo}` : null

  return (
    <section className="bg-white border rounded-lg p-4">
      <h2 className="text-xl text-brand mb-2">DevOps Badges</h2>
      {(!build && !license && !release) ? (
        <p className="text-sm text-slate-600">Set <code>githubOwner</code> and <code>githubRepo</code> in <code>src/config/siteConfig.js</code> to display badges.</p>
      ) : (
        <div className="flex flex-wrap gap-2 items-center">
          {build && (<a href={repoUrl ? `${repoUrl}/actions/workflows/ci.yml` : undefined} target="_blank" rel="noopener noreferrer"><img alt="Build" src={build} /></a>)}
          {release && (<a href={repoUrl ? `${repoUrl}/releases` : undefined} target="_blank" rel="noopener noreferrer"><img alt="Release" src={release} /></a>)}
          {license && (<a href={repoUrl ? `${repoUrl}/blob/main/LICENSE` : undefined} target="_blank" rel="noopener noreferrer"><img alt="License" src={license} /></a>)}
        </div>
      )}
    </section>
  )
}
