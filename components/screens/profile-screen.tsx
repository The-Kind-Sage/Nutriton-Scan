'use client'

/**
 * Profile & preferences. Effects: 46 layout-animated chip add/remove ·
 * 30 accordion groups · 33 validation · 34 toast · 27 theme · 47 haptics.
 */

import Link from 'next/link'
import { Check, ChevronRight, LogOut, Mail, Plus, Sparkles, X } from 'lucide-react'
import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { AppShell } from '@/components/app-shell'
import { Reveal, Stagger } from '@/components/motion'
import { toast } from '@/components/toast'
import { cn } from '@/lib/utils'
import { FAMILY_PROFILE } from '@/lib/data/fixtures'
import { layoutItem, spring } from '@/lib/motion'
import type { Allergen, Condition, DietTag } from '@/lib/types'

const GOALS = [
  { id: 'lose-fat', label: 'Lose fat', copy: 'Fiber and protein weighted higher for satiety.' },
  { id: 'build-muscle', label: 'Build muscle', copy: 'Protein density is prioritised.' },
  { id: 'maintain', label: 'Maintain', copy: 'Balanced weighting across all factors.' },
  { id: 'manage-condition', label: 'Manage a condition', copy: 'Condition penalties are amplified.' },
] as const

const DIETS: DietTag[] = ['vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'keto', 'low-sugar', 'organic', 'halal', 'high-protein']
const ALLERGENS: Allergen[] = ['gluten', 'milk', 'soy', 'nuts', 'peanuts', 'eggs', 'sesame', 'fish', 'shellfish']
const CONDITIONS: { id: Condition; label: string; copy: string }[] = [
  { id: 'diabetes', label: 'Diabetes', copy: 'Sugar and net carbs weighted 1.8×' },
  { id: 'hypertension', label: 'High blood pressure', copy: 'Sodium weighted 2.2×' },
  { id: 'ckd', label: 'Chronic kidney disease', copy: 'Potassium and phosphorus surfaced' },
  { id: 'high-cholesterol', label: 'High cholesterol', copy: 'Saturated fat weighted 1.7×' },
]

export function ProfileScreen() {
  const profile = FAMILY_PROFILE
  const [name, setName] = useState(profile.name)
  const [goal, setGoal] = useState<string>(profile.goal)
  const [diets, setDiets] = useState<DietTag[]>(profile.diet)
  const [allergies, setAllergies] = useState<Allergen[]>(profile.allergies)
  const [conditions, setConditions] = useState<Condition[]>(profile.conditions)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [notifications, setNotifications] = useState({ streak: true, weekly: true, marketing: false })

  const toggle = <T,>(list: T[], value: T, set: (v: T[]) => void) => {
    set(list.includes(value) ? list.filter((x) => x !== value) : [...list, value])
  }

  const applyReducedMotion = (on: boolean) => {
    setReducedMotion(on)
    document.documentElement.dataset.motion = on ? 'reduced' : 'full'
    toast(on ? 'Motion reduced across the app' : 'Full motion restored', 'info')
  }

  return (
    <AppShell>
      <div className="container-ns pt-5">
        {/* Identity */}
        <Reveal className="flex items-center gap-4">
          <div className="relative">
            <span className="grid size-16 place-items-center rounded-2xl bg-brand-900 text-xl font-bold text-lime-accent" aria-hidden>
              {name.slice(0, 2).toUpperCase()}
            </span>
            <span className="absolute -bottom-1 -right-1 grid size-6 place-items-center rounded-full border-2 border-canvas bg-brand-500 text-white" aria-hidden>
              <Check className="size-3" />
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <label htmlFor="profile-name" className="text-xs font-bold uppercase tracking-[.16em] text-ink-300">Your name</label>
            <input
              id="profile-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded-xl border border-line bg-surface px-3 py-2.5 text-lg font-bold text-ink-900 outline-none focus:border-brand-500"
            />
          </div>
        </Reveal>

        {/* Goal */}
        <section className="mt-8">
          <h2 className="text-lg font-bold text-ink-900">Your goal</h2>
          <p className="mt-1 text-sm text-ink-500">This changes how every score is weighted.</p>
          <Stagger className="mt-3 grid gap-2 sm:grid-cols-2">
            {GOALS.map((g) => {
              const active = goal === g.id
              return (
                <button
                  key={g.id}
                  onClick={() => setGoal(g.id)}
                  aria-pressed={active}
                  className={cn(
                    'press flex items-start gap-3 rounded-2xl border p-4 text-left transition-colors',
                    active ? 'border-brand-500 bg-brand-50' : 'border-line bg-surface hover:bg-canvas-2',
                  )}
                >
                  <span className={cn('mt-0.5 grid size-5 shrink-0 place-items-center rounded-full border-2 transition-colors',
                    active ? 'border-brand-500 bg-brand-500 text-white' : 'border-line-strong')}>
                    {active && <Check className="size-3" aria-hidden />}
                  </span>
                  <span>
                    <span className="block text-sm font-bold text-ink-900">{g.label}</span>
                    <span className="mt-0.5 block text-xs leading-5 text-ink-500">{g.copy}</span>
                  </span>
                </button>
              )
            })}
          </Stagger>
        </section>

        {/* Diet */}
        <section className="mt-8">
          <h2 className="text-lg font-bold text-ink-900">Dietary preferences</h2>
          <p className="mt-1 text-sm text-ink-500">We will never recommend something that breaks these.</p>
          <motion.ul layout className="mt-3 flex flex-wrap gap-2">
            <AnimatePresence mode="popLayout">
              {DIETS.map((diet) => {
                const active = diets.includes(diet)
                return (
                  <motion.li key={diet} {...layoutItem(0)}>
                    <button
                      onClick={() => toggle(diets, diet, setDiets)}
                      aria-pressed={active}
                      className={cn(
                        'press inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-xs font-bold capitalize transition-colors',
                        active ? 'border-brand-500 bg-brand-500 text-white' : 'border-line bg-surface text-ink-500',
                      )}
                    >
                      {active ? <Check className="size-3" aria-hidden /> : <Plus className="size-3" aria-hidden />}
                      {diet.replace('-', ' ')}
                    </button>
                  </motion.li>
                )
              })}
            </AnimatePresence>
          </motion.ul>
        </section>

        {/* Allergens */}
        <section className="mt-8">
          <h2 className="text-lg font-bold text-ink-900">Allergens</h2>
          <p className="mt-1 text-sm text-ink-500">
            Products containing these are not scored — you get a warning and safer alternatives instead.
          </p>
          <motion.ul layout className="mt-3 flex flex-wrap gap-2">
            <AnimatePresence mode="popLayout">
              {ALLERGENS.map((allergen) => {
                const active = allergies.includes(allergen)
                return (
                  <motion.li key={allergen} {...layoutItem(0)}>
                    <button
                      onClick={() => toggle(allergies, allergen, setAllergies)}
                      aria-pressed={active}
                      className={cn(
                        'press inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-xs font-bold capitalize transition-colors',
                        active ? 'border-score-danger bg-score-danger text-white' : 'border-line bg-surface text-ink-500',
                      )}
                    >
                      {active ? <X className="size-3" aria-hidden /> : <Plus className="size-3" aria-hidden />}
                      {allergen}
                    </button>
                  </motion.li>
                )
              })}
            </AnimatePresence>
          </motion.ul>
        </section>

        {/* Conditions */}
        <section className="mt-8">
          <h2 className="text-lg font-bold text-ink-900">Health conditions</h2>
          <p className="mt-1 text-sm text-ink-500">
            Optional. This re-weights the scoring engine — it is not a diagnosis and never a substitute for your clinician.
          </p>
          <div className="mt-3 divide-y divide-line overflow-hidden rounded-[24px] border border-line bg-surface">
            {CONDITIONS.map((c) => {
              const active = conditions.includes(c.id)
              return (
                /* A switch is itself a button, so the row is a div and the label
                   carries the interaction — a button inside a button is invalid
                   HTML and React reports it as a hydration mismatch (React #418). */
                <div key={c.id} className="flex w-full items-center gap-3 p-4">
                  <button
                    onClick={() => toggle(conditions, c.id, setConditions)}
                    aria-pressed={active}
                    className="min-w-0 flex-1 text-left"
                  >
                    <span className="block text-sm font-semibold text-ink-900">{c.label}</span>
                    <span className="block text-xs text-ink-500">{c.copy}</span>
                  </button>
                  <Switch on={active} onClick={() => toggle(conditions, c.id, setConditions)} />
                </div>
              )
            })}
          </div>
        </section>

        {/* Preferences */}
        <section className="mt-8">
          <h2 className="text-lg font-bold text-ink-900">App preferences</h2>
          <div className="mt-3 divide-y divide-line overflow-hidden rounded-[24px] border border-line bg-surface">
            <Row label="Reduce motion" copy="Turns off parallax, marquees and auto-playing animations.">
              <Switch on={reducedMotion} onClick={() => applyReducedMotion(!reducedMotion)} />
            </Row>
            <Row label="Streak reminders" copy="One nudge a day if you have not scanned.">
              <Switch on={notifications.streak} onClick={() => setNotifications((n) => ({ ...n, streak: !n.streak }))} />
            </Row>
            <Row label="Weekly digest" copy="A short Sunday summary of your week.">
              <Switch on={notifications.weekly} onClick={() => setNotifications((n) => ({ ...n, weekly: !n.weekly }))} />
            </Row>
            <Row label="Product updates" copy="Occasional news about new features.">
              <Switch on={notifications.marketing} onClick={() => setNotifications((n) => ({ ...n, marketing: !n.marketing }))} />
            </Row>
          </div>
        </section>

        {/* Subscription */}
        <section className="mt-8">
          <h2 className="text-lg font-bold text-ink-900">Subscription</h2>
          <Reveal className="mt-3">
            <div className="fx-trace rounded-[26px] border border-transparent bg-surface p-5 shadow-float" data-active="true">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[.16em] text-brand-600">Current plan</p>
                  <h3 className="mt-1.5 text-xl font-bold text-ink-900">Free</h3>
                  <p className="mt-1 text-sm text-ink-500">14 of 20 scans used this month</p>
                </div>
                <span className="grid size-10 place-items-center rounded-2xl bg-berry/12 text-berry">
                  <Sparkles className="size-5" aria-hidden />
                </span>
              </div>

              <div className="mt-4 h-2 overflow-hidden rounded-full bg-canvas-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '70%' }}
                  transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                  className="h-full rounded-full bg-brand-500"
                />
              </div>

              <Link href="/pricing" className="press mt-5 flex items-center justify-center gap-1.5 rounded-xl bg-brand-600 py-3.5 text-sm font-bold text-white">
                Upgrade to Plus <ChevronRight className="size-4" aria-hidden />
              </Link>
            </div>
          </Reveal>
        </section>

        {/* Data & account */}
        <section className="mt-8">
          <h2 className="text-lg font-bold text-ink-900">Your data</h2>
          <div className="mt-3 divide-y divide-line overflow-hidden rounded-[24px] border border-line bg-surface">
            <LinkRow label="Export my diary" copy="Download everything as CSV or PDF." onClick={() => toast('Export started — check your downloads', 'info')} />
            <LinkRow label="Connected apps" copy="Apple Health, Fitbit and 6 more." onClick={() => toast('Integrations are in the app settings', 'info')} />
            <LinkRow label="Privacy & consent" copy="Granular analytics controls." onClick={() => toast('All analytics are off by default', 'info')} />
            <LinkRow label="Delete my account" copy="Removes your data within 30 days." danger onClick={() => toast('We emailed you a confirmation link', 'info')} />
          </div>

          <button
            onClick={() => toast('Signed out — see you soon', 'info')}
            className="press mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-line bg-surface py-3.5 text-sm font-bold text-ink-700"
          >
            <LogOut className="size-4" aria-hidden /> Sign out
          </button>
        </section>

        <p className="mt-6 flex items-center justify-center gap-2 text-xs text-ink-300">
          <Mail className="size-3.5" aria-hidden /> hello@nutritionscan.app · v2.0 · portrait build
        </p>
      </div>
    </AppShell>
  )
}

/* ── Small pieces ─────────────────────────────────────────────────────── */
function Row({ label, copy, children }: { label: string; copy: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-4 p-4">
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-ink-900">{label}</p>
        <p className="mt-0.5 text-xs leading-5 text-ink-500">{copy}</p>
      </div>
      {children}
    </div>
  )
}

function LinkRow({ label, copy, onClick, danger }: { label: string; copy: string; onClick: () => void; danger?: boolean }) {
  return (
    <button onClick={onClick} className="press flex w-full items-center gap-3 p-4 text-left">
      <span className="min-w-0 flex-1">
        <span className={cn('block text-sm font-semibold', danger ? 'text-score-danger' : 'text-ink-900')}>{label}</span>
        <span className="block text-xs text-ink-500">{copy}</span>
      </span>
      <ChevronRight className="size-4 shrink-0 text-ink-300" aria-hidden />
    </button>
  )
}

function Switch({ on, onClick }: { on: boolean; onClick?: () => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={onClick}
      className={cn(
        'press relative h-7 w-12 shrink-0 rounded-full transition-colors duration-300',
        on ? 'bg-brand-500' : 'bg-line-strong',
      )}
    >
      <motion.span
        layout
        transition={spring.pop}
        className="absolute top-1 size-5 rounded-full bg-white shadow-sm"
        style={{ left: on ? 26 : 4 }}
      />
    </button>
  )
}
