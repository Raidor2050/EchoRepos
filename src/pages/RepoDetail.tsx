import { Link, useParams } from 'react-router-dom'
import { motion } from 'motion/react'
import { getCategory, CATEGORIES } from '../data/taxonomy'
import { getRepo, reposInCategory, categoryCount } from '../lib/data'
import { githubUrl, formatCompact, formatMonth } from '../lib/format'
import { similarRepos } from '../lib/similar'
import { DifficultyMeter, LanguageDot, SectionHeading, Sparkline } from '../components/atoms'
import { IconStar, IconFork, IconExternal, IconHeart } from '../components/Icons'
import { RelatedGraph } from '../components/RelatedGraph'
import { useApp } from '../lib/store'
import { usePageMeta } from '../lib/hooks'

export default function RepoDetail() {
  const { id = '' } = useParams()
  const repo = getRepo(decodeURIComponent(id))

  if (!repo) {
    return (
      <div className="page container" style={{ textAlign: 'center', padding: '120px 0' }}>
        <h1 className="h1">Signal lost</h1>
        <p className="lead">That repository is not in the catalog.</p>
        <Link to="/explore" className="btn btn--primary">Back to explore</Link>
      </div>
    )
  }

  return <DetailBody repo={repo} />
}

function DetailBody({ repo }: { repo: NonNullable<ReturnType<typeof getRepo>> }) {
  usePageMeta(`${repo.id} - EchoRepos`)
  const { favorites, toggleFavorite } = useApp()
  const cat = getCategory(repo.category)
  const related = similarRepos(repo.id, 6)
  const isFav = favorites.has(repo.id)
  const siblings = reposInCategory(repo.category).filter((r) => r.id !== repo.id).slice(0, 3)

  return (
    <article className="page page-repo container">
      <nav className="crumbs" aria-label="Breadcrumb">
        <Link to="/explore">← Explore</Link>
        <span>/</span>
        <Link to={`/explore?cat=${repo.category}`}>{cat.label}</Link>
      </nav>

      <motion.header initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="repo-head">
        <span className="eyebrow"><span className="eyebrow__dot" /> {cat.label}</span>
        <h1 className="repo-head__title">
          <span>{repo.owner}/</span>{repo.name}
          <a href={githubUrl(repo.id)} target="_blank" rel="noreferrer" className="repo-head__gh" aria-label="Open on GitHub">
            <IconExternal size={20} />
          </a>
          <button
            className={`fav-btn${isFav ? ' is-on' : ''}`}
            onClick={() => toggleFavorite(repo.id)}
            aria-label={isFav ? 'Remove from favorites' : 'Save to favorites'}
            aria-pressed={isFav}
          >
            <IconHeart size={19} filled={isFav} />
          </button>
        </h1>
        <p className="lead">{repo.desc}</p>

        <div className="repo-head__pills">
          <LanguageDot lang={repo.language} />
          <span className="pill pill--amber"><IconStar size={12} /> {formatCompact(repo.stars)}</span>
          <span className="pill"><IconFork size={12} /> {formatCompact(repo.forks)}</span>
          <DifficultyMeter level={repo.difficulty} withLabel />
          <span className="pill">updated {formatMonth(repo.updated)}</span>
        </div>

        <div style={{ display: 'flex', gap: 10, marginTop: 18, flexWrap: 'wrap' }}>
          <a className="btn btn--primary" href={githubUrl(repo.id)} target="_blank" rel="noreferrer">
            Open on GitHub <IconExternal size={15} />
          </a>
          <button className="btn btn--ghost" onClick={() => toggleFavorite(repo.id)}>
            <IconHeart size={15} filled={isFav} /> {isFav ? 'Saved' : 'Save'}
          </button>
        </div>
      </motion.header>

      <div className="repo-cols">
        <section className="repo-col">
          <h2 className="h3">Why it made the cut</h2>
          <p className="glass pad">{repo.why}</p>

          <h2 className="h3" style={{ marginTop: 30 }}>Vital signals</h2>
          <div className="signals glass pad">
            <SignalBar label="Popularity" v={repo.signals.popularity} hue="#ffc46b" note={`${formatCompact(repo.stars)} stars`} />
            <SignalBar label="Activity" v={repo.signals.activity} hue="#6cf5b8" note={`last update ${formatMonth(repo.updated)}`} />
            <SignalBar label="Production readiness" v={repo.signals.production} hue="#4f7cff" note="battle-tested score" />
            <SignalBar label="Learning value" v={repo.signals.learning} hue="#ff6ad5" note="docs & ramp quality" />
            <div className="spark-row">
              <Sparkline seedValue={repo.signals.popularity} width={140} />
              <span className="mono-note">popularity trend (illustrative)</span>
            </div>
          </div>

          <h2 className="h3" style={{ marginTop: 30 }}>Good for</h2>
          <ul className="uses">
            {repo.useCases.map((u) => (
              <li key={u}><Link to={`/explore?q=${encodeURIComponent(u.replace(/-/g, ' '))}`}>{u.replace(/-/g, ' ')}</Link></li>
            ))}
          </ul>
        </section>

        <aside className="repo-col">
          <h2 className="h3">Related repositories</h2>
          <div className="related-wrap glass">
            <RelatedGraph center={repo} related={related} />
          </div>
          <div className="related-list">
            {related.map(({ repo: r }) => (
              <Link key={r.id} to={`/repo/${r.id}`} className="pill">
                {r.name} · ★ {formatCompact(r.stars)}
              </Link>
            ))}
          </div>

          {repo.alternatives && repo.alternatives.length > 0 && (
            <>
              <h2 className="h3" style={{ marginTop: 26 }}>Alternatives</h2>
              <div className="alt-list">
                {repo.alternatives.map((aid) => {
                  const alt = getRepo(aid)
                  return alt ? (
                    <Link key={aid} to={`/repo/${aid}`} className="cat-card cat-card--row" style={{ '--cat-c': getCategory(alt.category).hue } as React.CSSProperties}>
                      <span className="cat-card__body">
                        <h3>{alt.name}</h3>
                        <p>{alt.owner}</p>
                      </span>
                      <span className="cat-card__count">{formatCompact(alt.stars)}★</span>
                    </Link>
                  ) : (
                    <a key={aid} className="pill" href={`https://github.com/${aid}`} target="_blank" rel="noreferrer">{aid} ↗</a>
                  )
                })}
              </div>
            </>
          )}

          <h2 className="h3" style={{ marginTop: 26 }}>More {getCategory(repo.category).label.toLowerCase()}</h2>
          <div className="alt-list">
            {siblings.map((s) => (
              <Link key={s.id} to={`/repo/${s.id}`} className="pill">{s.name} · ★ {formatCompact(s.stars)}</Link>
            ))}
            <Link to={`/explore?cat=${repo.category}`} className="pill pill--cyan">
              All {categoryCount(repo.category)} →
            </Link>
          </div>
        </aside>
      </div>

      <footer style={{ textAlign: 'center' }}>
        <SectionHeading eyebrow="keep exploring" title="Jump to another ecosystem" align="center" />
        <div className="pill-cloud">
          {CATEGORIES.filter((c) => c.id !== repo.category)
            .slice(0, 8)
            .map((c) => (
              <Link key={c.id} to={`/explore?cat=${c.id}`} className="chip">{c.label}</Link>
            ))}
        </div>
      </footer>
    </article>
  )
}

function SignalBar({ label, v, hue, note }: { label: string; v: number; hue: string; note: string }) {
  return (
    <motion.div
      className="signal"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
    >
      <header>
        <b>{label}</b>
        <span className="mono-note">{v}/100 - {note}</span>
      </header>
      <div className="signal__track">
        <motion.i
          className="signal__fill"
          style={{ background: `linear-gradient(90deg, ${hue}66, ${hue})` }}
          initial={{ width: 0 }}
          whileInView={{ width: `${v}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </motion.div>
  )
}
