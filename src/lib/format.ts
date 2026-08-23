/** Format helpers shared across the UI. */

export function formatStars(n: number): string {
  return formatCompact(n)
}

export function formatCompact(n: number): string {
  if (n >= 1_000_000) {
    const v = n / 1_000_000
    return `${v >= 10 ? Math.round(v) : v.toFixed(1)}M`
  }
  if (n >= 1_000) {
    const v = n / 1_000
    return `${v >= 10 ? Math.round(v) : v.toFixed(1)}k`
  }
  return String(n)
}

/** "2026-07" | ISO date → "Jul 2026" */
export function formatMonth(iso: string): string {
  const d = new Date(iso.length <= 7 ? `${iso}-01T00:00:00Z` : iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' })
}

export function githubUrl(id: string): string {
  return `https://github.com/${id}`
}
