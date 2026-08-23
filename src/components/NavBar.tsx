import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { LogoMark } from './LogoMark'
import { IconCommand, IconMenu, IconX, IconSparkle } from './Icons'
import { useApp } from '../lib/store'

const LINKS = [
  { to: '/', label: 'Home', end: true },
  { to: '/explore', label: 'Explore' },
  { to: '/categories', label: 'Categories' },
  { to: '/learn', label: 'Learn' },
] as const

export function NavBar() {
  const [open, setOpen] = useState(false)
  const { setCommandOpen } = useApp()

  /* close sheet on route change */
  useEffect(() => {
    const close = () => setOpen(false)
    window.addEventListener('hashchange', close)
    return () => window.removeEventListener('hashchange', close)
  }, [])

  return (
    <>
      <header className="nav">
        <div className="nav__inner">
          <Link to="/" className="nav__logo" aria-label="EchoRepos home">
            <LogoMark />
            <span>
              Echo<em>Repos</em>
            </span>
          </Link>

          <nav className="nav__links" aria-label="Primary">
            {LINKS.map((l) => (
              <NavLink key={l.to} to={l.to} end={'end' in l && l.end} className={({ isActive }) => `nav__link${isActive ? ' is-active' : ''}`}>
                {l.label}
              </NavLink>
            ))}
          </nav>

          <div className="nav__spacer" />

          <button className="nav__kbd" onClick={() => setCommandOpen(true)} aria-label="Open command search">
            <IconCommand size={14} />
            Search
            <kbd>⌘K</kbd>
          </button>

          <Link to="/quiz" className="btn btn--primary btn--sm" style={{ marginLeft: 10 }}>
            <IconSparkle size={14} />
            Find repos
          </Link>

          <button className="nav__burger" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-label="Toggle menu">
            {open ? <IconX size={22} /> : <IconMenu size={22} />}
          </button>
        </div>
      </header>

      {open && (
        <nav className="nav__sheet" aria-label="Mobile">
          {[...LINKS, { to: '/quiz', label: 'Find repos' }].map((l) => (
            <NavLink key={l.to} to={l.to} end={'end' in l && l.end} className={({ isActive }) => `nav__link${isActive ? ' is-active' : ''}`}>
              {l.label}
            </NavLink>
          ))}
        </nav>
      )}
    </>
  )
}
