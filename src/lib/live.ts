/**
 * Live GitHub trending data - fetched client-side on the homepage.
 * Pure helpers here; network call kept separate so mappers stay testable.
 */

import { REPOS } from './data'
import { githubUrl } from './format'

export interface LiveRepo {
  id: string
  name: string
  owner: string
  url: string
  desc: string
  stars: number
  forks: number
  language: string
}

interface ApiRepoItem {
  full_name?: unknown
  html_url?: unknown
  stargazers_count?: unknown
  forks_count?: unknown
  language?: unknown
  description?: unknown
}

/** Search API: current most-starred repositories (unauthenticated, CORS-enabled). */
export function topReposUrl(perPage = 8): string {
  return `https://api.github.com/search/repositories?q=stars:%3E10000&sort=stars&order=desc&per_page=${perPage}`
}

const clean = (s: string, max: number): string =>
  s.replace(/[\u2012-\u2015]/g, '-').replace(/\s+/g, ' ').trim().slice(0, max)

export function mapTopRepo(item: ApiRepoItem): LiveRepo | null {
  if (typeof item.full_name !== 'string' || !item.full_name.includes('/')) return null
  const [owner, name] = item.full_name.split('/')
  if (!owner || !name) return null
  const stars = typeof item.stargazers_count === 'number' ? item.stargazers_count : 0
  if (stars <= 0) return null
  return {
    id: item.full_name.toLowerCase(),
    name,
    owner,
    url: typeof item.html_url === 'string' ? item.html_url : `https://github.com/${item.full_name}`,
    desc: clean(typeof item.description === 'string' ? item.description : 'No description provided.', 160),
    stars,
    forks: typeof item.forks_count === 'number' ? item.forks_count : 0,
    language: typeof item.language === 'string' && item.language ? item.language : 'Text',
  }
}

export async function fetchTopRepos(signal?: AbortSignal, perPage = 8): Promise<LiveRepo[]> {
  const res = await fetch(topReposUrl(perPage), {
    signal,
    headers: { Accept: 'application/vnd.github+json' },
  })
  if (!res.ok) throw new Error(`GitHub API ${res.status}`)
  const json: { items?: ApiRepoItem[] } = await res.json()
  const items = Array.isArray(json.items)
    ? json.items.map(mapTopRepo).filter((r): r is LiveRepo => r !== null)
    : []
  if (items.length === 0) throw new Error('GitHub API returned no usable results')
  return items
}

/** Curated fallback (catalog's own most-starred) shown when the API is unavailable or rate-limited. */
export function catalogFallback(count = 8): LiveRepo[] {
  return [...REPOS]
    .sort((a, b) => b.stars - a.stars)
    .slice(0, count)
    .map((r) => ({
      id: r.id,
      name: r.name,
      owner: r.owner,
      url: githubUrl(r.id),
      desc: clean(r.desc || r.why, 160),
      stars: r.stars,
      forks: r.forks,
      language: r.language || r.languages[0] || 'Text',
    }))
}
