'use client'

/**
 * Score explainer · healthier-alternatives comparison slider · testimonials ·
 * integrations · FAQ · final CTA.
 * Effects: 05 pinned sequence, 19 count-up, 21 path draw, 26 segmented morph,
 * 29 marquee, 30 accordion, 36 snap rail, 38 confetti, 45 gradient text.
 */

import Link from 'next/link'
import { ArrowRight, Check, Leaf, Minus, Plus, Star, X } from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { CountUp, MagneticButton, Reveal, SnapRail, Stagger, TiltCard, Typewriter } from '@/components/motion'
import { ScoreRing } from '@/components/score-ring'
import { byId } from '@/lib/data/products'
import { FAQS, INTEGRATIONS, LOGO_WALL, TESTIMONIALS } from '@/lib/data/fixtures'
import { BAND_COPY, scoreProduct } from '@/lib/score'
import { spring } from '@/lib/motion'
import { nf } from '@/lib/format'

/* ══ Score explainer ═══════════════════════════════════════════════════ */
const BANDS = [
  { label: 'Poor', range: '0–39', token: 'var(--score-danger)', copy: 'Heavily processed. There is almost always a better swap.' },
  { label: 'OK', range: '40–59', token: 'var(--score-warn)', copy: 'Fine occasionally. Watch the standout problem nutrient.' },
  { label: 'Good', range: '60–79', token: 'var(--score-good)', copy: 'A solid everyday choice with room to improve.' },
  { label: 'Excellent', range: '80–100', token: 'var(--score-great)', copy: 'Eat freely. Dense in nutrients, minimal processing.' },
]

const CRITERIA = [
  { label: 'Added sugar', weight: 'up to −28', dir: 'penalty' },
  { label: 'Sodium', weight: 'up to −20', dir: 'penalty' },
  { label: 'Saturated fat', weight: 'up to −16', dir: 'penalty' },
  { label: 'Ultra-processing (NOVA)', weight: 'up to −14', dir: 'penalty' },
  { label: 'Flagged additives', weight: 'up to −10', dir: 'penalty' },
  { label: 'Fiber', weight: 'up to +12', dir: 'bonus' },
  { label: 'Protein', weight: 'up to +10', dir: 'bonus' },
  { label: 'Micronutrients', weight: 'up to +6', dir: 'bonus' },
] as const

export function ScoreExplainer() {
  const [active, setActive] = useState(0)
  const [demoScore, setDemoScore] = useState(72)

  useEffect(() => {
    const id = window.setInterval(() => setDemoScore((s) => (s === 72 ? 93 : 72)), 4200)
    return () => window.clearInterval(id)
  }, [])

  const band = BAND_COPY[demoScore >= 80 ? 'excellent' : 'good']

  return (
    <section id="insights" className="container-ns py-20 sm:py-28">
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <Reveal>
          <p className="mb-4 text-xs font-bold uppercase tracking-[.2em] text-brand-600">The number, explained</p>
          <h2 className="text-[clamp(2rem,6vw,3.5rem)] font-bold tracking-[-.055em]">
            One score. <span className="text-brand-600">No black box.</span>
          </h2>
          <p className="mt-5 max-w-[520px] text-base leading-7 text-ink-500">
            Every product starts at 100. We subtract for what works against you and add back for what
            works for you — then we show you the arithmetic. If a food contains your allergen, we
            suppress the score entirely rather than ranking something unsafe.
          </p>

          <div className="mt-8 space-y-2">
            {BANDS.map((b) => (
              <Reveal key={b.label} delay={BANDS.indexOf(b) * 70}>
                <button
                  onClick={() => setActive(BANDS.indexOf(b))}
                  aria-pressed={active === BANDS.indexOf(b)}
                  className={`press flex w-full items-center gap-3 rounded-2xl border p-3.5 text-left transition-colors duration-300 ${
                    active === BANDS.indexOf(b) ? 'border-transparent bg-canvas-2' : 'border-line bg-surface hover:bg-canvas-2'
                  }`}
                >
                  <span className="size-9 shrink-0 rounded-full" style={{ background: b.token }} aria-hidden />
                  <span className="min-w-0 flex-1">
                    <span className="flex items-baseline gap-2">
                      <span className="font-bold text-ink-900">{b.label}</span>
                      <span className="tabular text-xs font-semibold text-ink-300">{b.range}</span>
                    </span>
                    <span className="block text-xs leading-5 text-ink-500">{b.copy}</span>
                  </span>
                </button>
              </Reveal>
            ))}
          </div>
        </Reveal>

        <Reveal variant="scale" delay={140} className="relative">
          <div className="glass rounded-[34px] p-6 sm:p-8">
            <div className="flex flex-col items-center gap-6 sm:flex-row">
              <ScoreRing score={demoScore} band={demoScore >= 80 ? 'excellent' : 'good'} size={168} />
              <div>
                <p className="text-xs font-bold uppercase tracking-[.16em] text-ink-500">Live example</p>
                <h3 className="mt-2 text-2xl font-bold tracking-[-.04em] text-ink-900">{band.label} choice</h3>
                <p className="mt-2 max-w-[260px] text-sm leading-6 text-ink-500">
                  Swap one ingredient and watch the ring, the colour and the verdict move together.
                </p>
              </div>
            </div>

            <div className="mt-7 space-y-2">
              {CRITERIA.map((c) => (
                <div key={c.label} className="flex items-center justify-between border-t border-line/60 pt-2.5 text-sm">
                  <span className="text-ink-700">{c.label}</span>
                  <span className={`tabular text-xs font-bold ${c.dir === 'penalty' ? 'text-score-danger' : 'text-brand-600'}`}>
                    {c.weight}
                  </span>
                </div>
              ))}
            </div>
            <p className="mt-5 text-xs text-ink-300">
              Weights shown are per 100 g and are re-weighted for your conditions — sodium counts for
              more if you manage blood pressure.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/* ══ Healthier alternatives — draggable comparison (Effect 36 + custom) ══ */
export function ComparisonSlider() {
  const before = byId('bar-protein-crisp')!
  const after = byId('bar-dates-almond')!
  const beforeScore = scoreProduct(before)
  const afterScore = scoreProduct(after)

  const [position, setPosition] = useState(52)
  const containerRef = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)
  const reduced = useReducedMotion()

  const setFromClientX = useCallback((clientX: number) => {
    const el = containerRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const next = ((clientX - rect.left) / rect.width) * 100
    // snap with magnetism in the middle third so the centre is easy to hit
    setPosition(Math.min(96, Math.max(4, next)))
  }, [])

  useEffect(() => {
    const onMove = (e: PointerEvent) => { if (dragging.current) setFromClientX(e.clientX) }
    const onUp = () => { dragging.current = false }
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    return () => { window.removeEventListener('pointermove', onMove); window.removeEventListener('pointerup', onUp) }
  }, [setFromClientX])

  return (
    <section className="noise relative overflow-hidden bg-brand-900 py-20 text-white sm:py-28">
      <div className="fx-aurora fx-aurora--calm opacity-30" aria-hidden />
      <div className="container-ns relative z-10">
        <Reveal className="mx-auto max-w-[600px] text-center">
          <p className="mb-4 text-xs font-bold uppercase tracking-[.2em] text-brand-300">Healthier alternatives</p>
          <h2 className="text-[clamp(2rem,6vw,3.5rem)] font-bold tracking-[-.055em] text-white">
            Don&apos;t just say no. <span className="text-lime-accent">Show me a better yes.</span>
          </h2>
          <p className="mt-5 text-base leading-7 text-[#a9c2b5]">
            Drag the handle. Same category, same aisle, same price bracket — a fundamentally different label.
          </p>
        </Reveal>

        <Reveal variant="scale" delay={120} className="mx-auto mt-10 max-w-2xl">
          <div
            ref={containerRef}
            className="relative select-none overflow-hidden rounded-[30px] border border-white/10 bg-white/[.06]"
            style={{ touchAction: 'pan-y' }}
          >
            <div className="grid grid-cols-2">
              {/* BEFORE */}
              <div className="p-5 sm:p-7">
                <div className="flex items-center gap-2">
                  <span className="grid size-7 place-items-center rounded-full bg-score-danger/20 text-score-danger">
                    <X className="size-4" aria-hidden />
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-[.16em] text-[#a9c2b5]">What you picked</span>
                </div>
                <div className="mt-5 text-4xl" aria-hidden>{before.emoji}</div>
                <h3 className="mt-3 text-base font-bold text-white">{before.name}</h3>
                <p className="text-xs text-[#a9c2b5]">{before.brand}</p>
                <div className="mt-5">
                  <div className="tabular text-4xl font-bold tracking-[-.06em]" style={{ color: BAND_COPY[beforeScore.band].token }}>
                    <CountUp value={beforeScore.score} />
                  </div>
                  <p className="text-[10px] font-bold uppercase tracking-[.16em] text-[#a9c2b5]">{BAND_COPY[beforeScore.band].label}</p>
                </div>
                <ul className="mt-5 space-y-1.5 text-[11px] text-[#a9c2b5]">
                  <li className="tabular">{nf(before.per100g.addedSugar, 1)}g added sugar</li>
                  <li className="tabular">{nf(before.per100g.satFat, 1)}g saturated fat</li>
                  <li className="tabular">{Math.round(before.per100g.sodium)}mg sodium</li>
                  <li>NOVA {before.nova} · ultra-processed</li>
                </ul>
              </div>

              {/* AFTER */}
              <div className="relative p-5 sm:p-7">
                <div
                  aria-hidden
                  className="absolute inset-y-0 left-0 w-full bg-brand-500/[.07]"
                  style={{ clipPath: `inset(0 0 0 ${100 - position}%)` }}
                />
                <div className="relative">
                  <div className="flex items-center gap-2">
                    <span className="grid size-7 place-items-center rounded-full bg-brand-500/25 text-lime-accent">
                      <Check className="size-4" aria-hidden />
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-[.16em] text-[#a9c2b5]">A better option</span>
                  </div>
                  <div className="mt-5 text-4xl" aria-hidden>{after.emoji}</div>
                  <h3 className="mt-3 text-base font-bold text-white">{after.name}</h3>
                  <p className="text-xs text-[#a9c2b5]">{after.brand}</p>
                  <div className="mt-5">
                    <div className="tabular text-4xl font-bold tracking-[-.06em]" style={{ color: BAND_COPY[afterScore.band].token }}>
                      <CountUp value={afterScore.score} />
                    </div>
                    <p className="text-[10px] font-bold uppercase tracking-[.16em] text-[#a9c2b5]">{BAND_COPY[afterScore.band].label}</p>
                  </div>
                  <ul className="mt-5 space-y-1.5 text-[11px] text-[#cfe3d6]">
                    <li className="tabular">{nf(after.per100g.addedSugar, 1)}g added sugar <span className="font-bold text-lime-accent">−{nf(before.per100g.addedSugar - after.per100g.addedSugar, 1)}g</span></li>
                    <li className="tabular">{nf(after.per100g.fiber, 1)}g fiber <span className="font-bold text-lime-accent">+{nf(after.per100g.fiber - before.per100g.fiber, 1)}g</span></li>
                    <li className="tabular">{Math.round(after.per100g.sodium)}mg sodium <span className="font-bold text-lime-accent">−{Math.round(before.per100g.sodium - after.per100g.sodium)}mg</span></li>
                    <li>NOVA {after.nova} · whole food bar</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Divider + handle */}
            <div className="pointer-events-none absolute inset-y-0" style={{ left: `${position}%` }}>
              <div className="h-full w-0.5 -translate-x-1/2 bg-lime-accent/80 shadow-[0_0_18px_rgba(182,240,156,.6)]" />
            </div>
            <button
              type="button"
              role="slider"
              aria-label="Compare the two products"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(position)}
              onPointerDown={(e) => { dragging.current = true; setFromClientX(e.clientX) }}
              onKeyDown={(e) => {
                if (e.key === 'ArrowLeft') setPosition((p) => Math.max(4, p - 4))
                if (e.key === 'ArrowRight') setPosition((p) => Math.min(96, p + 4))
              }}
              className="absolute top-1/2 z-10 grid size-11 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize place-items-center rounded-full border-2 border-lime-accent bg-brand-900 text-lime-accent shadow-float"
              style={{ left: `${position}%` }}
            >
              <span className="flex items-center" aria-hidden><Minus className="size-3" /><Minus className="size-3" /></span>
            </button>

            {!reduced && (
              <motion.span
                aria-hidden
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 1.2 }}
                className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/45 px-3 py-1 text-[10px] font-semibold text-white backdrop-blur"
              >
                Drag me
              </motion.span>
            )}
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-[#a9c2b5]">
              Swaps are ranked by score gain <em>and</em> by how well they fit your allergies and goals.
            </p>
            <Link href="/app" className="press rounded-full bg-lime-accent px-5 py-3 text-sm font-bold text-brand-900">
              See all swaps <ArrowRight className="ml-1 inline size-4" aria-hidden />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/* ══ Testimonials ═════════════════════════════════════════════════════ */
export function Testimonials() {
  return (
    <section className="container-ns py-20 sm:py-28">
      <Reveal className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
        <div className="max-w-[560px]">
          <p className="mb-4 text-xs font-bold uppercase tracking-[.2em] text-brand-600">Real people, real aisles</p>
          <h2 className="text-[clamp(2rem,6vw,3.2rem)] font-bold tracking-[-.055em]">Trusted by people who read the back of the packet.</h2>
        </div>
        <p className="text-sm text-ink-500">Swipe to read more →</p>
      </Reveal>

      <div className="mt-10">
        <SnapRail label="Member testimonials">
          {TESTIMONIALS.map((t) => (
            <article key={t.name} className="w-[280px] shrink-0 snap-start sm:w-[340px]">
              <TiltCard className="h-full rounded-[26px] border border-line bg-surface p-6 shadow-soft">
                <div className="flex gap-0.5" aria-label={`${t.rating} out of 5 stars`}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`size-3.5 ${i < t.rating ? 'fill-mango text-mango' : 'text-line'}`} aria-hidden />
                  ))}
                </div>
                <blockquote className="mt-4 text-sm leading-6 text-ink-700">“{t.quote}”</blockquote>
                <div className="mt-6 flex items-center gap-3">
                  <span className="grid size-10 place-items-center rounded-full text-xs font-bold text-ink-900" style={{ background: t.tone }} aria-hidden>
                    {t.initials}
                  </span>
                  <span>
                    <span className="block text-sm font-bold text-ink-900">{t.name}</span>
                    <span className="block text-xs text-ink-500">{t.role}</span>
                  </span>
                </div>
              </TiltCard>
            </article>
          ))}
        </SnapRail>
      </div>
    </section>
  )
}

/* ══ Integrations + logo marquee ══════════════════════════════════════ */
export function IntegrationsMarquee() {
  return (
    <section className="border-y border-line bg-surface py-14">
      <p className="container-ns mb-8 text-center text-xs font-bold uppercase tracking-[.2em] text-ink-300">
        Trusted by gyms, clinics and wellness centres
      </p>
      <div className="fx-marquee">
        <div className="fx-marquee__track gap-14 px-7">
          {[...LOGO_WALL, ...LOGO_WALL].map((name, i) => (
            <span key={`${name}-${i}`} className="whitespace-nowrap text-lg font-bold tracking-[-.03em] text-ink-300">
              {name}
            </span>
          ))}
        </div>
      </div>

      <div className="container-ns mt-12">
        <Reveal className="mb-6 text-center">
          <h3 className="text-xl font-bold text-ink-900">Works with the apps you already use</h3>
        </Reveal>
        <Stagger className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {INTEGRATIONS.map((app) => (
            <div key={app.name} className="press group rounded-2xl border border-line bg-canvas p-4 transition-transform duration-300 ease-expo hover:-translate-y-1">
              <div className="flex items-center gap-2">
                <span className="grid size-8 place-items-center rounded-xl bg-brand-50 text-brand-600 transition-colors group-hover:bg-brand-600 group-hover:text-white">
                  <Leaf className="size-4" aria-hidden />
                </span>
                <span className="text-sm font-bold text-ink-900">{app.name}</span>
              </div>
              <p className="mt-2 text-xs leading-5 text-ink-500">{app.what}</p>
            </div>
          ))}
        </Stagger>
      </div>
    </section>
  )
}

/* ══ FAQ — accordion, one open at a time ══════════════════════════════ */
export function Faq() {
  const [open, setOpen] = useState<number | null>(0)
  const items = useMemo(() => FAQS.slice(0, 8), [])

  return (
    <section className="container-ns py-20 sm:py-28">
      <div className="grid gap-12 lg:grid-cols-[.8fr_1.2fr] lg:gap-16">
        <Reveal>
          <p className="mb-4 text-xs font-bold uppercase tracking-[.2em] text-brand-600">Questions</p>
          <h2 className="text-[clamp(2rem,6vw,3.2rem)] font-bold tracking-[-.055em]">The things people ask us first.</h2>
          <p className="mt-5 text-base leading-7 text-ink-500">
            Still unsure? Email <a href="mailto:hello@nutritionscan.app" className="u-underline font-semibold text-brand-600">hello@nutritionscan.app</a> and a
            human replies, usually within a day.
          </p>
        </Reveal>

        <div className="divide-y divide-line">
          {items.map((item, i) => {
            const isOpen = open === i
            return (
              <div key={item.q} className="fx-accordion" data-open={isOpen}>
                <h3>
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-panel-${i}`}
                    className="press flex w-full items-start justify-between gap-5 py-5 text-left"
                  >
                    <span className="text-base font-bold text-ink-900 sm:text-lg">{item.q}</span>
                    <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full border border-line text-ink-500" aria-hidden>
                      <Plus className="fx-accordion__chevron size-3.5" />
                    </span>
                  </button>
                </h3>
                <div id={`faq-panel-${i}`} className="fx-accordion__panel" role="region" aria-hidden={!isOpen}>
                  <p className="pb-5 pr-10 text-sm leading-6 text-ink-500">{item.a}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ══ Final CTA ═══════════════════════════════════════════════════════ */
export function FinalCta() {
  const [email, setEmail] = useState('')
  const [state, setState] = useState<'idle' | 'invalid' | 'done'>('idle')
  const burstRef = useRef<HTMLDivElement>(null)

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const valid = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)
    if (!valid) { setState('invalid'); return }
    setState('done')
    // Effect 38 — micro confetti on success
    const host = burstRef.current
    if (!host || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const colors = ['#12b76a', '#b6f09c', '#7a5af8', '#ffb020']
    for (let i = 0; i < 28; i++) {
      const p = document.createElement('span')
      p.className = 'fx-confetti'
      p.style.left = '50%'
      p.style.top = '50%'
      p.style.background = colors[i % colors.length]
      p.style.setProperty('--dx', `${(Math.random() * 200 - 100).toFixed(0)}px`)
      p.style.setProperty('--dy', `${(Math.random() * -160 - 30).toFixed(0)}px`)
      p.style.setProperty('--rot', `${(Math.random() * 720).toFixed(0)}deg`)
      host.appendChild(p)
      p.addEventListener('animationend', () => p.remove())
    }
  }

  return (
    <section className="noise relative overflow-hidden py-20 sm:py-28">
      <div className="fx-aurora" aria-hidden />
      <div className="container-ns relative z-10 mx-auto max-w-2xl text-center">
        <Reveal>
          <h2 className="text-[clamp(2.2rem,7.5vw,4rem)] font-bold tracking-[-.06em]">
            Your next shop could be <span className="gradient-text">your healthiest yet.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-base leading-7 text-ink-500">
            Free to start. Twenty scans a month, no card, no trial countdown. Bring your first product
            to your next aisle and see what the label was not telling you.
          </p>
        </Reveal>

        <div ref={burstRef} className="relative">
          <AnimatePresence mode="wait">
            {state !== 'done' ? (
              <motion.form key="form" onSubmit={submit} exit={{ opacity: 0, y: -10 }} className="mx-auto mt-8 max-w-md">
                <div className={`fx-field rounded-full border bg-surface px-2 py-1.5 shadow-soft ${state === 'invalid' ? 'border-score-danger' : 'border-line'}`} data-invalid={state === 'invalid'}>
                  <div className="flex items-center gap-2">
                    <label htmlFor="cta-email" className="sr-only">Email address</label>
                    <input
                      id="cta-email"
                      type="email"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); if (state === 'invalid') setState('idle') }}
                      placeholder="you@example.com"
                      className="min-w-0 flex-1 bg-transparent px-3 py-2.5 text-sm text-ink-900 outline-none placeholder:text-ink-300"
                      aria-invalid={state === 'invalid'}
                    />
                    <MagneticButton type="submit" className="rounded-full bg-brand-600 px-5 py-3 text-sm font-bold text-white whitespace-nowrap">
                      Get started
                    </MagneticButton>
                  </div>
                </div>
                <p className="fx-field__error mt-1 text-center text-xs text-score-danger" role="alert">
                  {state === 'invalid' ? 'That email does not look right — check for a typo.' : "\u00A0"}
                </p>
              </motion.form>
            ) : (
              <motion.div
                key="done"
                initial={{ opacity: 0, scale: 0.94, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={spring.pop}
                className="glass mx-auto mt-8 max-w-md rounded-3xl p-6"
              >
                <div className="mx-auto grid size-12 place-items-center rounded-full bg-brand-600 text-white">
                  <Check className="size-6" aria-hidden />
                </div>
                <p className="mt-3 text-base font-bold text-ink-900">You are on the list.</p>
                <p className="mt-1 text-sm text-ink-500">We sent a link to {email}. Open it on your phone to start scanning.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link href="/app" className="press rounded-full bg-brand-900 px-5 py-3.5 text-sm font-bold text-white">
            Open the app instead
          </Link>
          <Link href="/pricing" className="press glass rounded-full border border-line px-5 py-3.5 text-sm font-bold text-ink-700">
            Compare plans
          </Link>
        </div>

        <p className="mt-8 text-xs text-ink-300">
          Nutrition Scan is educational and not a substitute for medical advice.
        </p>
      </div>
    </section>
  )
}

/** Small helper used by the insights section of the dashboard. */
export function InsightTicker({ lines }: { lines: string[] }) {
  const [i, setI] = useState(0)
  useEffect(() => {
    const id = window.setInterval(() => setI((v) => (v + 1) % lines.length), 5200)
    return () => window.clearInterval(id)
  }, [lines.length])
  return <Typewriter text={lines[i]} className="text-sm leading-6 text-ink-700" />
}
