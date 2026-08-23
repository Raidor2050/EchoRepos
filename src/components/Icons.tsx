import type { SVGProps } from 'react'

type P = SVGProps<SVGSVGElement> & { size?: number }

function base({ size = 16, ...rest }: P): SVGProps<SVGSVGElement> {
  return {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': true,
    ...rest,
  }
}

export const IconStar = (p: P) => (
  <svg {...base(p)} fill="currentColor" stroke="none">
    <path d="M12 2.5l2.9 5.9 6.5.95-4.7 4.58 1.1 6.47L12 17.35l-5.8 3.05 1.1-6.47L2.6 9.35l6.5-.95L12 2.5z" />
  </svg>
)

export const IconFork = (p: P) => (
  <svg {...base(p)}>
    <circle cx="6" cy="5" r="2.4" />
    <circle cx="18" cy="5" r="2.4" />
    <circle cx="12" cy="19" r="2.4" />
    <path d="M6 7.5v2a4 4 0 0 0 4 4h4a4 4 0 0 0 4-4v-2M12 13.5v3" />
  </svg>
)

export const IconIssue = (p: P) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="3" fill="currentColor" stroke="none" />
  </svg>
)

export const IconBranch = (p: P) => (
  <svg {...base(p)}>
    <circle cx="7" cy="5" r="2.4" />
    <circle cx="7" cy="19" r="2.4" />
    <circle cx="17" cy="9" r="2.4" />
    <path d="M7 7.4v9.2M17 11.4c0 3-2.5 4.1-5 4.6" />
  </svg>
)

export const IconExternal = (p: P) => (
  <svg {...base(p)}>
    <path d="M14 4h6v6M20 4l-9 9M18 13v6H5V6h6" />
  </svg>
)

export const IconSearch = (p: P) => (
  <svg {...base(p)}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </svg>
)

export const IconArrowRight = (p: P) => (
  <svg {...base(p)}>
    <path d="M4 12h15m-6-6 6 6-6 6" />
  </svg>
)

export const IconChevron = (p: P) => (
  <svg {...base(p)}>
    <path d="m6 9 6 6 6-6" />
  </svg>
)

export const IconCheck = (p: P) => (
  <svg {...base(p)}>
    <path d="m4.5 12.5 5 5 10-11" />
  </svg>
)

export const IconBolt = (p: P) => (
  <svg {...base(p)} fill="currentColor" stroke="none">
    <path d="M13 2 4.5 13.5H11L9.5 22 19 9.5h-6.5L13 2z" />
  </svg>
)

export const IconBook = (p: P) => (
  <svg {...base(p)}>
    <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15.5H6.5A2.5 2.5 0 0 0 4 21V5.5zM4 18.5A2.5 2.5 0 0 1 6.5 16H20" />
  </svg>
)

export const IconSparkle = (p: P) => (
  <svg {...base(p)} fill="currentColor" stroke="none">
    <path d="M12 2c.6 4.8 2.2 6.4 7 7-4.8.6-6.4 2.2-7 7-.6-4.8-2.2-6.4-7-7 4.8-.6 6.4-2.2 7-7zM19.5 14.5c.3 2.4 1.1 3.2 3.5 3.5-2.4.3-3.2 1.1-3.5 3.5-.3-2.4-1.1-3.2-3.5-3.5 2.4-.3 3.2-1.1 3.5-3.5z" />
  </svg>
)

export const IconCommand = (p: P) => (
  <svg {...base(p)}>
    <path d="M8 8h8v8H8V8zm0 0V6a2 2 0 1 0-2 2h2zm8 0V6a2 2 0 1 1 2 2h-2zm0 8v2a2 2 0 1 0 2-2h-2zm-8 0v2a2 2 0 1 1-2-2h2z" />
  </svg>
)

export const IconMenu = (p: P) => (
  <svg {...base(p)}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </svg>
)

export const IconX = (p: P) => (
  <svg {...base(p)}>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
)

export const IconHeart = ({ filled, ...p }: P & { filled?: boolean }) => (
  <svg {...base(p)} fill={filled ? 'currentColor' : 'none'}>
    <path d="M12 20.5S3.5 15 3.5 9A4.6 4.6 0 0 1 12 6.2 4.6 4.6 0 0 1 20.5 9c0 6-8.5 11.5-8.5 11.5z" />
  </svg>
)
