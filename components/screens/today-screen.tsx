'use client'

/**
 * Today — the screen a user opens twenty times a day.
 *
 * Layout borrows the information architecture of the reference app (budget,
 * macros, habits, weight, notes, meals) but rebuilt: one hero budget ring
 * instead of three competing cards, a week strip that shows adherence at a
 * glance, and habit rows that are tappable rather than decorative.
 *
 * Effects: 19 count-up · 20 ring · 25 sheet · 26 segmented · 34 toast ·
 * 41 heatmap · 46 layout anim · 47 haptics.
 */

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Activity, Camera, ChevronDown, ChevronRight, Dumbbell, Flame, Footprints, GlassWater, NotebookPen, Plus, Scale, Sparkles, Utensils, Zap } from 'lucide-react'
import { AppShell } from '@/components/app-shell'
import { CountUp, Reveal, Stagger } from '@/components/motion'
import { ProgressRing, MacroBar } from '@/components/charts'
import { Card, Sheet } from '@/components/ui-kit'
import { ScoreChip } from '@/components/score-ring'
import { toast } from '@/components/toast'
import { cn } from '@/lib/utils'
import { spring } from '@/lib/motion'
import { longDay, nf, relativeDay, shortDay } from '@/lib/format'
import {
  EXERCISE, HABITS, LAST_7, NOTES, STEP_GOAL,
  TODAY, WEIGHT, WEIGHT_CURRENT, WEIGHT_START, calorieBudget, todayHabits,
} from '@/lib/data/health'
import { MEAL_PLAN, recipeById } from '@/lib/data/library'
import { FAMILY_PROFILE, SEED_DIARY } from '@/lib/data/fixtures'

const DAILY_BASE = 2100
const MACRO_TARGETS = { protein: 146, carbs: 231, fat: 70 }

export function TodayScreen() {
  const [day, setDay] = useState(TODAY)
  const [quickAdd, setQuickAdd] = useState<false | 'water' | 'exercise' | 'weight' | 'note'>(false)
  const [showDayPicker, setShowDayPicker] = useState(false)

  const dayEntries = useMemo(() => SEED_DIARY.filter((e) => e.day === day), [day])
  const habits = todayHabits()
  const isToday = day === TODAY

  const food = dayEntries.reduce((s, e) => s + e.kcal, 0)
  const protein = dayEntries.reduce((s, e) => s + e.protein, 0)
  const carbs = dayEntries.reduce((s, e) => s + e.carbs, 0)
  const fat = Math.round(dayEntries.reduce((s, e) => s + e.carbs * 0.28, 0))
  const exerciseKcal = EXERCISE.filter((e) => e.day === day).reduce((s, e) => s + e.kcal, 0)
  const budget = calorieBudget(DAILY_BASE, food, exerciseKcal)

  const streak = 4
  const weightDelta = WEIGHT_CURRENT - WEIGHT_START

  const dayScore = dayEntries.length
    ? Math.round(dayEntries.reduce((s, e) => s + e.score, 0) / dayEntries.length)
    : 0

  const waterPct = Math.round((habits.waterMl / FAMILY_PROFILE.dailyTargets.waterMl) * 100)
  const stepPct = Math.round((habits.steps / STEP_GOAL) * 100)

  return (
    <AppShell>
      <div className="container-ns pt-4">
        {/* ── Header with date picker + streak ─────────────────────── */}
        <Reveal className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <button
              onClick={() => setShowDayPicker((v) => !v)}
              aria-expanded={showDayPicker}
              className="press inline-flex items-center gap-1.5 text-[clamp(1.5rem,6.5vw,2rem)] font-bold tracking-[-.05em] text-ink-900"
            >
              {isToday ? 'Today' : relativeDay(day, TODAY)}
              <ChevronDown className={cn('size-5 text-ink-300 transition-transform duration-300', showDayPicker && 'rotate-180')} aria-hidden />
            </button>
            <p className="mt-0.5 text-xs text-ink-500">
              {longDay(day)}
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <span className="fx-badge-pop inline-flex items-center gap-1.5 rounded-full bg-mango/18 px-3 py-2 text-sm font-bold text-citrus-text">
              <Zap className="size-4 fx-flame" aria-hidden />
              <span className="tabular">{streak}</span>
            </span>
            <Link href="/pricing" className="press rounded-full bg-citrus px-4 py-2.5 text-xs font-bold text-white shadow-[0_8px_20px_rgba(255,122,26,.28)]">
              Go Premium
            </Link>
          </div>
        </Reveal>

        {/* ── Week strip: adherence at a glance ────────────────────── */}
        <Reveal delay={60} className="mt-5">
          <div className="flex items-center justify-between gap-1">
            {LAST_7.map((d) => {
              const log = HABITS.find((h) => h.day === d)
              const pct = log ? Math.min(1, log.steps / STEP_GOAL) : 0
              const selected = d === day
              const dayIndex = new Date(`${d}T12:00:00Z`).getUTCDay()
              return (
                <button
                  key={d}
                  onClick={() => setDay(d)}
                  aria-current={selected ? 'date' : undefined}
                  aria-label={`${relativeDay(d, TODAY)}, ${Math.round(pct * 100)} percent of step goal`}
                  className="press flex flex-1 flex-col items-center gap-1.5"
                >
                  <span className={cn('text-[10px] font-bold uppercase tracking-wide', selected ? 'text-brand-600' : 'text-ink-300')}>
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'][dayIndex]}
                  </span>
                  <span className="relative grid size-8 place-items-center">
                    <svg viewBox="0 0 32 32" className="absolute inset-0 -rotate-90" aria-hidden>
                      <circle cx="16" cy="16" r="13.5" fill="none" stroke="var(--canvas-2)" strokeWidth="3" />
                      <circle
                        cx="16" cy="16" r="13.5" fill="none"
                        stroke={pct >= 1 ? 'var(--brand-600)' : 'var(--brand-300)'}
                        strokeWidth="3" strokeLinecap="round"
                        strokeDasharray={2 * Math.PI * 13.5}
                        strokeDashoffset={2 * Math.PI * 13.5 * (1 - pct)}
                      />
                    </svg>
                    <span className={cn(
                      'size-2 rounded-full transition-colors',
                      selected ? 'bg-brand-600' : pct >= 1 ? 'bg-brand-500' : 'bg-transparent',
                    )} />
                  </span>
                </button>
              )
            })}
          </div>
        </Reveal>

        {/* ── Calorie budget — the hero ────────────────────────────── */}
        <Reveal variant="scale" className="mt-5">
          <Card className="relative overflow-hidden p-5 sm:p-6">
            <div
              aria-hidden
              className="absolute -right-16 -top-16 size-52 rounded-full opacity-[.07]"
              style={{ background: 'var(--grad-aurora)' }}
            />
            <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-8">
              <div className="flex items-center gap-5">
                <ProgressRing value={food} target={budget.base + exerciseKcal} size={116} thickness={11} label="used" />
                <div className="min-w-0 sm:hidden">
                  <p className="text-xs font-bold uppercase tracking-[.16em] text-ink-500">Remaining</p>
                  <p className="tabular mt-1 text-3xl font-bold tracking-[-.05em] text-ink-900">
                    <CountUp value={budget.remaining} />
                  </p>
                  <p className="text-xs text-ink-500">kcal left today</p>
                </div>
              </div>

              <div className="min-w-0 flex-1">
                <div className="hidden sm:block">
                  <p className="text-xs font-bold uppercase tracking-[.16em] text-ink-500">Remaining</p>
                  <p className="tabular mt-1 text-[clamp(2rem,7vw,2.75rem)] font-bold tracking-[-.06em] text-ink-900">
                    <CountUp value={budget.remaining} />
                    <span className="ml-2 text-sm font-semibold text-ink-300">kcal left</span>
                  </p>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-3 border-t border-line pt-4">
                  <div>
                    <p className="text-[11px] font-medium text-ink-500">Base goal</p>
                    <p className="tabular text-sm font-bold text-ink-900">{nf(budget.base)}</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-medium text-ink-500">Food</p>
                    <p className="tabular text-sm font-bold text-ink-900">{nf(budget.food)}</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-medium text-ink-500">Exercise</p>
                    <p className="tabular text-sm font-bold text-brand-600">+{nf(budget.exercise)}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative mt-5 flex items-center justify-between gap-3 rounded-2xl bg-canvas-2 px-4 py-3">
              <p className="text-xs leading-5 text-ink-500">
                <Sparkles className="mr-1 inline size-3.5 text-berry" aria-hidden />
                {budget.remaining > 600
                  ? `You have room for a proper dinner and a snack. Aim for 30g of protein.`
                  : budget.remaining > 200
                    ? 'Getting close to your budget — go protein and vegetables for the rest of the day.'
                    : 'Budget spent. Water, herbal tea and an early night.'}
              </p>
              <Link href="/app/scan" className="press shrink-0 rounded-full bg-ink-900 px-4 py-2.5 text-[11px] font-bold text-white">
                Log food
              </Link>
            </div>
          </Card>
        </Reveal>

        {/* ── Macros ───────────────────────────────────────────────── */}
        <Reveal delay={80} className="mt-3">
          <Card className="p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-ink-900">Macros</h2>
              <Link href="/app/goals" className="press text-[11px] font-bold text-brand-600">Adjust targets</Link>
            </div>
            <MacroBar className="mt-4" protein={protein} carbs={carbs} fat={fat} />
            <div className="mt-4 grid grid-cols-3 gap-2">
              {[
                { label: 'Protein', value: protein, target: MACRO_TARGETS.protein, tone: 'text-brand-600' },
                { label: 'Carbs', value: carbs, target: MACRO_TARGETS.carbs, tone: 'text-sky-accent' },
                { label: 'Fat', value: fat, target: MACRO_TARGETS.fat, tone: 'text-mango' },
              ].map((m) => (
                <div key={m.label} className="rounded-xl bg-canvas-2 p-3">
                  <p className="text-[10px] font-medium text-ink-500">{m.label}</p>
                  <p className={cn('tabular mt-0.5 text-sm font-bold', m.tone)}>
                    {nf(m.value)}<span className="text-[10px] font-medium text-ink-300">/{m.target}g</span>
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </Reveal>

        {/* ── Healthy habits ───────────────────────────────────────── */}
        <Reveal delay={100} className="mt-6">
          <div className="flex items-end justify-between">
            <h2 className="text-xl font-bold tracking-[-.045em] text-ink-900">Healthy habits</h2>
            <span className="text-[11px] font-semibold text-ink-300">Tap to log</span>
          </div>

          <div className="mt-3 divide-y divide-line overflow-hidden rounded-[26px] border border-line bg-surface">
            <HabitRow
              icon={GlassWater} label="Water" tone="text-sky-accent"
              value={`${(habits.waterMl / 1000).toFixed(1)} L`}
              hint={habits.waterMl === 0 ? 'You must be thirsty!' : `${nf(FAMILY_PROFILE.dailyTargets.waterMl - habits.waterMl)} ml to goal`}
              progress={waterPct}
              onLog={() => setQuickAdd('water')}
            />
            <HabitRow
              icon={Dumbbell} label="Exercise" tone="text-berry"
              value={habits.exerciseMinutes ? `${habits.exerciseMinutes} min` : '—'}
              hint={habits.exerciseMinutes ? `${nf(exerciseKcal)} kcal burned` : 'Nothing logged yet today'}
              progress={Math.min(100, Math.round((habits.exerciseMinutes / 45) * 100))}
              onLog={() => setQuickAdd('exercise')}
            />
            <HabitRow
              icon={Footprints} label="Steps" tone="text-brand-600"
              value={nf(habits.steps)}
              hint={stepPct >= 100 ? 'Goal reached' : `${nf(Math.max(0, STEP_GOAL - habits.steps))} to go`}
              progress={stepPct}
              device
              onLog={() => toast('Synced from Apple Health · 4 minutes ago', 'info')}
            />
            <HabitRow
              icon={Scale} label="Weight" tone="text-ink-700"
              value={`${WEIGHT_CURRENT} kg`}
              hint={`${weightDelta >= 0 ? '+' : ''}${weightDelta.toFixed(1)} kg since ${shortDay(WEIGHT[0].day)}`}
              onLog={() => setQuickAdd('weight')}
            />
            <HabitRow
              icon={NotebookPen} label="Notes" tone="text-mango"
              value={NOTES[0] ? 'Written' : '—'}
              hint={NOTES[0]?.body.slice(0, 42) + '…'}
              onLog={() => setQuickAdd('note')}
            />
          </div>
        </Reveal>

        {/* ── Diary ────────────────────────────────────────────────── */}
        <Reveal delay={120} className="mt-6">
          <div className="flex items-end justify-between">
            <h2 className="text-xl font-bold tracking-[-.045em] text-ink-900">Diary</h2>
            <Link href="/app/history" className="press text-sm font-bold text-brand-600">View all</Link>
          </div>

          <div className="mt-3 space-y-2.5">
            {(['breakfast', 'lunch', 'dinner', 'snack'] as const).map((meal) => {
              const entries = dayEntries.filter((e) => e.meal === meal)
              const mealKcal = entries.reduce((s, e) => s + e.kcal, 0)
              return (
                <div key={meal} className="overflow-hidden rounded-[24px] border border-line bg-surface">
                  <div className="flex items-center gap-3 p-4">
                    <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-canvas-2 text-ink-500">
                      <Utensils className="size-4" aria-hidden />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold capitalize text-ink-900">{meal}</p>
                      <p className="text-xs text-ink-500">
                        {entries.length ? `${entries.length} item${entries.length > 1 ? 's' : ''} · ${nf(mealKcal)} kcal` : 'Nothing logged yet'}
                      </p>
                    </div>
                    <Link
                      href={`/app/scan?meal=${meal}`}
                      className="press shrink-0 rounded-full bg-brand-50 px-4 py-2.5 text-xs font-bold text-brand-700"
                    >
                      Log
                    </Link>
                  </div>

                  <AnimatePresence initial={false}>
                    {entries.length > 0 && (
                      <motion.ul
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={spring.soft}
                        className="overflow-hidden border-t border-line"
                      >
                        {entries.map((entry) => {
                          const band = entry.score >= 80 ? 'excellent' : entry.score >= 60 ? 'good' : entry.score >= 40 ? 'ok' : 'poor'
                          return (
                            <li key={entry.id} className="flex items-center gap-3 border-b border-line px-4 py-3 last:border-0">
                              <span className="text-lg" aria-hidden>{entry.emoji}</span>
                              <span className="min-w-0 flex-1">
                                <span className="block truncate text-sm font-semibold text-ink-900">{entry.name}</span>
                                <span className="block text-[11px] text-ink-500">{entry.time} · {nf(entry.kcal)} kcal</span>
                              </span>
                              <ScoreChip score={entry.score} band={band} />
                            </li>
                          )
                        })}
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </div>
              )
            })}
          </div>
        </Reveal>

        {/* ── Scan banner — the product's core action, always one tap away ── */}
        <Reveal delay={130} className="mt-6">
          <Link
            href="/app/scan?mode=meal"
            className="press group relative block overflow-hidden rounded-[26px] bg-[linear-gradient(120deg,#052e1f_0%,#0b4630_58%,#123b2c_100%)] p-5"
          >
            <div className="fx-aurora fx-aurora--calm opacity-30" aria-hidden />
            <div className="relative z-10 flex items-center gap-4">
              <span className="fx-glow grid size-12 shrink-0 place-items-center rounded-2xl bg-lime-accent/18 text-lime-accent">
                <Camera className="size-6" aria-hidden />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-bold text-white">Meal Scan</span>
                <span className="mt-0.5 block text-xs leading-5 text-[#a9c2b5]">
                  Photograph your plate and get a score, macros and three ways to improve it — in about four seconds.
                </span>
              </span>
              <ChevronRight className="size-5 shrink-0 text-lime-accent transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden />
            </div>
            <span className="relative z-10 mt-4 flex flex-wrap gap-1.5">
              {['Barcode', 'Plate photo', 'Label text', 'Voice'].map((m) => (
                <span key={m} className="rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-semibold text-[#d7e8dd]">{m}</span>
              ))}
            </span>
          </Link>
        </Reveal>

        {/* ── Planned meals ────────────────────────────────────────── */}
        <Reveal delay={140} className="mt-6">
          <Card className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-ink-900">Your meal plan</h2>
                <p className="mt-0.5 text-xs text-ink-500">Four meals built around your macros and allergies.</p>
              </div>
              <Link href="/app/recipes" className="press rounded-full bg-canvas-2 px-3.5 py-2 text-[11px] font-bold text-ink-900">
                Browse
              </Link>
            </div>

            <ul className="mt-4 space-y-2">
              {MEAL_PLAN.map((item) => {
                const recipe = recipeById(item.recipeId)
                return (
                  <li key={item.id} className="flex items-center gap-3 rounded-2xl bg-canvas-2 p-3">
                    <span className="text-xl" aria-hidden>{item.emoji}</span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-xs font-bold text-ink-900">{item.name}</span>
                      <span className="block text-[11px] text-ink-500">
                        <span className="capitalize">{item.slot}</span> · {recipe?.kcal} kcal · {recipe?.protein}g protein
                      </span>
                    </span>
                    <button
                      onClick={() => toast(`${item.name} logged to ${item.slot}`, 'success')}
                      disabled={item.logged}
                      className={cn(
                        'press shrink-0 rounded-full px-3.5 py-2 text-[11px] font-bold',
                        item.logged ? 'bg-brand-500/15 text-brand-700' : 'bg-ink-900 text-white',
                      )}
                    >
                      {item.logged ? 'Logged' : 'Log'}
                    </button>
                  </li>
                )
              })}
            </ul>
          </Card>
        </Reveal>

        {/* ── Today's insight ──────────────────────────────────────── */}
        <Reveal delay={160} className="mt-6">
          <div className="noise relative overflow-hidden rounded-[26px] bg-brand-900 p-5 text-white">
            <div className="fx-aurora fx-aurora--calm opacity-25" aria-hidden />
            <div className="relative z-10">
              <div className="flex items-center gap-2">
                <Activity className="size-4 text-lime-accent" aria-hidden />
                <p className="text-[11px] font-bold uppercase tracking-[.16em] text-brand-300">Today&apos;s pattern</p>
              </div>
              <p className="mt-3 text-sm leading-6 text-[#cfe3d6]">
                Your glucose averaged <b className="tabular text-white">118 mg/dL</b> today against 131 last week.
                The two highest readings both followed processed snacks — the lentil soup barely moved it.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Link href="/app/glucose" className="press rounded-full bg-white/12 px-3.5 py-2 text-[11px] font-bold text-white">
                  Glucose log
                </Link>
                <Link href="/app/progress" className="press rounded-full bg-lime-accent px-3.5 py-2 text-[11px] font-bold text-brand-900">
                  Full progress
                </Link>
              </div>
            </div>
          </div>
        </Reveal>

        <p className="mt-6 mb-2 text-center text-[11px] text-ink-300">
          Scores are educational, not medical advice. Talk to your clinician about changes to your diet.
        </p>
      </div>

      {/* ── Quick add sheet (Effect 25) ─────────────────────────────── */}
      <Sheet open={quickAdd === 'water'} onClose={() => setQuickAdd(false)} title="Log water">
        <WaterLogger onDone={(ml) => { toast(`+${ml}ml logged`, 'info'); setQuickAdd(false) }} current={habits.waterMl} target={FAMILY_PROFILE.dailyTargets.waterMl} />
      </Sheet>

      <Sheet open={quickAdd === 'exercise'} onClose={() => setQuickAdd(false)} title="Log exercise">
        <div className="grid grid-cols-2 gap-2">
          {[
            { name: 'Walk', kcal: 96, minutes: 24 }, { name: 'Run', kcal: 412, minutes: 42 },
            { name: 'Strength', kcal: 330, minutes: 55 }, { name: 'Yoga', kcal: 118, minutes: 30 },
            { name: 'Cycle', kcal: 285, minutes: 38 }, { name: 'Swim', kcal: 402, minutes: 45 },
          ].map((x) => (
            <button
              key={x.name}
              onClick={() => { toast(`${x.name} · ${x.minutes} min · ${x.kcal} kcal logged`, 'success'); setQuickAdd(false) }}
              className="press rounded-2xl border border-line bg-surface p-4 text-left"
            >
              <p className="text-sm font-bold text-ink-900">{x.name}</p>
              <p className="tabular mt-0.5 text-[11px] text-ink-500">{x.minutes} min · {x.kcal} kcal</p>
            </button>
          ))}
        </div>
      </Sheet>

      <Sheet open={quickAdd === 'weight'} onClose={() => setQuickAdd(false)} title="Log weight">
        <WeightLogger onDone={(kg) => { toast(`${kg} kg logged`, 'success'); setQuickAdd(false) }} current={WEIGHT_CURRENT} />
      </Sheet>

      <Sheet open={quickAdd === 'note'} onClose={() => setQuickAdd(false)} title="Add a note">
        <NoteLogger onDone={() => { toast('Note saved', 'success'); setQuickAdd(false) }} />
      </Sheet>
    </AppShell>
  )
}

/* ── Habit row ───────────────────────────────────────────────────────── */
function HabitRow({
  icon: Icon, label, value, hint, tone, progress, onLog, device,
}: {
  icon: React.ElementType; label: string; value: string; hint?: string
  tone?: string; progress?: number; onLog: () => void; device?: boolean
}) {
  return (
    <div className="flex items-center gap-3 p-3.5">
      <span className={cn('grid size-10 shrink-0 place-items-center rounded-xl bg-canvas-2', tone)}>
        <Icon className="size-4" aria-hidden />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-2">
          <p className="text-sm font-bold text-ink-900">{label}</p>
          <p className="tabular shrink-0 text-sm font-bold text-ink-900">{value}</p>
        </div>
        {hint && <p className="mt-0.5 truncate text-[11px] text-ink-500">{hint}</p>}
        {typeof progress === 'number' && (
          <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-canvas-2">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${Math.min(100, progress)}%` }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="h-full rounded-full bg-brand-500"
            />
          </div>
        )}
      </div>
      <button
        onClick={onLog}
        aria-label={device ? `Sync ${label}` : `Log ${label}`}
        className="press grid size-9 shrink-0 place-items-center rounded-full border border-line bg-surface text-ink-500"
      >
        <Plus className="size-4" aria-hidden />
      </button>
    </div>
  )
}

/* ── Sheet bodies ────────────────────────────────────────────────────── */
function WaterLogger({ current, target, onDone }: { current: number; target: number; onDone: (ml: number) => void }) {
  const [ml, setMl] = useState(current)
  const pct = Math.min(100, Math.round((ml / target) * 100))

  return (
    <div>
      <div className="relative h-32 overflow-hidden rounded-2xl border border-line bg-canvas-2">
        <motion.div
          className="absolute inset-x-0 bottom-0 bg-sky-accent/25"
          animate={{ height: `${pct}%` }}
          transition={spring.soft}
        >
          <span aria-hidden className="fx-wave">
            <svg className="fx-wave__surface absolute -top-2 left-0 h-4 w-[200%] text-sky-accent/40" viewBox="0 0 200 12" preserveAspectRatio="none">
              <path d="M0 6 Q 12.5 0 25 6 T 50 6 T 75 6 T 100 6 T 125 6 T 150 6 T 175 6 T 200 6 V 12 H 0 Z" fill="currentColor" />
            </svg>
          </span>
        </motion.div>
        <div className="absolute inset-0 grid place-items-center">
          <div className="text-center">
            <p className="tabular text-3xl font-bold tracking-[-.05em] text-ink-900">{(ml / 1000).toFixed(2)}L</p>
            <p className="text-xs text-ink-500">of {(target / 1000).toFixed(1)}L · {pct}%</p>
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-4 gap-2">
        {[250, 330, 500, 750].map((amount) => (
          <button
            key={amount}
            onClick={() => { setMl((v) => v + amount); if (typeof navigator !== 'undefined' && 'vibrate' in navigator) navigator.vibrate?.(12) }}
            className="press rounded-xl border border-line bg-surface py-3 text-xs font-bold text-ink-900"
          >
            +{amount}
          </button>
        ))}
      </div>

      <button
        onClick={() => onDone(ml - current)}
        className="press mt-4 w-full rounded-full bg-brand-600 py-3.5 text-sm font-bold text-white"
      >
        Save {ml > current ? `+${ml - current}ml` : 'entry'}
      </button>
    </div>
  )
}

function WeightLogger({ current, onDone }: { current: number; onDone: (kg: number) => void }) {
  const [kg, setKg] = useState(current)
  return (
    <div>
      <div className="rounded-2xl border border-line bg-canvas-2 p-6 text-center">
        <p className="text-xs font-bold uppercase tracking-[.16em] text-ink-500">New weight</p>
        <div className="mt-3 flex items-center justify-center gap-4">
          <button onClick={() => setKg((v) => Math.max(40, +(v - 0.1).toFixed(1)))} aria-label="Decrease by 100 grams"
            className="press grid size-11 place-items-center rounded-full border border-line bg-surface text-xl font-bold text-ink-700">−</button>
          <span className="tabular min-w-[120px] text-4xl font-bold tracking-[-.06em] text-ink-900">{kg.toFixed(1)}</span>
          <button onClick={() => setKg((v) => Math.min(200, +(v + 0.1).toFixed(1)))} aria-label="Increase by 100 grams"
            className="press grid size-11 place-items-center rounded-full border border-line bg-surface text-xl font-bold text-ink-700">+</button>
        </div>
        <p className="mt-2 text-xs text-ink-500">
          {kg < current ? `${(current - kg).toFixed(1)} kg down from yesterday` : kg > current ? `${(kg - current).toFixed(1)} kg up from yesterday` : 'Same as yesterday'}
        </p>
      </div>
      <button onClick={() => onDone(kg)} className="press mt-4 w-full rounded-full bg-brand-600 py-3.5 text-sm font-bold text-white">
        Save weight
      </button>
    </div>
  )
}

function NoteLogger({ onDone }: { onDone: () => void }) {
  const [body, setBody] = useState('')
  const [mood, setMood] = useState<'great' | 'good' | 'ok' | 'low'>('good')
  return (
    <div>
      <div className="flex gap-2">
        {(['great', 'good', 'ok', 'low'] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMood(m)}
            aria-pressed={mood === m}
            className={cn('press flex-1 rounded-xl border py-2.5 text-xs font-bold capitalize',
              mood === m ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-line bg-surface text-ink-500')}
          >
            {m === 'great' ? '😄' : m === 'good' ? '🙂' : m === 'ok' ? '😐' : '😕'} {m}
          </button>
        ))}
      </div>
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={4}
        placeholder="How did today feel? Energy, cravings, sleep — anything worth noticing."
        className="mt-3 w-full resize-none rounded-2xl border border-line bg-surface p-4 text-sm text-ink-900 outline-none placeholder:text-ink-300 focus:border-brand-500"
      />
      <button
        onClick={onDone}
        disabled={!body.trim()}
        className="press mt-3 w-full rounded-full bg-brand-600 py-3.5 text-sm font-bold text-white disabled:opacity-40"
      >
        Save note
      </button>
    </div>
  )
}

/* Re-exported so other screens can reuse the same sheet bodies. */
export { WaterLogger, WeightLogger, NoteLogger }
