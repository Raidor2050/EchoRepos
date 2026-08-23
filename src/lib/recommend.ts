import type { CategoryId, Difficulty, ProjectType, Repo } from '../data/types'
import { REPOS } from './data'
import { formatCompact } from './format'

/* ────────────────────────────────────────────────────────────────────────
   Metadata-driven recommendation engine.

   Quiz answers → profile vector → weighted multi-dimensional scoring →
   normalized match % + generated reasons. Adding categories/repos never
   requires touching the engine: everything reads structured metadata.
   ──────────────────────────────────────────────────────────────────────── */

export type BuildingType =
  | 'saas' | 'website' | 'mobile-app' | 'ai-app'
  | 'automation' | 'dev-tool' | 'game' | 'other'

export type Level = 'new' | 'some' | 'experienced'
export type Stage = 'idea' | 'mvp' | 'production'
export type Priority =
  | 'popularity' | 'simplicity' | 'performance'
  | 'production' | 'community' | 'learning'

export interface QuizAnswers {
  building?: BuildingType
  level?: Level
  /** up to 3 language keys; 'any' allowed */
  techs: string[]
  capability?: string
  stage?: Stage
  repoType?: ProjectType | 'any'
  priority?: Priority
}

export const EMPTY_ANSWERS: QuizAnswers = { techs: [] }

/** Q1 mapping: building type → category/use-case/project-type affinities. */
const BUILDING: Record<BuildingType, { cats: CategoryId[]; ucs: string[]; pts: ProjectType[]; label: string }> = {
  saas:       { cats: ['webdev', 'backend', 'frontend'],            ucs: ['auth-payments', 'data-storage', 'web-apps'], pts: ['framework', 'library', 'app-template'], label: 'SaaS' },
  website:    { cats: ['frontend', 'webdev', 'creative'],           ucs: ['content-sites', 'design-systems'],            pts: ['framework', 'library', 'app-template'], label: 'Website' },
  'mobile-app': { cats: ['mobile', 'frontend'],                     ucs: ['mobile-apps'],                                pts: ['framework', 'library'],                 label: 'Mobile app' },
  'ai-app':   { cats: ['ai', 'agents'],                             ucs: ['ai-integration'],                             pts: ['library', 'framework', 'engine'],       label: 'AI application' },
  automation: { cats: ['automation', 'datasci', 'devops'],          ucs: ['automation-scraping', 'data-pipelines'],      pts: ['self-hosted', 'tool', 'library'],       label: 'Automation' },
  'dev-tool': { cats: ['devtools', 'backend', 'devops'],            ucs: ['dev-tooling', 'apis'],                        pts: ['tool', 'cli', 'library'],               label: 'Developer tool' },
  game:       { cats: ['gamedev', 'creative'],                      ucs: ['games'],                                      pts: ['engine', 'framework', 'library'],       label: 'Game' },
  other:      { cats: [],                                           ucs: [],                                             pts: ['library', 'tool'],                      label: 'Something new' },
}

const LEVEL_TARGET_RANK: Record<Level, number> = { new: 0.15, some: 1, experienced: 1.7 }
const DIFF_RANK: Record<Difficulty, number> = { beginner: 0, intermediate: 1, advanced: 2 }

/** Q7 mapping: priority → blend of numeric signals (already 0–100). */
function priorityScore(r: Repo, p: Priority): number {
  const s = r.signals
  switch (p) {
    case 'popularity': return s.popularity * 0.85 + s.activity * 0.15
    case 'simplicity': return s.learning * 0.55 + s.production * 0.2 + (r.difficulty === 'beginner' ? 25 : r.difficulty === 'intermediate' ? 12 : 3)
    case 'performance': return s.activity * 0.35 + s.production * 0.4 + (/^(rust|c\+\+|c|go|zig)$/i.test(r.language) ? 25 : 8)
    case 'production': return s.production * 0.8 + s.popularity * 0.2
    case 'community': return s.popularity * 0.6 + s.activity * 0.4
    case 'learning': return s.learning * 0.9 + (r.difficulty === 'beginner' ? 10 : 0)
  }
}

const TECH_ADJACENT: Record<string, string[]> = {
  typescript: ['javascript'],
  javascript: ['typescript'],
  kotlin: ['java'],
  java: ['kotlin'],
}

interface DimSpec {
  key: string
  weight: number
  score: (r: Repo) => number
  reason: (r: Repo) => string
}

function dimensions(a: QuizAnswers): DimSpec[] {
  const b = BUILDING[a.building ?? 'other']
  const techsLower = a.techs.filter((t) => t !== 'any').map((t) => t.toLowerCase())

  return [
    {
      key: 'category',
      weight: 0.26,
      score: (r) => {
        if (b.cats.length === 0) return 0.55
        if (r.category === b.cats[0]) return 1
        if (b.cats.slice(1).includes(r.category)) return 0.78
        if (r.categories.some((c) => b.cats.includes(c))) return 0.6
        return 0.28
      },
      reason: (r) => `Core ${labelOfCat(r.category)} ecosystem`,
    },
    {
      key: 'capability',
      weight: 0.22,
      score: (r) => {
        let s = 0.32
        if (a.capability && r.useCases.includes(a.capability)) s = Math.max(s, 1)
        if (a.repoType && a.repoType !== 'any' && r.projectTypes.includes(a.repoType)) s = Math.max(s, 0.9)
        if (a.stage === 'mvp' && r.signals.production >= 80) s += 0.08
        if (a.stage === 'idea') s += r.signals.learning / 500
        if (a.stage === 'production' && r.signals.production >= 90) s += 0.06
        if (b.ucs.some((u) => r.useCases.includes(u))) s = Math.max(s, 0.72)
        return Math.min(1, s)
      },
      reason: (r) =>
        a.capability && r.useCases.includes(a.capability)
          ? `Purpose-built for ${prettyUc(a.capability)}`
          : `Fits your ${BUILDING[a.building ?? 'other'].label.toLowerCase()} goal`,
    },
    {
      key: 'priority',
      weight: 0.24,
      score: (r) => priorityScore(r, a.priority ?? 'popularity') / 100,
      reason: (r) => {
        switch (a.priority) {
          case 'simplicity': return r.difficulty === 'beginner' ? 'Gentle setup, guided docs' : 'Approachable codebase'
          case 'performance': return 'Engineered for raw speed'
          case 'production': return `Battle-tested readiness (${r.signals.production}/100)`
          case 'learning': return 'High learning value - great docs & structure'
          case 'community': return `${formatCompact(r.stars)}★ community favorite`
          default: return `${formatCompact(r.stars)}★ - widely adopted`
        }
      },
    },
    {
      key: 'tech',
      weight: 0.16,
      score: (r) => {
        if (techsLower.length === 0) return 0.62
        const langs = r.languages.map((l) => l.toLowerCase())
        for (const t of techsLower) {
          if (langs.includes(t)) return 1
          if ((TECH_ADJACENT[t] ?? []).some((adj) => langs.includes(adj))) return 0.65
          if (r.technologies.some((x) => x.toLowerCase().includes(t))) return 0.75
        }
        return 0.22
      },
      reason: (r) => `Written in ${r.language}`,
    },
    {
      key: 'difficulty',
      weight: 0.12,
      score: (r) => {
        const target = LEVEL_TARGET_RANK[a.level ?? 'some']
        const dist = Math.abs(DIFF_RANK[r.difficulty] - target)
        return Math.max(0.18, 1 - dist * 0.38)
      },
      reason: (r) =>
        a.level === 'new' && r.difficulty === 'beginner'
          ? 'Beginner-friendly on-ramp'
          : a.level === 'experienced' && r.difficulty === 'advanced'
            ? 'Deep, production-grade internals'
            : '',
    },
  ]
}

function labelOfCat(id: CategoryId): string {
  return id.replace(/-/g, ' ')
}

function prettyUc(uc: string): string {
  return uc.replace(/-/g, ' ')
}

export interface ScoredRepo {
  repo: Repo
  match: number
  reasons: string[]
}

/**
 * Rank the catalog for a quiz profile.
 * match% normalization: base 38 + 58 · raw^0.92 clamps top hits into 85–97
 * while the median pool lands in the 40–70 band.
 */
export function recommend(a: QuizAnswers, limit = 8): ScoredRepo[] {
  const dims = dimensions(a)
  const scored: ScoredRepo[] = REPOS.map((repo) => {
    const evaluated = dims.map((d) => ({
      key: d.key,
      contribution: d.weight * d.score(repo),
      text: d.reason(repo),
    }))
    const raw = evaluated.reduce((sum, d) => sum + d.contribution, 0)
    const contributions = [...evaluated].sort((x, y) => y.contribution - x.contribution)

    const reasons: string[] = []
    for (const c of contributions) {
      if (reasons.length >= 2) break
      if (c.contribution < 0.08) break
      if (!c.text || reasons.includes(c.text)) continue
      reasons.push(c.text)
    }
    if (reasons.length === 0 && repo.stars > 50_000) reasons.push(`${formatCompact(repo.stars)}★ - industry standard`)

    const match = Math.round(Math.min(97, Math.max(38, 38 + 58 * Math.pow(raw, 0.92))))
    return { repo, match, reasons }
  })

  scored.sort(
    (x, y) =>
      y.match - x.match ||
      y.repo.signals.popularity - x.repo.signals.popularity ||
      y.repo.stars - x.repo.stars,
  )
  return diversityGuard(scored).slice(0, limit)
}

/**
 * MMR-lite diversity pass: within any 10-slot window cap same-language at 4
 * and same primary-category at 5, swapping violators with next-ranked repos.
 */
function diversityGuard(rows: ScoredRepo[]): ScoredRepo[] {
  const out: ScoredRepo[] = []
  const pool = [...rows]
  while (pool.length > 0) {
    const start = Math.max(0, out.length - 9)
    const window = out.slice(start)
    const langCount = new Map<string, number>()
    const catCount = new Map<CategoryId, number>()
    for (const w of window) {
      langCount.set(w.repo.language, (langCount.get(w.repo.language) ?? 0) + 1)
      catCount.set(w.repo.category, (catCount.get(w.repo.category) ?? 0) + 1)
    }
    /* pick the ranked-first candidate that keeps every sliding 10-window
       within caps (≤4 same language, ≤5 same primary category);
       if none qualifies, admit whoever violates LEAST */
    let bestIdx = -1
    let bestCost = Infinity
    for (let i = 0; i < pool.length; i++) {
      const c = pool[i].repo
      const cost = Math.max(langCount.get(c.language) ?? 0, catCount.get(c.category) ?? 0)
      if (cost < bestCost) {
        bestCost = cost
        bestIdx = i
        if (cost <= 2) break
      }
    }
    const [picked] = pool.splice(bestIdx, 1)
    out.push(picked)
  }
  return out
}

/** "AI SaaS + TypeScript + Beginner" style profile headline. */
export function profileString(a: QuizAnswers): string {
  const parts: string[] = []
  if (a.building) parts.push(BUILDING[a.building].label)
  if (a.techs.length > 0) {
    parts.push(a.techs.length > 2 ? 'Polyglot' : titleCase(a.techs[0]))
  }
  if (a.level) parts.push({ new: 'Beginner', some: 'Intermediate', experienced: 'Advanced' }[a.level])
  return parts.join(' + ')
}

function titleCase(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1)
}
