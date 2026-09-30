'use client'

/**
 * Effect 20 — the animated score ring. This is the single most important
 * visual in the product, so it gets its own component:
 *  · spring-eased stroke-dashoffset (not a linear CSS transition)
 *  · the number counts up in sync with the arc
 *  · the gradient stops swap to the band colour, so one number recolours
 *    the ring, the chip, the chart and the badge everywhere at once
 *  · a particle bloom fires on Excellent (Effect 22)
 */

import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { BAND_COPY } from '@/lib/score'
import type { ScoreBand } from '@/lib/types'

const GRADIENTS: Record<ScoreBand, [string, string]> = {
  poor: ['#f04438', '#ff9c93'],
  ok: ['#f79009', '#ffd48a'],
  good: ['#12b76a', '#b6f09c'],
  excellent: ['#039855', '#6ce9a6'],
}

export function ScoreRing({
  score, size = 176, strokeWidth = 9, band, label, showBand = true, className,
}: {
  score: number
  size?: number
  strokeWidth?: number
  band: ScoreBand
  label?: string
  showBand?: boolean
  className?: string
}) {
  const reduced = useReducedMotion()
  const radius = (size - strokeWidth * 2) / 2 - 2
  const circumference = 2 * Math.PI * radius
  const id = `score-grad-${band}`

  const [animatedScore, setAnimatedScore] = useState(reduced ? score : 0)
  const hostRef = useRef<HTMLDivElement>(null)
  const bloomed = useRef(false)

  // Count the number up in step with the arc.
  useEffect(() => {
    if (reduced) { setAnimatedScore(score); return }
    let raf = 0
    let t0 = 0
    const from = animatedScore
    const easeOut = (t: number) => 1 - Math.pow(2, -10 * t)
    const tick = (now: number) => {
      if (!t0) t0 = now
      const p = Math.min((now - t0) / 1100, 1)
      setAnimatedScore(Math.round(from + (score - from) * easeOut(p)))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [score, reduced])

  // Effect 22 — one bloom per mount when the score is Excellent.
  useEffect(() => {
    if (reduced || band !== 'excellent' || bloomed.current) return
    const host = hostRef.current
    if (!host) return
    bloomed.current = true
    const colors = ['#12b76a', '#b6f09c', '#7a5af8', '#ffb020']
    for (let i = 0; i < 30; i++) {
      const p = document.createElement('span')
      p.className = 'fx-confetti'
      p.style.left = `${size / 2}px`
      p.style.top = `${size / 2}px`
      p.style.background = colors[i % colors.length]
      p.style.setProperty('--dx', `${(Math.random() * 200 - 100).toFixed(0)}px`)
      p.style.setProperty('--dy', `${(Math.random() * -170 - 30).toFixed(0)}px`)
      p.style.setProperty('--rot', `${(Math.random() * 720).toFixed(0)}deg`)
      p.style.setProperty('--dur', `${(1100 + Math.random() * 700).toFixed(0)}ms`)
      host.appendChild(p)
      p.addEventListener('animationend', () => p.remove())
    }
  }, [band, reduced, size])

  const dashoffset = circumference * (1 - animatedScore / 100)
  const copy = BAND_COPY[band]

  return (
    <div
      ref={hostRef}
      className={cn('relative grid shrink-0 place-items-center', className)}
      style={{ width: size, height: size, ['--score-current' as string]: copy.token }}
    >
      <svg className="absolute inset-0 -rotate-90" viewBox={`0 0 ${size} ${size}`} role="img"
        aria-label={`Nutrition score ${score} out of 100 — ${copy.label}`}>
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={GRADIENTS[band][0]} />
            <stop offset="100%" stopColor={GRADIENTS[band][1]} />
          </linearGradient>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="var(--canvas-2)" strokeWidth={strokeWidth} />
        <circle
          className="fx-ring__value"
          cx={size / 2} cy={size / 2} r={radius} fill="none"
          stroke={`url(#${id})`} strokeWidth={strokeWidth}
          strokeDasharray={circumference} strokeDashoffset={dashoffset}
        />
      </svg>
      <div className="relative text-center leading-none">
        <div className="tabular font-bold tracking-[-.07em] text-ink-900"
          style={{ fontSize: size * 0.31 }}>
          {animatedScore}
        </div>
        {showBand && (
          <div className="mt-1.5 text-[10px] font-bold uppercase tracking-[.18em]" style={{ color: copy.token }}>
            {label ?? copy.label}
          </div>
        )}
      </div>
    </div>
  )
}

/** Small inline score chip for lists, rails and result cards. */
export function ScoreChip({ score, band, className }: { score: number; band: ScoreBand; className?: string }) {
  const copy = BAND_COPY[band]
  return (
    <span
      className={cn('inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold', className)}
      style={{ background: `color-mix(in oklab, ${copy.token} 14%, transparent)`, color: copy.token }}
    >
      <span className="size-1.5 rounded-full" style={{ background: copy.token }} aria-hidden />
      {score}
      <span className="font-semibold opacity-80">{copy.grade}</span>
    </span>
  )
}
