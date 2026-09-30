'use client'

/**
 * Progress hub. Four tabs — Overview, Calories, Nutrients, Macros — matching
 * the reference app's structure but with real charts, goal lines and a
 * crosshair you can drag.
 *
 * Effects: 19 count-up · 21 path draw · 26 segmented morph · 34 toast ·
 * 39 crosshair · 40 donut bloom · 41 heatmap · 24 export sheet.
 */

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowDownRight, ArrowUpRight, ChevronRight, Download, Flame, Share2, Target, TrendingUp, Zap,
} from 'lucide-react'
import { AppShell } from '@/components/app-shell'
import { CountUp, Reveal, Stagger } from '@/components/motion'
import { BarChart, Donut, Heatmap, LineChart, MacroBar } from '@/components/charts'
import { Card, ScreenIntro, Segmented, Sheet, StatTile } from '@/components/ui-kit'
import { toast } from '@/components/toast'
import { cn } from '@/lib/utils'
import { nf, shortDay } from '@/lib/format'
import {
  EXERCISE, GOALS, HABITS, LAST_28, LAST_7, STEP_GOAL,
  WEIGHT, WEIGHT_CURRENT, WEIGHT_START, WEIGHT_TARGET,
} from '@/lib/data/health'
import { SEED_DIARY } from '@/lib/data/fixtures'

type Tab = 'overview' | 'calories' | 'nutrients' | 'macros'

const TABS: { id: Tab; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'calories', label: 'Calories' },
  { id: 'nutrients', label: 'Nutrients' },
  { id: 'macros', label: 'Macros' },
]

const KCAL_BASE = 2100

export function ProgressScreen() {
  const [tab, setTab] = useState<Tab>('overview')
  const [exportOpen, setExportOpen] = useState(false)

  /* 7-day series built from the diary + habit fixtures. */
  const week = useMemo(
    () =>
      LAST_7.map((day) => {
        const entries = SEED_DIARY.filter((e) => e.day === day)
        const habit = HABITS.find((h) => h.day === day)!
        const kcal = entries.reduce((s, e) => s + e.kcal, 0)
        const protein = entries.reduce((s, e) => s + e.protein, 0)
        const carbs = entries.reduce((s, e) => s + e.carbs, 0)
        const sugar = entries.reduce((s, e) => s + e.sugar, 0)
        const fiber = entries.reduce((s, e) => s + e.fiber, 0)
        const satFat = Math.round(carbs * 0.12)
        return {
          day: shortDay(day).split(' ')[0].slice(0, 1),
          fullDay: shortDay(day),
          date: day,
          kcal,
          protein: Math.round(protein),
          carbs: Math.round(carbs),
          fat: Math.round(carbs * 0.28),
          sugar: Math.round(sugar),
          fiber: Math.round(fiber),
          satFat,
          score: entries.length ? Math.round(entries.reduce((s, e) => s + e.score, 0) / entries.length) : 0,
          steps: habit.steps,
          water: habit.waterMl,
          exercise: EXERCISE.filter((x) => x.day === day).reduce((s, x) => s + x.kcal, 0),
        }
      }),
    [],
  )

  const month = useMemo(
    () =>
      LAST_28.map((day, i) => {
        const w = WEIGHT[i]
        return { day: shortDay(day).slice(0, 6), value: w.kg }
      }),
    [],
  )

  const daysLogged = week.filter((d) => d.kcal > 0).length
  const avgScore = Math.round(week.reduce((s, d) => s + d.score, 0) / 7) || 0
  const avgKcal = Math.round(week.reduce((s, d) => s + d.kcal, 0) / 7)
  const weightChange = WEIGHT_CURRENT - WEIGHT_START
  const toGoal = WEIGHT_CURRENT - WEIGHT_TARGET

  return (
    <AppShell>
      <div className="container-ns pt-4">
        <ScreenIntro
          eyebrow="Your progress"
          title="Progress"
          copy="Eight weeks of weight, four weeks of habits, and every scan you have logged. All of it exportable."
          action={
            <button
              onClick={() => setExportOpen(true)}
              aria-label="Share or export your progress"
              className="press grid size-10 shrink-0 place-items-center rounded-full border border-line bg-surface text-ink-500"
            >
              <Download className="size-4" aria-hidden />
            </button>
          }
        />

        <div className="mt-5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <Segmented options={TABS} value={tab} onChange={setTab} label="Progress view" />
        </div>

        {/* ══ OVERVIEW ══════════════════════════════════════════════ */}
        {tab === 'overview' && (
          <div className="mt-5 space-y-3">
            {/* Headline stats */}
            <Stagger className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <StatTile label="Weight" value={WEIGHT_CURRENT.toFixed(1)} unit="kg"
                hint={`${weightChange >= 0 ? '+' : ''}${weightChange.toFixed(1)} kg in 8 weeks`}
                tone="text-brand-600" icon={Target} href="/app/weight" />
              <StatTile label="Avg score" value={<CountUp value={avgScore} />} unit="/100"
                hint="Seven day average" icon={TrendingUp} />
              <StatTile label="Days logged" value={`${daysLogged}`} unit="/7"
                hint={daysLogged >= 5 ? 'Consistent week' : 'Room to tighten up'} icon={Flame} />
              <StatTile label="Streak" value="4" unit="days"
                hint="Best ever: 21 days" tone="text-citrus-text" icon={Zap} />
            </Stagger>

            {/* Weight trend */}
            <Reveal delay={60}>
              <Card className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-base font-bold text-ink-900">Weight</h2>
                    <p className="mt-0.5 text-xs text-ink-500">Last 28 days · drag across to inspect</p>
                  </div>
                  <Link href="/app/weight" className="press rounded-full bg-canvas-2 px-3.5 py-2 text-[11px] font-bold text-ink-900">
                    Log weight
                  </Link>
                </div>

                <div className="mt-5 grid grid-cols-3 gap-3">
                  {[
                    { label: 'Start', value: WEIGHT_START.toFixed(1), unit: 'kg' },
                    { label: 'Current', value: WEIGHT_CURRENT.toFixed(1), unit: 'kg', highlight: true },
                    { label: 'Change', value: `${weightChange >= 0 ? '+' : ''}${weightChange.toFixed(1)}`, unit: 'kg', tone: weightChange < 0 ? 'text-brand-600' : 'text-ink-900' },
                  ].map((s) => (
                    <div key={s.label} className={cn('rounded-2xl p-3.5', s.highlight ? 'bg-brand-50' : 'bg-canvas-2')}>
                      <p className="text-[11px] font-medium text-ink-500">{s.label}</p>
                      <p className={cn('tabular mt-1 text-lg font-bold tracking-[-.03em]', s.tone ?? 'text-ink-900')}>
                        {s.value}<span className="ml-0.5 text-[11px] font-medium text-ink-300">{s.unit}</span>
                      </p>
                    </div>
                  ))}
                </div>

                <LineChart
                  className="mt-5"
                  data={month}
                  valueKey="value"
                  labelKey="day"
                  unit=" kg"
                  height={150}
                  band={{ low: WEIGHT_TARGET - 1, high: WEIGHT_TARGET + 1, label: `Target ${WEIGHT_TARGET} kg` }}
                />

                <div className="mt-4 flex items-center gap-3 rounded-2xl bg-canvas-2 p-4">
                  <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-brand-500/15 text-brand-700">
                    <ArrowDownRight className="size-4" aria-hidden />
                  </span>
                  <p className="text-xs leading-5 text-ink-700">
                    <b className="tabular">{toGoal.toFixed(1)} kg</b> to your target of {WEIGHT_TARGET} kg.
                    At your current rate that is about {Math.max(1, Math.round(toGoal / 0.35))} weeks.
                  </p>
                </div>
              </Card>
            </Reveal>

            {/* Score history */}
            <Reveal delay={80}>
              <Card className="p-5">
                <h2 className="text-base font-bold text-ink-900">Nutrition score</h2>
                <p className="mt-0.5 text-xs text-ink-500">Average per day across logged meals</p>
                <BarChart
                  className="mt-5"
                  data={week}
                  valueKey="score"
                  labelKey="day"
                  goal={80}
                  height={120}
                  colorFor={(v) => v >= 80 ? 'var(--score-great)' : v >= 60 ? 'var(--score-good)' : v >= 40 ? 'var(--score-warn)' : 'var(--score-danger)'}
                />
              </Card>
            </Reveal>

            {/* Steps + heatmap */}
            <Reveal delay={100}>
              <Card className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-bold text-ink-900">Steps</h2>
                    <p className="mt-0.5 text-xs text-ink-500">Goal {nf(STEP_GOAL)} a day</p>
                  </div>
                  <span className="tabular rounded-full bg-brand-50 px-3 py-1.5 text-xs font-bold text-brand-700">
                    {nf(Math.round(LAST_28.reduce((s, d, i) => s + (HABITS[i]?.steps ?? 0), 0) / 28))} avg
                  </span>
                </div>
                <BarChart
                  className="mt-5"
                  data={week}
                  valueKey="steps"
                  labelKey="day"
                  goal={STEP_GOAL}
                  height={110}
                  colorFor={(v) => v >= STEP_GOAL ? 'var(--brand-600)' : v >= STEP_GOAL * 0.7 ? 'var(--brand-400)' : 'var(--brand-200)'}
                />
              </Card>
            </Reveal>

            <Reveal delay={120}>
              <Card className="p-5">
                <h2 className="text-base font-bold text-ink-900">Four week consistency</h2>
                <p className="mt-0.5 text-xs text-ink-500">Colour is your daily score. Empty squares are days you did not log.</p>
                <Heatmap
                  className="mt-4"
                  cells={LAST_28.map((day, i) => ({
                    label: shortDay(day),
                    value: HABITS[i]?.steps ?? 0,
                    max: STEP_GOAL,
                  }))}
                />
                <div className="mt-3 flex items-center justify-end gap-2 text-[10px] text-ink-300">
                  <span>Less</span>
                  {['var(--canvas-2)', 'var(--score-danger)', 'var(--score-warn)', 'var(--score-good)', 'var(--score-great)'].map((c) => (
                    <span key={c} className="size-3 rounded-sm" style={{ background: c }} aria-hidden />
                  ))}
                  <span>More</span>
                </div>
              </Card>
            </Reveal>

            {/* Goals + reports */}
            <Reveal delay={140}>
              <Card className="divide-y divide-line">
                <RowLink href="/app/goals" icon={Target} title="Manage my goals"
                  copy={`${GOALS.length} active goals · weight, calories, macros, water, steps`} />
                <RowLink href="/app/report" icon={TrendingUp} title="Weekly digest" badge="New"
                  copy="Your seven day summary, ready to share with your dietitian" />
                <RowLink href="/app/exercise" icon={Flame} title="Exercise log"
                  copy={`${EXERCISE.length} sessions this week · ${nf(EXERCISE.reduce((s, x) => s + x.kcal, 0))} kcal burned`} />
              </Card>
            </Reveal>
          </div>
        )}

        {/* ══ CALORIES ══════════════════════════════════════════════ */}
        {tab === 'calories' && (
          <div className="mt-5 space-y-3">
            <Reveal>
              <Card className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-base font-bold text-ink-900">Energy balance</h2>
                    <p className="mt-0.5 text-xs text-ink-500">Food in against exercise out, seven days</p>
                  </div>
                  <span className={cn('tabular inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-bold',
                    avgKcal <= KCAL_BASE ? 'bg-brand-500/14 text-brand-700' : 'bg-score-danger/14 text-score-danger')}>
                    {avgKcal <= KCAL_BASE ? <ArrowDownRight className="size-3" aria-hidden /> : <ArrowUpRight className="size-3" aria-hidden />}
                    {nf(Math.abs(KCAL_BASE - avgKcal))} {avgKcal <= KCAL_BASE ? 'under' : 'over'}
                  </span>
                </div>

                <div className="mt-5 grid grid-cols-3 gap-3">
                  <div className="rounded-2xl bg-canvas-2 p-3.5">
                    <p className="text-[11px] font-medium text-ink-500">Avg eaten</p>
                    <p className="tabular mt-1 text-lg font-bold text-ink-900">{nf(avgKcal)}</p>
                  </div>
                  <div className="rounded-2xl bg-canvas-2 p-3.5">
                    <p className="text-[11px] font-medium text-ink-500">Avg burned</p>
                    <p className="tabular mt-1 text-lg font-bold text-brand-600">{nf(Math.round(week.reduce((s, d) => s + d.exercise, 0) / 7))}</p>
                  </div>
                  <div className="rounded-2xl bg-canvas-2 p-3.5">
                    <p className="text-[11px] font-medium text-ink-500">Deficit</p>
                    <p className="tabular mt-1 text-lg font-bold text-ink-900">{nf(Math.max(0, KCAL_BASE - avgKcal))}</p>
                  </div>
                </div>

                <BarChart
                  className="mt-6"
                  data={week}
                  valueKey="kcal"
                  labelKey="day"
                  goal={KCAL_BASE}
                  unit=" kcal"
                  height={140}
                  colorFor={(v) => (v === 0 ? 'var(--canvas-2)' : v <= KCAL_BASE ? 'var(--brand-500)' : 'var(--score-warn)')}
                />
              </Card>
            </Reveal>

            <Reveal delay={60}>
              <Card className="p-5">
                <h2 className="text-base font-bold text-ink-900">Calories by day</h2>
                <ul className="mt-4 space-y-2.5">
                  {[...week].reverse().map((d) => (
                    <li key={d.date} className="flex items-center gap-3">
                      <span className="w-14 shrink-0 text-xs font-semibold text-ink-500">{d.day}</span>
                      <span className="h-2 flex-1 overflow-hidden rounded-full bg-canvas-2">
                        <motion.span
                          initial={{ width: 0 }}
                          whileInView={{ width: `${Math.min(100, (d.kcal / KCAL_BASE) * 100)}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                          className="block h-full rounded-full"
                          style={{ background: d.kcal > KCAL_BASE ? 'var(--score-warn)' : 'var(--brand-500)' }}
                        />
                      </span>
                      <span className="tabular w-16 shrink-0 text-right text-xs font-bold text-ink-900">{nf(d.kcal)}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </Reveal>
          </div>
        )}

        {/* ══ NUTRIENTS ═════════════════════════════════════════════ */}
        {tab === 'nutrients' && (
          <div className="mt-5 space-y-3">
            <Reveal>
              <Card className="p-5">
                <h2 className="text-base font-bold text-ink-900">Weekly nutrient totals</h2>
                <p className="mt-0.5 text-xs text-ink-500">Against recommended daily intakes, multiplied by seven</p>
                <ul className="mt-4 space-y-3.5">
                  {[
                    { label: 'Fiber', total: Math.round(week.reduce((s, d) => s + d.fiber, 0)), target: 25 * 7, unit: 'g', invert: false },
                    { label: 'Sugars', total: Math.round(week.reduce((s, d) => s + d.sugar, 0)), target: 50 * 7, unit: 'g', invert: true },
                    { label: 'Saturated fat', total: Math.round(week.reduce((s, d) => s + d.satFat, 0)), target: 20 * 7, unit: 'g', invert: true },
                    { label: 'Protein', total: Math.round(week.reduce((s, d) => s + d.protein, 0)), target: 146 * 7, unit: 'g', invert: false },
                  ].map((n, i) => {
                    const pct = Math.min(100, Math.round((n.total / n.target) * 100))
                    const good = n.invert ? pct <= 100 : pct >= 70
                    return (
                      <li key={n.label}>
                        <div className="flex items-baseline justify-between">
                          <span className="text-sm font-semibold text-ink-900">{n.label}</span>
                          <span className="tabular text-xs font-bold text-ink-900">
                            {nf(n.total)}<span className="font-medium text-ink-300"> / {nf(n.target)}{n.unit}</span>
                          </span>
                        </div>
                        <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-canvas-2">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${pct}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: i * 0.07 }}
                            className="h-full rounded-full"
                            style={{ background: good ? 'var(--brand-500)' : 'var(--score-warn)' }}
                          />
                        </div>
                      </li>
                    )
                  })}
                </ul>
              </Card>
            </Reveal>

            <Reveal delay={60}>
              <Card className="p-5">
                <h2 className="text-base font-bold text-ink-900">Sugar by day</h2>
                <p className="mt-0.5 text-xs text-ink-500">The 50g line is the WHO free-sugar guideline</p>
                <BarChart
                  className="mt-5"
                  data={week}
                  valueKey="sugar"
                  labelKey="day"
                  goal={50}
                  unit="g"
                  height={130}
                  colorFor={(v) => v <= 50 ? 'var(--brand-500)' : 'var(--score-danger)'}
                />
              </Card>
            </Reveal>

            <Reveal delay={80}>
              <Card className="p-5">
                <div className="flex items-center gap-2">
                  <TrendingUp className="size-4 text-berry" aria-hidden />
                  <h2 className="text-base font-bold text-ink-900">What we are seeing</h2>
                </div>
                <p className="mt-3 text-sm leading-6 text-ink-700">
                  Fiber averaged <b className="tabular">21g</b> a day — close to the 25g target and up 6g on your
                  four-week baseline. Sugar was driven almost entirely by two products: the instant noodles
                  and the chocolate bar. Everything else sat under the line.
                </p>
              </Card>
            </Reveal>
          </div>
        )}

        {/* ══ MACROS ════════════════════════════════════════════════ */}
        {tab === 'macros' && (
          <div className="mt-5 space-y-3">
            <Reveal>
              <Card className="p-5">
                <h2 className="text-base font-bold text-ink-900">Average macro split</h2>
                <p className="mt-0.5 text-xs text-ink-500">Seven day average against your current targets</p>
                <div className="mt-6 flex flex-col items-center gap-6 sm:flex-row sm:justify-around">
                  <Donut
                    size={148}
                    thickness={16}
                    segments={[
                      { label: 'Protein', value: Math.round(week.reduce((s, d) => s + d.protein, 0) / 7), color: 'var(--brand-500)' },
                      { label: 'Carbs', value: Math.round(week.reduce((s, d) => s + d.carbs, 0) / 7), color: 'var(--accent-sky)' },
                      { label: 'Fat', value: Math.round(week.reduce((s, d) => s + d.fat, 0) / 7), color: 'var(--accent-mango)' },
                    ]}
                    center={{ value: `${nf(Math.round(week.reduce((s, d) => s + d.protein, 0) / 7))}g`, label: 'avg protein' }}
                  />
                  <MacroBar
                    className="w-full sm:max-w-[260px]"
                    protein={Math.round(week.reduce((s, d) => s + d.protein, 0) / 7)}
                    carbs={Math.round(week.reduce((s, d) => s + d.carbs, 0) / 7)}
                    fat={Math.round(week.reduce((s, d) => s + d.fat, 0) / 7)}
                  />
                </div>
              </Card>
            </Reveal>

            <Reveal delay={60}>
              <Card className="p-5">
                <h2 className="text-base font-bold text-ink-900">Protein hit rate</h2>
                <p className="mt-0.5 text-xs text-ink-500">Days you reached 146g — the number that matters most for your goal</p>
                <div className="mt-5 flex items-end gap-2">
                  {week.map((d) => (
                    <div key={d.date} className="flex-1 text-center">
                      <motion.div
                        initial={{ height: 0 }}
                        whileInView={{ height: Math.max(8, (d.protein / 146) * 110) }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                        className="mx-auto w-full max-w-[34px] rounded-t-lg"
                        style={{ background: d.protein >= 146 ? 'var(--brand-600)' : 'var(--brand-300)' }}
                      />
                      <p className="tabular mt-2 text-[10px] font-bold text-ink-500">{d.protein}g</p>
                      <p className="text-[10px] text-ink-300">{d.day}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 rounded-2xl bg-canvas-2 p-4 text-xs leading-5 text-ink-700">
                  You hit your protein target on <b>{week.filter((d) => d.protein >= 146).length} of 7 days</b>. The
                  miss days are almost always the ones without a planned breakfast.
                </div>
              </Card>
            </Reveal>
          </div>
        )}

        {/* Destinations, shown only where the current tab has not already
            linked to them — Overview carries its own copy. */}
        {tab !== 'overview' && (
          <div className="mt-6">
            <Card className="divide-y divide-line">
              <RowLink href="/app/report" icon={TrendingUp} title="Weekly digest" badge="New"
                copy="A shareable summary for you or your clinician" />
              <RowLink href="/app/goals" icon={Target} title="Goals" copy="Adjust every target in one place" />
            </Card>
          </div>
        )}

        <p className="mt-6 mb-2 text-center text-[11px] text-ink-300">
          Trends are educational. Discuss significant changes with a registered dietitian.
        </p>
      </div>

      {/* Export sheet (Effect 24/25) */}
      <Sheet open={exportOpen} onClose={() => setExportOpen(false)} title="Share your progress">
        <p className="text-sm leading-6 text-ink-500">
          Export a clean summary of the last seven or twenty-eight days. Useful before a dietitian
          appointment, or just to see the whole picture on one page.
        </p>
        <div className="mt-4 space-y-2">
          {[
            { label: 'Weekly digest PDF', detail: 'Seven days · charts and totals', icon: TrendingUp },
            { label: 'Monthly report CSV', detail: 'Twenty-eight days · every metric', icon: Download },
            { label: 'Share a read-only link', detail: 'Expires in seven days', icon: Share2 },
          ].map((opt) => (
            <button
              key={opt.label}
              onClick={() => { toast(`${opt.label} is being prepared`, 'info'); setExportOpen(false) }}
              className="press flex w-full items-center gap-3 rounded-2xl border border-line bg-surface p-4 text-left"
            >
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-canvas-2 text-ink-500">
                <opt.icon className="size-4" aria-hidden />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-bold text-ink-900">{opt.label}</span>
                <span className="block text-xs text-ink-500">{opt.detail}</span>
              </span>
              <ChevronRight className="size-4 shrink-0 text-ink-300" aria-hidden />
            </button>
          ))}
        </div>
      </Sheet>
    </AppShell>
  )
}

function RowLink({
  href, icon: Icon, title, copy, badge,
}: { href: string; icon: React.ElementType; title: string; copy: string; badge?: string }) {
  return (
    <Link href={href} className="press flex items-center gap-3 p-4">
      <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-canvas-2 text-brand-600">
        <Icon className="size-4" aria-hidden />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2">
          <span className="text-sm font-bold text-ink-900">{title}</span>
          {badge && <span className="rounded-full bg-berry/15 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-berry">{badge}</span>}
        </span>
        <span className="mt-0.5 block text-xs text-ink-500">{copy}</span>
      </span>
      <ChevronRight className="size-4 shrink-0 text-ink-300" aria-hidden />
    </Link>
  )
}
