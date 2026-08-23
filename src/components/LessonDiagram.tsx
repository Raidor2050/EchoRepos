import type { ReactNode } from 'react'

/** Hand-drawn SVG concept scenes, one per lesson slug. */
export function LessonDiagram({ slug }: { slug: string }): ReactNode {
  switch (slug) {
    case 'open-source':
      return <OssScene />
    case 'git':
    case 'commit':
      return <CommitScene />
    case 'branch':
      return <BranchScene />
    case 'fork':
      return <ForkScene />
    case 'star':
      return <StarScene />
    case 'issue':
      return <IssueScene />
    case 'pull-request':
      return <PrScene />
    default:
      return <RepoScene />
  }
}

function Frame({ children, vb = '0 0 340 150' }: { children: ReactNode; vb?: string }) {
  return (
    <svg viewBox={vb} width="100%" className="lesson-diagram" role="img" aria-hidden>
      {children}
    </svg>
  )
}

function OssScene() {
  const nodes = [
    [170, 75, 26],
    [60, 40, 14],
    [70, 110, 12],
    [280, 45, 15],
    [272, 112, 13],
  ] as const
  return (
    <Frame>
      {nodes.slice(1).map(([x, y], i) => (
        <line key={i} x1="170" y1="75" x2={x} y2={y} stroke="#7df9ff" strokeOpacity="0.3" strokeWidth="1" strokeDasharray="4 4" style={{ animation: `dashflow ${5 + i}s linear infinite` }} />
      ))}
      {nodes.map(([x, y, r], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r={r} fill="#05080d" stroke={i === 0 ? '#7df9ff' : '#a78bfa'} strokeWidth="2" />
          <circle cx={x} cy={y} r={r * 0.35} fill={i === 0 ? '#7df9ff' : '#ff6ad5'} />
          {i > 0 && <text x={x} y={y - r - 7} textAnchor="middle" fontSize="9.5" fill="#8b96a6" fontFamily="var(--font-mono)">{['MIT', 'Apache-2', 'GPL'][i % 3]}</text>}
        </g>
      ))}
      <text x="170" y="132" textAnchor="middle" fontSize="10" fill="#626d7d" fontFamily="var(--font-mono)">one project · many licenses · everyone welcome</text>
    </Frame>
  )
}

function CommitScene() {
  const xs = [30, 100, 170, 240, 305]
  return (
    <Frame>
      <path d="M20 80 H320" stroke="url(#cc-line)" strokeWidth="2" fill="none" />
      {xs.map((x, i) => (
        <g key={x} style={{ animation: `kf-pulse 2.4s ease-in-out ${i * 0.4}s infinite` }}>
          <circle cx={x} cy="80" r="10" fill="#05080d" stroke="#7df9ff" strokeWidth="2" className="cc-node" style={{ animationDelay: `${i * 0.45}s` }} />
          <rect x={x - 22} y="98" width="44" height="10" rx="3" fill="rgba(125,249,255,0.09)" />
          <text x={x} y="106" textAnchor="middle" fontSize="8" fill="#8b96a6" fontFamily="var(--font-mono)">{['init', 'fix a11y', 'add tests', 'docs!', 'v1.0'][i]}</text>
        </g>
      ))}
      <defs>
        <linearGradient id="cc-line" x1="0" x2="1">
          <stop offset="0%" stopColor="#7df9ff" />
          <stop offset="100%" stopColor="#ff6ad5" />
        </linearGradient>
      </defs>
    </Frame>
  )
}

function BranchScene() {
  return (
    <Frame>
      <path d="M20 120 H320" stroke="#4f7cff" strokeWidth="2" opacity="0.65" fill="none" />
      <path d="M90 120 C130 120 130 55 175 55 H310" stroke="#6cf5b8" strokeWidth="2" fill="none" />
      <path d="M180 55 C220 55 225 88 260 88 H315" stroke="#ffc46b" strokeWidth="2" fill="none" />
      {[[40, 120], [90, 120], [140, 120]].map(([x, y]) => (
        <circle key={x} cx={x} cy={y} r="7" fill="#05080d" stroke="#4f7cff" strokeWidth="2" />
      ))}
      {[200, 255].map((x) => (
        <circle key={x} cx={x} cy="55" r="7" fill="#05080d" stroke="#6cf5b8" strokeWidth="2" />
      ))}
      <circle cx="285" cy="88" r="7" fill="#05080d" stroke="#ffc46b" strokeWidth="2" />
      <text x="20" y="140" fontSize="10" fill="#4f7cff" fontFamily="var(--font-mono)">main</text>
      <text x="196" y="42" fontSize="10" fill="#6cf5b8" fontFamily="var(--font-mono)">feature/dark-mode</text>
      <text x="252" y="78" fontSize="10" fill="#ffc46b" fontFamily="var(--font-mono)">fix/typo</text>
    </Frame>
  )
}

function ForkScene() {
  return (
    <Frame>
      <rect x="18" y="30" width="128" height="86" rx="10" fill="rgba(79,124,255,0.07)" stroke="#4f7cff" strokeWidth="1.4" />
      <rect x="194" y="30" width="128" height="86" rx="10" fill="rgba(255,106,213,0.06)" stroke="#ff6ad5" strokeWidth="1.4" />
      <text x="82" y="52" textAnchor="middle" fontSize="11" fill="#4f7cff" fontFamily="var(--font-mono)" fontWeight="700">upstream/app</text>
      <text x="258" y="52" textAnchor="middle" fontSize="11" fill="#ff6ad5" fontFamily="var(--font-mono)" fontWeight="700">you/app</text>
      {[68, 84, 100].map((y) => (
        <g key={y}>
          <line x1="34" y1={y} x2="130" y2={y} stroke="rgba(255,255,255,0.16)" strokeWidth="4" strokeLinecap="round" />
          <line x1="210" y1={y} x2="306" y2={y} stroke="rgba(255,255,255,0.16)" strokeWidth="4" strokeLinecap="round" />
        </g>
      ))}
      <line x1="210" y1="84" x2="306" y2="84" stroke="#6cf5b8" strokeWidth="4" strokeLinecap="round" />
      <path d="M146 73 C170 73 172 84 194 84" stroke="#ff6ad5" strokeWidth="1.6" strokeDasharray="4 3" fill="none" markerEnd="url(#arrow-p)" />
      <path d="M194 97 C172 97 170 86 148 86" stroke="#7df9ff" strokeWidth="1.6" strokeDasharray="4 3" fill="none" markerEnd="url(#arrow-c)" />
      <defs>
        <marker id="arrow-p" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto"><path d="M0 0 L6 3.5 L0 7" fill="none" stroke="#ff6ad5" /></marker>
        <marker id="arrow-c" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto"><path d="M0 0 L6 3.5 L0 7" fill="none" stroke="#7df9ff" /></marker>
      </defs>
      <text x="170" y="66" textAnchor="middle" fontSize="9" fill="#8b96a6" fontFamily="var(--font-mono)">fork ↓</text>
      <text x="170" y="112" textAnchor="middle" fontSize="9" fill="#8b96a6" fontFamily="var(--font-mono)">PR ↑</text>
    </Frame>
  )
}

function StarScene() {
  const stars = [
    [50, 40, 9], [95, 62, 6], [140, 34, 12], [190, 58, 7], [235, 38, 10], [285, 60, 13], [70, 100, 7], [160, 105, 10], [250, 102, 8],
  ] as const
  return (
    <Frame>
      {stars.map(([x, y, r], i) => (
        <g key={i} style={{ animation: `twinkle 2.2s ease-in-out ${(i * 0.37) % 2}s infinite`, transformOrigin: `${x}px ${y}px` }}>
          <path
            d={`M${x} ${y - r} L${x + r * 0.32} ${y - r * 0.32} L${x + r} ${y} L${x + r * 0.32} ${y + r * 0.32} L${x} ${y + r} L${x - r * 0.32} ${y + r * 0.32} L${x - r} ${y} L${x - r * 0.32} ${y - r * 0.32} Z`}
            fill={i % 3 === 0 ? '#ffc46b' : 'rgba(255,196,107,0.35)'}
            stroke="#ffc46b"
            strokeWidth="0.8"
          />
        </g>
      ))}
      <text x="170" y="140" textAnchor="middle" fontSize="10" fill="#626d7d" fontFamily="var(--font-mono)">stars = popularity signal + your bookmark list</text>
    </Frame>
  )
}

function IssueScene() {
  const rows = [
    ['Bug', 'Login fails on Safari 17', '#ff5470'],
    ['Feature', 'Add dark mode toggle', '#7df9ff'],
    ['Docs', 'README missing install steps', '#ffc46b'],
    ['Help wanted', 'Good first issue: fix typo', '#6cf5b8'],
  ] as const
  return (
    <Frame vb="0 0 360 160">
      {rows.map(([tag, title, hue], i) => (
        <g key={title} transform={`translate(24 ${16 + i * 33})`}>
          <rect width="312" height="26" rx="7" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.08)" />
          <rect x="10" y="6" width={tag.length * 6.6 + 14} height="14" rx="7" fill={`${hue}22`} stroke={hue} strokeWidth="0.8" />
          <text x={17 + (tag.length * 6.6 + 14) / 2} y="16.5" textAnchor="middle" fontSize="8.5" fill={hue} fontFamily="var(--font-mono)" fontWeight="700">{tag}</text>
          <text x={tag.length * 6.6 + 34} y="16.5" fontSize="10" fill="#c6cfdb" fontFamily="var(--font-body)">{title}</text>
          <text x="296" y="16.5" textAnchor="end" fontSize="9" fill="#626d7d" fontFamily="var(--font-mono)">#{101 + i}</text>
        </g>
      ))}
    </Frame>
  )
}

function PrScene() {
  return (
    <Frame>
      <text x="30" y="36" fontSize="11" fill="#c6cfdb" fontFamily="var(--font-body)">your branch</text>
      <path d="M28 48 H120" stroke="#6cf5b8" strokeWidth="3" strokeLinecap="round" />
      <text x="230" y="36" fontSize="11" fill="#c6cfdb" fontFamily="var(--font-body)">main</text>
      <path d="M218 48 H312" stroke="#4f7cff" strokeWidth="3" strokeLinecap="round" />
      <path d="M120 48 C168 48 172 92 218 92" stroke="#ff6ad5" strokeWidth="1.8" strokeDasharray="5 4" fill="none" />
      <rect x="136" y="64" width="76" height="22" rx="11" fill="rgba(255,106,213,0.12)" stroke="#ff6ad5" strokeWidth="1.2" />
      <text x="174" y="78" textAnchor="middle" fontSize="10" fill="#ff6ad5" fontFamily="var(--font-mono)" fontWeight="700">pull request</text>
      {[
        ['✓ tests passed', '#6cf5b8'],
        ['✓ reviewed by maintainer', '#6cf5b8'],
        ['→ merge', '#7df9ff'],
      ].map(([t, c], i) => (
        <text key={t} x="170" y={116 + i * 13} textAnchor="middle" fontSize="9.5" fill={String(c)} fontFamily="var(--font-mono)">{t}</text>
      ))}
    </Frame>
  )
}

function RepoScene() {
  return (
    <Frame>
      <rect x="70" y="22" width="200" height="108" rx="10" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.14)" />
      <circle cx="88" cy="38" r="4" fill="#ff5470" /><circle cx="102" cy="38" r="4" fill="#ffc46b" /><circle cx="116" cy="38" r="4" fill="#6cf5b8" />
      <rect x="86" y="54" width="90" height="7" rx="3.5" fill="rgba(125,249,255,0.5)" />
      <rect x="86" y="70" width="168" height="5" rx="2.5" fill="rgba(255,255,255,0.12)" />
      <rect x="86" y="82" width="150" height="5" rx="2.5" fill="rgba(255,255,255,0.12)" />
      <rect x="86" y="94" width="160" height="5" rx="2.5" fill="rgba(255,255,255,0.12)" />
      <rect x="86" y="112" width="56" height="10" rx="5" fill="rgba(167,139,250,0.25)" stroke="#a78bfa" strokeWidth="0.7" />
      <text x="114" y="119.5" textAnchor="middle" fontSize="7.5" fill="#a78bfa" fontFamily="var(--font-mono)">issues</text>
      <rect x="150" y="112" width="72" height="10" rx="5" fill="rgba(108,245,184,0.2)" stroke="#6cf5b8" strokeWidth="0.7" />
      <text x="186" y="119.5" textAnchor="middle" fontSize="7.5" fill="#6cf5b8" fontFamily="var(--font-mono)">releases</text>
    </Frame>
  )
}
