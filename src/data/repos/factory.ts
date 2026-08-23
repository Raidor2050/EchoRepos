import type { CategoryId, Difficulty, ProjectType, Repo } from '../types'

/** Default capability mapping per primary category (used when a seed omits `u`). */
const CATEGORY_USECASES: Record<CategoryId, string[]> = {
  ai: ['ai-integration'],
  agents: ['ai-integration', 'automation-scraping'],
  webdev: ['web-apps'],
  frontend: ['web-apps', 'design-systems'],
  backend: ['apis'],
  mobile: ['mobile-apps'],
  devtools: ['dev-tooling'],
  devops: ['deploy-infra'],
  databases: ['data-storage'],
  datasci: ['dashboards-viz', 'data-pipelines'],
  security: ['security-hardening'],
  automation: ['automation-scraping'],
  gamedev: ['games'],
  creative: ['design-systems', 'games'],
  oss: ['dev-tooling', 'learning'],
  learning: ['learning'],
  blockchain: ['dev-tooling', 'security-hardening'],
  systems: ['dev-tooling', 'deploy-infra'],
  media: ['content-sites', 'desktop-apps'],
  privacy: ['security-hardening', 'deploy-infra'],
  knowledge: ['content-sites', 'self-hosted'],
  hardware: ['automation-scraping', 'games'],
  science: ['data-pipelines', 'dashboards-viz'],
  curated: ['learning', 'dev-tooling'],
}

const DIFF: Record<string, Difficulty> = { b: 'beginner', i: 'intermediate', a: 'advanced' }

export interface SeedFields {
  /** description (≤160 chars) */
  d: string
  /** editorial one-liner: why it matters */
  w: string
  /** technologies, space separated */
  t?: string
  /** secondary languages, space separated */
  l?: string
  /** use-case ids, space separated */
  u?: string
  /** project types, space separated */
  p?: string
  /** difficulty: b | i | a */
  diff: 'b' | 'i' | 'a'
  /** signals: [popularity, activity, production, learning] 0–100 */
  sig: [number, number, number, number]
  /** approximate star count at snapshot time */
  s: number
  /** approximate fork count (defaults to ~16% of stars) */
  f?: number
  /** topics, space separated */
  topics?: string
  /** alternative repo ids, space separated */
  alt?: string
  /** approximate last-push date */
  up?: string
}

/** Expand a compact seed row into the full Repo shape. */
export function seed(
  id: string,
  category: CategoryId,
  extraCategories: CategoryId[],
  language: string,
  x: SeedFields,
): Repo {
  const categories = [category, ...extraCategories.filter((c) => c !== category)]
  const technologies = x.t ? x.t.split(' ') : []
  const projectTypes = (x.p ? x.p.split(' ') : ['library']) as ProjectType[]
  const forks =
    x.f ?? Math.max(200, Math.round((x.s * 0.16) / 100) * 100)
  return {
    id,
    name: id.split('/')[1],
    owner: id.split('/')[0],
    desc: x.d,
    why: x.w,
    category,
    categories,
    language,
    languages: x.l ? [language, ...x.l.split(' ')] : [language],
    technologies,
    useCases: x.u ? x.u.split(' ') : CATEGORY_USECASES[category],
    projectTypes,
    difficulty: DIFF[x.diff],
    signals: {
      popularity: x.sig[0],
      activity: x.sig[1],
      production: x.sig[2],
      learning: x.sig[3],
    },
    stars: x.s,
    forks,
    topics: x.topics ? x.topics.split(' ') : [categories[0].replace('-', '-')],
    updated: x.up ?? '2026-07',
    alternatives: x.alt ? x.alt.split(' ') : undefined,
  }
}
