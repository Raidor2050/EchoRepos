import { motion } from 'motion/react'
import type { Difficulty } from '../data/types'
import { langHue } from '../data/taxonomy'
import { formatCompact } from '../lib/format'
import { IconStar, IconArrowRight } from './Icons'

/* ── Tag chip ── */
export function TagChip({ label, hue }: { label: string; hue?: string }) {
  return (
    <span className="tag" style={hue ? ({ '--tag-c': hue } as React.CSSProperties) : undefined}>
      {label}
    </span>
  )
}

/* ── Language dot ── */
export function LanguageDot({ lang }: { lang: string }) {
  const c = langHue(lang)
  return (
    <span className="lang-dot" style={{ '--dot-c': c } as React.CSSProperties}>
      <i />
      {lang}
    </span>
  )
}

/* ── Difficulty meter ── */
const DIFF_LABEL: Record<Difficulty, string> = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
}
export function DifficultyMeter({ level, withLabel = true }: { level: Difficulty; withLabel?: boolean }) {
  return (
    <span
      className="meter"
      data-level={level}
      role="img"
      aria-label={`Difficulty: ${DIFF_LABEL[level]}`}
      title={`Difficulty: ${DIFF_LABEL[level]}`}
    >
      <i />
      <i />
      <i />
      {withLabel && <em style={{ fontStyle: 'normal', fontSize: 12, marginLeft: 6, color: 'var(--text-3)' }}>{DIFF_LABEL[level]}</em>}
    </span>
  )
}

/* ── Stat pill ── */
export function StarPill({ stars }: { stars: number }) {
  return (
    <span className="pill pill--amber" title={`${stars.toLocaleString()} stars`}>
      <IconStar size={12} />
      {formatCompact(stars)}
    </span>
  )
}

/* ── Match ring (quiz results) ── */
export function MatchRing({ value, size = 54 }: { value: number; size?: number }) {
  const stroke = 4.5
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }} role="img" aria-label={`Match ${value}%`}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={stroke} />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="url(#match-grad)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          whileInView={{ strokeDashoffset: c * (1 - value / 100) }}
          viewport={{ once: true }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
        <defs>
          <linearGradient id="match-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#7df9ff" />
            <stop offset="100%" stopColor="#ff6ad5" />
          </linearGradient>
        </defs>
      </svg>
      <span
        style={{
          position: 'absolute',
          inset: 0,
          display: 'grid',
          placeItems: 'center',
          fontFamily: 'var(--font-mono)',
          fontSize: size > 46 ? 13 : 11,
          fontWeight: 600,
          color: 'var(--text-1)',
        }}
      >
        {value}%
      </span>
    </div>
  )
}

/* ── Activity sparkline ── */
export function Sparkline({ seedValue, width = 120, height = 34 }: { seedValue: number; width?: number; height?: number }) {
  /* deterministic pseudo-wave from the repo's activity signal */
  const pts: string[] = []
  const n = 14
  for (let i = 0; i <= n; i++) {
    const t = i / n
    const wave =
      Math.sin(t * Math.PI * (1.5 + (seedValue % 7) * 0.22) + seedValue) * 0.5 +
      Math.sin(t * Math.PI * 3.3 + seedValue * 1.7) * 0.28 +
      t * 0.9
    const y = height - 4 - ((wave + 1.4) / 2.6) * (height - 8)
    pts.push(`${(t * width).toFixed(1)},${y.toFixed(1)}`)
  }
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} aria-hidden>
      <polyline
        points={pts.join(' ')}
        fill="none"
        stroke="#7df9ff"
        strokeWidth="1.6"
        strokeLinecap="round"
        opacity="0.9"
        style={{ filter: 'drop-shadow(0 0 4px rgba(125,249,255,.6))' }}
      />
      <circle cx={width} cy={pts[pts.length - 1].split(',')[1]} r="2.6" fill="#7df9ff" />
    </svg>
  )
}

/* ── Section heading ── */
export function SectionHeading({
  eyebrow,
  title,
  sub,
  align,
}: {
  eyebrow: string
  title: string
  sub?: string
  align?: 'center' | 'start'
}) {
  return (
    <motion.div
      className="section-heading"
      style={align === 'center' ? { textAlign: 'center', width: '100%' } : undefined}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      <span className="eyebrow">{align === 'center' ? <><span className="eyebrow__dot" /> {eyebrow}</> : eyebrow}</span>
      <h2>{title}</h2>
      {sub && <p>{sub}</p>}
    </motion.div>
  )
}

/* ── Empty state ── */
export function EmptyState({
  icon = '📡',
  title,
  text,
  action,
}: {
  icon?: string
  title: string
  text?: string
  action?: { label: string; onClick: () => void }
}) {
  return (
    <div className="empty">
      <span style={{ fontSize: 40 }}>{icon}</span>
      <h3>{title}</h3>
      {text && <p>{text}</p>}
      {action ? (
        <button className="btn btn--ghost btn--sm" onClick={action.onClick}>
          {action.label} <IconArrowRight size={14} />
        </button>
      ) : (
        <a className="btn btn--ghost btn--sm" href="#/explore">
          Reset trajectory <IconArrowRight size={14} />
        </a>
      )}
    </div>
  )
}
