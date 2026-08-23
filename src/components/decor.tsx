/**
 * Animated SVG environment systems - reusable decorative backdrops.
 * All motion is CSS-driven and disabled under prefers-reduced-motion.
 */

/** Perspective grid + drifting aurora blobs. */
export function GridBackdrop({ hue = '#4f7cff' }: { hue?: string }) {
  return (
    <div className="grid-backdrop" aria-hidden>
      <svg className="grid-backdrop__grid" width="100%" height="100%" preserveAspectRatio="none">
        <defs>
          <pattern id="er-grid" width="56" height="56" patternUnits="userSpaceOnUse">
            <path d="M 56 0 L 0 0 0 56" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
          </pattern>
          <radialGradient id="er-grid-fade" cx="50%" cy="30%" r="75%">
            <stop offset="0%" stopColor="#fff" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#000" stopOpacity="0.25" />
          </radialGradient>
          <mask id="er-grid-mask">
            <rect width="100%" height="100%" fill="url(#er-grid-fade)" />
          </mask>
        </defs>
        <rect width="100%" height="100%" fill="url(#er-grid)" mask="url(#er-grid-mask)" />
      </svg>
      <div className="blob blob--a" style={{ background: `radial-gradient(circle, ${hue}26, transparent 70%)` }} />
      <div className="blob blob--b" style={{ background: 'radial-gradient(circle, #ff6ad51a, transparent 70%)' }} />
    </div>
  )
}

/** Horizontal data-stream lines with traveling pulses. */
export function DataStream({ y, hue = '#7df9ff', delay = 0, duration = 7 }: { y: string; hue?: string; delay?: number; duration?: number }) {
  return (
    <svg
      className="data-stream"
      style={{ top: y }}
      width="100%"
      height="2"
      aria-hidden
    >
      <line x1="0" y1="1" x2="100%" y2="1" stroke={hue} strokeOpacity="0.12" strokeWidth="1" strokeDasharray="3 9" />
      <circle r="2.5" fill={hue} opacity="0.9">
        <animate attributeName="cx" from="0%" to="100%" dur={`${duration}s`} begin={`${delay}s`} repeatCount="indefinite" />
        <animate attributeName="opacity" values="0;.95;0" keyTimes="0;0.08;1" dur={`${duration}s`} begin={`${delay}s`} repeatCount="indefinite" />
      </circle>
    </svg>
  )
}

/** Concentric orbit rings used behind section headings / CTAs. */
export function OrbitDecor({ size = 420, hue = '#7df9ff' }: { size?: number; hue?: string }) {
  return (
    <svg
      className="orbit-decor"
      width={size}
      height={size}
      viewBox="0 0 200 200"
      aria-hidden
    >
      <g fill="none" stroke={hue}>
        <circle cx="100" cy="100" r="96" strokeOpacity="0.07" strokeDasharray="2 6" />
        <circle cx="100" cy="100" r="72" strokeOpacity="0.09" />
        <circle cx="100" cy="100" r="48" strokeOpacity="0.06" strokeDasharray="4 8" />
        <circle cx="100" cy="28" r="2.4" fill={hue} stroke="none">
          <animateTransform attributeName="transform" type="rotate" from="0 100 100" to="360 100 100" dur="26s" repeatCount="indefinite" />
        </circle>
        <circle cx="172" cy="100" r="1.8" fill="#ff6ad5" stroke="none">
          <animateTransform attributeName="transform" type="rotate" from="180 100 100" to="540 100 100" dur="34s" repeatCount="indefinite" />
        </circle>
      </g>
    </svg>
  )
}

/** Animated commit-chain diagram (used on Home + Learn). */
export function CommitChainDiagram() {
  return (
    <svg viewBox="0 0 320 120" width="100%" aria-label="A chain of commits on a branch line">
      <defs>
        <linearGradient id="cc-line" x1="0" x2="1">
          <stop offset="0%" stopColor="#7df9ff" />
          <stop offset="100%" stopColor="#ff6ad5" />
        </linearGradient>
      </defs>
      <path id="cc-path" d="M16 60 H304" stroke="url(#cc-line)" strokeWidth="2" strokeOpacity="0.55" fill="none" />
      {[40, 110, 180, 250].map((x, i) => (
        <g key={x}>
          <circle cx={x} cy="60" r="11" fill="#05080d" stroke="#7df9ff" strokeWidth="2" className="cc-node" style={{ animationDelay: `${i * 0.45}s` }} />
          <circle cx={x} cy="60" r="4" fill="#7df9ff" />
          <text x={x} y="92" textAnchor="middle" fontSize="10" fill="#626d7d" fontFamily="var(--font-mono)">
            {['a1f0c3', 'b82de9', 'c44a01', 'd97f2b'][i]}
          </text>
        </g>
      ))}
      <circle r="3.5" fill="#ff6ad5">
        <animateMotion dur="5s" repeatCount="indefinite" path="M16 60 H304" />
      </circle>
    </svg>
  )
}
