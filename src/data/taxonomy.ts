import type { Category, CategoryId } from './types'

/** The 24 ecosystems of the EchoRepos universe. Order drives cluster layout. */
export const CATEGORIES: Category[] = [
  { id: 'ai',         label: 'AI & ML',          tagline: 'Models, training and inference',        hue: '#ff6ad5' },
  { id: 'agents',     label: 'AI Agents',        tagline: 'Autonomous & LLM-powered apps',         hue: '#a78bfa' },
  { id: 'webdev',     label: 'Web Frameworks',   tagline: 'Fullstack meta-frameworks',             hue: '#5b8cff' },
  { id: 'frontend',   label: 'Frontend & UI',    tagline: 'Interfaces, design systems, CSS',       hue: '#22d3ee' },
  { id: 'backend',    label: 'Backend & APIs',   tagline: 'Servers, routing, business logic',      hue: '#34d399' },
  { id: 'mobile',     label: 'Mobile & Desktop', tagline: 'Apps for every screen',                 hue: '#fb7185' },
  { id: 'devtools',   label: 'Developer Tools',  tagline: 'Editors, terminals, CLIs, testing',     hue: '#f59e0b' },
  { id: 'devops',     label: 'DevOps & Cloud',   tagline: 'Containers, IaC, observability',        hue: '#38bdf8' },
  { id: 'databases',  label: 'Databases',        tagline: 'Storage engines & ORMs',                hue: '#a3e635' },
  { id: 'datasci',    label: 'Data Science',     tagline: 'Analysis, notebooks, visualization',    hue: '#f97316' },
  { id: 'security',   label: 'Security',         tagline: 'Crypto, identity, defense',             hue: '#ef4444' },
  { id: 'automation', label: 'Automation',       tagline: 'Workflows, smart homes, self-hosting',  hue: '#2dd4bf' },
  { id: 'gamedev',    label: 'Game Development', tagline: 'Engines & game frameworks',             hue: '#eab308' },
  { id: 'creative',   label: 'Creative Coding',  tagline: 'Graphics, motion, visualization',       hue: '#f0abfc' },
  { id: 'oss',        label: 'OSS Core',         tagline: 'Languages & foundational infrastructure', hue: '#94a3b8' },
  { id: 'learning',   label: 'Learning',         tagline: 'Curricula, roadmaps, algorithms',       hue: '#86efac' },
  { id: 'blockchain', label: 'Crypto & Web3',    tagline: 'Chains, coins and contracts',           hue: '#f7931a' },
  { id: 'systems',    label: 'OS & Systems',     tagline: 'Kernels, drivers, low level',           hue: '#6366f1' },
  { id: 'media',      label: 'Media',            tagline: 'Video, music, photos, reading',         hue: '#d946ef' },
  { id: 'privacy',    label: 'Network & Privacy',tagline: 'Proxies, tunnels, censorship resistance', hue: '#0ea5e9' },
  { id: 'knowledge',  label: 'Notes & Knowledge',tagline: 'Wikis, journals, second brains',        hue: '#00c9a7' },
  { id: 'hardware',   label: 'IoT & Hardware',   tagline: 'Boards, robots, connected things',      hue: '#ff8c69' },
  { id: 'science',    label: 'Science',          tagline: 'Research tools, simulation, physics',   hue: '#7fdbca' },
  { id: 'curated',    label: 'Awesome Lists',    tagline: 'The definitive lists of everything',    hue: '#ffd166' },
]

export const CATEGORY_IDS = CATEGORIES.map((c) => c.id)

const BY_ID = new Map<string, Category>(CATEGORIES.map((c) => [c.id, c]))

export function getCategory(id: CategoryId): Category {
  return BY_ID.get(id) ?? CATEGORIES[0]
}

/** Neon palette per programming language (GitHub Linguist inspired). */
const LANG_HUES: Record<string, string> = {
  JavaScript: '#f1e05a',
  TypeScript: '#3178c6',
  Python: '#3572A5',
  'Jupyter Notebook': '#DA5B0B',
  Go: '#00ADD8',
  Rust: '#dea584',
  'C++': '#f34b7d',
  C: '#8a93a3',
  'C#': '#178600',
  Java: '#b07219',
  Kotlin: '#A97BFF',
  Ruby: '#701516',
  PHP: '#4F5D95',
  Shell: '#89e051',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Dart: '#00B4AB',
  Swift: '#F05138',
  Scala: '#c22d40',
  R: '#198CE7',
  Elixir: '#6e4a7e',
  Lua: '#51a0cf',
  'Vim Script': '#199f4b',
  Vue: '#41b883',
  Zig: '#ec915c',
  Haskell: '#5e5086',
  Solidity: '#AA6746',
  Julia: '#a270ba',
  Nix: '#7e7eff',
  Perl: '#0298c3',
  'Objective-C': '#438eff',
  Assembly: '#6E4C13',
  Verilog: '#b2b7f8',
  MDX: '#fcb32c',
  Astro: '#ff5a03',
  PowerShell: '#012456',
  Makefile: '#427819',
  Dockerfile: '#384d54',
  Clojure: '#db5855',
  'Emacs Lisp': '#c065db',
}

export function langHue(lang: string): string {
  return LANG_HUES[lang] ?? '#9aa4b2'
}
