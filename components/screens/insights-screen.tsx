'use client'

/**
 * Insights. Effects: 39 animated area chart with crosshair · 40 donut bloom ·
 * 41 heatmap stagger · 19 count-up deltas · 26 range toggle · 31 typewriter.
 */

import { useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowDownRight, ArrowUpRight, Sparkles, TrendingUp } from 'lucide-react'
import { AppShell } from '@/components/app-shell'
import { CountUp, Reveal, Stagger, TiltCard, Typewriter } from '@/components/motion'
import { api } from '@/lib/api'
import { spring } from '@/lib/motion'
import { nf } from '@/lib/format'

type Range = 'week' | 'month'

interface InsightsData {
  week: { day: string; score: number; kcal: number; fiber: number; sugar: number }[]
  streak: number
  nutrientOfWeek: { name: string; headline: string; copy: string }
  goals: { label: string; value: number; target: number; unit: string }[]
  heatmap: { day: number; score: number }[]
  insight: string
  weekly: { delta: number; label: string }
}

export function InsightsScreen() {
  const [range, setRange] = useState<Range>('week')
  const [data, setData] = useState<InsightsData | null>(null)

  useEffect(() => {
    let cancelled = false
    api.getInsights().then((d) => { if (!cancelled) setData(d as InsightsData) })
    return () => { cancelled = true }
  }, [])

  const series = useMemo(() => {
    if (!data) return []
    return range === 'week' ? data.week : [...data.week, ...data.week, ...data.week, ...data.week].slice(0, 28)
  }, [data, range])

  return (
    <AppShell>
      <div className="container-ns pt-5">
        <Reveal className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.16em] text-brand-600">Your patterns</p>
            <h1 className="mt-1.5 text-[clamp(1.75rem,7vw,2.5rem)] font-bold tracking-[-.05em]">Insights</h1>
            <p className="mt-2 max-w-md text-sm leading-6 text-ink-500">
              Small scans build a picture of what actually works for you — not what works on average.
            </p>
          </div>
          <div className="fx-seg" role="group" aria-label="Time range">
            {(['week', 'month'] as Range[]).map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                aria-pressed={range === r}
                className={`fx-seg__item press relative z-10 min-h-9 rounded-full px-3.5 text-xs font-bold capitalize transition-colors ${
                  range === r ? 'text-ink-900' : 'text-ink-500'
                }`}
              >
                {r}
                {range === r && (
                  <motion.span layoutId="range-pill" transition={spring.layout} className="absolute inset-0 -z-10 rounded-full bg-surface shadow-soft" />
                )}
              </button>
            ))}
          </div>
        </Reveal>

        {!data ? (
          <div className="mt-6 space-y-3">
            <div className="skeleton h-56 w-full rounded-[26px]" />
            <div className="grid grid-cols-2 gap-3">
              <div className="skeleton h-32 rounded-2xl" />
              <div className="skeleton h-32 rounded-2xl" />
            </div>
          </div>
        ) : (
          <>
            {/* Summary */}
            <Stagger className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { label: 'Average score', value: 77, delta: data.weekly.delta },
                { label: 'Days logged', value: 26, suffix: ' of 28' },
                { label: 'Current streak', value: data.streak, suffix: ' days' },
                { label: 'Fiber / day', value: 21, suffix: 'g' },
              ].map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-line bg-surface p-4">
                  <p className="text-xs font-medium text-ink-500">{stat.label}</p>
                  <p className="tabular mt-1.5 text-xl font-bold text-ink-900">
                    <CountUp value={stat.value} />{stat.suffix && <span className="text-xs font-medium text-ink-300">{stat.suffix}</span>}
                  </p>
                  {typeof stat.delta === 'number' && (
                    <p className={`mt-1 inline-flex items-center gap-1 text-[11px] font-bold ${stat.delta >= 0 ? 'text-brand-600' : 'text-score-danger'}`}>
                      {stat.delta >= 0 ? <ArrowUpRight className="size-3" aria-hidden /> : <ArrowDownRight className="size-3" aria-hidden />}
                      {stat.delta > 0 ? '+' : ''}{stat.delta} this week
                    </p>
                  )}
                </div>
              ))}
            </Stagger>

            {/* Score history */}
            <Reveal className="mt-6">
              <ScoreChart series={series} range={range} />
            </Reveal>

            {/* Nutrient of the week */}
            <Reveal className="mt-6">
              <TiltCard className="rounded-[26px] bg-brand-900 p-6 text-white">
                <div className="flex items-center gap-2">
                  <span className="grid size-8 place-items-center rounded-xl bg-white/10 text-lime-accent">
                    <Sparkles className="size-4" aria-hidden />
                  </span>
                  <p className="text-xs font-bold uppercase tracking-[.16em] text-brand-300">
                    Nutrient of the week · {data.nutrientOfWeek.name}
                  </p>
                </div>
                <h2 className="mt-4 text-xl font-bold text-white">{data.nutrientOfWeek.headline}</h2>
                <Typewriter text={data.nutrientOfWeek.copy} className="mt-2 max-w-[560px] text-sm leading-6 text-[#a9c2b5]" />
              </TiltCard>
            </Reveal>

            {/* Goal rings */}
            <section className="mt-6">
              <h2 className="text-lg font-bold text-ink-900">Goal completion</h2>
              <Stagger className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {data.goals.map((goal) => (
                  <div key={goal.label} className="rounded-[24px] border border-line bg-surface p-4 text-center">
                    <MiniRing value={goal.value} target={goal.target} />
                    <p className="mt-3 text-xs font-semibold text-ink-900">{goal.label}</p>
                    <p className="tabular mt-0.5 text-[11px] text-ink-500">
                      {nf(goal.value)} / {nf(goal.target)} {goal.unit}
                    </p>
                  </div>
                ))}
              </Stagger>
            </section>

            {/* Heatmap */}
            <section className="mt-6">
              <h2 className="text-lg font-bold text-ink-900">Four week consistency</h2>
              <p className="mt-1 text-sm text-ink-500">Darker means a higher average score that day.</p>
              <div className="mt-4 grid grid-cols-7 gap-1.5">
                {data.heatmap.map((cell, i) => (
                  <span
                    key={cell.day}
                    className="fx-heatmap__cell aspect-square rounded-md"
                    style={{
                      ['--i' as string]: i,
                      background: cell.score === 0 ? 'var(--canvas-2)'
                        : cell.score >= 85 ? 'var(--score-great)'
                          : cell.score >= 70 ? 'var(--score-good)'
                            : cell.score >= 40 ? 'var(--score-warn)' : 'var(--score-danger)',
                      opacity: cell.score === 0 ? 1 : 0.55 + (cell.score / 200),
                    }}
                    title={`Day ${cell.day + 1}: ${cell.score || 'no data'}`}
                  />
                ))}
              </div>
            </section>

            {/* Coach summary */}
            <Reveal className="mt-6 mb-4">
              <div className="rounded-[26px] border border-line bg-surface p-5">
                <div className="flex items-center gap-2">
                  <TrendingUp className="size-4 text-berry" aria-hidden />
                  <h2 className="text-base font-bold text-ink-900">What we are seeing</h2>
                </div>
                <Typewriter text={data.insight} className="mt-3 text-sm leading-6 text-ink-700" />
                <p className="mt-4 text-xs text-ink-300">
                  Generated from your logged scans. Educational only — not medical advice.
                </p>
              </div>
            </Reveal>
          </>
        )}
      </div>
    </AppShell>
  )
}

/* ── Effect 39 — area chart drawn on view, with a drag crosshair ───────── */
function ScoreChart({ series, range }: { series: { day: string; score: number }[]; range: Range }) {
  const [hover, setHover] = useState<number | null>(null)
  const svgRef = useRef<SVGSVGElement>(null)

  const W = 320
  const H = 140
  const pad = 8

  const points = useMemo(() => {
    if (!series.length) return []
    const max = 100
    return series.map((d, i) => ({
      x: pad + (i / Math.max(1, series.length - 1)) * (W - pad * 2),
      y: H - pad - (d.score / max) * (H - pad * 2),
      ...d,
    }))
  }, [series])

  const line = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ')
  const area = `${line} L ${points.at(-1)?.x ?? 0} ${H - pad} L ${points[0]?.x ?? 0} ${H - pad} Z`

  const handleMove = (e: React.PointerEvent) => {
    const el = svgRef.current
    if (!el || !points.length) return
    const rect = el.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * W
    let nearest = 0
    let best = Infinity
    points.forEach((p, i) => {
      const d = Math.abs(p.x - x)
      if (d < best) { best = d; nearest = i }
    })
    setHover(nearest)
  }

  const active = hover != null ? points[hover] : null
  const first = points[0]?.score ?? 0
  const last = points.at(-1)?.score ?? 0
  const trend = last - first

  return (
    <div className="rounded-[26px] border border-line bg-surface p-5">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-base font-bold text-ink-900">Score history</h2>
          <p className="mt-0.5 text-xs text-ink-500">
            {range === 'week' ? 'Last seven days' : 'Last twenty eight days'} · drag across to inspect
          </p>
        </div>
        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${trend >= 0 ? 'bg-brand-500/14 text-brand-700' : 'bg-score-danger/14 text-score-danger'}`}>
          {trend >= 0 ? <ArrowUpRight className="size-3" aria-hidden /> : <ArrowDownRight className="size-3" aria-hidden />}
          {trend > 0 ? '+' : ''}{trend} pts
        </span>
      </div>

      <div className="relative mt-4">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${W} ${H}`}
          className="w-full touch-none"
          role="img"
          aria-label={`Score history, from ${first} to ${last} out of 100`}
          onPointerMove={handleMove}
          onPointerLeave={() => setHover(null)}
        >
          <defs>
            <linearGradient id="insights-area" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--brand-500)" stopOpacity="0.28" />
              <stop offset="100%" stopColor="var(--brand-500)" stopOpacity="0" />
            </linearGradient>
          </defs>

          {[25, 50, 75].map((g) => (
            <line key={g} x1={pad} x2={W - pad} y1={H - pad - (g / 100) * (H - pad * 2)} y2={H - pad - (g / 100) * (H - pad * 2)}
              stroke="var(--line)" strokeWidth="1" strokeDasharray="3 5" />
          ))}

          <motion.path
            d={area}
            fill="url(#insights-area)"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.5 }}
          />
          <motion.path
            d={line}
            fill="none"
            stroke="var(--brand-500)"
            strokeWidth="2.5"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          />

          {points.map((p, i) => (
            <circle
              key={i}
              cx={p.x}
              cy={p.y}
              r={hover === i ? 5 : 3}
              fill="var(--surface)"
              stroke="var(--brand-500)"
              strokeWidth="2"
              className="transition-all duration-200"
            />
          ))}

          {active && (
            <>
              <line x1={active.x} x2={active.x} y1={pad} y2={H - pad} stroke="var(--brand-500)" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
              <circle cx={active.x} cy={active.y} r="9" fill="var(--brand-500)" opacity="0.18" />
            </>
          )}
        </svg>

        {active && (
          <div
            className="glass pointer-events-none absolute -translate-x-1/2 rounded-xl px-3 py-2 text-center shadow-float"
            style={{ left: `${(active.x / W) * 100}%`, top: `${Math.max(0, (active.y / H) * 100 - 26)}%` }}
          >
            <div className="tabular text-sm font-bold text-ink-900">{active.score}</div>
            <div className="text-[10px] font-semibold text-ink-500">{active.day}</div>
          </div>
        )}
      </div>
    </div>
  )
}

/* ── Effect 40 — donut bloom for goal completion ──────────────────────── */
function MiniRing({ value, target }: { value: number; target: number }) {
  const pct = Math.min(100, (value / target) * 100)
  const R = 26
  const C = 2 * Math.PI * R

  return (
    <div className="relative mx-auto grid size-[68px] place-items-center">
      <svg viewBox="0 0 64 64" className="absolute inset-0 -rotate-90" aria-hidden>
        <circle cx="32" cy="32" r={R} fill="none" stroke="var(--canvas-2)" strokeWidth="6" />
        <motion.circle
          cx="32" cy="32" r={R}
          fill="none"
          stroke={pct >= 100 ? 'var(--score-great)' : pct >= 60 ? 'var(--brand-500)' : 'var(--score-warn)'}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={C}
          initial={{ strokeDashoffset: C }}
          whileInView={{ strokeDashoffset: C * (1 - pct / 100) }}
          viewport={{ once: true }}
          transition={{ duration: 1.1, ease: [0.22, 1.12, 0.36, 1] }}
        />
      </svg>
      <span className="tabular text-sm font-bold text-ink-900">{Math.round(pct)}%</span>
    </div>
  )
}
