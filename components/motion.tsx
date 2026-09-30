'use client'

/**
 * Motion primitives. Every animated surface in the app composes these rather
 * than rolling its own observer/keyframe logic, so the motion language stays
 * consistent and reduced-motion is honoured in exactly one place.
 */

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useConfetti, useCountUpOnView, useMagnetic, useParallax, useReveal, useRipple, useScrollProgress, useTilt } from '@/hooks'

/* ── Effect 02 — scroll reveal ─────────────────────────────────────────── */
type RevealVariant = 'up' | 'down' | 'left' | 'right' | 'scale' | 'blurUp' | 'unfold'

export function Reveal({
  children, variant = 'up', delay = 0, className, style, as: Tag = 'div',
}: {
  children: ReactNode; variant?: RevealVariant; delay?: number; className?: string; style?: CSSProperties
  as?: 'div' | 'section' | 'li' | 'article' | 'span' | 'header' | 'p'
}) {
  const ref = useReveal<HTMLDivElement>()
  return (
    <Tag ref={ref as never} data-reveal={variant} className={className}
      style={{ ...style, ['--d' as string]: `${delay}ms` }}>
      {children}
    </Tag>
  )
}

/** Reveal + per-child stagger. Children inherit `--i` automatically. */
export function Stagger({
  children, className, delay = 0, as: Tag = 'div', style,
}: {
  children: ReactNode; className?: string; delay?: number
  as?: 'div' | 'ul' | 'section' | 'article'; style?: CSSProperties
}) {
  const ref = useReveal<HTMLDivElement>({ stagger: true })
  return (
    <Tag ref={ref as never} className={cn('stagger', className)} style={{ ...style, ['--d' as string]: `${delay}ms` }}>
      {children}
    </Tag>
  )
}

/* ── Effect 01 — per-word blur-up headline ─────────────────────────────── */
export function WordReveal({ text, className, highlight }: { text: string; className?: string; highlight?: string[] }) {
  const ref = useReveal<HTMLHeadingElement>({ stagger: true })
  const words = text.split(' ')
  return (
    <h1 ref={ref} className={cn('fx-words', className)}>
      {words.map((word, i) => {
        const isHighlighted = highlight?.some((h) => word.toLowerCase().startsWith(h.toLowerCase()))
        return (
          <span key={`${word}-${i}`} style={{ ['--i' as string]: i }}>
            <span className={isHighlighted ? 'gradient-text' : undefined}>{word}&nbsp;</span>
          </span>
        )
      })}
    </h1>
  )
}

/* ── Effect 03 — parallax wrapper ──────────────────────────────────────── */
export function Parallax({ children, rate = 0.35, className }: { children: ReactNode; rate?: number; className?: string }) {
  const { ref, y } = useParallax<HTMLDivElement>(rate)
  return (
    <motion.div ref={ref} style={{ y }} className={className}>{children}</motion.div>
  )
}

/* ── Effect 04 — scroll progress bar ───────────────────────────────────── */
export function ScrollProgressBar() {
  const progress = useScrollProgress()
  return (
    <motion.div
      aria-hidden
      className="fixed inset-x-0 top-0 z-[95] h-[3px] origin-left"
      style={{ scaleX: progress, background: 'var(--grad-aurora)' }}
    />
  )
}

/* ── Effect 19 — count-up that fires on view ───────────────────────────── */
export function CountUp({
  value, decimals = 0, duration = 1100, prefix = '', suffix = '', className,
}: { value: number; decimals?: number; duration?: number; prefix?: string; suffix?: string; className?: string }) {
  const { ref, value: current } = useCountUpOnView(value, { decimals, duration })
  const display = decimals > 0 ? current.toFixed(decimals) : Math.round(current).toLocaleString('en-GB')
  return (
    <span ref={ref} className={cn('tabular', className)}>
      {prefix}{display}{suffix}
    </span>
  )
}

/* ── Effects 09 + 14 + 32 — magnetic, rippling, shimmering CTA ─────────── */
export function MagneticButton({
  children, className, strength = 8, onClick, type = 'button', ariaLabel,
}: {
  children: ReactNode; className?: string; strength?: number
  onClick?: () => void; type?: 'button' | 'submit'; ariaLabel?: string
}) {
  const { onPointerMove, onPointerLeave } = useMagnetic<HTMLButtonElement>(strength)
  const ripple = useRipple()
  return (
    <button
      type={type}
      aria-label={ariaLabel}
      onClick={onClick}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      onPointerDown={ripple}
      className={cn('fx-magnetic fx-shimmer u-ripple-host press relative overflow-hidden', className)}
    >
      {children}
    </button>
  )
}

/* ── Effects 10 + 11 — spotlight + 3D tilt card ────────────────────────── */
export function TiltCard({ children, className, glare = true }: { children: ReactNode; className?: string; glare?: boolean }) {
  const { onPointerMove, onPointerLeave } = useTilt<HTMLDivElement>(8)
  return (
    <div
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      className={cn('fx-tilt fx-spotlight relative', className)}
    >
      {glare && <span className="fx-glare" aria-hidden />}
      {children}
    </div>
  )
}

/* ── Effect 38 — confetti host ─────────────────────────────────────────── */
export function useBurst() {
  const ref = useRef<HTMLDivElement>(null)
  const confetti = useConfetti()
  return { ref, burst: (count = 34) => confetti(ref.current, count) }
}

/* ── Effect 31 — typewriter with an accessible full-text fallback ──────── */
export function Typewriter({ text, className }: { text: string; className?: string }) {
  const reduced = useReducedMotion()
  const [shown, setShown] = useState(reduced ? text : '')

  useEffect(() => {
    if (reduced) { setShown(text); return }
    const words = text.split(' ')
    let i = 0
    setShown('')
    const id = window.setInterval(() => {
      i += 1
      setShown(words.slice(0, i).join(' '))
      if (i >= words.length) window.clearInterval(id)
    }, 1000 / 7)
    return () => window.clearInterval(id)
  }, [text, reduced])

  return (
    <p className={className}>
      <span aria-hidden>{shown}{shown.length < text.length && <span className="fx-caret" />}</span>
      <span className="sr-only">{text}</span>
    </p>
  )
}

/* ── Effect 36 — snap carousel with pointer-following progress ─────────── */
export function SnapRail({ children, className, label }: { children: ReactNode; className?: string; label: string }) {
  const railRef = useRef<HTMLDivElement>(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const el = railRef.current
    if (!el) return
    let raf = 0
    const onScroll = () => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        const max = el.scrollWidth - el.clientWidth
        setProgress(max > 0 ? el.scrollLeft / max : 0)
        raf = 0
      })
    }
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => { el.removeEventListener('scroll', onScroll); if (raf) cancelAnimationFrame(raf) }
  }, [])

  return (
    <div className="relative">
      <div
        ref={railRef}
        role="group"
        aria-label={label}
        className={cn('flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden', className)}
      >
        {children}
      </div>
      <div className="mt-3 h-1 overflow-hidden rounded-full bg-canvas-2" aria-hidden>
        <div className="h-full rounded-full bg-brand-500 transition-transform duration-300"
          style={{ transform: `scaleX(${Math.max(0.08, progress)})`, transformOrigin: 'left' }} />
      </div>
    </div>
  )
}
