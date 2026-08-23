import { useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import type { Repo } from '../data/types'
import { getCategory } from '../data/taxonomy'
import { formatCompact } from '../lib/format'

/**
 * Radial constellation of related repositories (SVG, hand-rolled).
 * Center node + spokes to related repos; nodes navigate client-side.
 */
export function RelatedGraph({ center, related }: { center: Repo; related: Array<{ repo: Repo; score: number }> }) {
  const navigate = useNavigate()
  const size = 460
  const cx = size / 2
  const cy = size / 2
  const R = 168
  const centerHue = getCategory(center.category).hue

  function open(id: string) {
    navigate(`/repo/${id}`)
  }

  return (
    <motion.svg
      viewBox={`0 0 ${size} ${size}`}
      width="100%"
      style={{ maxWidth: 560 }}
      role="img"
      aria-label={`Repositories related to ${center.id}`}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <defs>
        <radialGradient id="rel-glow">
          <stop offset="0%" stopColor={`${centerHue}55`} />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>

      <circle cx={cx} cy={cy} r={R + 26} fill="none" stroke="rgba(255,255,255,0.06)" strokeDasharray="2 7" />
      <circle cx={cx} cy={cy} r={90} fill="url(#rel-glow)" />

      {/* spokes */}
      {related.map((r, i) => {
        const a = (i / related.length) * Math.PI * 2 - Math.PI / 2
        const x = cx + Math.cos(a) * R
        const y = cy + Math.sin(a) * R
        return (
          <line
            key={r.repo.id}
            x1={cx}
            y1={cy}
            x2={x}
            y2={y}
            stroke={getCategory(r.repo.category).hue}
            strokeOpacity={0.25 + r.score}
            strokeWidth={1.1}
            strokeDasharray="3 5"
            style={{ animation: `dashflow ${6 + i}s linear infinite` }}
          />
        )
      })}

      {/* center node */}
      <circle cx={cx} cy={cy} r={13} fill="#000" stroke={centerHue} strokeWidth="2.4" />
      <circle cx={cx} cy={cy} r={4.5} fill={centerHue} />
      <text x={cx} y={cy - 24} textAnchor="middle" fontSize="12.5" fontWeight="600" fill="#e8eef6" fontFamily="'Space Grotesk', sans-serif">
        {center.name}
      </text>

      {/* satellites */}
      {related.map((r, i) => {
        const a = (i / related.length) * Math.PI * 2 - Math.PI / 2
        const x = cx + Math.cos(a) * R
        const y = cy + Math.sin(a) * R
        const hue = getCategory(r.repo.category).hue
        const label = r.repo.name
        const flip = Math.cos(a) < 0
        return (
          <g key={r.repo.id} onClick={() => open(r.repo.id)} style={{ cursor: 'pointer' }}>
            <title>{`${r.repo.id} · ★ ${formatCompact(r.repo.stars)}`}</title>
            <circle cx={x} cy={y} r={20} fill="transparent" />
            <motion.circle
              cx={x}
              cy={y}
              r={8}
              fill="#05080d"
              stroke={hue}
              strokeWidth="2"
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 + i * 0.07, type: 'spring', stiffness: 220, damping: 14 }}
              style={{ transformOrigin: `${x}px ${y}px`, cursor: 'pointer' }}
            />
            <text
              x={x + (flip ? -14 : 14)}
              y={y + 4}
              textAnchor={flip ? 'end' : 'start'}
              fontSize="11"
              fill="#aeb9c8"
              fontFamily="ui-monospace, monospace"
            >
              {label.length > 16 ? `${label.slice(0, 15)}…` : label}
            </text>
          </g>
        )
      })}
    </motion.svg>
  )
}
