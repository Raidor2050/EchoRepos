import type { Repo } from '../../data/types'
import { CATEGORIES } from '../../data/taxonomy'
import { REPOS } from '../../lib/data'

/** Deterministic RNG so the universe looks identical on every load. */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export interface UniNode {
  repo: Repo
  hue: string
  catIdx: number
  cxFrac: number
  cyFrac: number
  orbitFrac: number
  phase: number
  speed: number
  size: number
}

export interface UniParticle {
  xFrac: number
  yFrac: number
  vy: number
  tw: number
  size: number
}

/** Hub position as viewport fractions — right-of-center so hero copy breathes. */
export const HUB = { x: 0.63, y: 0.47 }

export function buildNodes(isMobile: boolean): UniNode[] {
  const rng = mulberry32(777)
  const perCluster = isMobile ? 5 : 9
  const spread = isMobile ? 0.05 : 0.082
  const out: UniNode[] = []
  for (let i = 0; i < CATEGORIES.length; i++) {
    const cat = CATEGORIES[i]
    const pool = REPOS.filter((r) => r.category === cat.id)
    pool.sort((a, b) => b.signals.popularity - a.signals.popularity)
    const take = Math.max(3, Math.min(pool.length, perCluster))
    /* two concentric rings of clusters around the EchoRepos hub */
    const ring = i % 2 === 0 ? 0.175 : 0.305
    const angle = (i / CATEGORIES.length) * Math.PI * 2 + rng() * 0.22
    const hx = HUB.x + Math.cos(angle) * ring * (isMobile ? 0.82 : 1)
    const hy = HUB.y + Math.sin(angle) * ring * 0.8
    for (let k = 0; k < take; k++) {
      const repo = pool[Math.floor(rng() * Math.min(pool.length, k + 6))]
      if (!repo || out.some((n) => n.repo.id === repo.id)) continue
      const idx = out.length
      out.push({
        repo,
        hue: cat.hue,
        catIdx: i,
        cxFrac: hx,
        cyFrac: hy,
        orbitFrac: spread * (0.35 + ((idx * 37) % 10) / 10),
        phase: (((idx * 73) % 100) / 100) * Math.PI * 2,
        speed: 0.00016 + ((((idx * 53) % 40) / 40) * 0.00022),
        size: 1.6 + Math.min(3.6, (repo.stars / 240_000) * 3.4),
      })
    }
  }
  return out
}

export function buildParticles(count: number): UniParticle[] {
  const rng = mulberry32(4242)
  return Array.from({ length: count }, () => ({
    xFrac: rng(),
    yFrac: rng(),
    vy: -(0.00002 + rng() * 0.00006),
    tw: rng() * Math.PI * 2,
    size: 0.6 + rng() * 1.4,
  }))
}

/** Random cross-cluster chords — the "everything is connected" texture. */
export function buildChords(nodes: UniNode[], count = 14): Array<[number, number]> {
  const rng = mulberry32(991)
  const out: Array<[number, number]> = []
  for (let i = 0; i < count; i++) {
    const a = Math.floor(rng() * nodes.length)
    const b = Math.floor(rng() * nodes.length)
    if (a !== b && nodes[a].catIdx !== nodes[b].catIdx) out.push([a, b])
  }
  return out
}

/** Pre-rendered radial glow sprite per hue (cheap bloom). */
export function makeSprite(hue: string): HTMLCanvasElement {
  const s = document.createElement('canvas')
  s.width = 48
  s.height = 48
  const g = s.getContext('2d')!
  const grad = g.createRadialGradient(24, 24, 0, 24, 24, 24)
  grad.addColorStop(0, `${hue}bb`)
  grad.addColorStop(0.35, `${hue}44`)
  grad.addColorStop(1, 'transparent')
  g.fillStyle = grad
  g.fillRect(0, 0, 48, 48)
  return s
}
