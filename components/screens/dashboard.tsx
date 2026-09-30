'use client'

/**
 * Dashboard. Effects: 19 count-up · 20 rings · 35 pull-to-refresh ·
 * 41 heatmap stagger · 42 hydration ripple · 43 chip fly-in · 02 stagger.
 */

import Link from 'next/link'
import { ArrowRight, Camera, ChevronRight, Droplets, Flame, Leaf, Plus, Sparkles } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { AppShell } from '@/components/app-shell'
import { CountUp, Reveal, Stagger, TiltCard, Typewriter } from '@/components/motion'
import { ScoreChip, ScoreRing } from '@/components/score-ring'
import { toast } from '@/components/toast'
import { api } from '@/lib/api'
import { DAYS, FAMILY_PROFILE, SEED_DIARY, TODAY } from '@/lib/data/fixtures'
import { scoreProduct } from '@/lib/score'
import { byId } from '@/lib/data/products'
import { spring } from '@/lib/motion'
import { longDay, nf } from '@/lib/format'
import type { DiaryEntry } from '@/lib/types'

const MEALS = ['breakfast', 'lunch', 'dinner', 'snack'] as const
type Meal = (typeof MEALS)[number]

export function Dashboard() {
  const [entries, setEntries] = useState<DiaryEntry[]>(SEED_DIARY.filter((e) => e.day === TODAY))
  const [water, setWater] = useState(1400)
  const [refreshing, setRefreshing] = useState(false)
  const [pull, setPull] = useState(0)
  const [insight, setInsight] = useState<string | null>(null)
  const touchStart = useRef<number | null>(null)

  const targets = FAMILY_PROFILE.dailyTargets
  const totals = entries.reduce(
    (acc, e) => ({
      kcal: acc.kcal + e.kcal, protein: acc.protein + e.protein, carbs: acc.carbs + e.carbs,
      sugar: acc.sugar + e.sugar, fiber: acc.fiber + e.fiber,
    }),
    { kcal: 0, protein: 0, carbs: 0, sugar: 0, fiber: 0 },
  )
  const dayScore = entries.length
    ? Math.round(entries.reduce((s, e) => s + e.score, 0) / entries.length)
    : 0
  const band = dayScore >= 80 ? 'excellent' : dayScore >= 60 ? 'good' : dayScore >= 40 ? 'ok' : 'poor'

  useEffect(() => {
    let cancelled = false
    api.getInsights().then((data) => { if (!cancelled) setInsight(data.insight) })
    return () => { cancelled = true }
  }, [])

  /* Effect 35 — pull to refresh, only active at the top of the page. */
  const onTouchStart = (e: React.TouchEvent) => {
    if (window.scrollY <= 0) touchStart.current = e.touches[0].clientY
  }
  const onTouchMove = (e: React.TouchEvent) => {
    if (touchStart.current == null) return
    const distance = e.touches[0].clientY - touchStart.current
    if (distance > 0) setPull(Math.min(88, distance * 0.55))
  }
  const onTouchEnd = useCallback(async () => {
    if (pull > 56) {
      setRefreshing(true)
      await api.getDiary(TODAY)
      window.setTimeout(() => { setRefreshing(false); toast('Diary up to date') }, 700)
    }
    setPull(0)
    touchStart.current = null
  }, [pull])

  return (
    <AppShell>
      {/* Pull-to-refresh indicator */}
      <div
        aria-hidden
        className="flex justify-center overflow-hidden transition-[height] duration-200"
        style={{ height: refreshing ? 44 : pull }}
      >
        <span className={`mt-3 size-6 rounded-full border-2 border-brand-500 border-t-transparent ${refreshing ? 'animate-spin' : ''}`}
          style={{ transform: refreshing ? undefined : `rotate(${pull * 4}deg)` }} />
      </div>

      <div
        className="container-ns pt-4"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* ── Greeting ─────────────────────────────────────────────── */}
        <Reveal className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-ink-500">{longDay(TODAY)}</p>
            <h1 className="mt-1 text-[clamp(1.75rem,7vw,2.5rem)] font-bold tracking-[-.05em]">
              Good morning, {FAMILY_PROFILE.name}.
            </h1>
            <p className="mt-2 max-w-md text-sm leading-6 text-ink-500">
              A little clarity goes a long way. Here is how your choices are adding up.
            </p>
          </div>
          <Link
            href="/app/scan"
            className="press hidden shrink-0 items-center gap-2 rounded-full bg-citrus px-5 py-3.5 text-sm font-bold text-white shadow-[0_12px_24px_rgba(255,122,26,.24)] sm:inline-flex"
          >
            Scan something <Camera className="size-4" aria-hidden />
          </Link>
        </Reveal>

        {/* ── Score + focus ────────────────────────────────────────── */}
        <div className="mt-6 grid gap-3 lg:grid-cols-[1.15fr_.85fr]">
          <Reveal variant="scale">
            <section className="h-full rounded-[30px] bg-brand-50 p-6 sm:p-8">
              <div className="flex flex-col items-center gap-6 sm:flex-row sm:gap-8">
                <ScoreRing score={dayScore} band={band} size={158} label="Today" />
                <div className="text-center sm:text-left">
                  <p className="text-xs font-bold uppercase tracking-[.16em] text-ink-500">Your nutrition score</p>
                  <h2 className="mt-2 text-2xl font-bold tracking-[-.045em] text-ink-900">
                    {dayScore >= 75 ? 'You are on a good path.' : dayScore >= 55 ? 'Solid, with room to move.' : 'Let us find you a better swap.'}
                  </h2>
                  <p className="mt-2 max-w-sm text-sm leading-6 text-ink-700">
                    {entries.length} items logged today, averaging {dayScore} across your scans.
                  </p>
                  <div className="mt-4 flex flex-wrap justify-center gap-2 sm:justify-start">
                    <span className="rounded-full bg-surface/80 px-3 py-1.5 text-xs font-bold text-brand-700">
                      <Flame className="mr-1 inline size-3 fx-flame" aria-hidden /> 4 day streak
                    </span>
                    <span className="rounded-full bg-surface/80 px-3 py-1.5 text-xs font-bold text-ink-500">
                      +6 vs last week
                    </span>
                  </div>
                </div>
              </div>
            </section>
          </Reveal>

          <Reveal variant="scale" delay={90}>
            <section className="noise relative h-full overflow-hidden rounded-[30px] bg-brand-900 p-6 text-white sm:p-8">
              <div className="fx-aurora fx-aurora--calm opacity-30" aria-hidden />
              <div className="relative z-10">
                <p className="text-xs font-bold uppercase tracking-[.16em] text-brand-300">Today&apos;s focus</p>
                <h2 className="mt-3 text-2xl font-bold tracking-[-.04em] text-white">Add more colour.</h2>
                <p className="mt-2 max-w-xs text-sm leading-6 text-[#b5cfc2]">
                  {insight ? <Typewriter text={insight} className="text-sm leading-6 text-[#b5cfc2]" /> : 'You are 2 servings away from your fruit and veg goal.'}
                </p>

                <div className="mt-6 h-2 overflow-hidden rounded-full bg-white/15">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '62%' }}
                    transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
                    className="h-full rounded-full bg-lime-accent"
                  />
                </div>
                <p className="mt-2 text-xs text-[#b5cfc2]">3 of 5 servings</p>
              </div>
            </section>
          </Reveal>
        </div>

        {/* ── Nutrients ────────────────────────────────────────────── */}
        <section className="mt-9">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[.16em] text-brand-600">Your nutrients</p>
              <h2 className="mt-1.5 text-xl font-bold tracking-[-.04em] text-ink-900">Today at a glance</h2>
            </div>
            <Link href="/app/insights" className="press inline-flex items-center gap-1 text-sm font-bold text-brand-600">
              Trends <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>

          <Stagger className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: 'Energy', value: totals.kcal, target: targets.kcal, unit: 'kcal', tone: 'text-citrus-text' },
              { label: 'Protein', value: totals.protein, target: targets.protein, unit: 'g', tone: 'text-berry' },
              { label: 'Fiber', value: totals.fiber, target: targets.fiber, unit: 'g', tone: 'text-brand-600' },
              { label: 'Sugars', value: totals.sugar, target: 50, unit: 'g', tone: 'text-sky-accent' },
            ].map((n) => {
              const pct = Math.min(100, Math.round((n.value / n.target) * 100))
              return (
                <div key={n.label} className="rounded-2xl border border-line bg-surface p-4">
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs font-medium text-ink-500">{n.label}</span>
                    <span className="tabular text-[11px] font-semibold text-ink-300">{pct}%</span>
                  </div>
                  <p className={`tabular mt-2 text-xl font-bold ${n.tone}`}>
                    <CountUp value={n.value} /> <span className="text-xs font-medium text-ink-300">{n.unit}</span>
                  </p>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-canvas-2">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${pct}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                      className="h-full rounded-full bg-current opacity-70"
                      style={{ color: 'inherit' }}
                    />
                  </div>
                </div>
              )
            })}
          </Stagger>
        </section>

        {/* ── Hydration (Effect 42) ────────────────────────────────── */}
        <section className="mt-9">
          <div className="rounded-[26px] border border-line bg-surface p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Droplets className="size-5 text-sky-accent" aria-hidden />
                <h2 className="text-base font-bold text-ink-900">Hydration</h2>
              </div>
              <span className="tabular text-sm font-bold text-ink-900">
                {(water / 1000).toFixed(1)}L <span className="text-xs font-medium text-ink-300">of {targets.waterMl / 1000}L</span>
              </span>
            </div>

            <div className="relative mt-4 h-16 overflow-hidden rounded-2xl border border-line bg-canvas-2">
              <motion.div
                className="absolute inset-x-0 bottom-0 bg-sky-accent/25"
                animate={{ height: `${Math.min(100, (water / targets.waterMl) * 100)}%` }}
                transition={spring.soft}
              >
                <span aria-hidden className="fx-wave">
                  <svg className="fx-wave__surface absolute -top-2 left-0 h-4 w-[200%] text-sky-accent/40" viewBox="0 0 200 12" preserveAspectRatio="none">
                    <path d="M0 6 Q 12.5 0 25 6 T 50 6 T 75 6 T 100 6 T 125 6 T 150 6 T 175 6 T 200 6 V 12 H 0 Z" fill="currentColor" />
                  </svg>
                </span>
              </motion.div>
              <span className="absolute inset-0 grid place-items-center text-xs font-bold text-ink-700">
                {Math.round((water / targets.waterMl) * 100)}% of your goal
              </span>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {[250, 500].map((amount) => (
                <button
                  key={amount}
                  onClick={() => {
                    setWater((w) => Math.min(targets.waterMl + 1000, w + amount))
                    toast(`+${amount}ml logged`, 'info')
                  }}
                  className="press rounded-xl border border-line bg-canvas px-3.5 py-2.5 text-xs font-bold text-ink-700"
                >
                  <Plus className="mr-1 inline size-3" aria-hidden /> {amount}ml
                </button>
              ))}
              <Link href="/app/insights" className="press ml-auto self-center text-xs font-bold text-brand-600">
                Hydration trends
              </Link>
            </div>
          </div>
        </section>

        {/* ── Meals ────────────────────────────────────────────────── */}
        <section className="mt-9">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold tracking-[-.04em] text-ink-900">Today&apos;s diary</h2>
            <Link href="/app/history" className="press inline-flex items-center gap-1 text-sm font-bold text-brand-600">
              See all <ChevronRight className="size-4" aria-hidden />
            </Link>
          </div>

          <div className="mt-4 space-y-3">
            {MEALS.map((meal) => {
              const mealEntries = entries.filter((e) => e.meal === meal)
              const mealKcal = mealEntries.reduce((s, e) => s + e.kcal, 0)
              return (
                <Reveal key={meal} delay={MEALS.indexOf(meal) * 60}>
                  <div className="rounded-[24px] border border-line bg-surface p-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold capitalize text-ink-900">{meal}</h3>
                      <span className="tabular text-xs font-semibold text-ink-300">{nf(mealKcal)} kcal</span>
                    </div>

                    <ul className="mt-3 space-y-2">
                      {mealEntries.map((entry) => {
                        const product = byId(entry.productId)
                        const band = entry.score >= 80 ? 'excellent' : entry.score >= 60 ? 'good' : entry.score >= 40 ? 'ok' : 'poor'
                        return (
                          <motion.li key={entry.id} layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={spring.soft}>
                            <Link
                              href={product ? `/app/result/${product.barcode}` : '/app/history'}
                              className="press flex items-center gap-3 rounded-2xl bg-canvas-2 p-3"
                            >
                              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-surface text-lg" aria-hidden>
                                {entry.emoji}
                              </span>
                              <span className="min-w-0 flex-1">
                                <span className="block truncate text-sm font-semibold text-ink-900">{entry.name}</span>
                                <span className="block text-xs text-ink-500">{entry.brand} · {entry.time}</span>
                              </span>
                              <ScoreChip score={entry.score} band={band} />
                            </Link>
                          </motion.li>
                        )
                      })}

                      {!mealEntries.length && (
                        <li>
                          <Link href="/app/scan" className="press flex items-center gap-3 rounded-2xl border border-dashed border-line p-3 text-sm font-semibold text-ink-300">
                            <span className="grid size-10 place-items-center rounded-xl bg-canvas-2" aria-hidden>
                              <Plus className="size-4" />
                            </span>
                            Nothing logged — scan your first item
                          </Link>
                        </li>
                      )}
                    </ul>

                    {mealEntries.length > 0 && (
                      <Link href="/app/scan" className="press mt-3 flex items-center justify-center gap-1.5 rounded-xl border border-dashed border-line py-2.5 text-xs font-bold text-ink-500">
                        <Plus className="size-3.5" aria-hidden /> Add to {meal}
                      </Link>
                    )}
                  </div>
                </Reveal>
              )
            })}
          </div>
        </section>

        {/* ── Recent + insight ─────────────────────────────────────── */}
        <section className="mt-9 grid gap-3 lg:grid-cols-2">
          <Reveal>
            <div className="h-full rounded-[26px] border border-line bg-surface p-5">
              <h2 className="text-base font-bold text-ink-900">Last 7 days</h2>
              <div className="mt-5 flex items-end gap-1.5" role="img" aria-label="Daily scores for the last seven days">
                {[71, 74, 68, 79, 82, 76, dayScore || 80].map((score, i) => (
                  <div key={i} className="flex-1 text-center">
                    <motion.div
                      initial={{ height: 0 }}
                      whileInView={{ height: `${Math.max(12, score * 0.7)}px` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: i * 0.06 }}
                      className="mx-auto w-full rounded-t-lg"
                      style={{ background: score >= 60 ? 'var(--brand-500)' : score >= 40 ? 'var(--score-warn)' : 'var(--score-danger)' }}
                    />
                    <span className="mt-1.5 block text-[10px] font-semibold text-ink-300">{['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}</span>
                  </div>
                ))}
              </div>
              <Link href="/app/insights" className="press mt-5 flex items-center justify-center gap-1.5 rounded-xl bg-canvas-2 py-3 text-xs font-bold text-ink-900">
                Open full insights <ChevronRight className="size-3.5" aria-hidden />
              </Link>
            </div>
          </Reveal>

          <Reveal delay={90}>
            <TiltCard className="h-full rounded-[26px] border border-line bg-surface p-5">
              <div className="flex items-center gap-2">
                <span className="grid size-8 place-items-center rounded-xl bg-berry/12 text-berry">
                  <Sparkles className="size-4" aria-hidden />
                </span>
                <h2 className="text-base font-bold text-ink-900">Coach note</h2>
              </div>
              <div className="mt-4 min-h-[96px]">
                {insight
                  ? <Typewriter text={insight} className="text-sm leading-6 text-ink-700" />
                  : <span className="skeleton block h-20 w-full" aria-hidden />}
              </div>
              <p className="mt-4 flex items-start gap-2 rounded-xl bg-canvas-2 p-3 text-xs leading-5 text-ink-500">
                <Leaf className="mt-0.5 size-3.5 shrink-0 text-brand-600" aria-hidden />
                Generated from your last seven days. Not medical advice — talk to your clinician about changes to your diet.
              </p>
            </TiltCard>
          </Reveal>
        </section>

        <p className="mt-8 text-center text-xs text-ink-300">
          {entries.length} of {DAYS.length} days logged this week · Your diary is stored on this device.
        </p>
      </div>
    </AppShell>
  )
}
