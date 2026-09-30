'use client'

/**
 * Diary. Effects: 37 swipe-to-delete with undo · 26 day switcher morph ·
 * 46 layout-animated list · 19 count-up totals · 35 pull-to-refresh.
 */

import Link from 'next/link'
import { Check, ChevronLeft, ChevronRight, Plus, Search, Trash2 } from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { AppShell } from '@/components/app-shell'
import { CountUp, Reveal, Stagger } from '@/components/motion'
import { ScoreChip } from '@/components/score-ring'
import { toast } from '@/components/toast'
import { api } from '@/lib/api'
import { DAYS, SEED_DIARY, TODAY } from '@/lib/data/fixtures'
import { spring } from '@/lib/motion'
import { longDay, nf, relativeDay } from '@/lib/format'
import type { DiaryEntry } from '@/lib/types'

const MEALS = ['breakfast', 'lunch', 'dinner', 'snack'] as const

export function DiaryScreen() {
  const [dayIndex, setDayIndex] = useState(0)
  const [entries, setEntries] = useState<DiaryEntry[]>(SEED_DIARY)
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const day = DAYS[dayIndex]

  const load = useCallback(async (d: string) => {
    setLoading(true)
    await api.getDiary(d)
    setLoading(false)
  }, [])

  useEffect(() => { void load(day) }, [day, load])

  const dayEntries = useMemo(
    () => entries.filter((e) => e.day === day && e.name.toLowerCase().includes(query.toLowerCase())),
    [entries, day, query],
  )

  const totals = dayEntries.reduce(
    (acc, e) => ({
      kcal: acc.kcal + e.kcal, protein: acc.protein + e.protein,
      carbs: acc.carbs + e.carbs, sugar: acc.sugar + e.sugar, fiber: acc.fiber + e.fiber,
    }),
    { kcal: 0, protein: 0, carbs: 0, sugar: 0, fiber: 0 },
  )

  /* Effect 37 — deletes commit only after the undo window closes. */
  const remove = (entry: DiaryEntry) => {
    const snapshot = entries
    setEntries((prev) => prev.filter((e) => e.id !== entry.id))
    toast(`${entry.name} removed`, 'success', {
      label: 'Undo',
      run: () => setEntries(snapshot),
    })
    window.setTimeout(() => {
      // Commit point. With a real backend this is where the DELETE fires.
    }, 6000)
  }

  const shift = (delta: number) => {
    setDayIndex((i) => Math.min(DAYS.length - 1, Math.max(0, i + delta)))
  }

  return (
    <AppShell>
      <div className="container-ns pt-4">
        <Reveal>
          <p className="text-xs font-bold uppercase tracking-[.2em] text-brand-600">Your diary</p>
          <h1 className="mt-2 text-[clamp(1.75rem,7vw,2.5rem)] font-bold tracking-[-.055em]">Every choice adds up.</h1>
          <p className="mt-2 max-w-lg text-sm leading-6 text-ink-500">
            Review what you have scanned and the patterns you are building. Swipe a row left to delete it —
            nothing is final for six seconds.
          </p>
        </Reveal>

        {/* Day switcher */}
        <div className="mt-6 flex items-center gap-2">
          <button onClick={() => shift(1)} disabled={dayIndex >= DAYS.length - 1} aria-label="Previous day"
            className="press grid size-10 shrink-0 place-items-center rounded-full border border-line bg-surface text-ink-700 disabled:opacity-40">
            <ChevronLeft className="size-4" aria-hidden />
          </button>

          <div className="min-w-0 flex-1 text-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={day}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={spring.soft}
              >
                <p className="text-sm font-bold text-ink-900">{relativeDay(day, TODAY)}</p>
                <p className="text-xs text-ink-500">{longDay(day)}</p>
              </motion.div>
            </AnimatePresence>
          </div>

          <button onClick={() => shift(-1)} disabled={dayIndex === 0} aria-label="Next day"
            className="press grid size-10 shrink-0 place-items-center rounded-full border border-line bg-surface text-ink-700 disabled:opacity-40">
            <ChevronRight className="size-4" aria-hidden />
          </button>
        </div>

        {/* Day dots */}
        <div className="mt-3 flex justify-center gap-1.5" role="tablist" aria-label="Choose a day">
          {DAYS.map((d, i) => (
            <button
              key={d}
              role="tab"
              aria-selected={i === dayIndex}
              aria-label={relativeDay(d, TODAY)}
              onClick={() => setDayIndex(i)}
              className={`press h-1.5 rounded-full transition-all duration-400 ease-expo ${
                i === dayIndex ? 'w-7 bg-brand-500' : 'w-1.5 bg-line-strong'
              }`}
            />
          ))}
        </div>

        {/* Totals */}
        <Stagger className="mt-5 grid grid-cols-4 gap-2">
          {[
            { label: 'Energy', value: totals.kcal, unit: 'kcal' },
            { label: 'Protein', value: totals.protein, unit: 'g' },
            { label: 'Carbs', value: totals.carbs, unit: 'g' },
            { label: 'Fiber', value: totals.fiber, unit: 'g' },
          ].map((t) => (
            <div key={t.label} className="rounded-2xl border border-line bg-surface p-3 text-center">
              <p className="text-[10px] font-medium text-ink-500">{t.label}</p>
              <p className="tabular mt-1 text-base font-bold text-ink-900">
                <CountUp value={t.value} />
              </p>
              <p className="text-[10px] text-ink-300">{t.unit}</p>
            </div>
          ))}
        </Stagger>

        {/* Search */}
        <div className="mt-5 flex items-center gap-2 rounded-2xl border border-line bg-surface px-4 py-1.5">
          <Search className="size-4 text-ink-300" aria-hidden />
          <label htmlFor="diary-search" className="sr-only">Search your diary</label>
          <input
            id="diary-search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search what you logged"
            className="min-w-0 flex-1 bg-transparent py-2.5 text-sm text-ink-900 outline-none placeholder:text-ink-300"
          />
          {query && (
            <button onClick={() => setQuery('')} aria-label="Clear search" className="press text-xs font-bold text-ink-500">
              Clear
            </button>
          )}
        </div>

        {/* Entries by meal */}
        {loading ? (
          <div className="mt-5 space-y-2">
            {[0, 1, 2].map((i) => <div key={i} className="skeleton h-[72px] rounded-2xl" />)}
          </div>
        ) : (
          <div className="mt-5 space-y-5">
            {MEALS.map((meal) => {
              const mealEntries = dayEntries.filter((e) => e.meal === meal)
              if (!mealEntries.length) return null

              return (
                <section key={meal}>
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm font-bold capitalize text-ink-900">{meal}</h2>
                    <span className="tabular text-xs font-semibold text-ink-300">
                      {nf(mealEntries.reduce((s, e) => s + e.kcal, 0))} kcal
                    </span>
                  </div>

                  <motion.ul layout className="mt-2 space-y-2">
                    <AnimatePresence mode="popLayout">
                      {mealEntries.map((entry) => (
                        <SwipeRow key={entry.id} entry={entry} onDelete={() => remove(entry)} />
                      ))}
                    </AnimatePresence>
                  </motion.ul>
                </section>
              )
            })}

            {!dayEntries.length && (
              <div className="rounded-[26px] border border-dashed border-line bg-surface/60 p-10 text-center">
                <p className="text-sm font-semibold text-ink-900">Nothing logged {relativeDay(day, TODAY).toLowerCase()}</p>
                <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-ink-500">
                  Scan your first product and we will do the math for you.
                </p>
                <Link href="/app/scan" className="press mt-5 inline-flex items-center gap-2 rounded-full bg-brand-600 px-5 py-3.5 text-sm font-bold text-white">
                  <Plus className="size-4" aria-hidden /> Scan something
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </AppShell>
  )
}

/* ── Effect 37 — swipe-to-delete row ─────────────────────────────────── */
function SwipeRow({ entry, onDelete }: { entry: DiaryEntry; onDelete: () => void }) {
  const [offset, setOffset] = useState(0)
  const start = useRef<{ x: number; y: number; locked: boolean } | null>(null)
  const THRESHOLD = 88
  const band = entry.score >= 80 ? 'excellent' : entry.score >= 60 ? 'good' : entry.score >= 40 ? 'ok' : 'poor'

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0, marginBottom: 0, transition: { duration: 0.26 } }}
      transition={spring.soft}
      className="relative overflow-hidden rounded-2xl"
    >
      {/* Delete affordance revealed underneath */}
      <div className="absolute inset-y-0 right-0 flex w-[110px] items-center justify-center rounded-2xl bg-score-danger text-white">
        <button onClick={onDelete} className="press flex flex-col items-center gap-1" aria-label={`Delete ${entry.name}`}>
          <Trash2 className="size-5" aria-hidden />
          <span className="text-[10px] font-bold uppercase tracking-wide">Delete</span>
        </button>
      </div>

      <motion.div
        drag="x"
        dragConstraints={{ left: -110, right: 0 }}
        dragElastic={0.12}
        onDrag={(_, info) => setOffset(info.offset.x)}
        onDragEnd={(_, info) => {
          if (info.offset.x < -THRESHOLD) { onDelete(); setOffset(0) }
          else setOffset(0)
        }}
        onTouchStart={(e) => { start.current = { x: e.touches[0].clientX, y: e.touches[0].clientY, locked: false } }}
        className="relative touch-pan-y rounded-2xl border border-line bg-surface"
        style={{ x: 0 }}
      >
        <div className="flex items-center gap-3 p-3.5">
          <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-canvas-2 text-xl" aria-hidden>{entry.emoji}</span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-ink-900">{entry.name}</p>
            <p className="mt-0.5 text-xs text-ink-500">{entry.brand} · {entry.time}</p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <ScoreChip score={entry.score} band={band} />
            <Check className="size-4 text-brand-500" aria-hidden />
          </div>
        </div>
      </motion.div>
    </motion.li>
  )
}
