import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { UniverseCanvas } from '../components/UniverseCanvas'
import { CommandSearch } from '../components/CommandSearch'
import { CategoryGlyph } from '../components/CategoryGlyph'
import { CommitChainDiagram, DataStream } from '../components/decor'
import { IconArrowRight, IconBolt, IconBook, IconSparkle } from '../components/Icons'
import { SectionHeading } from '../components/atoms'
import { CATEGORIES } from '../data/taxonomy'
import { REPO_COUNT } from '../lib/data'
import { formatCompact } from '../lib/format'
import { usePageMeta } from '../lib/hooks'

const TOTAL_STARS = 3_400_000

const STEPS = [
  {
    icon: <IconSparkle size={20} />,
    title: 'Tell us your goal',
    text: 'Take the 90-second quiz — what you\'re building, your stack, experience level. No account needed.',
    cta: { to: '/quiz', label: 'Start the quiz' },
    hue: '#ff6ad5',
  },
  {
    icon: <IconBolt size={20} />,
    title: 'Get matched instantly',
    text: 'A scoring engine weighs ecosystem fit, difficulty and maintenance health across all curated repos.',
    cta: { to: '/explore', label: 'Browse everything' },
    hue: '#7df9ff',
  },
  {
    icon: <IconBook size={20} />,
    title: 'Learn as you explore',
    text: 'Every concept — forks, PRs, releases — explained in a 3-minute interactive lesson track.',
    cta: { to: '/learn', label: 'Open Learn' },
    hue: '#a78bfa',
  },
]

export default function Home() {
  usePageMeta('EchoRepos — discover the open source universe')
  const featured = ['ai', 'webdev', 'devtools', 'agents', 'learning'] as const

  return (
    <div className="page-home">
      {/* ── hero ── */}
      <section className="hero">
        <div className="universe-wrap" aria-hidden={false}>
          <UniverseCanvas />
        </div>
        <DataStream y="18%" delay={0} />
        <DataStream y="82%" hue="#ff6ad5" delay={2.5} duration={9} />
        <div className="hero__inner container">
          <motion.div initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>
            <span className="eyebrow">
              <span className="eyebrow__dot" /> {REPO_COUNT} hand-picked repositories · zero fluff
            </span>
            <h1 className="hero__title">
              Navigate the
              <br />
              <span className="grad-text">open source</span> universe
            </h1>
            <p className="hero__sub">
              GitHub hosts 400 million repositories. You need ten good ones.
              EchoRepos maps the signal — searchable, explainable, beginner-welcoming.
            </p>
          </motion.div>
          <motion.div
            className="hero__search"
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            <CommandSearch variant="hero" />
          </motion.div>
          <motion.div className="hero__stats" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4, duration: 0.8 }}>
            <Stat n={`${REPO_COUNT}`} l="curated repos" />
            <Stat n="16" l="ecosystems" />
            <Stat n={`${formatCompact(TOTAL_STARS)}★`} l="combined stars" />
            <Stat n="12" l="lessons" />
          </motion.div>
        </div>
        <div className="hero__scrollhint" aria-hidden>scroll ↓</div>
      </section>

      {/* ── how it works ── */}
      <section className="section">
        <div className="container">
          <SectionHeading eyebrow="the loop" title="From lost to contributing in three moves" sub="No sign-up. Everything runs in your browser." align="center" />
          <div className="steps-grid">
            {STEPS.map((s, i) => (
              <motion.article
                key={s.title}
                className="step-card"
                style={{ '--cat-c': s.hue } as React.CSSProperties}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.55, delay: i * 0.12 }}
              >
                <span className="step-card__num">0{i + 1}</span>
                <span className="step-card__icon">{s.icon}</span>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
                <Link to={s.cta.to} className="step-card__link">
                  {s.cta.label} <IconArrowRight size={14} />
                </Link>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* ── featured ecosystems ── */}
      <section className="section section--tinted">
        <div className="container">
          <SectionHeading eyebrow="start somewhere" title="Five ecosystems worth your time" sub="Or open the full map of all sixteen." />
          <div className="feat-grid">
            {featured.map((id, i) => {
              const cat = CATEGORIES.find((c) => c.id === id)!
              return (
                <motion.div key={id} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08, duration: 0.5 }}>
                  <Link to={`/explore?cat=${id}`} className="cat-card" style={{ '--cat-c': cat.hue } as React.CSSProperties}>
                    <CategoryGlyph id={id} size={30} />
                    <h3>{cat.label}</h3>
                    <p>{cat.tagline}</p>
                  </Link>
                </motion.div>
              )
            })}
          </div>
          <div style={{ textAlign: 'center' }}>
            <Link to="/categories" className="btn btn--ghost">
              All 16 ecosystems <IconArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── git history teaser ── */}
      <section className="section">
        <div className="container split">
          <div>
            <span className="eyebrow"><span className="eyebrow__dot" /> new here?</span>
            <h2 className="h2">Git history is a chain of tiny saves</h2>
            <p className="lead">
              Every repo is a story told in commits. Our 12-lesson track takes you from
              "what is a repository" to confidently opening your first pull request — each lesson under four minutes,
              each with a living diagram.
            </p>
            <Link to="/learn" className="btn btn--primary">
              Start Lesson 1: what is open source? <IconArrowRight size={15} />
            </Link>
          </div>
          <div className="split__art glass">
            <CommitChainDiagram />
            <p className="mono-note">4 commits on main · HEAD → d97f2b</p>
          </div>
        </div>
      </section>

      {/* ── quiz CTA ── */}
      <section className="cta-band">
        <div className="container" style={{ textAlign: 'center', position: 'relative' }}>
          <h2 className="h2">Answer 7 questions.<br />Meet your stack.</h2>
          <p className="lead" style={{ maxWidth: 520, margin: '14px auto 24px' }}>
            The recommendation engine matches your goal, level and stack to ranked picks — with reasons for every match.
          </p>
          <Link to="/quiz" className="btn btn--primary btn--lg">
            <IconSparkle size={17} /> Find my repositories
          </Link>
          <p style={{ marginTop: 16, fontSize: 12.5, color: 'var(--text-4)', fontFamily: 'var(--font-mono)' }}>~90 seconds · saved locally · nothing leaves your browser</p>
        </div>
      </section>
    </div>
  )
}

function Stat({ n, l }: { n: string; l: string }) {
  return (
    <div className="stat">
      <b>{n}</b>
      <span>{l}</span>
    </div>
  )
}
