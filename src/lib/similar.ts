import type { Repo } from '../data/types'
import { REPOS, getRepo } from './data'

/* ────────────────────────────────────────────────────────────────────────
   Weighted-Jaccard similarity over sparse tag vectors.
   Field multipliers: categories ×2 · languages ×1.5 · technologies ×1 ·
   use-cases ×1. Threshold + shared-tag floor kills coincidental matches.
   ──────────────────────────────────────────────────────────────────────── */

const FIELD_WEIGHTS = { categories: 2, languages: 1.5, technologies: 1, useCases: 1 }

function fieldSets(r: Repo): Array<{ w: number; items: string[] }> {
  return [
    { w: FIELD_WEIGHTS.categories, items: r.categories },
    { w: FIELD_WEIGHTS.languages, items: r.languages.map((l) => l.toLowerCase()) },
    { w: FIELD_WEIGHTS.technologies, items: r.technologies.map((t) => t.toLowerCase()) },
    { w: FIELD_WEIGHTS.useCases, items: [...r.useCases, ...r.projectTypes] },
  ]
}

export function similarityScore(a: Repo, b: Repo): { score: number; shared: number } {
  if (a.id === b.id) return { score: 1, shared: 99 }
  let inter = 0
  let union = 0
  let shared = 0
  for (const { w, items } of fieldSets(a)) {
    const other = new Set(fieldSets(b).find((x) => x.w === w)?.items ?? [])
    for (const item of items) {
      if (other.has(item)) {
        inter += w
        shared++
      }
    }
    union += new Set([...items, ...other]).size * w
  }
  return { score: union === 0 ? 0 : inter / union, shared }
}

export interface SimilarRepo {
  repo: Repo
  score: number
}

/**
 * Related-repo discovery for detail pages.
 * Excludes the repo itself and its declared alternatives (rendered separately).
 */
export function similarRepos(id: string, limit = 6, minScore = 0.18): SimilarRepo[] {
  const center = getRepo(id)
  if (!center) return []
  const exclude = new Set<string>([id, ...(center.alternatives ?? [])])
  const rows: SimilarRepo[] = []
  for (const r of REPOS) {
    if (exclude.has(r.id)) continue
    const { score, shared } = similarityScore(center, r)
    if (score >= minScore && shared >= 2) rows.push({ repo: r, score })
  }
  return rows.sort((a, b) => b.score - a.score || b.repo.stars - a.repo.stars).slice(0, limit)
}
