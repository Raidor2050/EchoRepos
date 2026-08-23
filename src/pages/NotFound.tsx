import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { OrbitDecor } from '../components/decor'

export default function NotFound() {
  return (
    <div className="page nf container" style={{ textAlign: 'center', position: 'relative' }}>
      <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', opacity: 0.5, pointerEvents: 'none' }}>
        <OrbitDecor size={520} hue="#ff5470" />
      </div>
      <motion.div initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} style={{ position: 'relative', padding: '110px 0' }}>
        <p className="mono-note" style={{ fontSize: 13 }}>error 404 · signal lost</p>
        <h1 className="h1">This sector is empty space</h1>
        <p className="lead" style={{ maxWidth: 440, margin: '12px auto 26px' }}>
          The page you requested drifted out of orbit. The universe map is still intact.
        </p>
        <Link to="/" className="btn btn--primary btn--lg">Return to base</Link>
      </motion.div>
    </div>
  )
}
