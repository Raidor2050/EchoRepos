import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getRepo } from '../lib/data'
import { formatCompact } from '../lib/format'
import { fetchTopRepos, catalogFallback, type LiveRepo } from '../lib/live'
import { SectionHeading, LanguageDot, StarPill } from './atoms'
import { IconExternal } from './Icons'

/**
 * In-memory only: a hard reload always refetches from the GitHub API,
 * while quick back-and-forth navigation inside the session reuses fresh data.
 */
let cache: { at: number; items: LiveRepo[] } | null = null
const FRESH_MS = 120_000

function LiveCard({ repo }: { repo: LiveRepo }) {
  const inCatalog = Boolean(getRepo(repo.id))
  return (
    <article className="live-card">
      <h3 className="live-card__title mono">
        {inCatalog ? (
          <Link to={`/repo/${repo.id}`}>
            <span className="live-card__owner">{repo.owner}</span>
            <span className="live-card__slash">/</span>
            <span className="live-card__name">{repo.name}</span>
          </Link>
        ) : (
          <>
            <span className="live-card__owner">{repo.owner}</span>
            <span className="live-card__slash">/</span>
            <span className="live-card__name">{repo.name}</span>
          </>
        )}
      </h3>
      <p className="live-card__desc">{repo.desc}</p>
      <div className="live-card__foot">
        <LanguageDot lang={repo.language} />
        <StarPill stars={repo.stars} />
        <span className="pill pill--dim" title={`${repo.forks.toLocaleString()} forks`}>
          {formatCompact(repo.forks)} forks
        </span>
        {inCatalog ? (
          <Link className="live-card__visit" to={`/repo/${repo.id}`}>
            open in EchoRepos
          </Link>
        ) : (
          <a
            className="live-card__visit"
            href={repo.url}
            target="_blank"
            rel="noreferrer"
            aria-label={`${repo.id} on GitHub`}
          >
            Visit Repo <IconExternal />
          </a>
        )}
      </div>
    </article>
  )
}

export function LiveTopRepos() {
  const cached = cache && Date.now() - cache.at < FRESH_MS ? cache.items : null
  const [items, setItems] = useState<LiveRepo[] | null>(cached)
  const [status, setStatus] = useState<'loading' | 'live' | 'fallback'>(cached ? 'live' : 'loading')

  useEffect(() => {
    const ctrl = new AbortController()
    let alive = true
    fetchTopRepos(ctrl.signal)
      .then((fresh) => {
        if (!alive) return
        cache = { at: Date.now(), items: fresh }
        setItems(fresh)
        setStatus('live')
      })
      .catch(() => {
        if (!alive || ctrl.signal.aborted) return
        setStatus((s) => (s === 'loading' ? 'fallback' : s))
      })
    return () => {
      alive = false
      ctrl.abort()
    }
  }, [])

  const shown = status === 'fallback' && items === null ? catalogFallback(8) : items

  return (
    <section className="section live-section" aria-labelledby="live-top-title">
      <div className="wrap">
        <div className="live-head">
          <div id="live-top-title" style={{ display: 'contents' }}>
            <SectionHeading
              eyebrow="live from the github api"
              title="Top repositories on GitHub right now"
              sub="Fetched straight from GitHub every time this page loads - no snapshot, no stale numbers."
            />
          </div>
          <span className={`live-badge ${status === 'fallback' ? 'is-fallback' : ''}`} role="status" aria-live="polite">
            <i className="live-badge__dot" aria-hidden />
            {status === 'live' ? 'live data' : status === 'fallback' ? 'curated snapshot' : 'fetching\u2026'}
          </span>
        </div>

        {shown === null ? (
          <div className="live-grid" aria-hidden>
            {Array.from({ length: 8 }, (_, i) => (
              <div className="live-skel" key={i}>
                <i style={{ width: '58%' }} />
                <i style={{ width: '92%' }} />
                <i style={{ width: '74%' }} />
              </div>
            ))}
          </div>
        ) : (
          <div className="live-grid">
            {shown.map((r) => (
              <LiveCard key={r.id} repo={r} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
