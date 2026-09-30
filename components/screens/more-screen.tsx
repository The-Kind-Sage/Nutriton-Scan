'use client'

/**
 * More — the feature directory. Mirrors the reference app's list but reorganised
 * into three labelled groups (Track · Discover · Account) so ten entries read as
 * a product rather than a settings dump, with a live values preview on each row.
 *
 * Effects: 02 stagger · 10 spotlight · 13 gradient trace · 19 count-up ·
 * 38 confetti on the premium card.
 */

import Link from 'next/link'
import { useRef } from 'react'
import { useReducedMotion } from 'framer-motion'
import {
  Apple, ChevronRight, Crown, Dna, Dumbbell, FlaskConical, Moon, NotebookPen,
  Scale, Sparkles, Target, Timer, TrendingUp, Utensils, Watch,
} from 'lucide-react'
import { AppShell } from '@/components/app-shell'
import { CountUp, Reveal, TiltCard } from '@/components/motion'
import { Card } from '@/components/ui-kit'
import { toast } from '@/components/toast'
import {
  DEVICES, FASTING, GLUCOSE, NOTES, SLEEP, WEIGHT_CURRENT, WEIGHT_START, todayHabits,
} from '@/lib/data/health'
import { RECIPES, WORKOUTS } from '@/lib/data/library'
import { nf } from '@/lib/format'

const streak = 4
const weightChange = WEIGHT_CURRENT - WEIGHT_START
const habits = todayHabits()
const lastSleep = SLEEP[0]
const lastGlucose = GLUCOSE[0]
const fastingStreak = FASTING.filter((f) => f.completed).length

export function MoreScreen() {
  const burstRef = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  const premiumBurst = () => {
    const host = burstRef.current
    if (!host || reduced) return
    const colors = ['#12b76a', '#b6f09c', '#7a5af8', '#ffb020']
    for (let i = 0; i < 26; i++) {
      const p = document.createElement('span')
      p.className = 'fx-confetti'
      p.style.left = '50%'
      p.style.top = '50%'
      p.style.background = colors[i % colors.length]
      p.style.setProperty('--dx', `${(Math.random() * 180 - 90).toFixed(0)}px`)
      p.style.setProperty('--dy', `${(Math.random() * -140 - 20).toFixed(0)}px`)
      p.style.setProperty('--rot', `${(Math.random() * 720).toFixed(0)}deg`)
      host.appendChild(p)
      p.addEventListener('animationend', () => p.remove())
    }
    toast('Seven days of Plus, free', 'success')
  }

  return (
    <AppShell>
      <div className="container-ns pt-4">
        {/* ── Profile header ──────────────────────────────────────── */}
        <Reveal>
          <TiltCard className="relative overflow-hidden rounded-[30px] border border-line bg-surface p-5 shadow-soft">
            <span className="fx-glare" aria-hidden />
            <div className="relative flex items-center gap-4">
              <span className="relative grid size-16 shrink-0 place-items-center rounded-2xl bg-brand-900 text-xl font-bold text-lime-accent" aria-hidden>
                MC
                <span className="absolute -bottom-1 -right-1 grid size-6 place-items-center rounded-full border-2 border-surface bg-mango text-[10px] font-bold text-ink-900">
                  {streak}
                </span>
              </span>
              <div className="min-w-0 flex-1">
                <h1 className="truncate text-xl font-bold tracking-[-.04em] text-ink-900">Maya Chand</h1>
                <p className="mt-0.5 text-sm text-ink-500">
                  <span className="tabular font-bold text-ink-900">{streak} day streak</span>
                  <span className="mx-1.5 text-ink-300">·</span>
                  <span className="tabular font-bold text-brand-600">{weightChange.toFixed(1)} kg lost</span>
                </p>
              </div>
              <Link href="/app/profile" aria-label="Edit profile"
                className="press grid size-10 shrink-0 place-items-center rounded-full border border-line bg-canvas text-ink-500">
                <ChevronRight className="size-4" aria-hidden />
              </Link>
            </div>

            <div className="relative mt-5 grid grid-cols-4 gap-2">
              {[
                { label: 'Water', value: `${(habits.waterMl / 1000).toFixed(1)}L` },
                { label: 'Steps', value: `${nf(Math.round(habits.steps / 1000))}k` },
                { label: 'Scans', value: '12' },
                { label: 'Fasts', value: `${fastingStreak}` },
              ].map((s) => (
                <div key={s.label} className="rounded-xl bg-canvas-2 p-2.5 text-center">
                  <p className="tabular text-sm font-bold text-ink-900">{s.value}</p>
                  <p className="text-[10px] font-medium text-ink-500">{s.label}</p>
                </div>
              ))}
            </div>
          </TiltCard>
        </Reveal>

        {/* ── Premium card ────────────────────────────────────────── */}
        <Reveal delay={60} className="mt-3">
          <div ref={burstRef} className="relative">
            <button
              onClick={premiumBurst}
              className="noise fx-shimmer relative w-full overflow-hidden rounded-[26px] bg-[linear-gradient(120deg,#052e1f_0%,#0b4630_55%,#123b2c_100%)] p-5 text-left"
            >
              <div className="fx-aurora fx-aurora--calm opacity-40" aria-hidden />
              <div className="relative z-10 flex items-center gap-4">
                <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-lime-accent/20 text-lime-accent">
                  <Crown className="size-6" aria-hidden />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-base font-bold text-white">Try Premium free</span>
                  <span className="mt-0.5 block text-xs leading-5 text-[#a9c2b5]">
                    Unlimited scans, condition-aware scoring, full alternatives, no ads. Seven days, no card.
                  </span>
                </span>
                <ChevronRight className="size-5 shrink-0 text-lime-accent" aria-hidden />
              </div>
            </button>
          </div>
        </Reveal>

        {/* ── Track ───────────────────────────────────────────────── */}
        <Group title="Track" hint="Everything you log daily">
          <Row href="/app/weight" icon={Scale} tone="bg-brand-50 text-brand-600" title="Weight"
            value={`${WEIGHT_CURRENT.toFixed(1)} kg`} copy={`${weightChange.toFixed(1)} kg in 8 weeks · target 72 kg`} />
          <Row href="/app/fasting" icon={Timer} tone="bg-mango/15 text-citrus-text" title="Intermittent fasting"
            value="16:8" copy={`${fastingStreak} of the last 14 days completed`} />
          <Row href="/app/sleep" icon={Moon} tone="bg-berry/12 text-berry" title="Sleep"
            value={`${lastSleep.hours}h`} copy={`Quality ${lastSleep.quality}/100 · ${lastSleep.bedtime}–${lastSleep.wake}`} />
          <Row href="/app/glucose" icon={Dna} tone="bg-sky-accent/12 text-sky-accent" title="Glucose"
            value={`${lastGlucose.value}`} copy={`mg/dL fasting · ${GLUCOSE.length} readings logged`} />
          <Row href="/app/exercise" icon={Dumbbell} tone="bg-citrus/12 text-citrus-text" title="Exercise"
            value="4 sessions" copy="248 kcal burned this week from 2 sources" />
          <Row href="/app/notes" icon={NotebookPen} tone="bg-mango/15 text-citrus-text" title="Notes"
            value={`${NOTES.length}`} copy="Journal entries, tagged by mood" />
        </Group>

        {/* ── Discover ────────────────────────────────────────────── */}
        <Group title="Discover" hint="Food and movement you can copy">
          <Row href="/app/recipes" icon={Utensils} tone="bg-brand-50 text-brand-600" title="Recipe discovery"
            value={`${RECIPES.length}`} copy="Filtered to your allergies and goals" />
          <Row href="/app/workouts" icon={Dumbbell} tone="bg-berry/12 text-berry" title="Workout routines"
            value={`${WORKOUTS.length}`} copy="Beginner to advanced, home or gym" />
          <Row href="/app/nutrition" icon={Apple} tone="bg-citrus/12 text-citrus-text" title="Nutrition"
            value="2,100" copy="Calorie target, macro split, fiber and water" />
          <Row href="/app/goals" icon={Target} tone="bg-sky-accent/12 text-sky-accent" title="Goals"
            value="6 active" copy="Weight, calories, macros, water, steps" />
          <Row href="/app/report" icon={TrendingUp} tone="bg-brand-50 text-brand-600" title="My weekly report"
            badge="New" value="" copy="Your seven day digest, ready to share" />
          <Row href="/app/devices" icon={Watch} tone="bg-ink-900/6 text-ink-700" title="Apps & devices"
            value={`${DEVICES.filter((d) => d.syncing).length}/${DEVICES.length}`} copy="Apple Watch, Withings, Dexcom and more" />
        </Group>

        {/* ── Account ─────────────────────────────────────────────── */}
        <Group title="Account" hint="Your data and preferences">
          <Row href="/app/profile" icon={Sparkles} tone="bg-berry/12 text-berry" title="Profile & preferences"
            value="" copy="Diet, allergens, conditions, notifications" />
          <Row href="/pricing" icon={Crown} tone="bg-mango/15 text-citrus-text" title="Subscription"
            value="Free" copy="14 of 20 scans used this month" />
          <Row href="/app/devices" icon={FlaskConical} tone="bg-canvas-2 text-ink-500" title="Data & privacy"
            value="" copy="Export, delete, and analytics controls" />
        </Group>

        {/* ── Stats footer ────────────────────────────────────────── */}
        <Reveal delay={80} className="mt-6">
          <Card className="grid grid-cols-3 gap-3 p-5">
            {[
              { label: 'Total scans', value: 187 },
              { label: 'Products found', value: 41 },
              { label: 'Days tracked', value: 62 },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p className="tabular text-xl font-bold tracking-[-.03em] text-ink-900">
                  <CountUp value={s.value} />
                </p>
                <p className="mt-0.5 text-[10px] font-medium text-ink-500">{s.label}</p>
              </div>
            ))}
          </Card>
        </Reveal>

        <p className="mt-6 flex items-center justify-center gap-2 text-[11px] text-ink-300">
          <Apple className="size-3.5" aria-hidden /> Nutrition Scan v2.0 · educational use only
        </p>
      </div>
    </AppShell>
  )
}

function Group({ title, hint, children }: { title: string; hint: string; children: React.ReactNode }) {
  return (
    <section className="mt-7">
      <div className="flex items-baseline justify-between">
        <h2 className="text-xs font-bold uppercase tracking-[.18em] text-ink-300">{title}</h2>
        <span className="text-[11px] text-ink-300">{hint}</span>
      </div>
      <div className="mt-2.5 divide-y divide-line overflow-hidden rounded-[26px] border border-line bg-surface">
        {children}
      </div>
    </section>
  )
}

function Row({
  href, icon: Icon, title, value, copy, tone, badge,
}: {
  href: string; icon: React.ElementType; title: string; value?: string; copy: string
  tone: string; badge?: string
}) {
  return (
    <Link href={href} className="press flex items-center gap-3.5 p-4">
      <span className={`grid size-10 shrink-0 place-items-center rounded-xl ${tone}`}>
        <Icon className="size-4" aria-hidden />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2">
          <span className="text-sm font-bold text-ink-900">{title}</span>
          {badge && <span className="rounded-full bg-berry/15 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-berry">{badge}</span>}
        </span>
        <span className="mt-0.5 block truncate text-xs text-ink-500">{copy}</span>
      </span>
      {value && <span className="tabular shrink-0 text-sm font-bold text-brand-600">{value}</span>}
      <ChevronRight className="size-4 shrink-0 text-ink-300" aria-hidden />
    </Link>
  )
}
