import { Link } from 'react-router-dom'
import { LogoMark } from './LogoMark'

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div>
          <Link to="/" className="nav__logo" style={{ marginBottom: 14 }}>
            <LogoMark />
            <span>
              Echo<em>Repos</em>
            </span>
          </Link>
          <p className="footer__note">
            The best of GitHub, organized for humans. A curated map of the open-source
            universe — learn the landscape, find your stack, start building.
          </p>
        </div>
        <div>
          <h4>Discover</h4>
          <Link to="/explore">Explore repositories</Link>
          <Link to="/categories">Ecosystems</Link>
          <Link to="/quiz">Project quiz</Link>
          <Link to="/explore?sort=trending">Trending</Link>
        </div>
        <div>
          <h4>Learn</h4>
          <Link to="/learn">What is GitHub?</Link>
          <Link to="/learn#git">Git basics</Link>
          <Link to="/learn#pull-request">Pull requests</Link>
          <Link to="/learn#open-source">Open source</Link>
        </div>
        <div>
          <h4>Data</h4>
          <a href="https://github.com/Raidor2050/EchoRepos" target="_blank" rel="noreferrer">
            Source repository
          </a>
          <a href="https://docs.github.com/rest" target="_blank" rel="noreferrer">
            GitHub REST API
          </a>
        </div>
      </div>
      <div className="footer__base">
        <span>© {new Date().getFullYear()} EchoRepos — Discover. Learn. Build.</span>
        <span>
          Unofficial fan-made index · not affiliated with GitHub · stats are curated snapshots,
          refreshable via the data pipeline
        </span>
      </div>
    </footer>
  )
}
