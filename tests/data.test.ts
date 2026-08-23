import { describe, expect, it } from 'vitest'
import { REPOS, BY_ID, getRepo } from '../src/lib/data'
import { CATEGORIES, CATEGORY_IDS } from '../src/data/taxonomy'
import { LESSONS, TRACK_ORDER } from '../src/data/lessons'

describe('dataset integrity', () => {
  it('has at least 200 repositories', () => {
    expect(REPOS.length).toBeGreaterThanOrEqual(200)
  })

  it('has unique ids shaped owner/name', () => {
    const ids = REPOS.map((r) => r.id)
    expect(new Set(ids).size).toBe(ids.length)
    for (const id of ids) expect(id).toMatch(/^[^/]+\/[^/]+$/)
  })

  it('every repo has valid taxonomy fields', () => {
    for (const r of REPOS) {
      expect(CATEGORY_IDS).toContain(r.category)
      expect(['beginner', 'intermediate', 'advanced']).toContain(r.difficulty)
      expect(r.categories.length).toBeGreaterThan(0)
      expect(r.languages.length).toBeGreaterThan(0)
      expect(r.useCases.length).toBeGreaterThan(0)
      expect(r.projectTypes.length).toBeGreaterThan(0)
      expect(r.topics.length).toBeGreaterThan(0)
      expect(r.stars).toBeGreaterThan(0)
      expect(r.forks).toBeGreaterThan(0)
      expect(r.updated).toMatch(/^\d{4}-\d{2}/)
    }
  })

  it('signals stay within 0–100', () => {
    for (const r of REPOS) {
      for (const v of Object.values(r.signals)) {
        expect(v).toBeGreaterThanOrEqual(0)
        expect(v).toBeLessThanOrEqual(100)
      }
    }
  })

  it('alternatives reference real repos or external github ids', () => {
    for (const r of REPOS) {
      for (const alt of r.alternatives ?? []) {
        expect(alt).toMatch(/^[^/]+\/[^/]+$/)
        if (BY_ID.has(alt) && alt === r.id) throw new Error(`self-alternative: ${r.id}`)
      }
    }
  })

  it('getRepo resolves by id', () => {
    const first = REPOS[0]
    expect(getRepo(first.id)?.id).toBe(first.id)
    expect(getRepo('nobody/nothing-here')).toBeUndefined()
  })

  it('every category holds repos and has unique hues', () => {
    expect(CATEGORIES.length).toBe(24)
    expect(new Set(CATEGORIES.map((c) => c.hue)).size).toBe(CATEGORIES.length)
    for (const c of CATEGORIES) {
      expect(REPOS.some((r) => r.category === c.id || r.categories.includes(c.id))).toBe(true)
    }
  })
})

describe('learn track', () => {
  it('has 12 lessons with unique slugs', () => {
    expect(LESSONS.length).toBe(12)
    expect(new Set(TRACK_ORDER).size).toBe(12)
  })

  it('lessons have readable body content', () => {
    for (const l of LESSONS) {
      expect(l.body.length).toBeGreaterThanOrEqual(3)
      expect(l.minutes).toBeGreaterThan(0)
      expect(l.minutes).toBeLessThanOrEqual(5)
    }
  })

  it('search lesson hints resolve to real lesson slugs', async () => {
    const { suggest } = await import('../src/lib/search')
    const s = suggest('what is a fork', 7)
    const lesson = s.find((x) => x.kind === 'lesson')
    expect(lesson).toBeTruthy()
    expect(TRACK_ORDER).toContain((lesson as { slug: string }).slug)
  })
})
