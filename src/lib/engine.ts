import type { ProjectType } from '../data/types'
import { CATEGORIES } from '../data/taxonomy'
import { LANGUAGE_NAMES } from './data'
import {
  EMPTY_ANSWERS,
  profileString,
  recommend,
  type BuildingType,
  type Level,
  type Priority,
  type QuizAnswers,
  type Stage,
} from './recommend'
import { runSearch, suggest } from './search'
import { similarityScore, similarRepos } from './similar'

/* Re-export the engine surface as the single public lib entry. */
export {
  EMPTY_ANSWERS,
  profileString,
  recommend,
  runSearch,
  suggest,
  similarRepos,
  similarityScore,
}
export type { BuildingType, Level, Priority, QuizAnswers, Stage, ProjectType }

export const CATEGORY_OPTIONS = CATEGORIES
export const LANGUAGE_OPTIONS = LANGUAGE_NAMES

/* ── localStorage envelope with versioned migration chain ── */

interface Envelope<T> {
  v: number
  savedAt: string
  payload: T
}

const VERSION = 1

export function loadStore<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    const env = JSON.parse(raw) as Envelope<T>
    if (typeof env !== 'object' || env === null || typeof env.v !== 'number') return fallback
    if (env.v > VERSION) return fallback // discard unknown newer versions (forward-safe)
    if (env.v < VERSION) return (migrate(env.v, env.payload) as T) ?? fallback
    return env.payload ?? fallback
  } catch {
    return fallback
  }
}

function migrate(from: number, payload: unknown): unknown {
  /* ordered migration chain: migrations[n → n+1] */
  void from
  return payload
}

export function saveStore<T>(key: string, payload: T): void {
  try {
    const env: Envelope<T> = { v: VERSION, savedAt: new Date().toISOString(), payload }
    localStorage.setItem(key, JSON.stringify(env))
  } catch {
    /* storage full/unavailable - non-fatal */
  }
}
