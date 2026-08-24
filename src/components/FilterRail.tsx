import type { Difficulty } from '../data/types'
import { CATEGORIES } from '../data/taxonomy'
import { LANGUAGES } from '../lib/data'
import { formatCompact } from '../lib/format'
import type { SearchFilters, SortKey } from '../lib/search'
import { IconX } from './Icons'

export interface RailState {
  filters: SearchFilters
  sort: SortKey
  set: (patch: Partial<SearchFilters>) => void
  setSort: (s: SortKey) => void
  clearAll: () => void
}

const STAR_STEPS = [0, 10_000, 50_000, 100_000]

export function FilterRail({ state }: { state: RailState }) {
  const { filters, set } = state

  return (
    <div className="rail">
      <div className="rail__group">
        <span className="rail__label">
          Query <button onClick={() => set({ query: '' })} aria-label="Clear query" style={{ color: 'var(--text-4)' }}>clear</button>
        </span>
        <input
          className="cmd__input"
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.13)',
            borderRadius: 'var(--r-md)',
            padding: '10px 12px',
          }}
          value={filters.query}
          onChange={(e) => set({ query: e.target.value })}
          placeholder="search within results…"
          aria-label="Search within results"
        />
      </div>

      <div className="rail__group">
        <span className="rail__label">Ecosystem</span>
        <div className="rail__chips">
          <button className={`chip${!filters.category ? ' is-active' : ''}`} onClick={() => set({ category: '' })}>
            All
          </button>
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              className={`chip${filters.category === c.id ? ' is-active' : ''}`}
              onClick={() => set({ category: filters.category === c.id ? '' : c.id })}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <div className="rail__group">
        <span className="rail__label">Language</span>
        <div className="select-wrap">
          <select value={filters.language ?? ''} onChange={(e) => set({ language: e.target.value })} aria-label="Filter by language">
            <option value="">Any language</option>
            {LANGUAGES.map((l) => (
              <option key={l.lang} value={l.lang}>
                {l.lang} ({l.count})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="rail__group">
        <span className="rail__label">Difficulty</span>
        <div className="seg" role="group" aria-label="Difficulty">
          {(['', 'beginner', 'intermediate', 'advanced'] as Array<Difficulty | ''>).map((d) => (
            <button key={d || 'any'} className={filters.difficulty === d ? 'is-on' : ''} onClick={() => set({ difficulty: d })}>
              {d === '' ? 'Any' : d[0].toUpperCase() + d.slice(1, 3)}
            </button>
          ))}
        </div>
      </div>

      <div className="rail__group">
        <span className="rail__label">Minimum stars</span>
        <input
          className="range-stars"
          type="range"
          min={0}
          max={STAR_STEPS.length - 1}
          step={1}
          value={STAR_STEPS.findIndex((s) => s === (filters.minStars ?? 0))}
          onChange={(e) => set({ minStars: STAR_STEPS[Number(e.target.value)] })}
          aria-label="Minimum stars"
        />
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-2)' }}>
          ≥ {(filters.minStars ?? 0).toLocaleString()} ★
        </span>
      </div>

      <SortSelect state={state} />
    </div>
  )
}

export function SortSelect({ state }: { state: RailState }) {
  return (
    <div className="rail__group">
      <span className="rail__label">Sort by</span>
      <div className="select-wrap">
        <select value={state.sort} onChange={(e) => state.setSort(e.target.value as SortKey)} aria-label="Sort results">
          <option value="best">Best match</option>
          <option value="stars">Most starred</option>
          <option value="trending">Trending</option>
          <option value="recent">Recently active</option>
          <option value="beginner">Beginner friendly</option>
        </select>
      </div>
    </div>
  )
}

export function ActiveFilters({ state }: { state: RailState }) {
  const { filters, set, clearAll } = state
  const chips: Array<{ label: string; clear: () => void }> = []

  if (filters.query.trim()) chips.push({ label: `"${filters.query.trim()}"`, clear: () => set({ query: '' }) })
  if (filters.category) {
    const cat = CATEGORIES.find((c) => c.id === filters.category)
    chips.push({ label: cat?.label ?? String(filters.category), clear: () => set({ category: '' }) })
  }
  if (filters.language) chips.push({ label: filters.language, clear: () => set({ language: '' }) })
  if (filters.difficulty) chips.push({ label: filters.difficulty, clear: () => set({ difficulty: '' }) })
  if ((filters.minStars ?? 0) > 0) chips.push({ label: `≥ ${formatCompact(filters.minStars!)}★`, clear: () => set({ minStars: 0 }) })

  if (chips.length === 0) return null

  return (
    <div className="active-filters" aria-label="Active filters">
      {chips.map((c) => (
        <span key={c.label} className="af-chip">
          {c.label}
          <button onClick={c.clear} aria-label={`Remove filter ${c.label}`}>
            <IconX size={11} />
          </button>
        </span>
      ))}
      <button onClick={clearAll} style={{ color: 'var(--text-3)', fontSize: 12.5, textDecoration: 'underline' }}>
        Clear all
      </button>
    </div>
  )
}
