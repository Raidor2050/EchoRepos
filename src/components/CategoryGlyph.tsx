import type { CategoryId } from '../data/types'

/**
 * Abstract line-glyph per category — one visual identity per ecosystem.
 * Deliberately geometric/constellation-flavored rather than literal icons.
 */
export function CategoryGlyph({ id, size = 22 }: { id: CategoryId; size?: number }) {
  const common = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.7,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true as const,
  }
  switch (id) {
    case 'ai':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="3.2" />
          <path d="M12 2v4M12 18v4M2 12h4M18 12h4M4.9 4.9l2.8 2.8M16.3 16.3l2.8 2.8M19.1 4.9l-2.8 2.8M7.7 16.3l-2.8 2.8" />
        </svg>
      )
    case 'agents':
      return (
        <svg {...common}>
          <rect x="5" y="8" width="14" height="11" rx="3" />
          <circle cx="9.5" cy="13" r="1.1" fill="currentColor" stroke="none" />
          <circle cx="14.5" cy="13" r="1.1" fill="currentColor" stroke="none" />
          <path d="M12 8V4m0 0h3" />
        </svg>
      )
    case 'webdev':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18M12 3c3 3.5 3 14 0 18-3-4-3-14.5 0-18zM6 5.8c4 2.5 8 2.5 12 0M6 18.2c4-2.5 8-2.5 12 0" />
        </svg>
      )
    case 'frontend':
      return (
        <svg {...common}>
          <rect x="3" y="4" width="18" height="14" rx="2.5" />
          <path d="M3 9h18M8 21h8" />
        </svg>
      )
    case 'backend':
      return (
        <svg {...common}>
          <ellipse cx="12" cy="5.5" rx="7.5" ry="2.8" />
          <path d="M4.5 5.5v6c0 1.6 3.4 2.9 7.5 2.9s7.5-1.3 7.5-2.9v-6M4.5 11.5v6c0 1.6 3.4 2.9 7.5 2.9s7.5-1.3 7.5-2.9v-6" />
        </svg>
      )
    case 'mobile':
      return (
        <svg {...common}>
          <rect x="7" y="2.5" width="10" height="19" rx="2.6" />
          <path d="M11 18.5h2" />
        </svg>
      )
    case 'devtools':
      return (
        <svg {...common}>
          <path d="M5 7l5 5-5 5M12 17h7" />
        </svg>
      )
    case 'devops':
      return (
        <svg {...common}>
          <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z" />
          <path d="M12 12l8-4.5M12 12v9M12 12L4 7.5" />
        </svg>
      )
    case 'databases':
      return (
        <svg {...common}>
          <ellipse cx="12" cy="6" rx="8" ry="3" />
          <path d="M4 6v12c0 1.66 3.58 3 8 3s8-1.34 8-3V6M4 12c0 1.66 3.58 3 8 3s8-1.34 8-3" />
        </svg>
      )
    case 'datasci':
      return (
        <svg {...common}>
          <path d="M4 20V4M4 20h16" />
          <path d="M8 16v-5M12 16V8M16 16v-3M20 16V6" />
        </svg>
      )
    case 'security':
      return (
        <svg {...common}>
          <path d="M12 3l7 3v5c0 4.5-3 8.5-7 10-4-1.5-7-5.5-7-10V6l7-3z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      )
    case 'automation':
      return (
        <svg {...common}>
          <circle cx="6" cy="12" r="2.4" />
          <circle cx="18" cy="6" r="2.4" />
          <circle cx="18" cy="18" r="2.4" />
          <path d="M8.2 11 15.8 6.8M8.2 13l7.6 4.2" />
        </svg>
      )
    case 'gamedev':
      return (
        <svg {...common}>
          <rect x="2.5" y="8" width="19" height="9" rx="4.5" />
          <path d="M7 11v3M5.5 12.5h3M15.5 11.5h.01M18 13.5h.01" />
        </svg>
      )
    case 'creative':
      return (
        <svg {...common}>
          <path d="M12 3a9 9 0 1 0 9 9 4 4 0 0 1-5-5 4 4 0 0 1-4-4z" />
        </svg>
      )
    case 'oss':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="3.2" />
          <path d="M8.9 14.6 6 21M15.1 14.6 18 21M12 15.2v6" />
          <circle cx="6" cy="21" r="1.4" /><circle cx="18" cy="21" r="1.4" /><circle cx="12" cy="21" r="1.4" />
        </svg>
      )
    case 'learning':
      return (
        <svg {...common}>
          <path d="M12 4 2.5 8.5 12 13l9.5-4.5L12 4z" />
          <path d="M6.5 11v4.6c0 1.3 2.5 2.6 5.5 2.6s5.5-1.3 5.5-2.6V11" />
        </svg>
      )
  }
}
