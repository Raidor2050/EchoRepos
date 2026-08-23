import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Repo } from '../data/types'
import { CATEGORIES } from '../data/taxonomy'
import { formatCompact } from '../lib/format'
import { usePrefersReducedMotion } from '../lib/hooks'
import { buildChords, buildNodes, buildParticles, HUB, makeSprite, type UniNode } from './universe/layout'

/**
 * The EchoRepos universe — living repository constellation.
 * Canvas 2D · parametric orbital drift · pre-rendered glow sprites ·
 * adaptive quality (DPR cap, fps watchdog, visibility pause) ·
 * reduced-motion renders a static constellation.
 */
export function UniverseCanvas() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const navigate = useNavigate()
  const reducedMotion = usePrefersReducedMotion()
  const [hover, setHover] = useState<{ repo: Repo; x: number; y: number } | null>(null)

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 760
  const nodes = useMemo(() => buildNodes(isMobile), [isMobile])

  useEffect(() => {
    const canvas = canvasRef.current
    const wrap = wrapRef.current
    if (!canvas || !wrap) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let width = 0
    let height = 0
    let dpr = Math.min(window.devicePixelRatio || 1, 1.75)
    let raf = 0
    let t = Math.random() * 10_000
    let glowOn = true
    let particles = buildParticles(isMobile ? 44 : 96)
    const chords = buildChords(nodes)
    const sprites = new Map<string, HTMLCanvasElement>()
    const byCluster: UniNode[][] = CATEGORIES.map(() => [])
    for (const n of nodes) byCluster[n.catIdx].push(n)

    function sprite(hue: string): HTMLCanvasElement {
      const cached = sprites.get(hue)
      if (cached) return cached
      const s = makeSprite(hue)
      sprites.set(hue, s)
      return s
    }

    function resize() {
      const rect = wrap!.getBoundingClientRect()
      width = Math.max(320, rect.width)
      height = Math.max(380, rect.height)
      dpr = Math.min(window.devicePixelRatio || 1, 1.75)
      canvas!.width = Math.floor(width * dpr)
      canvas!.height = Math.floor(height * dpr)
      canvas!.style.width = `${width}px`
      canvas!.style.height = `${height}px`
      if (reducedMotionRef.current) draw(0)
    }

    const pointer = { x: 0.5, y: 0.5, active: false }
    let hoverNode: UniNode | null = null

    function nodePos(n: UniNode, time: number): [number, number] {
      const a = n.phase + time * n.speed
      const depth = 0.4 + n.orbitFrac * 5
      const ox = pointer.active ? (pointer.x - 0.5) * -24 * depth : 0
      const oy = pointer.active ? (pointer.y - 0.5) * -18 * depth : 0
      return [
        n.cxFrac * width + Math.cos(a) * n.orbitFrac * width + ox,
        n.cyFrac * height + Math.sin(a) * n.orbitFrac * width * 0.74 + oy,
      ]
    }

    function onPointerMove(e: PointerEvent) {
      if (reducedMotionRef.current) return
      const rect = wrap!.getBoundingClientRect()
      pointer.x = (e.clientX - rect.left) / rect.width
      pointer.y = (e.clientY - rect.top) / rect.height
      pointer.active = true
      let found: UniNode | null = null
      let best = 22
      for (const n of nodes) {
        const [nx, ny] = nodePos(n, t)
        const d = Math.hypot(e.clientX - rect.left - nx, e.clientY - rect.top - ny)
        if (d < best) {
          best = d
          found = n
        }
      }
      hoverNode = found
      setHover(found ? { repo: found.repo, x: e.clientX - rect.left, y: e.clientY - rect.top } : null)
      wrap!.style.cursor = found ? 'pointer' : 'default'
    }

    function onLeave() {
      pointer.active = false
      hoverNode = null
      setHover(null)
    }

    function onClick() {
      if (hoverNode) navigate(`/repo/${hoverNode.repo.id}`)
    }
    const clickRef = { current: onClick }

    /* ── draw one frame ── */
    function draw(time: number) {
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx!.clearRect(0, 0, width, height)

      /* nebula floor */
      const bg = ctx!.createRadialGradient(width * HUB.x, height * HUB.y, 40, width * HUB.x, height * HUB.y, Math.max(width, height) * 0.72)
      bg.addColorStop(0, 'rgba(9,17,32,0.5)')
      bg.addColorStop(0.45, 'rgba(4,7,12,0.72)')
      bg.addColorStop(1, 'rgba(0,0,0,0)')
      ctx!.fillStyle = bg
      ctx!.fillRect(0, 0, width, height)

      /* dust particles */
      for (const p of particles) {
        p.tw += 0.03
        p.yFrac += p.vy
        if (p.yFrac < -0.02) p.yFrac = 1.02
        ctx!.fillStyle = `rgba(160,200,255,${(0.13 + Math.sin(p.tw) * 0.09).toFixed(3)})`
        ctx!.beginPath()
        ctx!.arc(p.xFrac * width, p.yFrac * height, p.size, 0, Math.PI * 2)
        ctx!.fill()
      }

      const hubX = width * HUB.x
      const hubY = height * HUB.y
      ctx!.lineWidth = 1

      /* cluster spokes → hub */
      for (let ci = 0; ci < byCluster.length; ci++) {
        const cl = byCluster[ci]
        if (cl.length === 0) continue
        let sx = 0
        let sy = 0
        for (const n of cl) {
          const [nx, ny] = nodePos(n, time)
          sx += nx
          sy += ny
        }
        sx /= cl.length
        sy /= cl.length
        ctx!.strokeStyle = `${CATEGORIES[ci].hue}16`
        ctx!.beginPath()
        ctx!.moveTo(hubX, hubY)
        ctx!.quadraticCurveTo((hubX + sx) / 2 + 26, (hubY + sy) / 2 - 26, sx, sy)
        ctx!.stroke()

        /* faint cluster label */
        ctx!.fillStyle = 'rgba(150,170,200,0.30)'
        ctx!.font = '600 10px ui-monospace, monospace'
        ctx!.textAlign = 'center'
        ctx!.fillText(CATEGORIES[ci].label.toUpperCase(), sx, sy - 14)
      }

      /* orbital lattice within clusters */
      for (const cl of byCluster) {
        for (let i = 0; i < cl.length; i++) {
          const a = cl[i]
          const b = cl[(i + 1) % cl.length]
          const hot = hoverNode === a || hoverNode === b
          const [ax, ay] = nodePos(a, time)
          const [bx, by] = nodePos(b, time)
          ctx!.strokeStyle = `${a.hue}${hot ? '66' : '22'}`
          ctx!.beginPath()
          ctx!.moveTo(ax, ay)
          ctx!.lineTo(bx, by)
          ctx!.stroke()
        }
      }

      /* cross-cluster chords */
      for (const [ai, bi] of chords) {
        const a = nodes[ai]
        const b = nodes[bi]
        if (!a || !b) continue
        const [ax, ay] = nodePos(a, time)
        const [bx, by] = nodePos(b, time)
        ctx!.strokeStyle = 'rgba(125,249,255,0.08)'
        ctx!.beginPath()
        ctx!.moveTo(ax, ay)
        ctx!.lineTo(bx, by)
        ctx!.stroke()
      }

      /* hub — pulsing echo rings + core */
      const pulse = (time * 0.0012) % 1
      for (const k of [pulse, (pulse + 0.5) % 1]) {
        ctx!.strokeStyle = `rgba(125,249,255,${(0.35 * (1 - k)).toFixed(3)})`
        ctx!.lineWidth = 1.4
        ctx!.beginPath()
        ctx!.arc(hubX, hubY, 8 + k * 46, 0, Math.PI * 2)
        ctx!.stroke()
      }
      if (glowOn) ctx!.drawImage(sprite('#7df9ff'), hubX - 34, hubY - 34, 68, 68)
      ctx!.fillStyle = '#7df9ff'
      ctx!.beginPath()
      ctx!.arc(hubX, hubY, 7, 0, Math.PI * 2)
      ctx!.fill()
      ctx!.fillStyle = '#ffffff'
      ctx!.beginPath()
      ctx!.arc(hubX, hubY, 3, 0, Math.PI * 2)
      ctx!.fill()

      /* repository nodes */
      for (const n of nodes) {
        const [nx, ny] = nodePos(n, time)
        const hot = hoverNode === n
        const s = n.size * (hot ? 1.6 : 1)
        if (glowOn || hot) ctx!.drawImage(sprite(n.hue), nx - s * 3, ny - s * 3, s * 6, s * 6)
        ctx!.fillStyle = hot ? '#ffffff' : n.hue
        ctx!.beginPath()
        ctx!.arc(nx, ny, s, 0, Math.PI * 2)
        ctx!.fill()
        if (hot) {
          ctx!.strokeStyle = 'rgba(255,255,255,0.85)'
          ctx!.lineWidth = 1.2
          ctx!.beginPath()
          ctx!.arc(nx, ny, s + 4.5, 0, Math.PI * 2)
          ctx!.stroke()
        }
      }
    }

    /* ── loop with fps watchdog ── */
    let frames = 0
    let watchStart = performance.now()
    let degraded = false
    function loop(now: number) {
      raf = requestAnimationFrame(loop)
      t = now
      draw(now)
      frames++
      if (now - watchStart > 1600) {
        const fps = (frames * 1000) / (now - watchStart)
        frames = 0
        watchStart = now
        if (!degraded && fps < 42) {
          degraded = true
          glowOn = false
          particles = particles.slice(0, Math.ceil(particles.length / 2))
        }
      }
    }

    const reducedMotionRef = { current: reducedMotion }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(wrap)

    if (!reducedMotion) {
      raf = requestAnimationFrame(loop)
      wrap.addEventListener('pointermove', onPointerMove)
      wrap.addEventListener('pointerleave', onLeave)
      wrap.addEventListener('click', onClick as EventListener)
    } else {
      draw(0)
    }

    const onVis = () => {
      if (document.hidden || reducedMotion) {
        cancelAnimationFrame(raf)
      } else {
        watchStart = performance.now()
        frames = 0
        raf = requestAnimationFrame(loop)
      }
    }
    document.addEventListener('visibilitychange', onVis)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      document.removeEventListener('visibilitychange', onVis)
      wrap.removeEventListener('pointermove', onPointerMove)
      wrap.removeEventListener('pointerleave', onLeave)
      wrap.removeEventListener('click', clickRef.current as EventListener)
    }
  }, [nodes, navigate, reducedMotion])

  return (
    <div ref={wrapRef} className="universe" aria-label="Interactive map of curated GitHub repositories">
      <canvas ref={canvasRef} aria-hidden />
      {!isMobile && (
        <div className="universe__hublabel" style={{ left: `${HUB.x * 100}%`, top: `calc(${HUB.y * 100}% + 20px)` }}>
          <b>EchoRepos</b>
          <span>{REPO_COUNT_LABEL}</span>
        </div>
      )}
      {hover && (
        <div className="univ-tip" style={{ left: hover.x, top: hover.y }}>
          <b>{hover.repo.id}</b>
          <span>
            ★ {formatCompact(hover.repo.stars)} · {hover.repo.language} — click to open
          </span>
        </div>
      )}
    </div>
  )
}

const REPO_COUNT_LABEL = 'the signal hub'
