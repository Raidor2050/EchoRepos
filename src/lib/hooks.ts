import { useEffect, useRef, useState } from 'react'

/** True when the user prefers reduced motion (system-level). */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onChange = () => setReduced(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])
  return reduced
}

export function useDebounced<T>(value: T, ms = 140): T {
  const [v, setV] = useState(value)
  useEffect(() => {
    const t = window.setTimeout(() => setV(value), ms)
    return () => window.clearTimeout(t)
  }, [value, ms])
  return v
}

export function useOnKey(key: string | string[], handler: (e: KeyboardEvent) => void): void {
  const ref = useRef(handler)
  ref.current = handler
  useEffect(() => {
    const keys = Array.isArray(key) ? key : [key]
    const onKey = (e: KeyboardEvent) => {
      if (keys.includes(e.key)) ref.current(e)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [key])
}

/** Document title + meta description per route. */
export function usePageMeta(title: string, description?: string): void {
  useEffect(() => {
    document.title = `${title} - EchoRepos`
    if (description) {
      let tag = document.querySelector<HTMLMetaElement>('meta[name="description"]')
      if (!tag) {
        tag = document.createElement('meta')
        tag.name = 'description'
        document.head.appendChild(tag)
      }
      tag.content = description
    }
  }, [title, description])
}
