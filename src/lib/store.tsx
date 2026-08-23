import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { QuizAnswers } from './recommend'
import { EMPTY_ANSWERS } from './recommend'
import { loadStore, saveStore } from './engine'

interface AppState {
  favorites: ReadonlySet<string>
  toggleFavorite: (id: string) => void
  learned: ReadonlySet<string>
  markLearned: (slug: string) => void
  resetLearned: () => void
  quiz: QuizAnswers
  setQuiz: (q: QuizAnswers) => void
  commandOpen: boolean
  setCommandOpen: (open: boolean) => void
}

const Ctx = createContext<AppState | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<Set<string>>(
    () => new Set(loadStore<string[]>('er:favs', [])),
  )
  const [learned, setLearned] = useState<Set<string>>(
    () => new Set(loadStore<string[]>('er:learned', [])),
  )
  const [quiz, setQuizState] = useState<QuizAnswers>(() =>
    loadStore<QuizAnswers>('er:quiz', EMPTY_ANSWERS),
  )
  const [commandOpen, setCommandOpen] = useState(false)

  const persist = useCallback(<T,>(key: string, value: T) => saveStore(key, value), [])

  const toggleFavorite = useCallback(
    (id: string) => {
      setFavorites((prev) => {
        const next = new Set(prev)
        if (next.has(id)) next.delete(id)
        else next.add(id)
        persist('er:favs', [...next])
        return next
      })
    },
    [persist],
  )

  const markLearned = useCallback(
    (slug: string) => {
      setLearned((prev) => {
        const next = new Set(prev)
        if (next.has(slug)) next.delete(slug)
        else next.add(slug)
        persist('er:learned', [...next])
        return next
      })
    },
    [persist],
  )

  const resetLearned = useCallback(() => {
    setLearned(new Set())
    persist('er:learned', [])
  }, [persist])

  const setQuiz = useCallback(
    (q: QuizAnswers) => {
      setQuizState(q)
      persist('er:quiz', q)
    },
    [persist],
  )

  /* global ⌘K / Ctrl+K */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setCommandOpen((o) => !o)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const value = useMemo<AppState>(
    () => ({
      favorites,
      toggleFavorite,
      learned,
      markLearned,
      resetLearned,
      quiz,
      setQuiz,
      commandOpen,
      setCommandOpen,
    }),
    [favorites, toggleFavorite, learned, markLearned, resetLearned, quiz, setQuiz, commandOpen],
  )

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useApp(): AppState {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useApp must be used inside <AppProvider>')
  return ctx
}
