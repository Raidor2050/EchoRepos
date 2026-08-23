import type { CategoryId, Difficulty, Repo } from '../data/types'
import { CATEGORIES } from '../data/taxonomy'
import { REPOS } from './data'

/* ────────────────────────────────────────────────────────────────────────
   Client-side search engine.
   Tokenized field-weighted scoring + natural-language intent boosts +
   a synonym expansion table. Pure functions, zero deps, <16ms @ 2000 repos.
   ──────────────────────────────────────────────────────────────────────── */

const SYNONYMS: Record<string, string[]> = {
  py: ['python'],
  js: ['javascript'],
  ts: ['typescript'],
  rs: ['rust'],
  golang: ['go'],
  cpp: ['c++'],
  ml: ['machine', 'learning'],
  llm: ['llm', 'ai'],
  ai: ['ai'],
  db: ['database', 'data-storage'],
  dbs: ['database'],
  k8s: ['kubernetes'],
  ops: ['devops'],
  cicd: ['deploy-infra', 'ci'],
  ui: ['frontend', 'design-systems'],
  ux: ['design-systems'],
  auth: ['auth-payments', 'authentication'],
  oauth: ['auth-payments', 'oauth'],
  login: ['auth-payments'],
  payments: ['auth-payments'],
  chat: ['realtime-chat'],
  websocket: ['realtime-chat'],
  realtime: ['realtime-chat'],
  dashboard: ['dashboards-viz', 'dashboards'],
  charts: ['dashboards-viz'],
  graphs: ['dashboards-viz'],
  scraper: ['automation-scraping', 'scraping'],
  crawl: ['automation-scraping'],
  bots: ['automation-scraping', 'agents'],
  bot: ['agents'],
  selfhost: ['self-hosted'],
  selfhosted: ['self-hosted'],
  nosql: ['databases'],
  sql: ['databases', 'postgres', 'sqlite'],
  orm: ['orm', 'data-storage'],
  game: ['games'],
  gamedev: ['gamedev', 'games'],
  vid: ['video'],
  video: ['video', 'ffmpeg'],
  photo: ['photos', 'immich'],
  notes: ['docs'],
  learn: ['learning', 'course'],
  tutorial: ['course', 'learning'],
  beginner: ['beginner'],
  easy: ['beginner'],
  fast: ['performance'],
}

interface Intent {
  id: string
  label: string
  test: RegExp
  cats?: CategoryId[]
  ucs?: string[]
  techs?: string[]
  pts?: string[]
  beginner?: boolean
  production?: boolean
}

/** Natural-language intent table — additive boosts, never hard filters. */
const INTENTS: Intent[] = [
  { id: 'beginner', label: 'Beginner-friendly picks', test: /\b(beginner|newbie|new to|start|starter|learn|easy|simple)\b/, beginner: true },
  { id: 'saas', label: 'SaaS building blocks', test: /\b(saas|startup|subscription|billing)\b/, cats: ['webdev', 'backend', 'frontend'], ucs: ['auth-payments', 'data-storage'] },
  { id: 'webapp', label: 'Web app stack', test: /\b(website|web ?app|landing|portfolio|blog)\b/, cats: ['webdev', 'frontend'], ucs: ['content-sites', 'web-apps'] },
  { id: 'agents', label: 'AI agents & LLM apps', test: /\b(ai|agent|llm|chatbot|gpt|rag)\b/, cats: ['ai', 'agents'], ucs: ['ai-integration'] },
  { id: 'db', label: 'Data & storage', test: /\b(database|storage|sql|orm|persist)\b/, cats: ['databases'], ucs: ['data-storage'] },
  { id: 'prod', label: 'Production-grade picks', test: /\b(production|enterprise|battle.?tested|scale|scalable)\b/, production: true },
  { id: 'lightweight', label: 'Lightweight tools', test: /\b(lightweight|minimal|small|tiny|fast)\b/, beginner: true },
  { id: 'cli', label: 'CLI & tooling', test: /\b(cli|command.?line|terminal|shell|script)\b/, cats: ['devtools'], pts: ['cli', 'tool'] },
  { id: 'viz', label: 'Dashboards & visualization', test: /\b(dashboard|chart|visuali|graph|analytic)\b/, cats: ['datasci'], ucs: ['dashboards-viz'] },
  { id: 'scrape', label: 'Automation & scraping', test: /\b(scraper|scraping|crawl|automat|workflow|no.?code)\b/, cats: ['automation'], ucs: ['automation-scraping'] },
  { id: 'mobile', label: 'Mobile apps', test: /\b(mobile|ios|android|app store|flutter|react native)\b/, cats: ['mobile'], ucs: ['mobile-apps'] },
  { id: 'deploy', label: 'Deployment & infra', test: /\b(deploy|docker|kubernetes|k8s|hosting|server|cloud|infra)\b/, cats: ['devops'], ucs: ['deploy-infra'] },
]

interface Doc {
  repo: Repo
  nameLower: string
  nameWords: string[]
  ownerLower: string
  topicsLower: string[]
  techsLower: string[]
  langsLower: string[]
  catsLower: string[]
  ucsLower: string[]
  ptsLower: string[]
  descLower: string
  whyLower: string
}

const DOCS: Doc[] = REPOS.map((repo) => ({
  repo,
  nameLower: repo.name.toLowerCase(),
  nameWords: repo.name.toLowerCase().split(/[^a-z0-9.]+/),
  ownerLower: repo.owner.toLowerCase(),
  topicsLower: repo.topics.map((t) => t.toLowerCase()),
  techsLower: repo.technologies.map((t) => t.toLowerCase()),
  langsLower: repo.languages.map((l) => l.toLowerCase()),
  catsLower: repo.categories.flatMap((c) => c.split('-')),
  ucsLower: [...repo.useCases.map((u) => u.toLowerCase()), ...repo.projectTypes],
  ptsLower: repo.projectTypes,
  descLower: repo.desc.toLowerCase(),
  whyLower: repo.why.toLowerCase(),
}))

function expand(token: string): string[] {
  const out = [token]
  const syn = SYNONYMS[token]
  if (syn) for (const s of syn) if (!out.includes(s)) out.push(s)
  return out
}

function tokenize(query: string): string[][] {
  return query
    .toLowerCase()
    .split(/[^a-z0-9+#.]+/)
    .filter((t) => t.length > 0 && /[a-z0-9]/.test(t) && !STOP.has(t))
    .map(expand)
}

const STOP = new Set(['the', 'a', 'an', 'for', 'to', 'of', 'me', 'my', 'i', 'what', 'is', 'are', 'best', 'good', 'show', 'find', 'need', 'want', 'some', 'with', 'and'])

function detectIntents(queryLower: string): Intent[] {
  return INTENTS.filter((i) => i.test.test(queryLower))
}

function scoreDoc(d: Doc, tokenGroups: string[][], intents: Intent[]): number {
  let s = 0
  const catBoost = new Set(intents.flatMap((i) => i.cats ?? []))
  const ucBoost = new Set(intents.flatMap((i) => i.ucs ?? []))
  const techBoost = new Set(intents.flatMap((i) => i.techs ?? []))
  const ptBoost = new Set(intents.flatMap((i) => i.pts ?? []))

  for (let gi = 0; gi < tokenGroups.length; gi++) {
    const variants = tokenGroups[gi]
    let best = 0
    for (let vi = 0; vi < variants.length; vi++) {
      const t = variants[vi]
      const primary = vi === 0
      let ts = 0
      if (d.nameLower.includes(t)) ts = Math.max(ts, primary ? 10 : 7)
      else if (d.nameWords.some((w) => w.startsWith(t))) ts = Math.max(ts, 6)
      if (d.ownerLower.includes(t)) ts = Math.max(ts, 4)
      if (d.topicsLower.some((x) => x === t)) ts = Math.max(ts, primary ? 6 : 4.5)
      else if (d.topicsLower.some((x) => x.startsWith(t) || t.startsWith(x))) ts = Math.max(ts, 3.5)
      if (d.techsLower.some((x) => x === t || x.includes(t))) {
        ts = Math.max(ts, primary ? 5.5 : 4)
        if (techBoost.size > 0 && [...techBoost].some((b) => t.includes(b) || b.includes(t))) ts += 2
      }
      if (d.langsLower.includes(t)) ts = Math.max(ts, primary ? 5.5 : 4)
      if (d.catsLower.includes(t)) {
        ts = Math.max(ts, primary ? 5 : 3.5)
        if ([...catBoost].some((b) => b.split('-').includes(t))) ts += 3
      }
      if (d.ucsLower.some((x) => x === t || x.includes(t))) {
        ts = Math.max(ts, primary ? 4.5 : 3)
        if ([...ucBoost].some((b) => t.includes(b) || b.includes(t))) ts += 3
      }
      if (d.ptsLower.some((x) => x === t)) {
        ts = Math.max(ts, 4)
        if ([...ptBoost].some((b) => t.includes(b) || b.includes(t))) ts += 2
      }
      if (d.descLower.includes(` ${t}`) || d.descLower.startsWith(t)) ts = Math.max(ts, primary ? 2.5 : 1.8)
      if (d.whyLower.includes(` ${t}`)) ts = Math.max(ts, primary ? 2 : 1.4)
      best = Math.max(best, ts)
    }
    s += best
  }

  // intent-driven signal adjustments
  for (const it of intents) {
    if (it.beginner && d.repo.difficulty === 'beginner') s += 3.5
    if (it.production) s += (d.repo.signals.production / 100) * 3
    if (it.cats?.length && it.cats.some((c) => d.repo.categories.includes(c))) s += 2.5
    if (it.ucs?.length && it.ucs.some((u) => d.repo.useCases.includes(u))) s += 2
  }

  return s
}

export interface ScoredRepo {
  repo: Repo
  score: number
  /** human label of the dominant NL intent that matched, if any */
  intent?: string
}

/** Score every catalog entry against the query. Empty query → popular blend. */
export function runSearch(query: string): ScoredRepo[] {
  const q = query.trim()
  if (!q) {
    return REPOS.map((repo) => ({
      repo,
      score: (repo.signals.popularity * 0.62 + repo.signals.activity * 0.38) * 0.1,
    })).sort((a, b) => b.score - a.score || b.repo.stars - a.repo.stars)
  }
  const qLower = q.toLowerCase()
  const intents = detectIntents(qLower)
  const tokenGroups = tokenize(q)
  let out: ScoredRepo[] = DOCS.map((d) => ({
    repo: d.repo,
    score: scoreDoc(d, tokenGroups, intents),
    intent: intents[0]?.label,
  }))
  if (tokenGroups.length > 0) {
    const strict = out.filter((r) => r.score > 0)
    if (strict.length > 0) {
      out = strict
    } else if (intents.length > 0) {
      /* no literal token hit — fall back to intent-relevant slices */
      out = out.filter((r) =>
        intents.some(
          (it) =>
            (it.cats?.length && it.cats.some((c) => r.repo.categories.includes(c))) ||
            (it.ucs?.length && it.ucs.some((u) => r.repo.useCases.includes(u))),
        ),
      )
    } else {
      return []
    }
  }
  // tiny quality prior so ties favor genuinely excellent repos
  return out
    .map((r) => ({ ...r, score: r.score + (r.repo.signals.popularity / 100) * 0.4 }))
    .sort((a, b) => b.score - a.score || b.repo.stars - a.repo.stars)
}

/* ── Filters & sorting ── */

export interface SearchFilters {
  query: string
  category?: CategoryId | ''
  language?: string
  difficulty?: Difficulty | ''
  minStars?: number
}

export type SortKey = 'best' | 'stars' | 'trending' | 'recent' | 'beginner'

export function applyFilters(f: SearchFilters, sort: SortKey): ScoredRepo[] {
  let rows = runSearch(f.query)
  const cat = f.category
  if (cat) rows = rows.filter((r) => r.repo.categories.includes(cat))
  if (f.language) rows = rows.filter((r) => r.repo.languages.includes(f.language!))
  if (f.difficulty) rows = rows.filter((r) => r.repo.difficulty === f.difficulty)
  if (f.minStars && f.minStars > 0) rows = rows.filter((r) => r.repo.stars >= f.minStars!)

  const bySort: Record<SortKey, (a: ScoredRepo, b: ScoredRepo) => number> = {
    best: (a, b) => b.score - a.score || b.repo.stars - a.repo.stars,
    stars: (a, b) => b.repo.stars - a.repo.stars,
    trending: (a, b) =>
      b.repo.signals.activity * 0.7 + b.repo.signals.popularity * 0.3 -
      (a.repo.signals.activity * 0.7 + a.repo.signals.popularity * 0.3),
    recent: (a, b) => b.repo.updated.localeCompare(a.repo.updated),
    beginner: (a, b) => {
      const dv = (d: Difficulty) => (d === 'beginner' ? 2 : d === 'intermediate' ? 1 : 0)
      return (
        dv(b.repo.difficulty) - dv(a.repo.difficulty) ||
        b.repo.signals.learning - a.repo.signals.learning ||
        b.repo.stars - a.repo.stars
      )
    },
  }
  return rows.sort(bySort[sort])
}

/* ── Suggestions (command palette autocomplete) ── */

export type Suggestion =
  | { kind: 'repo'; repo: Repo }
  | { kind: 'category'; id: CategoryId; label: string }
  | { kind: 'lesson'; slug: string; label: string }

const LESSON_HINTS: Array<{ slug: string; re: RegExp }> = [
  { slug: 'git', re: /\bgit\b(?!hub)|version control/i },
  { slug: 'github', re: /github/i },
  { slug: 'repository', re: /repositor/i },
  { slug: 'commit', re: /commit/i },
  { slug: 'branch', re: /branch/i },
  { slug: 'fork', re: /fork/i },
  { slug: 'star', re: /\bstars?\b/i },
  { slug: 'issue', re: /\bissues?\b/i },
  { slug: 'pull-request', re: /pull request|\bpr\b/i },
  { slug: 'contributor', re: /contribut/i },
  { slug: 'release', re: /release|version/i },
  { slug: 'open-source', re: /open source/i },
]

export function suggest(query: string, limit = 7): Suggestion[] {
  const q = query.trim()
  const out: Suggestion[] = []
  if (!q) return out

  const lesson = LESSON_HINTS.find((h) => h.re.test(q))
  if (lesson) {
    out.push({ kind: 'lesson', slug: lesson.slug, label: `Learn what ${lesson.slug.replace('-', ' ')} means` })
  }
  const qLower = q.toLowerCase()
  for (const c of CATEGORIES) {
    if (out.length >= limit) break
    if (c.label.toLowerCase().includes(qLower) || c.tagline.toLowerCase().includes(qLower)) {
      out.push({ kind: 'category', id: c.id, label: c.label })
    }
  }
  const seen = new Set<string>()
  for (const r of runSearch(q)) {
    if (out.length >= limit) break
    if (seen.has(r.repo.id)) continue
    seen.add(r.repo.id)
    out.push({ kind: 'repo', repo: r.repo })
  }
  return out
}
