import { useEffect } from 'react'
import { HashRouter, Route, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'motion/react'
import { AppProvider, useApp } from './lib/store'
import { NavBar } from './components/NavBar'
import { Footer } from './components/Footer'
import { CommandOverlay } from './components/CommandSearch'
import Home from './pages/Home'
import Explore from './pages/Explore'
import Categories from './pages/Categories'
import Learn, { LessonDetail } from './pages/Learn'
import Quiz from './pages/Quiz'
import RepoDetail from './pages/RepoDetail'
import NotFound from './pages/NotFound'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => window.scrollTo(0, 0), [pathname])
  return null
}

function CloseOverlayOnRoute() {
  const { pathname } = useLocation()
  const { setCommandOpen } = useApp()
  useEffect(() => setCommandOpen(false), [pathname, setCommandOpen])
  return null
}

function AnimatedRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname.split('/')[1] || 'home'}>
        <Route path="/" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/learn" element={<Learn />} />
        <Route path="/learn/:slug" element={<LessonDetail />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/repo/:id" element={<RepoDetail />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  )
}

export default function App() {
  return (
    <AppProvider>
      <HashRouter>
        <ScrollToTop />
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
