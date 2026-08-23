import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { Repo } from '../data/types'
import { getCategory } from '../data/taxonomy'
import { githubUrl, formatCompact, formatMonth } from '../lib/format'
import { IconStar, IconExternal, IconChevron } from './Icons'
import { DifficultyMeter, LanguageDot, TagChip } from './atoms'

export function RepoCard({ repo, showMatch, match, reasons }: {
  repo: Repo
  showMatch?: boolean
  match?: number
  reasons?: string[]
}) {
  const [open, setOpen] = useState(false)
  const cat = getCategory(repo.category)

  return (
    <article className="card-repo" style={{ '--cat-c': cat.hue } as React.CSSProperties}>
      <div className="card-repo__head">
        <div>
          <span className="card-repo__id">{repo.owner} /</span>
          <h3 className="card-repo__name">
            <Link to={`/repo/${repo.id}`}>{repo.name}</Link>
          </h3>
        </div>
        {showMatch && match !== undefined && <span className="match-badge">{match}% match</span>}
        <a className="card-repo__gh" href={githubUrl(repo.id)} target="_blank" rel="noreferrer" aria-label={`${repo.id} on GitHub`} onClick={(e) => e.stopPropagation()}>
          <IconExternal size={15} />
        </a>
      </div>

      <p className="card-repo__desc">{repo.desc}</p>

      <div className="card-repo__tags">
        {repo.topics.slice(0, 2).map((t) => (
          <TagChip key={t} label={t} />
        ))}
      </div>

      {showMatch && reasons && reasons.length > 0 && (
        <ul style={{ margin: 0, paddingLeft: 18, color: 'var(--text-2)', fontSize: 13 }}>
          {reasons.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ul>
      )}

      <div className="card-repo__foot">
        <LanguageDot lang={repo.language} />
        <span className="pill pill--amber">
          <IconStar size={11} />
          {formatCompact(repo.stars)}
        </span>
        <DifficultyMeter level={repo.difficulty} withLabel={false} />
        <a
          href={githubUrl(repo.id)}
          target="_blank"
          rel="noreferrer"
          className="btn btn--ghost btn--sm card-repo__visit"
          onClick={(e) => e.stopPropagation()}
          aria-label={`Visit ${repo.id} on GitHub`}
        >
          Visit Repo <IconExternal size={12} />
        </a>
        <button
          className={`card-repo__expand${open ? ' is-open' : ''}`}
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-label="Toggle details"
        >
          <IconChevron size={16} />
        </button>
      </div>

      {open && (
        <div className="card-repo__more">
          <p className="card-repo__why">{repo.why}</p>
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-3)' }}>
            <span>forks {formatCompact(repo.forks)}</span>
            <span>active {formatMonth(repo.updated)}</span>
            <span>prod {repo.signals.production}/100</span>
            <span>learn {repo.signals.learning}/100</span>
          </div>
          <div className="card-repo__actions">
            <Link to={`/repo/${repo.id}`} className="btn btn--ghost btn--sm">
              Deep dive
            </Link>
            <a href={githubUrl(repo.id)} target="_blank" rel="noreferrer" className="btn btn--primary btn--sm">
              Open on GitHub <IconExternal size={13} />
            </a>
          </div>
        </div>
      )}
    </article>
  )
}
