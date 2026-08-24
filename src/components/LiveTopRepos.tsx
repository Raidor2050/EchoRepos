import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { formatCompact } from '../lib/format'
import { fetchTopRepos, catalogFallback, type LiveRepo } from '../lib/live'
import { SectionHeading, LanguageDot, StarPill } from './atoms'
import { IconExternal, IconArrowRight } from './Icons'

/**
 * In-memory only: a hard reload always refetches from the GitHub API,
 * while quick back-and-forth navigation inside the session reuses fresh data.
 */
let cache: { at: number; items: LiveRepo[] } | null = null
const FRESH_MS = 120_000

function LiveCard({ repo }: { repo: LiveRepo }) {
  return (
    <article className="live-card">
      <h3 className="live-card__title mono">
        <span className="live-card__owner">{repo.owner}</span>
        <span className="live-card__slash">/</span>
        <span className="live-card__name">{repo.name}</span>
      </h3>
      <p className="live-card__desc">{repo.desc}</p>
      <div className="live-card__foot">
        <LanguageDot lang={repo.language} />
        <StarPill stars={repo.stars} />
        <span className="pill pill--dim" title={`${repo.forks.toLocaleString()} forks`}>
          {formatCompact(repo.forks)} forks
        </span>
        <a
          className="live-card__visit"
          href={repo.url}
          target="_blank"
          rel="noreferrer"
          aria-label={`${repo.id} on GitHub`}
        >
          Visit Repo <IconExternal />
        </a>
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
    <section className="section section--tinted" aria-labelledby="live-top-title">
      <div className="container">
        <div className="live-head">
          <div id="live-top-title" style={{ display: 'contents' }}>
            <SectionHeading
              eyebrow="live from the github api"
              title="Top repositories on GitHub right now"
            />
          </div>
          <span className={`live-badge ${status === 'fallback' ? 'is-fallback' : ''}`} role="status" aria-live="polite">
            <i className="live-badge__dot" aria-hidden />
            {status === 'live' ? 'live data' : status === 'fallback' ? 'curated snapshot' : 'fetching\u2026'}
          </span>
        </div>

        {shown === null ? (
          <div className="live-grid live-grid--center" aria-hidden>
            {Array.from({ length: 8 }, (_, i) => (
              <div className="live-skel" key={i}>
                <i style={{ width: '58%' }} />
                <i style={{ width: '92%' }} />
                <i style={{ width: '74%' }} />
              </div>
            ))}
          </div>
        ) : (
          <div className="live-grid live-grid--center">
            {shown.map((r, i) => (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, duration: 0.5 }}
              >
                <LiveCard repo={r} />
              </motion.div>
            ))}
          </div>
        )}

        <div className="live-seeall">
          <a
            className="btn btn--ghost"
            href="https://github.com/search?q=stars%3A%3E10000&sort=stars&type=Repositories"
            target="_blank"
            rel="noreferrer"
          >
            See all top repos on GitHub <IconArrowRight size={15} />
          </a>
        </div>
      </div>
    </section>
  )
}
