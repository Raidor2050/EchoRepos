import type { CategoryId, Repo } from '../data/types'
import { CATEGORY_IDS } from '../data/taxonomy'
import statsOverlay from '../data/stats.generated.json'
import { WEBDEV } from '../data/repos/webdev'
import { FRONTEND } from '../data/repos/frontend'
import { BACKEND } from '../data/repos/backend'
import { AI } from '../data/repos/ai'
import { AGENTS } from '../data/repos/agents'
import { DEVTOOLS } from '../data/repos/devtools'
import { DEVOPS } from '../data/repos/devops'
import { DATABASES, DATASCI, SECURITY } from '../data/repos/data'
import { AUTOMATION } from '../data/repos/automation'
import { SELFHOSTED } from '../data/repos/selfhosted'
import { MOBILE } from '../data/repos/mobile'
import { GAMEDEV } from '../data/repos/gamedev'
import { CREATIVE } from '../data/repos/creative'
import { OSSCORE } from '../data/repos/osscore'
import { LEARNING } from '../data/repos/learning'
import { EXPANSION_A } from '../data/repos/expansion-a'
import { EXPANSION_B } from '../data/repos/expansion-b'
import { EXPANSION_C } from '../data/repos/expansion-c'

interface StatsEntry {
  stars?: number
  forks?: number
  pushedAt?: string
}

/** Merge live-stat overlay (refreshed by scripts/fetch-stats.mjs) over seeds. */
function applyStats(repo: Repo): Repo {
  const entry = (statsOverlay as { entries: Record<string, StatsEntry> }).entries[repo.id]
  if (!entry) return repo
  return {
    ...repo,
    stars: entry.stars ?? repo.stars,
    forks: entry.forks ?? repo.forks,
    updated: entry.pushedAt?.slice(0, 10) ?? repo.updated,
  }
}

const BASE: Repo[] = [...WEBDEV,
  ...FRONTEND,
  ...BACKEND,
  ...AI,
  ...AGENTS,
  ...DEVTOOLS,
  ...DEVOPS,
  ...DATABASES,
  ...DATASCI,
  ...SECURITY,
  ...AUTOMATION,
  ...SELFHOSTED,
  ...MOBILE,
  ...GAMEDEV,
  ...CREATIVE,
  ...OSSCORE,
  ...LEARNING,
]

const SEEDS = [
  ...BASE,
  ...EXPANSION_A,
  ...EXPANSION_B,
  ...EXPANSION_C,
].map(applyStats)

/* Integrity guards (fail loudly in dev/test if the dataset is broken). */
if (import.meta.env.DEV) {
  const ids = new Set<string>()
  for (const r of SEEDS) {
    if (ids.has(r.id)) throw new Error(`Duplicate repo id: ${r.id}`)
    ids.add(r.id)
    if (!CATEGORY_IDS.includes(r.category)) throw new Error(`Unknown category: ${r.category} on ${r.id}`)
  }
}

/** The full curated catalog. */
export const REPOS: Repo[] = SEEDS

export const REPO_COUNT = REPOS.length

/** id → Repo lookup. */
export const BY_ID: ReadonlyMap<string, Repo> = new Map(REPOS.map((r) => [r.id, r]))

export function getRepo(id: string): Repo | undefined {
  return BY_ID.get(id)
}

export function reposInCategory(cat: CategoryId): Repo[] {
  return REPOS.filter((r) => r.categories.includes(cat))
}

export function categoryCount(cat: CategoryId): number {
  return REPOS.reduce((n, r) => n + (r.categories.includes(cat) ? 1 : 0), 0)
}

export interface LangStat {
  lang: string
  count: number
}

/** Language facet list, most common first. */
export const LANGUAGES: LangStat[] = (() => {
  const m = new Map<string, number>()
  for (const r of REPOS) for (const l of r.languages) m.set(l, (m.get(l) ?? 0) + 1)
  return [...m.entries()]
    .map(([lang, count]) => ({ lang, count }))
    .sort((a, b) => b.count - a.count || a.lang.localeCompare(b.lang))
})()

export const LANGUAGE_NAMES = LANGUAGES.map((l) => l.lang)

/** Deterministic pseudo-random sample of featured repos per category (hero universe). */
export function featuredPerCategory(n: number): Repo[] {
  const out: Repo[] = []
  for (let i = 0; i < CATEGORY_IDS.length; i++) {
    const pool = REPOS.filter((r) => r.category === CATEGORY_IDS[i])
    // deterministic stride sampling weighted toward popularity
    const sorted = [...pool].sort(
      (a, b) => b.signals.popularity * 2 + b.stars / 50_000 - (a.signals.popularity * 2 + a.stars / 50_000),
    )
    const take = Math.max(2, Math.round(sorted.length * n))
    for (let k = 0; k < take && k < sorted.length; k++) out.push(sorted[k])
  }
  return out
}
