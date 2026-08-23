import { lazy, Suspense, useEffect, type ReactNode } from 'react'
import { HashRouter, Route, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { AppProvider, useApp } from './lib/store'
import { usePrefersReducedMotion } from './lib/hooks'
import { NavBar } from './components/NavBar'
import { Footer } from './components/Footer'
import { CommandOverlay } from './components/CommandSearch'
import { LogoMark } from './components/LogoMark'
import Home from './pages/Home'

const Explore = lazy(() => import('./pages/Explore'))
const Categories = lazy(() => import('./pages/Categories'))
const Learn = lazy(() => import('./pages/Learn'))
const LessonDetail = lazy(() =>
  import('./pages/Learn').then((m) => ({ default: m.LessonDetail })),
)
const Quiz = lazy(() => import('./pages/Quiz'))
const RepoDetail = lazy(() => import('./pages/RepoDetail'))
const NotFound = lazy(() => import('./pages/NotFound'))

function RouteLoader() {
  return (
    <div className="route-loader" role="status" aria-label="Loading page">
      <motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.6, ease: 'linear' }}>
        <LogoMark size={40} />
      </motion.span>
      <p>tuning into the signal…</p>
    </div>
  )
}

/**
 * Page transition shell. Keyed by pathname so every navigation mounts a
 * fresh wrapper: old page fades/slides out, new one fades in, scroll resets
 * exactly when the new page mounts (no mid-exit jump).
 */
function PageTransition({ children }: { children: ReactNode }) {
  const reduced = usePrefersReducedMotion()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])
  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: reduced ? 0 : 0.24, ease: [0.22, 1, 0.36, 1] }}
    >
      <Suspense fallback={<RouteLoader />}>{children}</Suspense>
    </motion.div>
  )
}

function AnimatedRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <PageTransition key={location.pathname}>
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/learn" element={<Learn />} />
          <Route path="/learn/:slug" element={<LessonDetail />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/repo/:id" element={<RepoDetail />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </PageTransition>
    </AnimatePresence>
  )
}

function CloseOverlayOnRoute() {
  const { pathname } = useLocation()
  const { setCommandOpen } = useApp()
  useEffect(() => setCommandOpen(false), [pathname, setCommandOpen])
  return null
}

export default function App() {
  return (
    <AppProvider>
      <HashRouter>
        <CloseOverlayOnRoute />
        <a href="#main" className="skip-link">Skip to content</a>
        <NavBar />
        <main id="main">
          <AnimatedRoutes />
        </main>
        <Footer />
        <CommandOverlay />
      </HashRouter>
    </AppProvider>
  )
}
