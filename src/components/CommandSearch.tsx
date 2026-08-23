import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { IconSearch, IconArrowRight } from './Icons'
import { LanguageDot } from './atoms'
import { CategoryGlyph } from './CategoryGlyph'
import { formatCompact } from '../lib/format'
import { suggest, type Suggestion } from '../lib/search'
import { useApp } from '../lib/store'

const ROTATING = [
  'Show me AI agent frameworks',
  'I need a React authentication library',
  'Best open source databases',
  'What can I use to build a SaaS?',
  'Beginner-friendly Python projects',
  'Self-hosted photo backup',
]

const CHIPS = [
  'ai agents',
  'react ui library',
  'rust cli tools',
  'beginner python',
  'self-hosted automation',
  'what is a pull request',
]

export function CommandSearch({ variant }: { variant: 'hero' | 'overlay' }) {
  const navigate = useNavigate()
  const { setCommandOpen } = useApp()
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(-1)
  const [focused, setFocused] = useState(false)
  const [placeholder, setPlaceholder] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  /* rotating typewriter placeholder */
  useEffect(() => {
    if (focused || query) return
    let exampleIdx = Math.floor(Math.random() * ROTATING.length)
    let charIdx = 0
    let deleting = false
    let timer: number
    const tick = () => {
      const text = ROTATING[exampleIdx]
      if (!deleting) {
        charIdx++
        if (charIdx >= text.length) {
          deleting = true
          timer = window.setTimeout(tick, 2100)
          setPlaceholder(text)
          return
        }
      } else {
        charIdx -= 2
        if (charIdx <= 0) {
          deleting = false
          charIdx = 0
          exampleIdx = (exampleIdx + 1) % ROTATING.length
        }
      }
      setPlaceholder(text.slice(0, Math.max(0, charIdx)))
      timer = window.setTimeout(tick, deleting ? 22 : 46)
    }
    timer = window.setTimeout(tick, 500)
    return () => window.clearTimeout(timer)
  }, [focused, query])

  const results = useMemo<Suggestion[]>(() => suggest(query, 7), [query])

  useEffect(() => setActive(-1), [results])

  function go(s: Suggestion): void {
    if (s.kind === 'repo') navigate(`/repo/${s.repo.id}`)
    else if (s.kind === 'category') navigate(`/explore?cat=${s.id}`)
    else navigate(`/learn#${s.slug}`)
    setQuery('')
    setCommandOpen(false)
  }

  function submit(): void {
    if (active >= 0 && results[active]) go(results[active])
    else if (query.trim()) {
      navigate(`/explore?q=${encodeURIComponent(query.trim())}`)
      setQuery('')
      setCommandOpen(false)
    }
  }

  function onKeyDown(e: React.KeyboardEvent): void {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((a) => Math.min(a + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((a) => Math.max(a - 1, -1))
    } else if (e.key === 'Enter') {
      submit()
    } else if (e.key === 'Escape') {
      if (variant === 'overlay') setCommandOpen(false)
      else inputRef.current?.blur()
    }
  }

  return (
    <div className={`cmd cmd--${variant}`}>
      <div className="cmd__box" role="search">
        <IconSearch size={19} />
        <input
          ref={inputRef}
          className="cmd__input"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={onKeyDown}
          onFocus={() => setFocused(true)}
          onBlur={() => window.setTimeout(() => setFocused(false), 150)}
          placeholder={placeholder || 'Search the GitHub universe…'}
          aria-label="Search repositories, topics and lessons"
          autoComplete="off"
          spellCheck={false}
        />
        <button className="cmd__go" onClick={submit} aria-label="Run search">
          <IconArrowRight size={18} />
        </button>
      </div>

      {variant === 'hero' && (
        <div className="cmd__chips" aria-label="Try searching for">
          <span style={{ fontSize: 12.5, color: 'var(--text-3)', alignSelf: 'center', fontFamily: 'var(--font-mono)' }}>try:</span>
          {CHIPS.map((c) => (
            <button key={c} className="chip" onClick={() => navigate(`/explore?q=${encodeURIComponent(c)}`)}>
              {c}
            </button>
          ))}
        </div>
      )}

      <AnimatePresence>
        {(focused || (variant === 'overlay' && query)) && results.length > 0 && (
          <motion.div
            className="cmd__results"
            role="listbox"
            initial={{ opacity: 0, y: -8, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.16 }}
          >
            {results.map((s, i) => (
              <button
                key={s.kind === 'repo' ? s.repo.id : s.label}
                role="option"
                aria-selected={i === active}
                className={`cmd__item${i === active ? ' is-active' : ''}`}
                onMouseEnter={() => setActive(i)}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => go(s)}
              >
                {s.kind === 'repo' ? (
                  <>
                    <LanguageDot lang={s.repo.language} />
                    <span className="cmd__item-name">{s.repo.id}</span>
                    <span className="cmd__item-desc">{s.repo.why}</span>
                    <span className="cmd__item-meta">
                      <span className="pill pill--amber">★ {formatCompact(s.repo.stars)}</span>
                    </span>
                  </>
                ) : s.kind === 'category' ? (
                  <>
                    <span style={{ color: 'var(--cyan)', display: 'flex' }}>
                      <CategoryGlyph id={s.id} size={15} />
                    </span>
                    <span className="cmd__item-name">{s.label}</span>
                    <span className="cmd__item-desc">browse ecosystem</span>
                  </>
                ) : (
                  <>
                    <span style={{ color: 'var(--magenta)' }}>✦</span>
                    <span className="cmd__item-name">{s.label}</span>
                    <span className="cmd__item-desc">interactive lesson</span>
                  </>
                )}
              </button>
            ))}
            <div style={{ padding: '7px 12px', fontSize: 11, color: 'var(--text-4)', fontFamily: 'var(--font-mono)', display: 'flex', gap: 14 }}>
              <span>↑↓ navigate</span>
              <span>↵ open</span>
              <span>esc close</span>
              <span style={{ marginLeft: 'auto' }}>enter → full results</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {focused && query && results.length === 0 && (
        <div className="cmd__results">
          <div className="cmd__empty">
            No signal found for '<b>{query}</b>'. Try{' '}
            <b style={{ cursor: 'pointer' }} onClick={() => setQuery('react ui library')}>
              react ui library
            </b>
          </div>
        </div>
      )}
    </div>
  )
}

/** Global ⌘K palette wrapper. */
export function CommandOverlay() {
  const { commandOpen, setCommandOpen } = useApp()
  useEffect(() => {
    if (!commandOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setCommandOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [commandOpen, setCommandOpen])

  return (
    <AnimatePresence>
      {commandOpen && (
        <>
          <motion.div
            className="overlay-scrim"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCommandOpen(false)}
          />
          <motion.div
            className="overlay-panel"
            initial={{ opacity: 0, y: 14, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <CommandSearch variant="overlay" />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
