import { useEffect } from 'react'
import { Link, useParams, useLocation } from 'react-router-dom'
import { motion } from 'motion/react'
import { LESSONS, TRACK_ORDER, type Lesson } from '../data/lessons'
import { LessonDiagram } from '../components/LessonDiagram'
import { IconCheck, IconArrowRight } from '../components/Icons'
import { SectionHeading } from '../components/atoms'
import { useApp } from '../lib/store'
import { usePageMeta } from '../lib/hooks'

export default function Learn() {
  usePageMeta('Learn Git & GitHub - EchoRepos')
  const { learned, resetLearned } = useApp()
  const location = useLocation()

  useEffect(() => {
    const slug = location.hash.replace('#', '')
    if (!slug) return
    requestAnimationFrame(() => document.getElementById(`lesson-${slug}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' }))
  }, [location.hash])

  const done = TRACK_ORDER.filter((s) => learned.has(s)).length

  return (
    <div className="page page-learn">
      <header className="page-head container">
        <SectionHeading
          eyebrow="the track · 12 concepts"
          title="From zero to first pull request"
          sub="Read in order or jump around. Progress is saved in your browser."
        />
        <div className="learn-progress" role="status">
          <div className="constellation" aria-hidden>
            {TRACK_ORDER.map((slug) => (
              <span key={slug} className={`constellation__node${learned.has(slug) ? ' is-lit' : ''}`} />
            ))}
          </div>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12.5 }}>
            {done}/{TRACK_ORDER.length} learned
          </span>
          {done > 0 && (
            <button onClick={resetLearned} style={{ fontSize: 12, color: 'var(--text-4)', textDecoration: 'underline' }}>
              reset
            </button>
          )}
        </div>
      </header>

      <div className="container lessons-grid">
        {LESSONS.map((l, i) => {
          const isDone = learned.has(l.slug)
          return (
            <motion.div key={l.slug} initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: (i % 4) * 0.07, duration: 0.45 }}>
              <Link id={`lesson-${l.slug}`} to={`/learn/${l.slug}`} className={`lesson-card${isDone ? ' is-done' : ''}`}>
                <span className="lesson-card__num">{String(i + 1).padStart(2, '0')}</span>
                <span className="lesson-card__icon" aria-hidden>{l.icon}</span>
                <h3>{l.title}</h3>
                <p>{l.tagline}</p>
                <span className="lesson-card__meta">
                  <span>{l.minutes} min</span>
                  {isDone && (
                    <span className="pill pill--green"><IconCheck size={11} /> learned</span>
                  )}
                </span>
              </Link>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

export function LessonDetail() {
  const { slug = '' } = useParams()
  const idx = TRACK_ORDER.indexOf(slug)
  if (idx === -1) {
    return (
      <div className="page container" style={{ textAlign: 'center', padding: '120px 0' }}>
        <h1 className="h1">Lesson not found</h1>
        <Link to="/learn" className="btn btn--primary">Back to the track</Link>
      </div>
    )
  }
  return <LessonView lesson={LESSONS[idx]} index={idx} />
}

function LessonView({ lesson, index }: { lesson: Lesson; index: number }) {
  usePageMeta(`${lesson.title} - EchoRepos Learn`)
  const { learned, markLearned } = useApp()
  const isDone = learned.has(lesson.slug)
  const next = index + 1 < LESSONS.length ? LESSONS[index + 1] : null

  return (
    <article className="page lesson-view container">
      <nav className="crumbs" aria-label="Breadcrumb">
        <Link to="/learn">← All lessons</Link>
      </nav>

      <header className="lesson-head">
        <motion.span className="lesson-head__icon" initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 14 }}>
          {lesson.icon}
        </motion.span>
        <div>
          <span className="eyebrow"><span className="eyebrow__dot" /> lesson {String(index + 1).padStart(2, '0')} of {LESSONS.length} · {lesson.minutes} min</span>
          <h1 className="h1">{lesson.title}</h1>
          <p className="lead">{lesson.tagline}</p>
        </div>
      </header>

      <div className="lesson-diagram-wrap glass">
        <LessonDiagram slug={lesson.slug} />
      </div>

      <div className="lesson-body">
        {lesson.body.map((p) => (
          <p key={p.slice(0, 24)}>{p}</p>
        ))}
      </div>

      {lesson.terms && (
        <dl className="terms">
          {lesson.terms.map((t) => (
            <div key={t.term}>
              <dt>{t.term}</dt>
              <dd>{t.def}</dd>
            </div>
          ))}
        </dl>
      )}

      <footer className="lesson-foot">
        <button className={`btn ${isDone ? 'btn--ghost' : 'btn--primary'}`} onClick={() => markLearned(lesson.slug)}>
          {isDone ? <><IconCheck size={15} /> Learned ✓ (tap to undo)</> : <>Mark as learned</>}
        </button>
        {next && (
          <Link to={`/learn/${next.slug}`} className="btn btn--ghost">
            Next: {next.title} <IconArrowRight size={14} />
          </Link>
        )}
      </footer>
    </article>
  )
}
