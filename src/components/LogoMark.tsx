/** EchoRepos logomark — a signal radiating outward like an echo. */
export function LogoMark({ size = 26 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden>
      <defs>
        <radialGradient id="er-g" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#7df9ff" />
          <stop offset="60%" stopColor="#4f7cff" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="32" cy="32" r="30" fill="url(#er-g)" opacity="0.32" />
      <circle cx="32" cy="32" r="10" fill="#7df9ff" />
      <circle cx="32" cy="32" r="17" fill="none" stroke="#4f7cff" strokeWidth="2.5" opacity="0.85" />
      <circle cx="32" cy="32" r="24" fill="none" stroke="#4f7cff" strokeWidth="1.6" opacity="0.45" />
      <circle cx="50" cy="14" r="3.5" fill="#ff6ad5" />
    </svg>
  )
}
