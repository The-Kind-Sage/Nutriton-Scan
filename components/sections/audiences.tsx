'use client'

/**
 * Audience tabs — Effect 26 (morphing sliding indicator), 43 (chip fly-in),
 * 02 (directional content crossfade). Deep-linkable via the URL hash so a
 * clinic can send a client straight to the "medical diets" panel.
 */

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Dumbbell, HeartPulse, Salad, Stethoscope, Users, type LucideIcon } from 'lucide-react'
import { Reveal } from '@/components/motion'
import { spring } from '@/lib/motion'

interface Audience {
  id: string
  label: string
  icon: LucideIcon
  headline: string
  copy: string
  chips: string[]
  stat: { value: string; label: string }
}

const AUDIENCES: Audience[] = [
  {
    id: 'fitness', label: 'Fitness', icon: Dumbbell,
    headline: 'Protein per 100g, not per marketing claim.',
    copy: 'Set a bulking or cutting target and the score re-weights towards protein density and away from empty calories. Sodium warnings before long runs, not after.',
    chips: ['Protein density', 'Macro split', 'Pre-workout sodium', 'Bulk & cut modes'],
    stat: { value: '42%', label: 'more protein found per shop' },
  },
  {
    id: 'families', label: 'Families', icon: Users,
    headline: 'Kid-safe scoring and additive flags you can explain.',
    copy: 'Sort out which cereals are actually cereal, flag the azo dyes linked to hyperactivity, and build a lunchbox list the whole house agrees on.',
    chips: ['Additive flags', 'Kid-safe scoring', 'Lunchbox lists', 'Allergen alerts'],
    stat: { value: '3 in 4', label: 'parents changed one weekly staple' },
  },
  {
    id: 'medical', label: 'Medical diets', icon: HeartPulse,
    headline: 'Sodium counted the way your condition counts it.',
    copy: 'Diabetes, hypertension, chronic kidney disease and high cholesterol each re-weight the engine. Glycemic load, potassium and phosphorus surface when they matter to you.',
    chips: ['Glycemic load', 'Sodium weighting', 'Potassium & phosphorus', 'Hard allergen blocks'],
    stat: { value: '2.2×', label: 'sodium weight for hypertension' },
  },
  {
    id: 'dietitians', label: 'Dietitians', icon: Stethoscope,
    headline: 'Between appointments, your client keeps a record.',
    copy: 'Export a seven or thirty day report as a PDF, share a read-only link, and see adherence in a heatmap instead of a handwritten food diary.',
    chips: ['Client roster', 'Shareable reports', 'Adherence heatmap', 'White-label export'],
    stat: { value: '18 min', label: 'saved per consultation' },
  },
  {
    id: 'gyms', label: 'Gyms & wellness', icon: Salad,
    headline: 'Give every member a score they can act on.',
    copy: 'Branded dashboards, member challenges and group streaks. Roll it into onboarding so nutrition sits next to training instead of after it.',
    chips: ['Branded dashboard', 'Member challenges', 'Group streaks', 'Onboarding flows'],
    stat: { value: '31%', label: 'lift in 30-day retention' },
  },
]

export function AudienceTabs() {
  const [active, setActive] = useState(0)
  const [direction, setDirection] = useState(1)
  const railRef = useRef<HTMLDivElement>(null)
  const pillRef = useRef<HTMLSpanElement>(null)

  // Deep-link support: /#audiences=dietitians
  useEffect(() => {
    const hash = window.location.hash
    const match = hash.match(/audiences[=-]([a-z]+)/i)
    if (!match) return
    const idx = AUDIENCES.findIndex((a) => a.id === match[1].toLowerCase())
    if (idx >= 0) setActive(idx)
  }, [])

  // Effect 26 — measure the active tab and slide the indicator to it.
  useEffect(() => {
    const rail = railRef.current
    const pill = pillRef.current
    if (!rail || !pill) return
    const measure = () => {
      const btn = rail.children[active] as HTMLElement | undefined
      if (!btn) return
      pill.style.setProperty('--seg-x', `${btn.offsetLeft}px`)
      pill.style.setProperty('--seg-w', `${btn.offsetWidth}px`)
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(rail)
    return () => ro.disconnect()
  }, [active])

  const select = (i: number) => {
    setDirection(i > active ? 1 : -1)
    setActive(i)
  }

  const current = AUDIENCES[active]
  const Icon = current.icon

  return (
    <section id="audiences" className="container-ns py-20 sm:py-28">
      <Reveal className="mx-auto max-w-[620px] text-center">
        <p className="mb-4 text-xs font-bold uppercase tracking-[.2em] text-brand-600">Built for</p>
        <h2 className="text-[clamp(2rem,6vw,3.2rem)] font-bold tracking-[-.055em]">
          One engine. <span className="text-brand-600">Five very different people.</span>
        </h2>
      </Reveal>

      <div className="mt-10">
        <div ref={railRef} className="fx-seg mx-auto flex max-w-full overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <span ref={pillRef} className="fx-seg__pill" aria-hidden />
          {AUDIENCES.map((a, i) => (
            <button
              key={a.id}
              onClick={() => select(i)}
              aria-pressed={active === i}
              role="tab"
              aria-selected={active === i}
              className={`fx-seg__item press relative z-10 flex min-h-11 shrink-0 items-center gap-2 whitespace-nowrap rounded-full px-4 text-sm font-semibold transition-colors ${
                active === i ? 'text-ink-900' : 'text-ink-500 hover:text-ink-700'
              }`}
            >
              <a.icon className="size-4" aria-hidden />
              {a.label}
            </button>
          ))}
        </div>

        <div className="relative mt-8 overflow-hidden rounded-[30px] border border-line bg-surface p-6 shadow-soft sm:p-10">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={current.id}
              custom={direction}
              initial={{ opacity: 0, x: direction * 28 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * -28 }}
              transition={spring.soft}
              className="grid gap-8 md:grid-cols-[1.2fr_.8fr] md:items-center"
            >
              <div>
                <span className="grid size-12 place-items-center rounded-2xl bg-brand-50 text-brand-600">
                  <Icon className="size-6" aria-hidden />
                </span>
                <h3 className="mt-5 text-2xl font-bold tracking-[-.04em] text-ink-900">{current.headline}</h3>
                <p className="mt-3 max-w-[520px] text-sm leading-6 text-ink-500">{current.copy}</p>

                <motion.ul
                  initial="hidden"
                  animate="show"
                  variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } } }}
                  className="mt-6 flex flex-wrap gap-2"
                >
                  {current.chips.map((chip) => (
                    <motion.li
                      key={chip}
                      variants={{ hidden: { opacity: 0, scale: 0.8, y: 6 }, show: { opacity: 1, scale: 1, y: 0, transition: spring.pop } }}
                      className="rounded-full bg-canvas-2 px-3 py-1.5 text-xs font-semibold text-ink-700"
                    >
                      {chip}
                    </motion.li>
                  ))}
                </motion.ul>
              </div>

              <div className="rounded-[26px] bg-gradient-to-br from-brand-50 to-canvas-2 p-6 text-center">
                <div className="tabular text-[clamp(2.4rem,9vw,3.4rem)] font-bold tracking-[-.06em] text-brand-700">
                  {current.stat.value}
                </div>
                <p className="mt-1 text-xs font-semibold uppercase tracking-[.14em] text-ink-500">{current.stat.label}</p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
