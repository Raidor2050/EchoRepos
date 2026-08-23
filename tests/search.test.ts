import { describe, expect, it } from 'vitest'
import { runSearch, applyFilters, suggest } from '../src/lib/search'

describe('runSearch', () => {
  it('ranks agent frameworks for "ai agents"', () => {
    const rows = runSearch('ai agents')
    expect(rows.length).toBeGreaterThan(0)
    const topCats = rows.slice(0, 6).map((r) => r.repo.category)
    expect(topCats.filter((c) => c === 'agents' || c === 'ai').length).toBeGreaterThanOrEqual(3)
  })

  it('expands synonyms (py → python)', () => {
    const rows = runSearch('py web framework')
    expect(rows.length).toBeGreaterThan(0)
    expect(rows.slice(0, 8).some((r) => r.repo.languages.includes('Python'))).toBe(true)
  })

  it('finds fastapi for "python api framework"', () => {
    const rows = runSearch('python api framework')
    expect(rows[0].repo.id).toBe('fastapi/fastapi')
  })

  it('matches repo names directly', () => {
    const rows = runSearch('react')
    expect(rows[0].repo.id).toBe('facebook/react')
  })

  it('empty query returns popularity-ranked defaults', () => {
    const rows = runSearch('')
    expect(rows.length).toBeGreaterThan(100)
    expect(rows[0].repo.signals.popularity).toBeGreaterThanOrEqual(rows[50].repo.signals.popularity)
  })

  it('never crashes on garbage input', () => {
    expect(runSearch('!!!@@@###')[0]).toBeDefined()
    expect(runSearch('zzzzqqqq')).toEqual([])
  })
})

describe('applyFilters', () => {
  it('filters by difficulty', () => {
    const rows = applyFilters({ query: '', difficulty: 'beginner' }, 'best')
    expect(rows.length).toBeGreaterThan(10)
    for (const r of rows) expect(r.repo.difficulty).toBe('beginner')
  })

  it('filters by language and category together', () => {
    const rows = applyFilters({ query: '', language: 'TypeScript', category: 'frontend' }, 'stars')
    expect(rows.length).toBeGreaterThan(3)
    for (const r of rows) {
      expect(r.repo.languages).toContain('TypeScript')
      expect(r.repo.categories).toContain('frontend')
    }
  })

  it('minStars filter respects threshold', () => {
    const rows = applyFilters({ query: '', minStars: 100_000 }, 'stars')
    for (const r of rows) expect(r.repo.stars).toBeGreaterThanOrEqual(100_000)
    expect(rows[0].repo.stars).toBeGreaterThanOrEqual((rows[rows.length - 1] ?? rows[0]).repo.stars)
  })

  it('sort=recent orders by updated desc', () => {
    const rows = applyFilters({ query: '' }, 'recent')
    for (let i = 1; i < rows.length; i++) {
      expect(rows[i - 1].repo.updated >= rows[i].repo.updated).toBe(true)
    }
  })

  it('sort=beginner surfaces beginner repos first', () => {
    const rows = applyFilters({ query: 'learn' }, 'beginner')
    expect(['beginner', 'intermediate']).toContain(rows[0].repo.difficulty)
  })
})

describe('suggest', () => {
  it('returns repo suggestions for prefixes', () => {
    const s = suggest('vite', 7)
    expect(s.some((x) => x.kind === 'repo' && x.repo.id === 'vitejs/vite')).toBe(true)
  })

  it('maps lesson questions to lesson suggestions', () => {
    const s = suggest('what is a pull request', 7)
    expect(s[0].kind).toBe('lesson')
  })

  it('returns empty for empty input', () => {
    expect(suggest('   ')).toEqual([])
  })

  it('caps results at limit', () => {
    expect(suggest('a', 5).length).toBeLessThanOrEqual(5)
  })
})
