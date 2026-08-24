import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import { CategoryGlyph } from '../components/CategoryGlyph'
import { GridBackdrop } from '../components/decor'
import { SectionHeading } from '../components/atoms'
import { CATEGORIES } from '../data/taxonomy'
import { categoryCount, featuredPerCategory, REPO_COUNT } from '../lib/data'
import { formatCompact } from '../lib/format'
import { usePageMeta } from '../lib/hooks'

export default function Categories() {
  usePageMeta('Ecosystems: EchoRepos')
  const navigate = useNavigate()
  const max = Math.max(...CATEGORIES.map((c) => categoryCount(c.id)))

  return (
    <div className="page page-cats">
      <GridBackdrop />
      <header className="page-head container">
        <SectionHeading
          eyebrow={`${REPO_COUNT} repos · ${CATEGORIES.length} ecosystems`}
          title="The map of ecosystems"
          sub="Bubble size = curated depth."
        />
      </header>

      <div className="bubble-field" aria-hidden>
        <svg viewBox="0 0 1500 660" width="100%">
          <defs>
            {CATEGORIES.map((c) => (
              <radialGradient key={c.id} id={`bg-${c.id}`} cx="34%" cy="28%" r="78%">
                <stop offset="0%" stopColor={c.hue} stopOpacity="0.42" />
                <stop offset="55%" stopColor={c.hue} stopOpacity="0.17" />
                <stop offset="100%" stopColor={c.hue} stopOpacity="0.05" />
              </radialGradient>
            ))}
          </defs>
          {(() => {
            /* golden-angle sunflower layout, then shrink-to-fit so every node stays inside */
            const W = 1500
            const H = 660
            const CX = W / 2
            const CY = H / 2
            const N = CATEGORIES.length
            const rs = CATEGORIES.map((c) => 34 + (categoryCount(c.id) / max) * 66)
            const rmax = Math.max(...rs)
            const raw = CATEGORIES.map((_, i) => {
              const a = i * 2.39996 + 0.9
              const t = Math.sqrt((i + 0.6) / N)
              return { ux: Math.cos(a) * t, uy: Math.sin(a) * t }
            })
            const fits = (ax: number, ay: number) =>
              raw.every((p, i) => {
                const x = CX + p.ux * ax
                const y = CY + p.uy * ay
                return x - rs[i] >= 10 && x + rs[i] <= W - 10 && y - rs[i] >= 10 && y + rs[i] <= H - 10
              })
            let ax = CX - rmax - 10
            let ay = CY - rmax - 10
            while (!fits(ax, ay) && ax > 40 && ay > 40) {
              ax *= 0.96
              ay *= 0.96
            }
            return raw.map((p, i) => {
              const c = CATEGORIES[i]
              const n = categoryCount(c.id)
              const r = rs[i]
              const cx = CX + p.ux * ax
              const cy = CY + p.uy * ay
              return (
                <motion.g
                  key={c.id}
                  initial={{ opacity: 0, scale: 0.6 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.04, type: 'spring', stiffness: 160, damping: 16 }}
                  style={{ transformOrigin: `${cx}px ${cy}px`, cursor: 'pointer' }}
                  onClick={() => navigate(`/explore?cat=${c.id}`)}
                >
                  <circle cx={cx} cy={cy} r={r + 18} fill={c.hue} opacity="0.06" />
                  <circle
                    className="bubble-ring"
                    cx={cx}
                    cy={cy}
                    r={r + 8}
                    fill="none"
                    stroke={c.hue}
                    strokeOpacity="0.4"
                    strokeWidth="1"
                    strokeDasharray="2 7"
                    strokeLinecap="round"
                  />
                  <circle
                    cx={cx}
                    cy={cy}
                    r={r}
                    fill={`url(#bg-${c.id})`}
                    stroke={c.hue}
                    strokeOpacity="0.6"
                    strokeWidth="1.5"
                    className="bubble"
                    style={{ '--cat-c': c.hue } as React.CSSProperties}
                  />
                  <ellipse cx={cx - r * 0.26} cy={cy - r * 0.36} rx={r * 0.42} ry={r * 0.26} fill="#ffffff" opacity="0.08" />
                  <text x={cx} y={cy - 1} textAnchor="middle" fontSize="15" fontWeight="800" fill="#eef3fa" fontFamily="var(--font-display)">
                    {n}
                  </text>
                  <text x={cx} y={cy + 19} textAnchor="middle" fontSize="11" fill={c.hue} fontFamily="var(--font-mono)" letterSpacing="1.4">
                    {c.label.toUpperCase()}
                  </text>
                </motion.g>
              )
            })
          })()}
        </svg>
      </div>

      <section className="section container">
        <SectionHeading eyebrow="the index" title="Browse every ecosystem" align="center" />
        <div className="cats-grid">
          {CATEGORIES.map((cat) => {
            const n = categoryCount(cat.id)
            const top = featuredPerCategory(24).find((r) => r.category === cat.id)
            return (
              <Link key={cat.id} to={`/explore?cat=${cat.id}`} className="cat-card cat-card--row" style={{ '--cat-c': cat.hue } as React.CSSProperties}>
                <span className="cat-card__glyph"><CategoryGlyph id={cat.id} size={26} /></span>
                <span className="cat-card__body">
                  <h3>{cat.label}</h3>
                  <p>{top ? `${top.owner}/${top.name} · ★ ${formatCompact(top.stars)} leads` : cat.tagline}</p>
                </span>
                <span className="cat-card__count">{n}</span>
              </Link>
            )
          })}
        </div>
      </section>
    </div>
  )
}
