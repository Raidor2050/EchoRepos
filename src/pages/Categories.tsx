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
          sub="Bubble size = curated depth. Pick a sector to explore its best repositories."
        />
      </header>

      <div className="container bubble-field" aria-hidden>
        <svg viewBox="0 0 900 380" width="100%">
          {CATEGORIES.map((c, i) => {
            const n = categoryCount(c.id)
            const r = 26 + (n / max) * 46
            /* deterministic pseudo-layout: golden-angle spiral clusters */
            const a = i * 2.39996
            const rad = 120 + (i % 3) * 62
            const cx = 450 + Math.cos(a) * rad * 1.55
            const cy = 190 + Math.sin(a) * rad * 0.72
            return (
              <motion.g
                key={c.id}
                initial={{ opacity: 0, scale: 0.6 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, type: 'spring', stiffness: 160, damping: 16 }}
                style={{ transformOrigin: `${cx}px ${cy}px`, cursor: 'pointer' }}
                onClick={() => navigate(`/explore?cat=${c.id}`)}
              >
                <circle cx={cx} cy={cy} r={r + 10} fill={`${c.hue}0d`} stroke={c.hue} strokeOpacity="0.25" />
                <circle cx={cx} cy={cy} r={r} fill={`${c.hue}1f`} stroke={c.hue} strokeWidth="1.4" className="bubble" style={{ '--cat-c': c.hue } as React.CSSProperties} />
                <text x={cx} y={cy - 2} textAnchor="middle" fontSize="12.5" fontWeight="700" fill="#e8eef6" fontFamily="var(--font-display)">
                  {n}
                </text>
                <text x={cx} y={cy + 14} textAnchor="middle" fontSize="9.5" fill={c.hue} fontFamily="var(--font-mono)" letterSpacing="1">
                  {c.label.toUpperCase()}
                </text>
              </motion.g>
            )
          })}
        </svg>
      </div>

      <section className="section container">
        <SectionHeading eyebrow="the index" title="Every ecosystem, card by card" align="center" />
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
