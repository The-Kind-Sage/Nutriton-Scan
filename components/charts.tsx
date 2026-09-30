'use client'

/**
 * Chart primitives. Hand-built SVG rather than a charting library: they are
 * smaller, they animate the way the rest of the app animates, and they inherit
 * the design tokens directly.
 *
 * Effects: 19 count-up · 20 ring draw · 21 path draw-on · 39 crosshair ·
 * 40 donut bloom · 41 bar stagger.
 */

import { useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { nf } from '@/lib/format'

/* ── Bar chart with staggered grow + tap-to-inspect ──────────────────── */
export function BarChart({
  data, valueKey, labelKey, goal, unit = '', height = 132, colorFor, className,
}: {
  data: Record<string, unknown>[]
  valueKey: string
  labelKey: string
  goal?: number
  unit?: string
  height?: number
  colorFor?: (value: number, index: number) => string
  className?: string
}) {
  const [active, setActive] = useState<number | null>(null)
  const values = data.map((d) => Number(d[valueKey]) || 0)
  const max = Math.max(goal ?? 0, ...values, 1)

  return (
    <div className={cn('relative', className)}>
      <div className="flex items-end gap-1.5" style={{ height }}>
        {data.map((d, i) => {
          const value = values[i]
          /* A zero day is real data — it means nothing was logged — so it gets a
             faint stub rather than no bar at all, which would read as broken. */
          const empty = value === 0
          const h = empty ? 3 : Math.max(4, (value / max) * height)
          const color = empty ? 'var(--line-strong)' : colorFor?.(value, i) ?? 'var(--brand-500)'
          const isActive = active === i
          return (
            <button
              key={`${String(d[labelKey])}-${i}`}
              onPointerEnter={() => setActive(i)}
              onPointerLeave={() => setActive(null)}
              onFocus={() => setActive(i)}
              onBlur={() => setActive(null)}
              className="group relative flex flex-1 flex-col items-center justify-end outline-none"
              style={{ height: '100%' }}
              aria-label={empty ? `${String(d[labelKey])}: nothing logged` : `${String(d[labelKey])}: ${nf(value)}${unit}`}
            >
              <motion.span
                initial={{ height: 0 }}
                whileInView={{ height: h }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: i * 0.05 }}
                className="w-full rounded-t-lg transition-opacity"
                style={{ background: color, opacity: isActive ? 1 : 0.82, maxWidth: 34 }}
              />
            </button>
          )
        })}
      </div>

      {/* Goal line */}
      {goal != null && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 border-t border-dashed border-ink-300/50"
          style={{ bottom: `${(goal / max) * height}px` }}
        />
      )}

      <div className="mt-2 flex gap-1.5">
        {data.map((d, i) => (
          <span key={`l-${i}`} className={cn('flex-1 text-center text-[10px] font-semibold transition-colors',
            active === i ? 'text-ink-900' : 'text-ink-300')}>
            {String(d[labelKey])}
          </span>
        ))}
      </div>

      {active != null && (
        <div className="pointer-events-none absolute -top-1 left-1/2 -translate-x-1/2 rounded-xl bg-ink-900 px-2.5 py-1.5 text-center shadow-lg">
          <div className="tabular text-xs font-bold text-white">{nf(values[active])}{unit}</div>
          <div className="text-[9px] font-semibold text-white/60">{String(data[active][labelKey])}</div>
        </div>
      )}
    </div>
  )
}

/* ── Line chart with animated draw + drag crosshair (Effect 39) ──────── */
export function LineChart({
  data, valueKey, labelKey, height = 150, unit = '', band, className,
}: {
  data: Record<string, unknown>[]
  valueKey: string
  labelKey: string
  height?: number
  unit?: string
  /** Optional target band drawn behind the line. */
  band?: { low: number; high: number; label: string }
  className?: string
}) {
  const [active, setActive] = useState<number | null>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const W = 340
  const pad = 6

  const values = data.map((d) => Number(d[valueKey]) || 0)
  const min = Math.min(...values, band?.low ?? Infinity)
  const max = Math.max(...values, band?.high ?? -Infinity)
  const span = max - min || 1
  const yFor = (v: number) => height - pad - ((v - min) / span) * (height - pad * 2)
  const xFor = (i: number) => pad + (i / Math.max(1, data.length - 1)) * (W - pad * 2)

  const points = useMemo(
    () => values.map((v, i) => ({ x: xFor(i), y: yFor(v), value: v, label: String(data[i][labelKey]) })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data],
  )

  const line = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ')
  const area = `${line} L ${points.at(-1)?.x ?? 0} ${height - pad} L ${points[0]?.x ?? 0} ${height - pad} Z`
  const activePoint = active != null ? points[active] : null

  const onMove = (e: React.PointerEvent) => {
    const el = svgRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * W
    let nearest = 0
    let best = Infinity
    points.forEach((p, i) => {
      const d = Math.abs(p.x - x)
      if (d < best) { best = d; nearest = i }
    })
    setActive(nearest)
  }

  return (
    <div className={cn('relative', className)}>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${height}`}
        className="w-full touch-none"
        role="img"
        aria-label={`${String(valueKey)} from ${nf(values[0] ?? 0)} to ${nf(values.at(-1) ?? 0)} ${unit}`}
        onPointerMove={onMove}
        onPointerDown={onMove}
        onPointerLeave={() => setActive(null)}
      >
        <defs>
          <linearGradient id={`lc-${valueKey}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--brand-500)" stopOpacity="0.26" />
            <stop offset="100%" stopColor="var(--brand-500)" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Target band */}
        {band && (
          <>
            <rect
              x={pad} y={yFor(band.high)}
              width={W - pad * 2}
              height={Math.max(2, yFor(band.low) - yFor(band.high))}
              fill="var(--brand-500)" opacity="0.08"
            />
            <text x={W - pad} y={yFor(band.high) - 4} textAnchor="end" fontSize="8" fill="var(--ink-300)" fontWeight="700">
              {band.label}
            </text>
          </>
        )}

        <motion.path d={area} fill={`url(#lc-${valueKey})`}
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }} />

        <motion.path d={line} fill="none" stroke="var(--brand-500)" strokeWidth="2.5" strokeLinecap="round"
          initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }} />

        {activePoint && (
          <>
            <line x1={activePoint.x} x2={activePoint.x} y1={pad} y2={height - pad}
              stroke="var(--brand-500)" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
            <circle cx={activePoint.x} cy={activePoint.y} r="9" fill="var(--brand-500)" opacity="0.16" />
            <circle cx={activePoint.x} cy={activePoint.y} r="4" fill="var(--surface)" stroke="var(--brand-500)" strokeWidth="2.5" />
          </>
        )}

        {/* Latest point gets a permanent marker */}
        {!activePoint && points.length > 1 && (
          <circle cx={points.at(-1)!.x} cy={points.at(-1)!.y} r="4"
            fill="var(--surface)" stroke="var(--brand-500)" strokeWidth="2.5" />
        )}
      </svg>

      {activePoint && (
        <div
          className="pointer-events-none absolute -translate-x-1/2 rounded-xl bg-ink-900 px-2.5 py-1.5 text-center shadow-lg"
          style={{ left: `${(activePoint.x / W) * 100}%`, top: 0 }}
        >
          <div className="tabular text-xs font-bold text-white">{nf(activePoint.value, 1)}{unit}</div>
          <div className="text-[9px] font-semibold text-white/60">{activePoint.label}</div>
        </div>
      )}
    </div>
  )
}

/* ── Donut (Effect 40) ───────────────────────────────────────────────── */
export function Donut({
  segments, size = 132, thickness = 14, center, className,
}: {
  segments: { label: string; value: number; color: string; unit?: string }[]
  size?: number
  thickness?: number
  center?: { value: string; label: string }
  className?: string
}) {
  const R = (size - thickness) / 2 - 2
  const C = 2 * Math.PI * R
  const total = segments.reduce((s, x) => s + x.value, 0) || 1
  let cursor = 0

  return (
    <div className={cn('relative grid shrink-0 place-items-center', className)} style={{ width: size, height: size }}>
      <svg viewBox={`0 0 ${size} ${size}`} className="absolute inset-0 -rotate-90" aria-hidden>
        <circle cx={size / 2} cy={size / 2} r={R} fill="none" stroke="var(--canvas-2)" strokeWidth={thickness} />
        {segments.map((seg, i) => {
          const len = (seg.value / total) * C
          const offset = cursor
          cursor += len
          return (
            <motion.circle
              key={seg.label}
              cx={size / 2} cy={size / 2} r={R}
              fill="none"
              stroke={seg.color}
              strokeWidth={thickness}
              strokeLinecap="round"
              strokeDasharray={`${Math.max(0, len - 3)} ${C}`}
              initial={{ strokeDashoffset: C }}
              whileInView={{ strokeDashoffset: -offset }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease: [0.22, 1.12, 0.36, 1], delay: i * 0.09 }}
            />
          )
        })}
      </svg>
      {center && (
        <div className="relative text-center">
          <div className="tabular text-xl font-bold tracking-[-.04em] text-ink-900">{center.value}</div>
          <div className="text-[9px] font-bold uppercase tracking-[.16em] text-ink-300">{center.label}</div>
        </div>
      )}
    </div>
  )
}

/* ── Progress ring with count-up label ───────────────────────────────── */
export function ProgressRing({
  value, target, size = 92, thickness = 8, unit = '', label, color = 'var(--brand-500)',
}: {
  value: number; target: number; size?: number; thickness?: number; unit?: string; label?: string; color?: string
}) {
  const R = (size - thickness) / 2 - 1
  const C = 2 * Math.PI * R
  const pct = Math.min(100, (value / Math.max(1, target)) * 100)

  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      <svg viewBox={`0 0 ${size} ${size}`} className="absolute inset-0 -rotate-90" aria-hidden>
        <circle cx={size / 2} cy={size / 2} r={R} fill="none" stroke="var(--canvas-2)" strokeWidth={thickness} />
        <motion.circle
          cx={size / 2} cy={size / 2} r={R} fill="none" stroke={color} strokeWidth={thickness} strokeLinecap="round"
          strokeDasharray={C}
          initial={{ strokeDashoffset: C }}
          whileInView={{ strokeDashoffset: C * (1 - pct / 100) }}
          viewport={{ once: true }}
          transition={{ duration: 1.1, ease: [0.22, 1.12, 0.36, 1] }}
        />
      </svg>
      <div className="text-center leading-none">
        <div className="tabular font-bold tracking-[-.05em] text-ink-900" style={{ fontSize: size * 0.24 }}>
          {Math.round(pct)}%
        </div>
        {label && <div className="mt-0.5 text-[8px] font-bold uppercase tracking-[.14em] text-ink-300">{label}</div>}
        {unit && <div className="mt-0.5 text-[9px] text-ink-500">{nf(value)}/{nf(target)}{unit}</div>}
      </div>
    </div>
  )
}

/* ── Stacked macro bar ───────────────────────────────────────────────── */
export function MacroBar({
  protein, carbs, fat, className,
}: { protein: number; carbs: number; fat: number; className?: string }) {
  const total = Math.max(1, protein + carbs + fat)
  const parts = [
    { label: 'Carbs', value: carbs, color: 'var(--accent-sky)' },
    { label: 'Fat', value: fat, color: 'var(--accent-mango)' },
    { label: 'Protein', value: protein, color: 'var(--brand-500)' },
  ]
  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex h-2.5 overflow-hidden rounded-full bg-canvas-2">
        {parts.map((p, i) => (
          <motion.span
            key={p.label}
            initial={{ width: 0 }}
            whileInView={{ width: `${(p.value / total) * 100}%` }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: i * 0.08 }}
            style={{ background: p.color }}
          />
        ))}
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1">
        {parts.map((p) => (
          <span key={p.label} className="inline-flex items-center gap-1.5 text-[11px] text-ink-500">
            <span className="size-2 rounded-full" style={{ background: p.color }} aria-hidden />
            {p.label} <b className="tabular text-ink-900">{nf(p.value)}g</b>
          </span>
        ))}
      </div>
    </div>
  )
}

/* ── Heatmap (Effect 41) ─────────────────────────────────────────────── */
export function Heatmap({
  cells, columns = 7, className,
}: { cells: { label: string; value: number; max: number }[]; columns?: number; className?: string }) {
  return (
    <div className={cn('grid gap-1.5', className)} style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
      {cells.map((cell, i) => {
        const ratio = cell.max ? cell.value / cell.max : 0
        const bg = ratio === 0 ? 'var(--canvas-2)'
          : ratio >= 0.85 ? 'var(--score-great)'
            : ratio >= 0.6 ? 'var(--score-good)'
              : ratio >= 0.35 ? 'var(--score-warn)'
                : 'var(--score-danger)'
        return (
          <span
            key={`${cell.label}-${i}`}
            className="fx-heatmap__cell aspect-square rounded-md"
            style={{ ['--i' as string]: i, background: bg, opacity: ratio === 0 ? 1 : 0.55 + ratio * 0.45 }}
            title={`${cell.label}: ${nf(cell.value)}`}
          />
        )
      })}
    </div>
  )
}
