import { describe, expect, it } from 'vitest'
import { recommend, profileString, EMPTY_ANSWERS, type QuizAnswers } from '../src/lib/recommend'
import { similarRepos } from '../src/lib/similar'

const base: QuizAnswers = {
  building: 'saas',
  level: 'new',
  techs: ['TypeScript'],
  capability: 'auth-payments',
  stage: 'idea',
  repoType: 'framework',
  priority: 'simplicity',
}

describe('recommend', () => {
  it('match % stays within the 38–97 band', () => {
    const rows = recommend(base, 20)
    for (const r of rows) {
      expect(r.match).toBeGreaterThanOrEqual(38)
      expect(r.match).toBeLessThanOrEqual(97)
    }
  })

  it('returns ranked results with non-empty reasons (≤2)', () => {
    const rows = recommend(base)
    expect(rows.length).toBe(8)
    expect(rows[0].match).toBeGreaterThanOrEqual(rows[rows.length - 1].match)
    for (const r of rows) {
      expect(r.reasons.length).toBeLessThanOrEqual(2)
      if (r.match > 55) expect(r.reasons.length).toBeGreaterThan(0)
    }
  })

  it('beginner profile favors beginner repos at the top', () => {
    const rows = recommend({ building: 'website', level: 'new', techs: ['any'], priority: 'learning' }, 8)
    const beginnerCount = rows.filter((r) => r.repo.difficulty === 'beginner').length
    expect(beginnerCount).toBeGreaterThanOrEqual(2)
  })

  it('respects tech preference in top slots', () => {
    const rows = recommend({ building: 'ai-app', level: 'experienced', techs: ['Python'], priority: 'performance' }, 5)
    const py = rows.filter((r) => r.repo.languages.includes('Python')).length
    expect(py).toBeGreaterThanOrEqual(2)
  })

  it('diversity guard caps same language at 4 per window', () => {
    const rows = recommend(base, 12)
    for (let i = 0; i + 10 <= rows.length; i++) {
      const window = rows.slice(i, i + 10)
      const counts = new Map<string, number>()
      for (const w of window) counts.set(w.repo.language, (counts.get(w.repo.language) ?? 0) + 1)
      for (const n of counts.values()) expect(n).toBeLessThanOrEqual(4)
    }
  })

  it('empty answers still produce a sensible default list', () => {
    const rows = recommend(EMPTY_ANSWERS, 8)
    expect(rows.length).toBe(8)
    for (const r of rows) expect(r.match).toBeGreaterThan(0)
  })
})

describe('profileString', () => {
  it('joins goal + stack + level', () => {
    expect(profileString(base)).toMatch(/SaaS/)
    expect(profileString(base)).toMatch(/TypeScript|Polyglot/)
    expect(profileString(base)).toMatch(/Beginner/)
  })

  it('handles partial answers', () => {
    expect(profileString({ techs: [] })).toBe('')
    expect(profileString({ techs: ['Rust'] })).toBe('Rust')
  })
})

describe('similarRepos', () => {
  it('finds related repos and excludes self & alternatives', () => {
    const rel = similarRepos('facebook/react', 6)
    expect(rel.length).toBeGreaterThan(0)
    for (const { repo } of rel) {
      expect(repo.id).not.toBe('facebook/react')
      expect(repo.id.startsWith('facebook/')).toBe(false)
    }
  })

  it('related repos share metadata signals', () => {
    const rel = similarRepos('fastapi/fastapi', 4)
    for (const { repo } of rel) {
      const shared =
        repo.categories.filter((c) => c === 'backend' || c === 'webdev').length +
        repo.languages.filter((l) => l === 'Python').length
      expect(shared).toBeGreaterThan(0)
    }
  })
})
