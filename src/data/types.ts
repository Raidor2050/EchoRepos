/* ── EchoRepos core data model ─────────────────────────────────────────── */

export type CategoryId =
  | 'ai'
  | 'agents'
  | 'webdev'
  | 'frontend'
  | 'backend'
  | 'mobile'
  | 'devtools'
  | 'devops'
  | 'databases'
  | 'datasci'
  | 'security'
  | 'automation'
  | 'gamedev'
  | 'creative'
  | 'oss'
  | 'learning'
  | 'blockchain'
  | 'systems'
  | 'media'
  | 'privacy'
  | 'knowledge'
  | 'hardware'
  | 'science'
  | 'curated'

export type Difficulty = 'beginner' | 'intermediate' | 'advanced'

export type ProjectType =
  | 'library'
  | 'framework'
  | 'app-template'
  | 'tool'
  | 'cli'
  | 'course'
  | 'self-hosted'
  | 'engine'

export interface RepoSignals {
  /** 0–100 - adoption / stars percentile within the catalog */
  popularity: number
  /** 0–100 - recent commit cadence & release velocity */
  activity: number
  /** 0–100 - battle-tested readiness for production use */
  production: number
  /** 0–100 - educational value: docs quality, readability, guided ramp */
  learning: number
}

export interface Repo {
  /** "owner/name" - stable unique id */
  id: string
  name: string
  owner: string
  desc: string
  /** one-line editorial: why this repo matters */
  why: string
  category: CategoryId
  categories: CategoryId[]
  language: string
  languages: string[]
  technologies: string[]
  /** kebab-case capability ids aligned with quiz Q4 (see lib/recommend.ts) */
  useCases: string[]
  projectTypes: ProjectType[]
  difficulty: Difficulty
  signals: RepoSignals
  /** approximate snapshot values; refreshed via scripts/fetch-stats.mjs */
  stars: number
  forks: number
  topics: string[]
  updated: string
  alternatives?: string[]
}

export interface Category {
  id: CategoryId
  label: string
  tagline: string
  hue: string
}
