import { describe, expect, it } from 'vitest'
import { mapTopRepo, topReposUrl, catalogFallback } from '../src/lib/live'
import { REPOS } from '../src/lib/data'

describe('live github feed', () => {
  it('builds a search url with encoded star filter', () => {
    const url = topReposUrl(8)
    expect(url).toContain('https://api.github.com/search/repositories?')
    expect(url).toContain('stars:%3E10000')
    expect(url).toContain('sort=stars')
    expect(url).toContain('per_page=8')
  })

  it('maps valid api items and rejects broken ones', () => {
    const ok = mapTopRepo({
      full_name: 'OAI/open-shim',
      html_url: 'https://github.com/OAI/open-shim',
      stargazers_count: 12345,
      forks_count: 678,
      language: 'Rust',
      description: '  A  shim   -  for models ',
    })
    expect(ok).toEqual({
      id: 'oai/open-shim',
      name: 'open-shim',
      owner: 'OAI',
      url: 'https://github.com/OAI/open-shim',
      desc: 'A shim - for models',
      stars: 12345,
      forks: 678,
      language: 'Rust',
    })
    expect(mapTopRepo({ full_name: 'no-slash' })).toBeNull()
    expect(mapTopRepo({ full_name: 'a/b', stargazers_count: 0 })).toBeNull()
    expect(mapTopRepo({})).toBeNull()
  })

  it('fallback mirrors the curated catalog, most stars first', () => {
    const fb = catalogFallback(8)
    expect(fb.length).toBe(8)
    const top = [...REPOS].sort((a, b) => b.stars - a.stars).slice(0, 8)
    expect(fb.map((r) => r.id)).toEqual(top.map((r) => r.id))
    for (const r of fb) {
      expect(r.url).toBe(`https://github.com/${top.find((t) => t.id === r.id)!.id}`)
      expect(r.desc.length).toBeGreaterThan(0)
    }
  })
})
