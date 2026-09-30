'use client'

/**
 * Weight, Fasting, Sleep and Glucose.
 *
 * These share one anatomy — headline stat, chart, log CTA, history — because
 * that pattern is genuinely the right one for a tracked metric. Each keeps its
 * own identity through colour, visualisation and copy rather than layout.
 *
 * Effects: 19 count-up · 20 rings · 21 path draw · 25 sheet · 26 segmented ·
 * 31 typewriter · 34 toast · 38 confetti · 39 crosshair · 41 heatmap · 42 wave.
 */

import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle, CircleDot, Info, Moon, Plus, Sparkles, Target } from 'lucide-react'
import { AppShell } from '@/components/app-shell'
import { CountUp, Reveal, Stagger } from '@/components/motion'
import { BarChart, Heatmap, LineChart, ProgressRing } from '@/components/charts'
import { Card, Disclosure, ScreenIntro, Segmented, Sheet } from '@/components/ui-kit'
import { toast } from '@/components/toast'
import { cn } from '@/lib/utils'
import { clock, shortDay } from '@/lib/format'
import {
  FASTING, GLUCOSE, SLEEP, WEIGHT,
  WEIGHT_CURRENT, WEIGHT_START, WEIGHT_TARGET,
} from '@/lib/data/health'

/* ══════════════════════════════════════════════════════════════════════
   WEIGHT
   ═════════════════════════════════════════════════════════════════════ */
export function WeightScreen() {
  const [range, setRange] = useState<'30' | '90' | 'all'>('30')
  const [logOpen, setLogOpen] = useState(false)
  const [kg, setKg] = useState(WEIGHT_CURRENT)

  const series = useMemo(() => {
    const n = 28
    return WEIGHT.slice(-n).map((w) => ({ day: shortDay(w.day).slice(0, 6), value: w.kg }))
  }, [range])

  const change = WEIGHT_CURRENT - WEIGHT_START
  const toGoal = WEIGHT_CURRENT - WEIGHT_TARGET
  const pctToGoal = Math.round(((WEIGHT_START - WEIGHT_CURRENT) / Math.max(0.1, WEIGHT_START - WEIGHT_TARGET)) * 100)

  return (
    <AppShell title="Weight" back={{ href: '/app/more', label: 'More' }}>
      <div className="container-ns pt-4">
        <ScreenIntro
          eyebrow="Weight"
          title="Down 4.2 kg in eight weeks."
          copy="Steady, unremarkable, and exactly what works. The plateaus in weeks three and five are normal — the trend is what matters."
          action={
            <button onClick={() => setLogOpen(true)}
              className="press shrink-0 rounded-full bg-brand-600 px-4 py-2.5 text-xs font-bold text-white">
              <Plus className="mr-1 inline size-3.5" aria-hidden /> Log
            </button>
          }
        />

        {/* Headline */}
        <Reveal variant="scale" className="mt-5">
          <Card className="relative overflow-hidden p-5">
            <div className="flex flex-col items-center gap-6 sm:flex-row sm:gap-8">
              <ProgressRing
                value={Math.max(0, WEIGHT_START - WEIGHT_CURRENT)}
                target={Math.max(0.1, WEIGHT_START - WEIGHT_TARGET)}
                size={132} thickness={12} label="to goal" color="var(--brand-500)"
              />
              <div className="w-full min-w-0">
                <p className="text-xs font-bold uppercase tracking-[.16em] text-ink-500">Current</p>
                <p className="tabular mt-1 text-[clamp(2.25rem,9vw,3rem)] font-bold tracking-[-.06em] text-ink-900">
                  <CountUp value={WEIGHT_CURRENT} decimals={1} />
                  <span className="ml-1.5 text-base font-semibold text-ink-300">kg</span>
                </p>
                <div className="mt-4 grid grid-cols-3 gap-2">
                  {[
                    { label: 'Start', value: WEIGHT_START.toFixed(1) },
                    { label: 'Change', value: `${change >= 0 ? '+' : ''}${change.toFixed(1)}`, tone: 'text-brand-600' },
                    { label: 'To goal', value: toGoal.toFixed(1) },
                  ].map((s) => (
                    <div key={s.label} className="rounded-xl bg-canvas-2 p-3">
                      <p className="text-[10px] font-medium text-ink-500">{s.label}</p>
                      <p className={cn('tabular mt-0.5 text-sm font-bold', s.tone ?? 'text-ink-900')}>{s.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-5 flex items-center gap-3 rounded-2xl bg-brand-50 p-4">
              <Target className="size-4 shrink-0 text-brand-700" aria-hidden />
              <p className="text-xs leading-5 text-ink-700">
                <b>{pctToGoal}% of the way to {WEIGHT_TARGET} kg.</b> You are losing about 0.35 kg a week —
                a rate that keeps muscle on. Faster is not better.
              </p>
            </div>
          </Card>
        </Reveal>

        {/* Trend */}
        <Reveal delay={60} className="mt-3">
          <Card className="p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-ink-900">Trend</h2>
                <p className="mt-0.5 text-xs text-ink-500">Tap or drag across the line</p>
              </div>
              <div className="shrink-0">
                <Segmented
                  label="Weight range"
                  size="sm"
                  options={[{ id: '30', label: '30d' }, { id: '90', label: '90d' }, { id: 'all', label: 'All' }]}
                  value={range}
                  onChange={setRange}
                />
              </div>
            </div>
            <LineChart
              className="mt-4"
              data={series}
              valueKey="value"
              labelKey="day"
              unit=" kg"
              height={168}
              band={{ low: WEIGHT_TARGET - 1, high: WEIGHT_TARGET + 1, label: `Target ${WEIGHT_TARGET} kg` }}
            />
          </Card>
        </Reveal>

        {/* History */}
        <Reveal delay={80} className="mt-3">
          <Card className="p-5">
            <h2 className="text-base font-bold text-ink-900">Recent entries</h2>
            <ul className="mt-4 divide-y divide-line">
              {[...WEIGHT].reverse().slice(0, 8).map((entry, i, arr) => {
                const prev = arr[i + 1]
                const diff = prev ? entry.kg - prev.kg : 0
                return (
                  <li key={entry.day} className="flex items-center justify-between py-2.5">
                    <span className="text-sm text-ink-700">{shortDay(entry.day)}</span>
                    <span className="flex items-center gap-3">
                      {diff !== 0 && (
                        <span className={cn('tabular text-[11px] font-bold', diff < 0 ? 'text-brand-600' : 'text-citrus-text')}>
                          {diff > 0 ? '+' : ''}{diff.toFixed(1)}
                        </span>
                      )}
                      <span className="tabular text-sm font-bold text-ink-900">{entry.kg.toFixed(1)} kg</span>
                    </span>
                  </li>
                )
              })}
            </ul>
          </Card>
        </Reveal>

        <Reveal delay={100} className="mt-3">
          <Card className="p-5">
            <Disclosure question="How we calculate your rate" defaultOpen={false}>
              We use a rolling seven day average rather than day-to-day readings. Weight swings 1–2 kg
              on water, salt and glycogen alone, so a single reading tells you almost nothing. The trend
              line is a three-day weighted average.
            </Disclosure>
            <Disclosure question="Why plateaus are expected" defaultOpen={false}>
              Fat loss rarely moves in a straight line. Weeks where the number barely moves usually
              follow a high-sodium day or a hard training session. Keep logging and the line catches up.
            </Disclosure>
          </Card>
        </Reveal>
      </div>

      <Sheet open={logOpen} onClose={() => setLogOpen(false)} title="Log weight">
        <div className="rounded-2xl border border-line bg-canvas-2 p-6 text-center">
          <p className="text-xs font-bold uppercase tracking-[.16em] text-ink-500">Today&apos;s weight</p>
          <div className="mt-3 flex items-center justify-center gap-4">
            <button onClick={() => setKg((v) => +(v - 0.1).toFixed(1))} aria-label="Decrease 100 grams"
              className="press grid size-11 place-items-center rounded-full border border-line bg-surface text-xl font-bold text-ink-700">−</button>
            <span className="tabular min-w-[130px] text-4xl font-bold tracking-[-.06em] text-ink-900">{kg.toFixed(1)}</span>
            <button onClick={() => setKg((v) => +(v + 0.1).toFixed(1))} aria-label="Increase 100 grams"
              className="press grid size-11 place-items-center rounded-full border border-line bg-surface text-xl font-bold text-ink-700">+</button>
          </div>
        </div>
        <button
          onClick={() => { toast(`${kg.toFixed(1)} kg logged`, 'success'); setLogOpen(false) }}
          className="press mt-4 w-full rounded-full bg-brand-600 py-3.5 text-sm font-bold text-white"
        >
          Save
        </button>
      </Sheet>
    </AppShell>
  )
}

/* ══════════════════════════════════════════════════════════════════════
   FASTING — the flagship of the secondary screens
   ═════════════════════════════════════════════════════════════════════ */
export function FastingScreen() {
  const [plan, setPlan] = useState<'14:10' | '16:8' | '18:6' | '20:4'>('16:8')
  const [phase, setPhase] = useState<'idle' | 'fasting'>('fasting')
  const [hoursIn, setHoursIn] = useState(11.4)

  const target = Number(plan.split(':')[0])
  const pct = Math.min(100, Math.round((hoursIn / target) * 100))
  const remaining = Math.max(0, target - hoursIn)
  const completed = FASTING.filter((f) => f.completed).length

  /* The projected end time is clock-dependent, so it is computed after mount
     only. Rendering it on the server produced a hydration mismatch (React #418)
     because the server clock and the phone clock disagree by seconds. */
  const [endTime, setEndTime] = useState<string | null>(null)
  useEffect(() => {
    const d = new Date()
    d.setHours(d.getHours() + Math.floor(remaining))
    d.setMinutes(d.getMinutes() + Math.round((remaining % 1) * 60))
    setEndTime(clock(d))
  }, [remaining])

  return (
    <AppShell title="Intermittent fasting" back={{ href: '/app/more', label: 'More' }}>
      <div className="container-ns pt-4">
        <ScreenIntro
          eyebrow="Intermittent fasting"
          title={`You are ${Math.floor(hoursIn)} hours into a ${target} hour fast.`}
          copy={`${endTime ? `Eating window opens around ${endTime}. ` : ''}Fasting is not for everyone — if you are pregnant, managing diabetes on medication, or have a history of disordered eating, talk to your clinician first.`}
        />

        {/* Live timer */}
        <Reveal variant="scale" className="mt-5">
          <Card className="relative overflow-hidden p-6">
            <div aria-hidden className="absolute -right-20 -top-20 size-56 rounded-full bg-berry/10 blur-3xl" />
            <div className="relative flex flex-col items-center">
              <div className="relative grid size-[220px] place-items-center">
                <svg viewBox="0 0 220 220" className="absolute inset-0 -rotate-90" aria-hidden>
                  <circle cx="110" cy="110" r="98" fill="none" stroke="var(--canvas-2)" strokeWidth="12" />
                  <defs>
                    <linearGradient id="fast-grad" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#7a5af8" />
                      <stop offset="100%" stopColor="#12b76a" />
                    </linearGradient>
                  </defs>
                  <motion.circle
                    cx="110" cy="110" r="98" fill="none" stroke="url(#fast-grad)" strokeWidth="12" strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 98}
                    animate={{ strokeDashoffset: 2 * Math.PI * 98 * (1 - pct / 100) }}
                    transition={{ duration: 1.1, ease: [0.22, 1.12, 0.36, 1] }}
                  />
                </svg>
                <div className="text-center">
                  <p className="text-[10px] font-bold uppercase tracking-[.2em] text-ink-300">
                    {phase === 'fasting' ? 'Fasting' : 'Eating window'}
                  </p>
                  <p className="tabular mt-1 text-[3.25rem] font-bold leading-none tracking-[-.06em] text-ink-900">
                    {Math.floor(hoursIn)}<span className="text-2xl">h</span> {Math.round((hoursIn % 1) * 60)}<span className="text-2xl">m</span>
                  </p>
                  <p className="tabular mt-2 text-xs font-semibold text-berry">
                    {pct}% of {plan}
                  </p>
                </div>
              </div>

              <div className="mt-5 w-full max-w-sm rounded-2xl bg-canvas-2 p-4 text-center">
                <p className="text-xs text-ink-500">
                  {remaining > 0
                    ? <>Eating window opens in <b className="tabular text-ink-900">{Math.floor(remaining)}h {Math.round((remaining % 1) * 60)}m</b>{endTime ? <> — about {endTime}</> : null}</>
                    : <>Goal reached. You can eat whenever you are ready.</>}
                </p>
              </div>

              <div className="mt-4 flex w-full max-w-sm gap-2">
                <button
                  onClick={() => {
                    if (phase === 'fasting') { setPhase('idle'); toast('Fast ended — eating window open', 'info') }
                    else { setPhase('fasting'); setHoursIn(0); toast('Fast started', 'success') }
                  }}
                  className={cn('press flex-1 rounded-full py-3.5 text-sm font-bold text-white',
                    phase === 'fasting' ? 'bg-ink-900' : 'bg-berry')}
                >
                  {phase === 'fasting' ? 'End fast' : 'Start fasting'}
                </button>
                <button
                  onClick={() => { setHoursIn((h) => +(h + 0.5).toFixed(1)); toast('+30 minutes added', 'info') }}
                  className="press rounded-full border border-line bg-surface px-5 text-sm font-bold text-ink-700"
                >
                  +30m
                </button>
              </div>
            </div>
          </Card>
        </Reveal>

        {/* Plan switcher */}
        <Reveal delay={60} className="mt-3">
          <Card className="p-5">
            <h2 className="text-base font-bold text-ink-900">Your plan</h2>
            <p className="mt-0.5 text-xs text-ink-500">16:8 is the most studied and the easiest to keep. Change whenever you like.</p>
            <div className="mt-4 grid grid-cols-4 gap-2">
              {(['14:10', '16:8', '18:6', '20:4'] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setPlan(p)}
                  aria-pressed={plan === p}
                  className={cn(
                    'press rounded-2xl border py-3.5 text-center transition-colors',
                    plan === p ? 'border-berry bg-berry/10' : 'border-line bg-surface',
                  )}
                >
                  <span className={cn('tabular block text-base font-bold', plan === p ? 'text-berry' : 'text-ink-900')}>{p}</span>
                  <span className="mt-0.5 block text-[10px] text-ink-500">
                    {p === '14:10' ? 'Gentle' : p === '16:8' ? 'Standard' : p === '18:6' ? 'Strict' : 'Advanced'}
                  </span>
                </button>
              ))}
            </div>
            <div className="mt-4 flex items-start gap-3 rounded-2xl bg-canvas-2 p-4">
              <Info className="mt-0.5 size-4 shrink-0 text-ink-500" aria-hidden />
              <p className="text-xs leading-5 text-ink-500">
                Longer is not automatically better. Most of the metabolic benefit in the research shows up
                between 14 and 18 hours. Beyond 20, the risk of muscle loss and poor sleep climbs.
              </p>
            </div>
          </Card>
        </Reveal>

        {/* History */}
        <Reveal delay={80} className="mt-3">
          <Card className="p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-ink-900">Last 14 days</h2>
              <span className="tabular rounded-full bg-berry/12 px-3 py-1.5 text-xs font-bold text-berry">
                {completed} of 14 completed
              </span>
            </div>
            <BarChart
              className="mt-5"
              data={FASTING.map((f) => ({ day: shortDay(f.day).split(' ')[0].slice(0, 1), hours: f.hours }))}
              valueKey="hours"
              labelKey="day"
              goal={target}
              unit="h"
              height={110}
              colorFor={(v) => v >= target ? 'var(--accent-berry)' : 'var(--brand-300)'}
            />
            <Heatmap className="mt-5" columns={7} cells={FASTING.map((f) => ({ label: shortDay(f.day), value: f.completed ? f.hours : 0, max: target }))} />
          </Card>
        </Reveal>
      </div>
    </AppShell>
  )
}

/* ══════════════════════════════════════════════════════════════════════
   SLEEP
   ═════════════════════════════════════════════════════════════════════ */
export function SleepScreen() {
  const avgHours = SLEEP.reduce((s, x) => s + x.hours, 0) / SLEEP.length
  const avgQuality = Math.round(SLEEP.reduce((s, x) => s + x.quality, 0) / SLEEP.length)
  const best = SLEEP.reduce((a, b) => (b.quality > a.quality ? b : a))

  return (
    <AppShell title="Sleep" back={{ href: '/app/more', label: 'More' }}>
      <div className="container-ns pt-4">
        <ScreenIntro
          eyebrow="Sleep"
          title="You sleep 7.0 hours on average."
          copy="Short by about an hour against what most adults need. The pattern is consistent: late nights, not early mornings, are what cost you."
        />

        <Stagger className="mt-5 grid grid-cols-3 gap-3">
          {[
            { label: 'Avg sleep', value: avgHours.toFixed(1), unit: 'h', tone: 'text-berry' },
            { label: 'Avg quality', value: `${avgQuality}`, unit: '/100' },
            { label: 'Best night', value: best.hours.toFixed(1), unit: 'h', tone: 'text-brand-600' },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl border border-line bg-surface p-4">
              <p className="text-[11px] font-medium text-ink-500">{s.label}</p>
              <p className={cn('tabular mt-1.5 text-xl font-bold', s.tone ?? 'text-ink-900')}>
                {s.value}<span className="ml-0.5 text-xs font-medium text-ink-300">{s.unit}</span>
              </p>
            </div>
          ))}
        </Stagger>

        <Reveal delay={60} className="mt-3">
          <Card className="p-5">
            <h2 className="text-base font-bold text-ink-900">Hours against quality</h2>
            <p className="mt-0.5 text-xs text-ink-500">Quality tracks duration almost perfectly for you — 8 hours reads 91, 5.8 hours reads 52.</p>
            <BarChart
              className="mt-5"
              data={SLEEP.map((s) => ({ day: shortDay(s.day).split(' ')[0].slice(0, 1), hours: s.hours }))}
              valueKey="hours"
              labelKey="day"
              goal={8}
              unit="h"
              height={130}
              colorFor={(v) => v >= 7.5 ? 'var(--score-great)' : v >= 7 ? 'var(--brand-500)' : v >= 6 ? 'var(--score-warn)' : 'var(--score-danger)'}
            />
          </Card>
        </Reveal>

        <Reveal delay={80} className="mt-3">
          <Card className="p-5">
            <h2 className="text-base font-bold text-ink-900">Bedtimes</h2>
            <ul className="mt-4 divide-y divide-line">
              {SLEEP.map((s) => (
                <li key={s.day} className="flex items-center gap-3 py-3">
                  <Moon className="size-4 shrink-0 text-berry" aria-hidden />
                  <span className="w-16 shrink-0 text-xs font-semibold text-ink-500">{shortDay(s.day)}</span>
                  <span className="tabular flex-1 text-sm text-ink-700">{s.bedtime} → {s.wake}</span>
                  <span className="tabular text-sm font-bold text-ink-900">{s.hours.toFixed(1)}h</span>
                  <span className={cn('tabular w-10 text-right text-[11px] font-bold',
                    s.quality >= 80 ? 'text-brand-600' : s.quality >= 65 ? 'text-citrus-text' : 'text-score-danger')}>
                    {s.quality}
                  </span>
                </li>
              ))}
            </ul>
          </Card>
        </Reveal>

        <Reveal delay={100} className="mt-3">
          <Card className="p-5">
            <div className="flex items-center gap-2">
              <Sparkles className="size-4 text-berry" aria-hidden />
              <h2 className="text-base font-bold text-ink-900">What we notice</h2>
            </div>
            <p className="mt-3 text-sm leading-6 text-ink-700">
              On the two nights you were asleep before 23:10, your next-day sugar intake was
              22g lower than on the nights you were up past midnight. Short sleep and sugar cravings
              travel together — this is one of the best-documented patterns in nutrition research.
            </p>
          </Card>
        </Reveal>
      </div>
    </AppShell>
  )
}

/* ══════════════════════════════════════════════════════════════════════
   GLUCOSE
   ═════════════════════════════════════════════════════════════════════ */
const GLUCOSE_BANDS = { low: 70, high: 140 }

/** Spoken labels rather than the stored enum, so the log reads like English. */
const GLUCOSE_CONTEXT: Record<string, string> = {
  fasting: 'Fasting',
  'pre-meal': 'Before eating',
  'post-meal': 'After eating',
  bedtime: 'Bedtime',
}

export function GlucoseScreen() {
  const [context, setContext] = useState<'all' | 'fasting' | 'post-meal'>('all')
  const [logOpen, setLogOpen] = useState(false)
  const [value, setValue] = useState(104)

  const readings = context === 'all' ? GLUCOSE : GLUCOSE.filter((g) => g.context === context)
  const fasting = GLUCOSE.filter((g) => g.context === 'fasting')
  const postMeal = GLUCOSE.filter((g) => g.context === 'post-meal')
  const avgFasting = Math.round(fasting.reduce((s, g) => s + g.value, 0) / Math.max(1, fasting.length))
  const avgPost = Math.round(postMeal.reduce((s, g) => s + g.value, 0) / Math.max(1, postMeal.length))
  const inRange = GLUCOSE.filter((g) => g.value >= GLUCOSE_BANDS.low && g.value <= GLUCOSE_BANDS.high).length
  const rangePct = Math.round((inRange / GLUCOSE.length) * 100)

  const bandFor = (v: number) =>
    v < GLUCOSE_BANDS.low ? 'Low' : v <= GLUCOSE_BANDS.high ? 'In range' : 'High'

  return (
    <AppShell title="Glucose" back={{ href: '/app/more', label: 'More' }}>
      <div className="container-ns pt-4">
        <ScreenIntro
          eyebrow="Glucose"
          title={`${rangePct}% of readings in range.`}
          copy="Target range is 70–140 mg/dL. This is a tracking tool, not a continuous monitor and not a diagnosis — never change medication based on it."
          action={
            <button onClick={() => setLogOpen(true)}
              className="press shrink-0 rounded-full bg-sky-accent px-4 py-2.5 text-xs font-bold text-white">
              <Plus className="mr-1 inline size-3.5" aria-hidden /> Log
            </button>
          }
        />

        <Stagger className="mt-5 grid grid-cols-3 gap-3">
          {[
            { label: 'Avg fasting', value: avgFasting, unit: 'mg/dL', tone: 'text-sky-accent' },
            { label: 'Avg post-meal', value: avgPost, unit: 'mg/dL', tone: 'text-citrus-text' },
            { label: 'In range', value: rangePct, unit: '%', tone: 'text-brand-600' },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl border border-line bg-surface p-4">
              <p className="text-[11px] font-medium text-ink-500">{s.label}</p>
              <p className={cn('tabular mt-1.5 text-xl font-bold', s.tone)}>
                <CountUp value={s.value} /><span className="ml-0.5 text-[10px] font-medium text-ink-300">{s.unit}</span>
              </p>
            </div>
          ))}
        </Stagger>

        <Reveal delay={60} className="mt-3">
          <Card className="p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-ink-900">Readings</h2>
                <p className="mt-0.5 text-xs text-ink-500">The shaded band is your target range</p>
              </div>
              <div className="shrink-0">
                <Segmented
                  label="Glucose context"
                  size="sm"
                  options={[{ id: 'all', label: 'All' }, { id: 'fasting', label: 'Fasting' }, { id: 'post-meal', label: 'Post' }]}
                  value={context}
                  onChange={setContext}
                />
              </div>
            </div>

            <LineChart
              className="mt-5"
              data={readings.map((g, i) => ({ day: `${i + 1}`, value: g.value }))}
              valueKey="value"
              labelKey="day"
              unit=" mg/dL"
              height={160}
              band={{ low: GLUCOSE_BANDS.low, high: GLUCOSE_BANDS.high, label: 'Target 70–140' }}
            />
          </Card>
        </Reveal>

        <Reveal delay={80} className="mt-3">
          <Card className="p-5">
            <h2 className="text-base font-bold text-ink-900">Log</h2>
            <ul className="mt-4 divide-y divide-line">
              {[...readings].reverse().map((g) => {
                const status = bandFor(g.value)
                return (
                  <li key={g.id} className="flex items-center gap-3 py-3">
                    <span className={cn('grid size-9 shrink-0 place-items-center rounded-xl',
                      status === 'In range' ? 'bg-brand-50 text-brand-600'
                        : status === 'High' ? 'bg-score-danger/12 text-score-danger'
                          : 'bg-sky-accent/12 text-sky-accent')}>
                      <CircleDot className="size-4" aria-hidden />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-bold text-ink-900">
                        <span className="tabular">{g.value}</span> mg/dL
                        <span className="ml-2 text-xs font-medium text-ink-500">{GLUCOSE_CONTEXT[g.context]}</span>
                      </span>
                      <span className="block truncate text-[11px] text-ink-500">
                        {shortDay(g.day)} · {g.time}{g.note ? ` · ${g.note}` : ''}
                      </span>
                    </span>
                    <span className={cn('shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold',
                      status === 'In range' ? 'bg-brand-500/14 text-brand-700'
                        : status === 'High' ? 'bg-score-danger/14 text-score-danger'
                          : 'bg-sky-accent/14 text-sky-accent')}>
                      {status}
                    </span>
                  </li>
                )
              })}
            </ul>
          </Card>
        </Reveal>

        <Reveal delay={100} className="mt-3">
          <Card className="border-score-warn/40 bg-[color-mix(in_oklab,var(--score-warn)_8%,var(--surface))] p-5">
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-0.5 size-5 shrink-0 text-score-warn" aria-hidden />
              <div>
                <p className="text-sm font-bold text-ink-900">One reading stands out</p>
                <p className="mt-1 text-xs leading-5 text-ink-700">
                  The 168 mg/dL reading on 30 September followed the instant noodles the app flagged at
                  1160 mg sodium and 46g of refined carbohydrate. Compare it with 142 after the lentil soup —
                  same calories, very different glucose response.
                </p>
              </div>
            </div>
          </Card>
        </Reveal>

        <Reveal delay={120} className="mt-3">
          <Card className="p-5">
            <Disclosure question="What the target range means" defaultOpen>
              For most adults with diabetes, the recommended pre-meal range is 80–130 mg/dL and
              under 180 mg/dL one to two hours after eating. Targets vary by person, pregnancy and
              medication. Yours should be set with your clinician — we default to 70–140.
            </Disclosure>
            <Disclosure question="Why we ask for context">
              A reading means very little without knowing whether it was fasting, before or after food.
              The same number can be reassuring at bedtime and concerning first thing in the morning.
            </Disclosure>
            <Disclosure question="Is this a medical device?">
              No. Nutrition Scan is an educational log. It does not diagnose, treat or replace a
              glucometer or CGM, and it must never drive a medication decision.
            </Disclosure>
          </Card>
        </Reveal>
      </div>

      <Sheet open={logOpen} onClose={() => setLogOpen(false)} title="Log a glucose reading">
        <div className="rounded-2xl border border-line bg-canvas-2 p-6 text-center">
          <p className="text-xs font-bold uppercase tracking-[.16em] text-ink-500">mg/dL</p>
          <div className="mt-3 flex items-center justify-center gap-4">
            <button onClick={() => setValue((v) => Math.max(40, v - 1))} aria-label="Decrease"
              className="press grid size-11 place-items-center rounded-full border border-line bg-surface text-xl font-bold text-ink-700">−</button>
            <span className="tabular min-w-[110px] text-4xl font-bold tracking-[-.06em] text-ink-900">{value}</span>
            <button onClick={() => setValue((v) => Math.min(400, v + 1))} aria-label="Increase"
              className="press grid size-11 place-items-center rounded-full border border-line bg-surface text-xl font-bold text-ink-700">+</button>
          </div>
          <p className={cn('mt-3 inline-block rounded-full px-3 py-1 text-xs font-bold',
            value < 70 ? 'bg-sky-accent/14 text-sky-accent' : value <= 140 ? 'bg-brand-500/14 text-brand-700' : 'bg-score-danger/14 text-score-danger')}>
            {bandFor(value)}
          </p>
        </div>
        <button
          onClick={() => { toast(`${value} mg/dL logged`, 'success'); setLogOpen(false) }}
          className="press mt-4 w-full rounded-full bg-sky-accent py-3.5 text-sm font-bold text-white"
        >
          Save reading
        </button>
      </Sheet>
    </AppShell>
  )
}

