import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'motion/react'
import { RepoCard } from '../components/RepoCard'
import { FilterRail, ActiveFilters, SortSelect, type RailState } from '../components/FilterRail'
import { EmptyState, SectionHeading } from '../components/atoms'
import { IconMenu, IconX } from '../components/Icons'
import { applyFilters, type SearchFilters, type SortKey } from '../lib/search'
import { usePageMeta } from '../lib/hooks'

const PAGE = 24

/** URL params are the source of truth: ?q=&cat=&lang=&diff=&min=&sort= */
function filtersFromParams(p: URLSearchParams): SearchFilters {
  return {
    query: p.get('q') ?? '',
    category: (p.get('cat') as SearchFilters['category']) ?? '',
    language: p.get('lang') ?? '',
    difficulty: (p.get('diff') as SearchFilters['difficulty']) ?? '',
    minStars: Number(p.get('min')) || 0,
  }
}

export default function Explore() {
  usePageMeta('Explore repositories - EchoRepos')
  const [params, setParams] = useSearchParams()
  const filters = useMemo(() => filtersFromParams(params), [params])
  const sort = (params.get('sort') as SortKey) ?? 'best'
  const [visible, setVisible] = useState(PAGE)
  const [drawer, setDrawer] = useState(false)

  const state: RailState = useMemo(() => {
    function write(next: SearchFilters, s?: SortKey) {
      const q = new URLSearchParams()
      if (next.query.trim()) q.set('q', next.query.trim())
      if (next.category) q.set('cat', next.category)
      if (next.language) q.set('lang', next.language)
      if (next.difficulty) q.set('diff', next.difficulty)
      if ((next.minStars ?? 0) > 0) q.set('min', String(next.minStars))
      if (s && s !== 'best') q.set('sort', s)
      setParams(q, { replace: true })
      setVisible(PAGE)
    }
    return {
      filters,
      sort,
      set: (patch) => write({ ...filters, ...patch }),
      setSort: (s) => write(filters, s),
      clearAll: () => write({ query: '' }, 'best'),
    }
  }, [filters, sort, setParams])

  const results = useMemo(() => applyFilters(filters, sort), [filters, sort])
  const shown = results.slice(0, visible)

  return (
    <div className="page page-explore">
      <header className="page-head container">
        <SectionHeading
          eyebrow="browse"
          title="The full catalog"
          sub={results.length === 0 ? undefined : `${results.length} repositories match`}
        />
        <button className="rail-toggle" onClick={() => setDrawer(true)} aria-label="Open filters">
          <IconMenu size={17} /> Filters
        </button>
      </header>

      <ActiveFilters state={state} />

      <div className="explore-layout container">
        <aside className="explore-aside" aria-label="Filters">
          <FilterRail state={state} />
        </aside>

        <main>
          {drawer && (
            <div className="rail-drawer" role="dialog" aria-label="Filters">
              <div className="rail-drawer__head">
                <b>Filters</b>
                <button onClick={() => setDrawer(false)} aria-label="Close filters"><IconX size={20} /></button>
              </div>
              <FilterRail state={state} />
              <SortSelect state={state} />
              <button className="btn btn--primary" style={{ width: '100%' }} onClick={() => setDrawer(false)}>
                Show {results.length} results
              </button>
            </div>
          )}

          {shown.length > 0 ? (
            <>
              <motion.div layout className="repo-grid">
                {shown.map(({ repo }, i) => (
                  <motion.div
                    key={repo.id}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: Math.min(i % PAGE, 11) * 0.045 }}
                  >
                    <RepoCard repo={repo} />
                  </motion.div>
                ))}
              </motion.div>
              {visible < results.length && (
                <div style={{ textAlign: 'center', marginTop: 34 }}>
                  <button className="btn btn--ghost" onClick={() => setVisible((v) => v + PAGE)}>
                    Load {Math.min(PAGE, results.length - visible)} more ({results.length - visible} left)
                  </button>
                </div>
              )}
            </>
          ) : (
            <EmptyState
              icon="📡"
              title="No signal in this sector"
              text="Loosen a filter."
              action={{ label: 'Reset all filters', onClick: state.clearAll }}
            />
          )}
        </main>
      </div>
    </div>
  )
}
