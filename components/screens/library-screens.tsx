'use client'

/**
 * Discovery screens: Recipes, Workouts, Goals, Weekly Report, Notes,
 * Devices and Exercise.
 *
 * Effects: 02 stagger · 18 skeleton→content · 25 sheet · 26 segmented ·
 * 31 typewriter · 34 toast · 36 rail · 38 confetti · 40 donut ·
 * 42 wave · 46 layout animation on goal add.
 */

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Apple, BadgeCheck, Bluetooth, Check, ChevronRight, Dumbbell, Flame, Footprints,
  HeartPulse, Moon, NotebookPen, Plus, RefreshCw, Scale, Search, Share2, Sparkles,
  Target, Timer, TrendingUp, Utensils, Watch, Zap,
} from 'lucide-react'
import { AppShell } from '@/components/app-shell'
import { CountUp, Reveal, Stagger, TiltCard, Typewriter } from '@/components/motion'
import { BarChart, Donut, Heatmap, MacroBar, ProgressRing } from '@/components/charts'
import { Card, Disclosure, EmptyState, ScreenIntro, Segmented, Sheet } from '@/components/ui-kit'
import { toast } from '@/components/toast'
import { cn } from '@/lib/utils'
import { layoutItem, spring } from '@/lib/motion'
import { clock, nf, shortDay } from '@/lib/format'
import {
  DEVICES, EXERCISE, GOALS, HABITS, LAST_28, LAST_7, NOTES, SLEEP,
  STEP_GOAL, WEIGHT_CURRENT, WEIGHT_START, todayHabits,
} from '@/lib/data/health'
import { RECIPES, WORKOUTS, recipeById } from '@/lib/data/library'
import { SEED_DIARY } from '@/lib/data/fixtures'

/* ══════════════════════════════════════════════════════════════════════
   RECIPES — discovery
   ═════════════════════════════════════════════════════════════════════ */
const DIET_FILTERS = ['All', 'Vegan', 'Vegetarian', 'Gluten free', 'High protein', 'Low sugar'] as const

export function RecipesScreen() {
  const [tag, setTag] = useState<(typeof DIET_FILTERS)[number]>('All')
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState<string | null>(null)

  const filtered = useMemo(
    () =>
      RECIPES.filter((r) => {
        const matchesTag = tag === 'All' || r.diet.some((d) => d.replace('-', ' ').toLowerCase() === tag.toLowerCase())
        const matchesQuery = !query || r.name.toLowerCase().includes(query.toLowerCase()) || r.tags.some((t) => t.toLowerCase().includes(query.toLowerCase()))
        return matchesTag && matchesQuery
      }),
    [tag, query],
  )

  const openRecipe = open ? recipeById(open) : null

  return (
    <AppShell title="Recipes" back={{ href: '/app/more', label: 'More' }}>
      <div className="container-ns pt-4">
        <ScreenIntro
          eyebrow="Recipe discovery"
          title="Cook something that scores well."
          copy={`${RECIPES.length} recipes, each scored with the same engine as a packaged product. Every one is filtered against your allergies and diet already.`}
        />

        {/* Search + filters */}
        <div className="mt-5 flex items-center gap-2 rounded-2xl border border-line bg-surface px-4 py-1.5">
          <Search className="size-4 shrink-0 text-ink-300" aria-hidden />
          <label htmlFor="recipe-search" className="sr-only">Search recipes</label>
          <input
            id="recipe-search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search recipes, tags or ingredients"
            className="min-w-0 flex-1 bg-transparent py-2.5 text-sm text-ink-900 outline-none placeholder:text-ink-300"
          />
        </div>

        <div className="mt-3 -mx-5 overflow-x-auto px-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex gap-2">
            {DIET_FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setTag(f)}
                aria-pressed={tag === f}
                className={cn(
                  'press shrink-0 rounded-full border px-3.5 py-2 text-xs font-bold transition-colors',
                  tag === f ? 'border-brand-500 bg-brand-500 text-white' : 'border-line bg-surface text-ink-500',
                )}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        {!filtered.length ? (
          <div className="mt-6">
            <EmptyState
              icon={Utensils}
              title="No recipes match that"
              copy={`Nothing in the library fits “${query || tag}”. Try a broader tag, or scan a product instead.`}
              action={{ href: '/app/scan', label: 'Scan a product' }}
            />
          </div>
        ) : (
          <Stagger className="mt-5 space-y-3">
            {filtered.map((recipe) => (
              <article key={recipe.id}>
                <TiltCard className="rounded-[26px] border border-line bg-surface p-5 shadow-soft">
                  <div className="flex items-start gap-4">
                    <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-canvas-2 text-2xl" aria-hidden>
                      {recipe.emoji}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <h2 className="text-base font-bold leading-tight text-ink-900">{recipe.name}</h2>
                        <span className="tabular shrink-0 rounded-full px-2.5 py-1 text-xs font-bold"
                          style={{
                            background: recipe.score >= 85 ? 'var(--brand-500)/14' : 'var(--score-good)/14',
                            color: recipe.score >= 85 ? 'var(--score-great)' : 'var(--score-good)',
                          }}>
                          {recipe.score}
                        </span>
                      </div>
                      <p className="mt-1.5 text-xs leading-5 text-ink-500">{recipe.description}</p>

                      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-ink-500">
                        <span className="inline-flex items-center gap-1"><Timer className="size-3" aria-hidden /> {recipe.minutes} min</span>
                        <span className="inline-flex items-center gap-1"><Utensils className="size-3" aria-hidden /> {recipe.servings} servings</span>
                        <span className="tabular inline-flex items-center gap-1"><Flame className="size-3" aria-hidden /> {recipe.kcal} kcal</span>
                        <span className="tabular inline-flex items-center gap-1"><Dumbbell className="size-3" aria-hidden /> {recipe.protein}g protein</span>
                      </div>

                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {recipe.tags.slice(0, 3).map((t) => (
                          <span key={t} className="rounded-full bg-canvas-2 px-2.5 py-1 text-[10px] font-semibold text-ink-700">{t}</span>
                        ))}
                      </div>

                      <button
                        onClick={() => setOpen(recipe.id)}
                        className="press mt-4 flex w-full items-center justify-center gap-1.5 rounded-xl bg-brand-600 py-3 text-xs font-bold text-white"
                      >
                        View recipe <ChevronRight className="size-3.5" aria-hidden />
                      </button>
                    </div>
                  </div>
                </TiltCard>
              </article>
            ))}
          </Stagger>
        )}
      </div>

      {/* Recipe detail sheet */}
      <Sheet open={Boolean(openRecipe)} onClose={() => setOpen(null)} title={openRecipe?.name ?? ''}>
        {openRecipe && (
          <div className="max-h-[65vh] overflow-y-auto">
            <div className="flex items-center gap-4">
              <span className="grid size-16 shrink-0 place-items-center rounded-2xl bg-canvas-2 text-3xl" aria-hidden>{openRecipe.emoji}</span>
              <div className="min-w-0">
                <p className="text-sm leading-6 text-ink-500">{openRecipe.description}</p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-4 gap-2">
              {[
                { label: 'kcal', value: openRecipe.kcal },
                { label: 'protein', value: `${openRecipe.protein}g` },
                { label: 'carbs', value: `${openRecipe.carbs}g` },
                { label: 'fat', value: `${openRecipe.fat}g` },
              ].map((m) => (
                <div key={m.label} className="rounded-xl bg-canvas-2 p-3 text-center">
                  <p className="tabular text-sm font-bold text-ink-900">{m.value}</p>
                  <p className="text-[10px] text-ink-500">{m.label}</p>
                </div>
              ))}
            </div>

            <h3 className="mt-5 text-sm font-bold text-ink-900">Ingredients</h3>
            <ul className="mt-2 space-y-1.5">
              {openRecipe.ingredients.map((i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-ink-700">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-brand-500" aria-hidden />
                  {i}
                </li>
              ))}
            </ul>

            <h3 className="mt-5 text-sm font-bold text-ink-900">Method</h3>
            <ol className="mt-2 space-y-2.5">
              {openRecipe.steps.map((s, i) => (
                <li key={s} className="flex gap-3 text-sm leading-6 text-ink-700">
                  <span className="grid size-6 shrink-0 place-items-center rounded-full bg-brand-50 text-[11px] font-bold text-brand-700">{i + 1}</span>
                  {s}
                </li>
              ))}
            </ol>

            {openRecipe.allergens.length > 0 && (
              <p className="mt-5 rounded-2xl bg-score-danger/10 p-4 text-xs leading-5 text-ink-700">
                <b className="text-score-danger">Contains:</b> {openRecipe.allergens.join(', ')}. Swap or omit before cooking.
              </p>
            )}

            <button
              onClick={() => { toast(`${openRecipe.name} added to your plan`, 'success'); setOpen(null) }}
              className="press mt-5 w-full rounded-full bg-brand-600 py-3.5 text-sm font-bold text-white"
            >
              Add to my meal plan
            </button>
          </div>
        )}
      </Sheet>
    </AppShell>
  )
}

/* ══════════════════════════════════════════════════════════════════════
   WORKOUTS
   ═════════════════════════════════════════════════════════════════════ */
export function WorkoutsScreen() {
  const [level, setLevel] = useState<'all' | 'beginner' | 'intermediate' | 'advanced'>('all')
  const [open, setOpen] = useState<string | null>(null)

  const filtered = level === 'all' ? WORKOUTS : WORKOUTS.filter((w) => w.level === level)
  const routine = open ? WORKOUTS.find((w) => w.id === open) : null
  const weekKcal = EXERCISE.reduce((s, x) => s + x.kcal, 0)

  return (
    <AppShell title="Workouts" back={{ href: '/app/more', label: 'More' }}>
      <div className="container-ns pt-4">
        <ScreenIntro
          eyebrow="Workout routines"
          title="Training that matches what you eat."
          copy="Six routines from a 20-minute home circuit to a barbell session. Log one and the calories land in today's budget automatically."
        />

        <Stagger className="mt-5 grid grid-cols-3 gap-3">
          {[
            { label: 'This week', value: EXERCISE.filter((x) => LAST_7.includes(x.day)).length, unit: 'sessions' },
            { label: 'Burned', value: weekKcal, unit: 'kcal' },
            { label: 'Avg session', value: Math.round(EXERCISE.reduce((s, x) => s + x.minutes, 0) / EXERCISE.length), unit: 'min' },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl border border-line bg-surface p-4">
              <p className="text-[11px] font-medium text-ink-500">{s.label}</p>
              <p className="tabular mt-1.5 text-xl font-bold text-ink-900">
                <CountUp value={s.value} /><span className="ml-0.5 text-[10px] font-medium text-ink-300">{s.unit}</span>
              </p>
            </div>
          ))}
        </Stagger>

        <div className="mt-5">
          <Segmented
            label="Workout level"
            options={[
              { id: 'all', label: 'All' },
              { id: 'beginner', label: 'Beginner' },
              { id: 'intermediate', label: 'Intermediate' },
              { id: 'advanced', label: 'Advanced' },
            ]}
            value={level}
            onChange={setLevel}
          />
        </div>

        <Stagger className="mt-4 space-y-3">
          {filtered.map((w) => (
            <button
              key={w.id}
              onClick={() => setOpen(w.id)}
              className="press w-full rounded-[26px] border border-line bg-surface p-5 text-left"
            >
              <div className="flex items-start gap-4">
                <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-canvas-2 text-2xl" aria-hidden>{w.emoji}</span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <h2 className="text-base font-bold text-ink-900">{w.name}</h2>
                    <span className={cn('shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold capitalize',
                      w.level === 'beginner' ? 'bg-brand-500/14 text-brand-700'
                        : w.level === 'intermediate' ? 'bg-mango/18 text-citrus-text'
                          : 'bg-score-danger/14 text-score-danger')}>
                      {w.level}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-ink-500">{w.focus}</p>
                  <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-ink-500">
                    <span className="tabular inline-flex items-center gap-1"><Timer className="size-3" aria-hidden /> {w.minutes} min</span>
                    <span className="tabular inline-flex items-center gap-1"><Flame className="size-3" aria-hidden /> {w.kcal} kcal</span>
                    <span className="inline-flex items-center gap-1"><Dumbbell className="size-3" aria-hidden /> {w.equipment}</span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </Stagger>

        {/* Recent sessions */}
        <Reveal delay={80} className="mt-6">
          <Card className="p-5">
            <h2 className="text-base font-bold text-ink-900">Recent sessions</h2>
            <ul className="mt-4 divide-y divide-line">
              {EXERCISE.slice(0, 5).map((x) => (
                <li key={x.id} className="flex items-center gap-3 py-3">
                  <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-canvas-2 text-ink-500">
                    <Dumbbell className="size-4" aria-hidden />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold text-ink-900">{x.name}</span>
                    <span className="block text-[11px] text-ink-500">
                      {shortDay(x.day)} · {x.minutes} min · {x.source === 'device' ? 'from Apple Watch' : 'manual'}
                    </span>
                  </span>
                  <span className="tabular shrink-0 text-sm font-bold text-brand-600">{x.kcal}</span>
                </li>
              ))}
            </ul>
          </Card>
        </Reveal>
      </div>

      <Sheet open={Boolean(routine)} onClose={() => setOpen(null)} title={routine?.name ?? ''}>
        {routine && (
          <div className="max-h-[65vh] overflow-y-auto">
            <div className="flex items-center gap-4">
              <span className="grid size-16 shrink-0 place-items-center rounded-2xl bg-canvas-2 text-3xl" aria-hidden>{routine.emoji}</span>
              <div>
                <p className="text-sm font-bold text-ink-900">{routine.focus}</p>
                <p className="tabular mt-0.5 text-xs text-ink-500">{routine.minutes} min · {routine.kcal} kcal · {routine.equipment}</p>
              </div>
            </div>

            <ul className="mt-5 divide-y divide-line">
              {routine.exercises.map((ex, i) => (
                <li key={ex.name} className="flex items-center gap-3 py-3">
                  <span className="grid size-7 shrink-0 place-items-center rounded-full bg-brand-50 text-[11px] font-bold text-brand-700">{i + 1}</span>
                  <span className="min-w-0 flex-1 text-sm font-semibold text-ink-900">{ex.name}</span>
                  <span className="tabular shrink-0 text-xs font-bold text-ink-700">{ex.sets}</span>
                  <span className="w-12 shrink-0 text-right text-[11px] text-ink-300">{ex.rest}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => { toast(`${routine.name} started — ${routine.kcal} kcal estimated`, 'success'); setOpen(null) }}
              className="press mt-5 w-full rounded-full bg-brand-600 py-3.5 text-sm font-bold text-white"
            >
              Start workout
            </button>
          </div>
        )}
      </Sheet>
    </AppShell>
  )
}

/* ══════════════════════════════════════════════════════════════════════
   GOALS
   ═════════════════════════════════════════════════════════════════════ */
export function GoalsScreen() {
  const [goals, setGoals] = useState(GOALS)
  const [addOpen, setAddOpen] = useState(false)
  const [kind, setKind] = useState<'weight' | 'water' | 'steps' | 'fasting'>('water')

  const presets = {
    weight: { label: 'Weight goal', unit: 'kg', target: 70, current: WEIGHT_CURRENT },
    water: { label: 'Water a day', unit: 'ml', target: 3000, current: 1500 },
    steps: { label: 'Steps a day', unit: 'steps', target: 12000, current: 9840 },
    fasting: { label: 'Fasting days a week', unit: 'days', target: 6, current: 4 },
  } as const

  const addGoal = () => {
    const preset = presets[kind]
    setGoals((prev) => [...prev, {
      id: `goal-${Date.now()}`,
      kind,
      label: preset.label,
      unit: preset.unit,
      current: preset.current,
      target: preset.target,
      startedAt: new Date().toISOString().slice(0, 10),
    }])
    setAddOpen(false)
    toast(`${preset.label} added`, 'success')
  }

  return (
    <AppShell title="Goals" back={{ href: '/app/more', label: 'More' }}>
      <div className="container-ns pt-4">
        <ScreenIntro
          eyebrow="Goals"
          title="Six targets, one place."
          copy="Every goal here feeds the Today screen, the Progress charts and the weekly report. Change one and everything downstream updates."
          action={
            <button onClick={() => setAddOpen(true)}
              className="press shrink-0 rounded-full bg-brand-600 px-4 py-2.5 text-xs font-bold text-white">
              <Plus className="mr-1 inline size-3.5" aria-hidden /> Add
            </button>
          }
        />

        <motion.ul layout className="mt-5 space-y-3">
          <AnimatePresence mode="popLayout">
            {goals.map((goal, i) => {
              const pct = goal.lowerIsBetter
                ? Math.round(((WEIGHT_START - goal.current) / Math.max(0.1, WEIGHT_START - goal.target)) * 100)
                : Math.round((goal.current / goal.target) * 100)
              const done = pct >= 100
              return (
                <motion.li key={goal.id} {...layoutItem(i)}>
                  <Card className="p-5">
                    <div className="flex items-center gap-4">
                      <ProgressRing
                        value={Math.max(0, pct)} target={100}
                        size={68} thickness={7}
                        color={done ? 'var(--score-great)' : 'var(--brand-500)'}
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <h2 className="text-sm font-bold text-ink-900">{goal.label}</h2>
                          {done && (
                            <span className="grid size-5 shrink-0 place-items-center rounded-full bg-brand-500 text-white">
                              <Check className="size-3" aria-hidden />
                            </span>
                          )}
                        </div>
                        <p className="tabular mt-1 text-xs text-ink-500">
                          {goal.lowerIsBetter ? `${WEIGHT_CURRENT.toFixed(1)} → ${goal.target} ${goal.unit}` : `${nf(goal.current)} / ${nf(goal.target)} ${goal.unit}`}
                        </p>
                        <div className="mt-3 flex gap-1.5">
                          <button
                            onClick={() => toast('Goal editor is in the full build', 'info')}
                            className="press rounded-lg border border-line bg-canvas px-3 py-1.5 text-[11px] font-bold text-ink-700"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => setGoals((prev) => prev.filter((g) => g.id !== goal.id))}
                            className="press rounded-lg border border-line bg-canvas px-3 py-1.5 text-[11px] font-bold text-ink-500"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.li>
              )
            })}
          </AnimatePresence>
        </motion.ul>

        <Reveal delay={80} className="mt-3">
          <Card className="p-5">
            <Disclosure question="How targets are calculated" defaultOpen={false}>
              Your calorie and macro targets come from your goal, weight, height and activity level using
              the Mifflin-St Jeor equation, then adjusted for the rate of loss you selected. Change any input
              and every target recalculates.
            </Disclosure>
            <Disclosure question="Should I set a weight goal?" defaultOpen={false}>
              Weight is one metric among many, and it is a noisy one. If the scale stresses you, track
              waist measurement, energy, or your score average instead — all three are on the Progress tab.
            </Disclosure>
          </Card>
        </Reveal>
      </div>

      <Sheet open={addOpen} onClose={() => setAddOpen(false)} title="Add a goal">
        <div className="grid grid-cols-2 gap-2">
          {(Object.keys(presets) as (keyof typeof presets)[]).map((k) => (
            <button
              key={k}
              onClick={() => setKind(k)}
              aria-pressed={kind === k}
              className={cn('press rounded-2xl border p-4 text-left transition-colors',
                kind === k ? 'border-brand-500 bg-brand-50' : 'border-line bg-surface')}
            >
              <p className="text-sm font-bold capitalize text-ink-900">{k}</p>
              <p className="tabular mt-0.5 text-[11px] text-ink-500">
                Target {presets[k].target} {presets[k].unit}
              </p>
            </button>
          ))}
        </div>
        <button onClick={addGoal} className="press mt-4 w-full rounded-full bg-brand-600 py-3.5 text-sm font-bold text-white">
          Add goal
        </button>
      </Sheet>
    </AppShell>
  )
}

/* ══════════════════════════════════════════════════════════════════════
   WEEKLY REPORT
   ═════════════════════════════════════════════════════════════════════ */
export function ReportScreen() {
  const habits = todayHabits()
  const weekData = LAST_7.map((day, i) => {
    const entries = SEED_DIARY.filter((e) => e.day === day)
    return {
      day: shortDay(day).split(' ')[0].slice(0, 1),
      kcal: entries.reduce((s, e) => s + e.kcal, 0),
      score: entries.length ? Math.round(entries.reduce((s, e) => s + e.score, 0) / entries.length) : 0,
      steps: HABITS.find((h) => h.day === day)?.steps ?? 0,
    }
  })

  const avgScore = Math.round(weekData.reduce((s, d) => s + d.score, 0) / 7) || 0
  const bestDay = weekData.reduce((a, b) => (b.score > a.score ? b : a))
  const worstDay = weekData.filter((d) => d.score > 0).reduce((a, b) => (b.score < a.score ? b : a))

  return (
    <AppShell title="Weekly report" back={{ href: '/app/progress', label: 'Progress' }}>
      <div className="container-ns pt-4">
        <ScreenIntro
          eyebrow="Weekly digest"
          title="Your week, in one page."
          copy="Generated every Sunday evening. Share it with your dietitian, or keep it as a record of what you actually ate."
          action={
            <button
              onClick={() => toast('Report link copied — expires in 7 days', 'info')}
              aria-label="Share report"
              className="press grid size-10 shrink-0 place-items-center rounded-full border border-line bg-surface text-ink-500"
            >
              <Share2 className="size-4" aria-hidden />
            </button>
          }
        />

        {/* Headline */}
        <Reveal variant="scale" className="mt-5">
          <Card className="relative overflow-hidden p-6">
            <div aria-hidden className="absolute -right-16 -top-16 size-48 rounded-full bg-brand-500/10 blur-3xl" />
            <div className="relative flex items-center gap-5">
              <div className="text-center">
                <p className="tabular text-[3rem] font-bold leading-none tracking-[-.06em] text-ink-900">
                  <CountUp value={avgScore} />
                </p>
                <p className="mt-1 text-[10px] font-bold uppercase tracking-[.16em] text-brand-600">Avg score</p>
              </div>
              <div className="min-w-0 flex-1 border-l border-line pl-5">
                <p className="text-sm font-bold text-ink-900">Your most consistent week yet.</p>
                <p className="mt-1.5 text-xs leading-5 text-ink-500">
                  Six of seven days logged, average score up 6 points on last week, and the two
                  highest-sugar days both involved the same product.
                </p>
              </div>
            </div>
          </Card>
        </Reveal>

        {/* Charts */}
        <Reveal delay={60} className="mt-3">
          <Card className="p-5">
            <h2 className="text-base font-bold text-ink-900">Score by day</h2>
            <BarChart
              className="mt-4"
              data={weekData}
              valueKey="score"
              labelKey="day"
              goal={80}
              height={120}
              colorFor={(v) => v >= 80 ? 'var(--score-great)' : v >= 60 ? 'var(--score-good)' : v >= 40 ? 'var(--score-warn)' : 'var(--score-danger)'}
            />
          </Card>
        </Reveal>

        {/* Cards */}
        <Stagger className="mt-3 grid gap-3 sm:grid-cols-2">
          <Card className="p-5">
            <div className="flex items-center gap-2">
              <TrendingUp className="size-4 text-brand-600" aria-hidden />
              <h2 className="text-sm font-bold text-ink-900">Best day</h2>
            </div>
            <p className="tabular mt-2 text-2xl font-bold text-brand-600">{bestDay.score}</p>
            <p className="mt-1 text-xs text-ink-500">
              High fiber, 84g protein, and no ultra-processed food. This is the template.
            </p>
          </Card>

          <Card className="p-5">
            <div className="flex items-center gap-2">
              <Target className="size-4 text-citrus-text" aria-hidden />
              <h2 className="text-sm font-bold text-ink-900">Day to learn from</h2>
            </div>
            <p className="tabular mt-2 text-2xl font-bold text-score-warn">{worstDay.score}</p>
            <p className="mt-1 text-xs text-ink-500">
              Instant noodles at 1160 mg sodium. Convenience, not failure — keep a backup meal in the freezer.
            </p>
          </Card>

          <Card className="p-5">
            <div className="flex items-center gap-2">
              <Footprints className="size-4 text-brand-600" aria-hidden />
              <h2 className="text-sm font-bold text-ink-900">Movement</h2>
            </div>
            <p className="tabular mt-2 text-2xl font-bold text-ink-900">
              {nf(Math.round(weekData.reduce((s, d) => s + d.steps, 0) / 7))}
            </p>
            <p className="mt-1 text-xs text-ink-500">Average steps a day. You cleared 10,000 on four days.</p>
          </Card>

          <Card className="p-5">
            <div className="flex items-center gap-2">
              <Zap className="size-4 text-citrus-text" aria-hidden />
              <h2 className="text-sm font-bold text-ink-900">Streak</h2>
            </div>
            <p className="tabular mt-2 text-2xl font-bold text-ink-900">4 days</p>
            <p className="mt-1 text-xs text-ink-500">Longest run this quarter. Best ever is 21 days.</p>
          </Card>
        </Stagger>

        {/* Coach note */}
        <Reveal delay={100} className="mt-3">
          <Card className="p-5">
            <div className="flex items-center gap-2">
              <Sparkles className="size-4 text-berry" aria-hidden />
              <h2 className="text-base font-bold text-ink-900">What to change next week</h2>
            </div>
            <Typewriter
              className="mt-3 text-sm leading-6 text-ink-700"
              text="Your protein hit rate is the highest-leverage number left. On the three days you missed 146g, breakfast contributed under 10g. Add a fifth of your protein at breakfast — Greek yogurt, eggs, or the overnight oats recipe — and you will clear the target without changing anything else."
            />
            <div className="mt-4 flex flex-wrap gap-2">
              <Link href="/app/recipes" className="press rounded-full bg-brand-600 px-4 py-2.5 text-xs font-bold text-white">
                Breakfast recipes
              </Link>
              <Link href="/app/goals" className="press rounded-full border border-line bg-surface px-4 py-2.5 text-xs font-bold text-ink-700">
                Adjust targets
              </Link>
            </div>
          </Card>
        </Reveal>

        <Reveal delay={120} className="mt-3">
          <Card className="p-5">
            <h2 className="text-base font-bold text-ink-900">Consistency</h2>
            <Heatmap
              className="mt-4"
              cells={LAST_28.map((day, i) => ({ label: shortDay(day), value: HABITS[i]?.steps ?? 0, max: STEP_GOAL }))}
            />
            <p className="mt-3 text-xs text-ink-500">Four weeks of step data. Weekends are your strong days.</p>
          </Card>
        </Reveal>

        <Reveal delay={140} className="mt-3">
          <Card className="p-5">
            <h2 className="text-base font-bold text-ink-900">Sleep and intake</h2>
            <ul className="mt-4 divide-y divide-line">
              {SLEEP.map((s) => (
                <li key={s.day} className="flex items-center gap-3 py-3">
                  <Moon className="size-4 shrink-0 text-berry" aria-hidden />
                  <span className="w-16 shrink-0 text-xs font-semibold text-ink-500">{shortDay(s.day)}</span>
                  <span className="tabular flex-1 text-sm text-ink-700">{s.hours.toFixed(1)}h sleep</span>
                  <span className={cn('tabular text-xs font-bold', s.quality >= 80 ? 'text-brand-600' : 'text-citrus-text')}>
                    quality {s.quality}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-4 rounded-2xl bg-canvas-2 p-4 text-xs leading-5 text-ink-500">
              {habits.waterMl}ml of water today. Under six hours of sleep correlates with a 14g
              higher sugar intake the following day across your logged data.
            </p>
          </Card>
        </Reveal>

        <p className="mt-6 mb-2 text-center text-[11px] text-ink-300">
          Educational summary. Not a clinical assessment.
        </p>
      </div>
    </AppShell>
  )
}

/* ══════════════════════════════════════════════════════════════════════
   NOTES
   ═════════════════════════════════════════════════════════════════════ */
export function NotesScreen() {
  const [notes, setNotes] = useState(NOTES)
  const [draft, setDraft] = useState('')
  const [mood, setMood] = useState<'great' | 'good' | 'ok' | 'low'>('good')

  const MOODS = { great: '😄', good: '🙂', ok: '😐', low: '😕' }

  return (
    <AppShell title="Notes" back={{ href: '/app/more', label: 'More' }}>
      <div className="container-ns pt-4">
        <ScreenIntro
          eyebrow="Notes"
          title="A line a day is enough."
          copy="What you ate, how you felt, what you noticed. Three weeks of notes usually explains more than three weeks of numbers."
        />

        {/* Composer */}
        <Reveal className="mt-5">
          <Card className="p-5">
            <div className="flex gap-2">
              {(Object.keys(MOODS) as (keyof typeof MOODS)[]).map((m) => (
                <button
                  key={m}
                  onClick={() => setMood(m)}
                  aria-pressed={mood === m}
                  aria-label={m}
                  className={cn('press flex-1 rounded-xl border py-2.5 text-xl transition-colors',
                    mood === m ? 'border-brand-500 bg-brand-50' : 'border-line bg-surface')}
                >
                  {MOODS[m]}
                </button>
              ))}
            </div>
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              rows={3}
              placeholder="Energy, cravings, sleep, anything worth noticing."
              className="mt-3 w-full resize-none rounded-2xl border border-line bg-canvas p-4 text-sm text-ink-900 outline-none placeholder:text-ink-300 focus:border-brand-500"
            />
            <button
              disabled={!draft.trim()}
              onClick={() => {
                setNotes((prev) => [{
                  id: `n-${Date.now()}`,
                  day: new Date().toISOString().slice(0, 10),
                  time: clock(new Date()),
                  body: draft,
                  mood,
                }, ...prev])
                setDraft('')
                toast('Note saved', 'success')
              }}
              className="press mt-3 w-full rounded-full bg-brand-600 py-3.5 text-sm font-bold text-white disabled:opacity-40"
            >
              Save note
            </button>
          </Card>
        </Reveal>

        <motion.ul layout className="mt-3 space-y-2.5">
          <AnimatePresence mode="popLayout">
            {notes.map((note, i) => (
              <motion.li key={note.id} {...layoutItem(i)}>
                <Card className="p-5">
                  <div className="flex items-start gap-3">
                    <span className="text-xl" aria-hidden>{MOODS[note.mood ?? 'good']}</span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm leading-6 text-ink-700">{note.body}</p>
                      <p className="mt-2 text-[11px] text-ink-300">
                        {shortDay(note.day)} · {note.time}
                      </p>
                    </div>
                    <button
                      onClick={() => setNotes((prev) => prev.filter((n) => n.id !== note.id))}
                      aria-label="Delete note"
                      className="press shrink-0 text-[11px] font-bold text-ink-300"
                    >
                      Delete
                    </button>
                  </div>
                </Card>
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>

        {!notes.length && (
          <div className="mt-3">
            <EmptyState icon={NotebookPen} title="No notes yet" copy="Add your first line above. Even one sentence a day builds a useful record." />
          </div>
        )}
      </div>
    </AppShell>
  )
}

/* ══════════════════════════════════════════════════════════════════════
   DEVICES
   ═════════════════════════════════════════════════════════════════════ */
export function DevicesScreen() {
  const [devices, setDevices] = useState(DEVICES)
  const [syncing, setSyncing] = useState<string | null>(null)

  const ICONS = { watch: Watch, band: Watch, scale: Scale, cgm: HeartPulse, phone: Apple }

  const sync = (id: string) => {
    setSyncing(id)
    window.setTimeout(() => {
      setSyncing(null)
      setDevices((prev) => prev.map((d) => (d.id === id ? { ...d, syncing: true, lastSync: 'Just now' } : d)))
      toast('Sync complete', 'success')
    }, 1400)
  }

  return (
    <AppShell title="Apps & devices" back={{ href: '/app/more', label: 'More' }}>
      <div className="container-ns pt-4">
        <ScreenIntro
          eyebrow="Integrations"
          title="Connect what you already wear."
          copy="Data flows one way — from your devices into Nutrition Scan. We never write back to your health records, and we never sell anything."
        />

        <Stagger className="mt-5 space-y-2.5">
          {devices.map((d) => {
            const Icon = ICONS[d.kind]
            const isSyncing = syncing === d.id
            return (
              <div key={d.id} className="rounded-[24px] border border-line bg-surface p-4">
                <div className="flex items-center gap-3.5">
                  <span className={cn('grid size-11 shrink-0 place-items-center rounded-2xl',
                    d.syncing ? 'bg-brand-50 text-brand-600' : 'bg-canvas-2 text-ink-300')}>
                    <Icon className="size-5" aria-hidden />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h2 className="truncate text-sm font-bold text-ink-900">{d.name}</h2>
                      {d.syncing && <BadgeCheck className="size-3.5 shrink-0 text-brand-500" aria-label="Connected" />}
                    </div>
                    <p className="mt-0.5 truncate text-xs text-ink-500">
                      {d.syncing ? `Synced ${d.lastSync}` : 'Not connected'} · {d.metrics.join(', ')}
                    </p>
                  </div>
                  <button
                    onClick={() => sync(d.id)}
                    disabled={isSyncing}
                    className={cn('press shrink-0 rounded-full px-3.5 py-2 text-[11px] font-bold',
                      d.syncing ? 'border border-line bg-canvas text-ink-700' : 'bg-brand-600 text-white')}
                  >
                    {isSyncing ? <RefreshCw className="size-3.5 animate-spin" aria-hidden /> : d.syncing ? 'Re-sync' : 'Connect'}
                  </button>
                </div>
              </div>
            )
          })}
        </Stagger>

        <Reveal delay={80} className="mt-5">
          <Card className="p-5">
            <div className="flex items-start gap-3">
              <Bluetooth className="mt-0.5 size-5 shrink-0 text-berry" aria-hidden />
              <div>
                <p className="text-sm font-bold text-ink-900">Permissions</p>
                <p className="mt-1 text-xs leading-5 text-ink-500">
                  Nutrition Scan reads only the categories listed on each device. You can revoke access
                  at any time in iOS Health or Android Health Connect — nothing breaks, you just stop
                  receiving automatic entries.
                </p>
              </div>
            </div>
          </Card>
        </Reveal>
      </div>
    </AppShell>
  )
}

/* ══════════════════════════════════════════════════════════════════════
   EXERCISE
   ═════════════════════════════════════════════════════════════════════ */
export function ExerciseScreen() {
  const [range, setRange] = useState<'7' | '28'>('7')
  const data = (range === '7' ? LAST_7 : LAST_28).map((day) => ({
    day: shortDay(day).split(' ')[0].slice(0, 1),
    kcal: EXERCISE.filter((x) => x.day === day).reduce((s, x) => s + x.kcal, 0),
    minutes: EXERCISE.filter((x) => x.day === day).reduce((s, x) => s + x.minutes, 0),
  }))

  const totalKcal = EXERCISE.reduce((s, x) => s + x.kcal, 0)
  const totalMin = EXERCISE.reduce((s, x) => s + x.minutes, 0)
  const byIntensity = ['low', 'moderate', 'high'].map((level, i) => ({
    label: level,
    value: EXERCISE.filter((x) => x.intensity === level).reduce((s, x) => s + x.kcal, 0),
    color: ['var(--brand-300)', 'var(--brand-500)', 'var(--brand-700)'][i],
  }))

  return (
    <AppShell title="Exercise" back={{ href: '/app/more', label: 'More' }}>
      <div className="container-ns pt-4">
        <ScreenIntro
          eyebrow="Exercise"
          title="10 sessions, 3,200 kcal burned."
          copy="Logged manually and synced from Apple Watch. Every calorie here is added back to your daily budget."
        />

        <Stagger className="mt-5 grid grid-cols-3 gap-3">
          {[
            { label: 'Sessions', value: EXERCISE.length },
            { label: 'Burned', value: totalKcal, unit: 'kcal' },
            { label: 'Total time', value: totalMin, unit: 'min' },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl border border-line bg-surface p-4">
              <p className="text-[11px] font-medium text-ink-500">{s.label}</p>
              <p className="tabular mt-1.5 text-xl font-bold text-ink-900">
                <CountUp value={s.value} /><span className="ml-0.5 text-[10px] font-medium text-ink-300">{s.unit}</span>
              </p>
            </div>
          ))}
        </Stagger>

        <Reveal delay={60} className="mt-3">
          <Card className="p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-ink-900">Calories burned</h2>
                <p className="mt-0.5 text-xs text-ink-500">Sessions logged per day</p>
              </div>
              <div className="shrink-0">
                <Segmented label="Exercise range" size="sm"
                  options={[{ id: '7', label: '7d' }, { id: '28', label: '28d' }]}
                  value={range} onChange={setRange} />
              </div>
            </div>
            <BarChart className="mt-5" data={data} valueKey="kcal" labelKey="day" unit=" kcal" height={130} />
          </Card>
        </Reveal>

        <Reveal delay={80} className="mt-3">
          <Card className="p-5">
            <h2 className="text-base font-bold text-ink-900">By intensity</h2>
            <div className="mt-5 flex flex-col items-center gap-6 sm:flex-row sm:justify-around">
              <Donut size={140} thickness={15} segments={byIntensity}
                center={{ value: nf(totalKcal), label: 'kcal total' }} />
              <ul className="w-full space-y-2.5 sm:max-w-[220px]">
                {byIntensity.map((b) => (
                  <li key={b.label} className="flex items-center gap-2.5">
                    <span className="size-2.5 rounded-full" style={{ background: b.color }} aria-hidden />
                    <span className="flex-1 text-sm capitalize text-ink-700">{b.label}</span>
                    <span className="tabular text-sm font-bold text-ink-900">{nf(b.value)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Card>
        </Reveal>

        <Reveal delay={100} className="mt-3">
          <Card className="p-5">
            <h2 className="text-base font-bold text-ink-900">All sessions</h2>
            <ul className="mt-4 divide-y divide-line">
              {EXERCISE.map((x) => (
                <li key={x.id} className="flex items-center gap-3 py-3">
                  <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-canvas-2 text-ink-500">
                    <Dumbbell className="size-4" aria-hidden />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold text-ink-900">{x.name}</span>
                    <span className="block text-[11px] text-ink-500">
                      {shortDay(x.day)} · {x.time} · {x.minutes} min · {x.intensity} · {x.source === 'device' ? 'Watch' : 'manual'}
                    </span>
                  </span>
                  <span className="tabular shrink-0 text-sm font-bold text-brand-600">{x.kcal}</span>
                </li>
              ))}
            </ul>
          </Card>
        </Reveal>
      </div>
    </AppShell>
  )
}


/* ══════════════════════════════════════════════════════════════════════
   NUTRITION — daily targets
   ═════════════════════════════════════════════════════════════════════ */
const MACRO_PRESETS = [
  { id: 'balanced', label: 'Balanced', split: [30, 40, 30] as const, copy: 'The default. Good for most people maintaining weight.' },
  { id: 'high-protein', label: 'High protein', split: [35, 35, 30] as const, copy: 'Keeps protein high while you lose fat.' },
  { id: 'lower-carb', label: 'Lower carb', split: [35, 25, 40] as const, copy: 'For blood-sugar control. Check with your clinician first.' },
  { id: 'endurance', label: 'Endurance', split: [25, 50, 25] as const, copy: 'Carb-led fuelling for regular training.' },
]

const MEAL_SPLIT = [
  { meal: 'Breakfast', pct: 25, kcal: 525 },
  { meal: 'Lunch', pct: 30, kcal: 630 },
  { meal: 'Dinner', pct: 30, kcal: 630 },
  { meal: 'Snacks', pct: 15, kcal: 315 },
]

export function NutritionScreen() {
  const [preset, setPreset] = useState('balanced')
  const [kcal, setKcal] = useState(2100)
  const [protein, setProtein] = useState(146)
  const [fiber, setFiber] = useState(30)

  const split = MACRO_PRESETS.find((p) => p.id === preset)!.split
  const [pPct, cPct, fPct] = split
  const grams = {
    protein: Math.round((kcal * (pPct / 100)) / 4),
    carbs: Math.round((kcal * (cPct / 100)) / 4),
    fat: Math.round((kcal * (fPct / 100)) / 9),
  }

  return (
    <AppShell title="Nutrition" back={{ href: '/app/more', label: 'More' }}>
      <div className="container-ns pt-4">
        <ScreenIntro
          eyebrow="Nutrition"
          title="Your daily targets."
          copy="Calories, macro split, fiber and water — the five numbers every score, chart and recommendation in the app is measured against."
        />

        {/* Energy */}
        <Reveal className="mt-5">
          <Card className="p-5">
            <h2 className="text-base font-bold text-ink-900">Calorie target</h2>
            <p className="mt-0.5 text-xs text-ink-500">
              Mifflin-St Jeor for your profile, then adjusted for a 0.35 kg a week loss.
            </p>
            <p className="tabular mt-4 text-4xl font-bold tracking-[-.05em] text-ink-900">
              <CountUp value={kcal} />
              <span className="ml-1.5 text-sm font-semibold text-ink-300">kcal a day</span>
            </p>
            <input
              type="range" min={1400} max={3400} step={50} value={kcal}
              onChange={(e) => setKcal(Number(e.target.value))}
              aria-label="Daily calorie target"
              className="mt-4 w-full accent-[var(--brand-500)]"
            />
            <div className="mt-1 flex justify-between text-[10px] font-semibold text-ink-300">
              <span>1,400</span><span>3,400</span>
            </div>
          </Card>
        </Reveal>

        {/* Macro split */}
        <Reveal delay={60} className="mt-3">
          <Card className="p-5">
            <h2 className="text-base font-bold text-ink-900">Macro split</h2>
            <p className="mt-0.5 text-xs text-ink-500">Choose a starting point, then fine tune the sliders.</p>

            <div className="mt-4 grid grid-cols-2 gap-2">
              {MACRO_PRESETS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setPreset(p.id)}
                  aria-pressed={preset === p.id}
                  className={cn('press rounded-2xl border p-3.5 text-left transition-colors',
                    preset === p.id ? 'border-brand-500 bg-brand-50' : 'border-line bg-surface')}
                >
                  <span className={cn('block text-sm font-bold', preset === p.id ? 'text-brand-700' : 'text-ink-900')}>
                    {p.label}
                  </span>
                  <span className="tabular mt-0.5 block text-[10px] text-ink-500">
                    {p.split[0]}/{p.split[1]}/{p.split[2]}
                  </span>
                </button>
              ))}
            </div>

            <p className="mt-3 text-xs leading-5 text-ink-500">
              {MACRO_PRESETS.find((p) => p.id === preset)!.copy}
            </p>

            <MacroBar className="mt-5" protein={grams.protein} carbs={grams.carbs} fat={grams.fat} />

            <ul className="mt-5 space-y-3">
              {[
                { label: 'Protein', value: protein, grams: grams.protein, unit: 'g', hint: '1.8 g per kg of body weight', set: setProtein, max: 240 },
                { label: 'Fiber', value: fiber, grams: grams.carbs, unit: 'g', hint: '30 g is the general adult recommendation', set: setFiber, max: 60 },
              ].map((row) => (
                <li key={row.label}>
                  <div className="flex items-baseline justify-between">
                    <span className="text-sm font-semibold text-ink-900">{row.label}</span>
                    <span className="tabular text-sm font-bold text-brand-600">
                      <CountUp value={row.value} />{row.unit}
                    </span>
                  </div>
                  <input
                    type="range" min={10} max={row.max} step={1} value={row.value}
                    onChange={(e) => row.set(Number(e.target.value))}
                    aria-label={`Daily ${row.label.toLowerCase()} target`}
                    className="mt-2 w-full accent-[var(--brand-500)]"
                  />
                  <p className="mt-1 text-[11px] text-ink-300">{row.hint}</p>
                </li>
              ))}
            </ul>
          </Card>
        </Reveal>

        {/* Meal distribution */}
        <Reveal delay={80} className="mt-3">
          <Card className="p-5">
            <h2 className="text-base font-bold text-ink-900">How it splits across the day</h2>
            <p className="mt-0.5 text-xs text-ink-500">A four-meal pattern. Each row feeds the per-meal targets on Today.</p>
            <ul className="mt-4 space-y-3">
              {MEAL_SPLIT.map((m, i) => {
                const scaled = Math.round(kcal * (m.pct / 100))
                return (
                  <li key={m.meal}>
                    <div className="flex items-baseline justify-between">
                      <span className="text-sm text-ink-700">{m.meal}</span>
                      <span className="tabular text-xs font-bold text-ink-900">{nf(scaled)} kcal · {m.pct}%</span>
                    </div>
                    <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-canvas-2">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${m.pct * 2.4}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: i * 0.07 }}
                        className="h-full rounded-full bg-brand-500"
                      />
                    </div>
                  </li>
                )
              })}
            </ul>
          </Card>
        </Reveal>

        {/* Condition-aware note */}
        <Reveal delay={100} className="mt-3">
          <Card className="p-5">
            <div className="flex items-center gap-2">
              <Sparkles className="size-4 text-berry" aria-hidden />
              <h2 className="text-base font-bold text-ink-900">Because you have diabetes</h2>
            </div>
            <p className="mt-3 text-sm leading-6 text-ink-700">
              Sugar and net carbohydrate are weighted 1.8× in your scoring, and we surface the
              glycemic load of anything you scan. Lower-carb is a reasonable preset for you, but
              change anything to do with carbohydrate and medication with your clinician, not with us.
            </p>
            <Link href="/app/profile" className="press mt-4 inline-flex rounded-full border border-line bg-surface px-4 py-2.5 text-xs font-bold text-ink-700">
              Update conditions
            </Link>
          </Card>
        </Reveal>

        <Reveal delay={120} className="mt-3">
          <Card className="p-5">
            <Disclosure question="Why these numbers and not the ones on the packet" defaultOpen={false}>
              Packaged food uses a 2,000 kcal reference diet designed for labelling law, not for you.
              Your targets come from your own weight, height and activity, which is why they differ.
            </Disclosure>
            <Disclosure question="Do targets change over time" defaultOpen={false}>
              Yes — recalculate every 5 kg or when your activity level changes, because a lighter body
              burns less at rest. We prompt you when a recalc is due.
            </Disclosure>
          </Card>
        </Reveal>

        <button
          onClick={() => toast('Targets saved — Today updated', 'success')}
          className="press mt-5 w-full rounded-full bg-brand-600 py-3.5 text-sm font-bold text-white"
        >
          Save targets
        </button>
      </div>
    </AppShell>
  )
}
