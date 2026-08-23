import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { RepoCard } from '../components/RepoCard'
import { SectionHeading, EmptyState } from '../components/atoms'
import { IconArrowRight, IconCheck, IconSparkle } from '../components/Icons'
import type { ProjectType } from '../data/types'
import {
  recommend,
  profileString,
  EMPTY_ANSWERS,
  type BuildingType,
  type Level,
  type Priority,
  type QuizAnswers,
  type Stage,
} from '../lib/recommend'
import { useApp } from '../lib/store'
import { usePageMeta } from '../lib/hooks'

type Answers = QuizAnswers
const TECHS = ['any', 'TypeScript', 'JavaScript', 'Python', 'Rust', 'Go', 'Java', 'Kotlin', 'Swift', 'C++', 'C#', 'Ruby']

const CAPABILITIES: Array<{ id?: string; label: string }> = [
  { label: 'Not sure yet - show the essentials' },
  { id: 'auth-payments', label: 'Logins & payments' },
  { id: 'data-storage', label: 'Databases & storage' },
  { id: 'ai-integration', label: 'Add AI features' },
  { id: 'realtime-chat', label: 'Realtime & chat' },
  { id: 'dashboards-viz', label: 'Dashboards & charts' },
  { id: 'automation-scraping', label: 'Automate boring work' },
  { id: 'apis', label: 'Build APIs' },
]

const BUILDING_OPTS: Array<{ v: BuildingType; e: string; label: string }> = [
  { v: 'saas', e: '🏢', label: 'A SaaS / web product' },
  { v: 'website', e: '🌐', label: 'A website or portfolio' },
  { v: 'mobile-app', e: '📱', label: 'A mobile app' },
  { v: 'ai-app', e: '🤖', label: 'Something with AI' },
  { v: 'automation', e: '⚙️', label: 'Automation & scripts' },
  { v: 'dev-tool', e: '🛠️', label: 'A developer tool' },
  { v: 'game', e: '🎮', label: 'A game' },
  { v: 'other', e: '✨', label: 'Just exploring' },
]

const REPO_TYPES: Array<{ v: ProjectType | 'any'; label: string }> = [
  { v: 'any', label: "Doesn't matter" },
  { v: 'library', label: 'Libraries I import' },
  { v: 'framework', label: 'Full frameworks' },
  { v: 'tool', label: 'Standalone tools' },
  { v: 'self-hosted', label: 'Self-hostable apps' },
  { v: 'course', label: 'Learning material' },
]

const STEP_COUNT = 7

export default function Quiz() {
  usePageMeta('Find your repositories - EchoRepos quiz')
  const { quiz, setQuiz } = useApp()
  const [step, setStep] = useState(0)
  const [phase, setPhase] = useState<'quiz' | 'scan' | 'results'>(
    quiz.building || quiz.techs.length ? 'results' : 'quiz',
  )
  const [a, setA] = useState<Answers>(quiz)

  const results = useMemo(() => (phase === 'results' && a.building ? recommend(a, 8) : []), [phase, a])

  function patch(p: Partial<Answers>): void {
    setA((prev) => ({ ...prev, ...p }))
  }

  /** single-choice questions auto-advance */
  function choose(p: Partial<Answers>, advance = true): void {
    patch(p)
    if (advance) window.setTimeout(() => next(), 180)
  }

  function next(): void {
    if (step + 1 >= STEP_COUNT) setPhase('scan')
    else setStep((s) => s + 1)
  }

  function back(): void {
    setStep((s) => Math.max(0, s - 1))
  }

  function finishScan(): void {
    setQuiz(a)
    setPhase('results')
  }

  function retake(): void {
    setA({ ...EMPTY_ANSWERS })
    setQuiz(EMPTY_ANSWERS)
    setStep(0)
    setPhase('quiz')
  }

  return (
    <div className="page page-quiz container">
      <SectionHeading eyebrow="the match engine" title="Seven questions to your stack" align="center" />

      {phase === 'quiz' && (
        <>
          <div className="quiz-progress" aria-hidden>
            <motion.div className="quiz-progress__bar" animate={{ width: `${((step + 1) / STEP_COUNT) * 100}%` }} transition={{ duration: 0.35 }} />
          </div>
          <AnimatePresence mode="wait">
            <motion.section
              key={step}
              className="quiz-card glass"
              initial={{ opacity: 0, x: 46 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -46 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            >
              {step === 0 && (
                <Q n={1} q="What are you building?">
                  <div className="opt-grid">
                    {BUILDING_OPTS.map((o) => (
                      <button key={o.v} className={`opt${a.building === o.v ? ' is-on' : ''}`} onClick={() => choose({ building: o.v })}>
                        <span className="opt__e">{o.e}</span>
                        {o.label}
                      </button>
                    ))}
                  </div>
                </Q>
              )}
              {step === 1 && (
                <Q n={2} q="How much have you coded before?">
                  <OptRow
                    opts={[
                      { v: 'new', l: "I'm brand new" },
                      { v: 'some', l: 'Some projects' },
                      { v: 'experienced', l: 'I ship for a living' },
                    ]}
                    on={a.level}
                    onPick={(v) => choose({ level: v as Level })}
                  />
                </Q>
              )}
              {step === 2 && (
                <Q n={3} q="Pick your languages (up to 3)">
                  <div className="chip-cloud">
                    {TECHS.map((t) => {
                      const on = a.techs.includes(t)
                      const full = !on && a.techs.length >= 3
                      return (
                        <button
                          key={t}
                          disabled={full}
                          className={`chip${on ? ' is-active' : ''}${full ? ' is-disabled' : ''}`}
                          onClick={() =>
                            patch({
                              techs: on ? a.techs.filter((x) => x !== t) : a.techs.length < 3 ? [...a.techs.filter((x) => x !== 'any'), t] : a.techs,
                            })
                          }
                        >
                          {t === 'any' ? 'No preference' : t}
                        </button>
                      )
                    })}
                  </div>
                  <StepNav onNext={next} hint={`${a.techs.length}/3 selected`} />
                </Q>
              )}
              {step === 3 && (
                <Q n={4} q="What should your tools do first?">
                  <OptColumn
                    opts={CAPABILITIES.map((c) => ({ v: c.id ?? '', l: c.label }))}
                    on={a.capability ?? ''}
                    onPick={(v) => choose({ capability: v || undefined })}
                  />
                </Q>
              )}
              {step === 4 && (
                <Q n={5} q="Where is your project right now?">
                  <OptRow
                    opts={[
                      { v: 'idea', l: 'Still an idea' },
                      { v: 'mvp', l: 'Building an MVP' },
                      { v: 'production', l: 'In production' },
                    ]}
                    on={a.stage}
                    onPick={(v) => choose({ stage: v as Stage })}
                  />
                </Q>
              )}
              {step === 5 && (
                <Q n={6} q="What shape of repository helps most?">
                  <OptColumn opts={REPO_TYPES.map((r) => ({ v: r.v, l: r.label }))} on={a.repoType ?? 'any'} onPick={(v) => choose({ repoType: v as ProjectType | 'any' })} />
                </Q>
              )}
              {step === 6 && (
                <Q n={7} q="What matters most in a pick?">
                  <OptColumn
                    opts={[
                      { v: 'popularity', l: '⭐ Massive adoption' },
                      { v: 'simplicity', l: '🌱 Easy to learn' },
                      { v: 'performance', l: '⚡ Raw performance' },
                      { v: 'production', l: '🏭 Production-ready' },
                      { v: 'community', l: '👥 Active community' },
                      { v: 'learning', l: '📚 Teaches me well' },
                    ]}
                    on={a.priority ?? ''}
                    onPick={(v) => choose({ priority: v as Priority })}
                  />
                </Q>
              )}
              <footer className="quiz-nav">
                <button onClick={back} disabled={step === 0} style={{ opacity: step === 0 ? 0.3 : 1 }}>
                  ← Back
                </button>
                <span className="mono-note">{step + 1} / {STEP_COUNT}</span>
              </footer>
            </motion.section>
          </AnimatePresence>
        </>
      )}

      {phase === 'scan' && <Scan profile={profileString(a)} onDone={finishScan} />}

      {phase === 'results' && (
        <section className="quiz-results">
          <header className="quiz-results__head">
            <p className="eyebrow"><span className="eyebrow__dot" /> your profile</p>
            <h2 className="h2">{profileString(a) || 'Open explorer'}</h2>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 14 }}>
              <button className="btn btn--ghost" onClick={retake}>Retake quiz</button>
              <Link className="btn btn--ghost" to="/explore">Browse everything instead</Link>
            </div>
          </header>
          {results.length === 0 ? (
            <EmptyState icon="🎯" title="Answer at least question 1" text="The engine needs your goal to rank matches." action={{ label: 'Take the quiz', onClick: retake }} />
          ) : (
            <div className="match-grid">
              {results.map(({ repo, match, reasons }, i) => (
                <motion.div key={repo.id} initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.09, duration: 0.45 }}>
                  <RepoCard repo={repo} showMatch match={match} reasons={reasons} />
                </motion.div>
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  )
}

function Q({ n, q, children }: { n: number; q: string; children: React.ReactNode }) {
  return (
    <>
      <p className="eyebrow"><span className="eyebrow__dot" /> question {n} of {STEP_COUNT}</p>
      <h2 className="quiz-q">{q}</h2>
      {children}
    </>
  )
}

function OptRow({ opts, on, onPick }: { opts: Array<{ v: string; l: string }>; on?: string; onPick: (v: string) => void }) {
  return (
    <div className="seg seg--big" role="listbox">
      {opts.map((o) => (
        <button key={o.v} role="option" aria-selected={on === o.v} className={`seg__btn${on === o.v ? ' is-on' : ''}`} onClick={() => onPick(o.v)}>
          {on === o.v && <IconCheck size={14} />}
          {o.l}
        </button>
      ))}
    </div>
  )
}

function OptColumn({ opts, on, onPick }: { opts: Array<{ v: string; l: string }>; on: string; onPick: (v: string) => void }) {
  return (
    <div className="opt-col">
      {opts.map((o) => (
        <button key={o.v || 'none'} className={`opt-row${on === o.v ? ' is-on' : ''}`} onClick={() => onPick(o.v)} role="radio" aria-checked={on === o.v}>
          <span>{o.l}</span>
          {on === o.v && <IconCheck size={16} />}
        </button>
      ))}
    </div>
  )
}

function StepNav({ onNext, hint }: { onNext: () => void; hint?: string }) {
  return (
    <div className="quiz-nav" style={{ marginTop: 22 }}>
      <span className="mono-note">{hint}</span>
      <button className="btn btn--primary btn--sm" onClick={onNext}>
        Continue <IconArrowRight size={14} />
      </button>
    </div>
  )
}

function Scan({ profile, onDone }: { profile: string; onDone: () => void }) {
  const lines = useMemo(
    () => [
      `> profile: ${profile || 'explorer'}`,
      '> scanning 227 curated repos…',
      '> weighting ecosystem fit ×0.26',
      '> weighting capability ×0.22',
      '> weighting priorities ×0.24',
      '> applying diversity guard…',
      '> rank normalized ✓',
    ],
    [profile],
  )
  const [shown, setShown] = useState(0)

  useEffect(() => {
    if (shown < lines.length) {
      const t = window.setTimeout(() => setShown((s) => s + 1), 250)
      return () => window.clearTimeout(t)
    }
    const t = window.setTimeout(onDone, 550)
    return () => window.clearTimeout(t)
  }, [shown, lines, onDone])

  return (
    <section className="scan glass" aria-live="polite">
      <span className="scan__spin"><IconSparkle size={30} /></span>
      <pre>{lines.slice(0, shown).join('\n')}</pre>
    </section>
  )
}
