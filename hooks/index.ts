'use client'

/**
 * Motion + platform hooks. All reduced-motion aware, all cleaned up properly.
 * Client-only module — every consumer must be a client component.
 */

import { useCallback, useEffect, useRef, useState } from 'react'
import { useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion'

/* ── Effect 02: reveal-on-view ───────────────────────────────────────────
   Adds `.is-in` once, then unobserves. Assigns `--i` to children so the CSS
   stagger works without a JS animation loop. */
export function useReveal<T extends HTMLElement = HTMLDivElement>(options?: { stagger?: boolean }) {
  const ref = useRef<T>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const targets = [el, ...Array.from(el.querySelectorAll<HTMLElement>('[data-reveal], .stagger, .fx-draw, .fx-words, .fx-mask'))]

    if (options?.stagger) {
      Array.from(el.children).forEach((child, i) => (child as HTMLElement).style.setProperty('--i', String(i)))
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          const target = entry.target as HTMLElement
          target.classList.add('is-in')
          if (target.classList.contains('stagger') || target.classList.contains('fx-words')) {
            Array.from(target.children).forEach((child, i) => (child as HTMLElement).style.setProperty('--i', String(i)))
          }
          const len = target.querySelector('[stroke]')?.getAttribute('pathLength')
          if (len) target.style.setProperty('--len', len)
          io.unobserve(target)
        }
      },
      { threshold: 0.18, rootMargin: '-10% 0px -10% 0px' },
    )

    targets.forEach((t) => io.observe(t))
    return () => io.disconnect()
  }, [options?.stagger])

  return ref
}

/* ── Effect 19: count-up. Tabular numerals keep the width stable. ─────── */
export function useCountUp(
  target: number,
  { duration = 1100, delay = 0, decimals = 0, start = true } = {},
) {
  const reduced = useReducedMotion()
  const [value, setValue] = useState(reduced ? target : 0)

  useEffect(() => {
    if (!start) return
    if (reduced) { setValue(target); return }
    let raf = 0
    let t0 = 0
    let cancelled = false
    const easeOut = (t: number) => 1 - Math.pow(2, -10 * t)
    const tick = (now: number) => {
      if (!t0) t0 = now
      const p = Math.min((now - t0) / duration, 1)
      if (!cancelled) setValue(Number((target * easeOut(p)).toFixed(decimals)))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    const id = window.setTimeout(() => { raf = requestAnimationFrame(tick) }, delay)
    return () => { cancelled = true; window.clearTimeout(id); cancelAnimationFrame(raf) }
  }, [target, duration, delay, decimals, start, reduced])

  return value
}

/** Counts up only once the element is on screen. */
export function useCountUpOnView(target: number, opts?: { duration?: number; decimals?: number; delay?: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const [seen, setSeen] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) { setSeen(true); io.disconnect() }
    }, { threshold: 0.6 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const value = useCountUp(target, { ...opts, start: seen })
  return { ref, value }
}

/* ── Effect 03: layered parallax. rate .15 = background, .6 = foreground ─ */
export function useParallax<T extends HTMLElement = HTMLDivElement>(rate = 0.35) {
  const ref = useRef<T>(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const raw = useTransform(scrollYProgress, [0, 1], [rate * 100, -rate * 100])
  const y = useSpring(raw, { stiffness: 120, damping: 30, mass: 0.4 })
  return { ref, y: reduced ? 0 : y, progress: scrollYProgress }
}

/* ── Effect 04: top scroll progress bar ─────────────────────────────────── */
export function useScrollProgress() {
  const { scrollYProgress } = useScroll()
  return useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 })
}

/* ── Effect 09: magnetic CTA. Pair with the .fx-magnetic class. ─────────── */
export function useMagnetic<T extends HTMLElement = HTMLButtonElement>(strength = 8) {
  const reduced = useReducedMotion()

  const onPointerMove = useCallback((e: React.PointerEvent<T>) => {
    if (reduced || e.pointerType === 'touch') return
    const el = e.currentTarget
    const r = el.getBoundingClientRect()
    const dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2)
    const dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2)
    el.style.setProperty('--mx', `${dx * strength}px`)
    el.style.setProperty('--my', `${dy * strength}px`)
  }, [reduced, strength])

  const onPointerLeave = useCallback((e: React.PointerEvent<T>) => {
    e.currentTarget.style.setProperty('--mx', '0px')
    e.currentTarget.style.setProperty('--my', '0px')
  }, [])

  return { onPointerMove, onPointerLeave }
}

/* ── Effect 10 + 11: spotlight + 3D tilt with glare ───────────────────── */
export function useTilt<T extends HTMLElement = HTMLDivElement>(max = 9) {
  const reduced = useReducedMotion()
  const frame = useRef(0)

  const onPointerMove = useCallback((e: React.PointerEvent<T>) => {
    if (reduced || e.pointerType === 'touch') return
    const el = e.currentTarget
    const { clientX, clientY } = e
    if (frame.current) return
    frame.current = requestAnimationFrame(() => {
      const r = el.getBoundingClientRect()
      const px = (clientX - r.left) / r.width
      const py = (clientY - r.top) / r.height
      el.style.setProperty('--ry', `${((px - 0.5) * max * 2).toFixed(2)}deg`)
      el.style.setProperty('--rx', `${((0.5 - py) * max * 2).toFixed(2)}deg`)
      el.style.setProperty('--gx', `${(px * 100).toFixed(1)}%`)
      el.style.setProperty('--gy', `${(py * 100).toFixed(1)}%`)
      el.style.setProperty('--mx', `${(clientX - r.left).toFixed(0)}px`)
      el.style.setProperty('--my', `${(clientY - r.top).toFixed(0)}px`)
      frame.current = 0
    })
  }, [reduced, max])

  const onPointerLeave = useCallback((e: React.PointerEvent<T>) => {
    const el = e.currentTarget
    el.style.setProperty('--rx', '0deg')
    el.style.setProperty('--ry', '0deg')
  }, [])

  return { onPointerMove, onPointerLeave }
}

/* ── Effect 14: ripple. Returns a handler that spawns a self-removing dot. */
export function useRipple() {
  const reduced = useReducedMotion()
  return useCallback((e: React.PointerEvent<HTMLElement>) => {
    if (reduced) return
    const el = e.currentTarget
    const r = el.getBoundingClientRect()
    const dot = document.createElement('span')
    dot.className = 'fx-ripple'
    dot.style.left = `${e.clientX - r.left}px`
    dot.style.top = `${e.clientY - r.top}px`
    dot.style.color = getComputedStyle(el).color
    el.appendChild(dot)
    dot.addEventListener('animationend', () => dot.remove())
  }, [reduced])
}

/* ── Effect 12: sticky header state ────────────────────────────────────── */
export function useScrolled(threshold = 40) {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    let raf = 0
    const onScroll = () => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        setScrolled(window.scrollY > threshold)
        raf = 0
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => { window.removeEventListener('scroll', onScroll); if (raf) cancelAnimationFrame(raf) }
  }, [threshold])
  return scrolled
}

/* ── Effect 25: bottom sheet drag physics ─────────────────────────────── */
export function useDragSheet(onClose: () => void) {
  const [open, setOpen] = useState(false)
  const [dragY, setDragY] = useState(0)
  const [dragging, setDragging] = useState(false)
  const startRef = useRef({ y: 0, t: 0, velocity: 0 })
  const heightRef = useRef(480)

  const openSheet = useCallback(() => { setOpen(true); setDragY(0) }, [])
  const close = useCallback(() => {
    setOpen(false)
    setDragY(0)
    onClose()
  }, [onClose])

  const handlers = {
    onPointerDown: (e: React.PointerEvent) => {
      (e.target as HTMLElement).setPointerCapture(e.pointerId)
      startRef.current = { y: e.clientY, t: performance.now(), velocity: 0 }
      heightRef.current = (e.currentTarget as HTMLElement).offsetHeight || 480
      setDragging(true)
    },
    onPointerMove: (e: React.PointerEvent) => {
      if (!dragging) return
      const raw = Math.max(0, e.clientY - startRef.current.y)
      const h = heightRef.current
      // rubber band past 40% so the sheet never feels like it snapped off
      const next = raw > h * 0.4 ? h * 0.4 + (raw - h * 0.4) * 0.55 : raw
      const now = performance.now()
      startRef.current.velocity = ((e.clientY - startRef.current.y) / Math.max(now - startRef.current.t, 1)) * 1000
      startRef.current.t = now
      setDragY(next)
    },
    onPointerUp: () => {
      setDragging(false)
      const h = heightRef.current
      if (startRef.current.velocity > 520 || dragY > h * 0.35) close()
      else setDragY(0)
    },
  }

  return { open, openSheet, close, dragY, dragging, handlers }
}

/* ── Platform helpers ─────────────────────────────────────────────────── */
export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false)
  useEffect(() => {
    const mql = window.matchMedia(query)
    const onChange = () => setMatches(mql.matches)
    onChange()
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [query])
  return matches
}

export function usePrefersReducedMotion() {
  return useReducedMotion() ?? false
}

/** Effect 47 — haptics with an always-available visual fallback. */
export function useHaptics() {
  return useCallback((pattern: number | number[] = 12) => {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try { navigator.vibrate(pattern) } catch { /* unsupported — visual feedback still fires */ }
    }
  }, [])
}

/** Effect 48 — drop heavy effects on low-end devices. */
export function useLowPower() {
  useEffect(() => {
    const nav = navigator as Navigator & { deviceMemory?: number }
    const mem = nav.deviceMemory ?? 8
    const cores = navigator.hardwareConcurrency ?? 8
    if (mem <= 4 || cores <= 4) document.documentElement.dataset.power = 'low'
  }, [])
}

/** Effect 38 — lightweight DOM particle burst (no canvas for < 60 nodes). */
export function useConfetti() {
  const reduced = useReducedMotion()
  return useCallback((host: HTMLElement | null, count = 34) => {
    if (!host || reduced) return
    const colors = ['#12b76a', '#b6f09c', '#7a5af8', '#ffb020', '#2e90fa']
    const box = host.getBoundingClientRect()
    for (let i = 0; i < count; i++) {
      const p = document.createElement('span')
      p.className = 'fx-confetti'
      p.style.left = `${box.width / 2}px`
      p.style.top = `${box.height / 2}px`
      p.style.background = colors[i % colors.length]
      p.style.setProperty('--dx', `${(Math.random() * 220 - 110).toFixed(0)}px`)
      p.style.setProperty('--dy', `${(Math.random() * -180 - 40).toFixed(0)}px`)
      p.style.setProperty('--rot', `${(Math.random() * 720).toFixed(0)}deg`)
      p.style.setProperty('--dur', `${(1100 + Math.random() * 700).toFixed(0)}ms`)
      host.appendChild(p)
      p.addEventListener('animationend', () => p.remove())
    }
  }, [reduced])
}

/** Effect 31 — word-by-word streaming, with the full string exposed to SRs. */
export function useTypewriter(text: string, { wordsPerSecond = 6, start = true } = {}) {
  const reduced = useReducedMotion()
  const [out, setOut] = useState(reduced ? text : '')

  useEffect(() => {
    if (!start || reduced) { setOut(text); return }
    const words = text.split(' ')
    let i = 0
    setOut('')
    const id = window.setInterval(() => {
      i += 1
      setOut(words.slice(0, i).join(' '))
      if (i >= words.length) window.clearInterval(id)
    }, 1000 / wordsPerSecond)
    return () => window.clearInterval(id)
  }, [text, wordsPerSecond, start, reduced])

  return { text: out, done: out.length >= text.length }
}

/** Effect 41 — heatmap data with a deterministic brand-ramp color. */
export function scoreTint(score: number) {
  if (score === 0) return 'var(--canvas-2)'
  if (score >= 85) return 'var(--score-great)'
  if (score >= 70) return 'var(--score-good)'
  if (score >= 40) return 'var(--score-warn)'
  return 'var(--score-danger)'
}

/** Local storage with SSR safety. */
export function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(initial)

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(key)
      if (raw != null) setValue(JSON.parse(raw) as T)
    } catch { /* ignore private-mode failures */ }
  }, [key])

  const set = useCallback((next: T) => {
    setValue(next)
    try { window.localStorage.setItem(key, JSON.stringify(next)) } catch { /* ignore */ }
  }, [key])

  return [value, set] as const
}

/** Framer Motion values re-exported so components import from one place. */
export { useMotionValue }
