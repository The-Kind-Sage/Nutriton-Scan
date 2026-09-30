'use client'

/**
 * "Point. Scan. Understand." · the feature bento · and the live demo scanner.
 * The live scanner is the credibility centrepiece: it runs the real scoring
 * engine over the mock API, with real latency, so loading states are visible.
 */

import Link from 'next/link'
import { ArrowRight, Camera, Check, Leaf, ScanLine, Sparkles, Upload } from 'lucide-react'
import { useCallback, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CountUp, MagneticButton, Reveal, Stagger, TiltCard } from '@/components/motion'
import { ScoreRing } from '@/components/score-ring'
import { api } from '@/lib/api'
import { DEMO_BARCODES } from '@/lib/data/fixtures'
import { BAND_COPY } from '@/lib/score'
import { chipContainer, chipIn, spring } from '@/lib/motion'
import { nf } from '@/lib/format'
import type { Product, ScoreResult } from '@/lib/types'

/* ══ How it works ══════════════════════════════════════════════════════ */
const STEPS = [
  {
    n: '01', icon: ScanLine, title: 'Point your camera',
    copy: 'A barcode, an ingredient label or the plate in front of you. Nutrition Scan sees the whole picture, not just the numbers on the back.',
    tone: 'bg-brand-900 text-white', accent: 'text-lime-accent', body: 'text-[#b5cfc2]',
  },
  {
    n: '02', icon: Sparkles, title: 'AI reads the details',
    copy: 'Ingredients, additives, allergens and the full nutrient panel — decoded in about two seconds, in language you do not need a degree to read.',
    tone: 'bg-surface border border-line text-ink-900', accent: 'text-berry', body: 'text-ink-500',
  },
  {
    n: '03', icon: Leaf, title: 'Make a better choice',
    copy: 'See the score, understand exactly why, and get a swap that fits your goals, your allergies and the shop you are standing in.',
    tone: 'bg-brand-50 text-ink-900', accent: 'text-brand-600', body: 'text-ink-700',
  },
]

export function HowItWorks() {
  return (
    <section id="how" className="container-ns py-20 sm:py-28">
      <Reveal className="max-w-[570px]">
        <p className="eyebrow mb-4 text-xs font-bold uppercase tracking-[.2em] text-brand-600">The simple version</p>
        <h2 className="text-[clamp(2rem,6vw,3.5rem)] font-bold tracking-[-.055em]">
          Point. Scan. <span className="text-brand-600">Understand.</span>
        </h2>
        <p className="mt-5 text-base leading-7 text-ink-500">
          No spreadsheets. No guilt. Just a calm, clear read on the food in front of you.
        </p>
      </Reveal>

      {/* Effect 21 — the connector draws itself between the steps */}
      <div className="relative mt-12">
        <svg aria-hidden className="pointer-events-none absolute left-0 right-0 top-[38px] hidden h-2 w-full md:block"
          viewBox="0 0 1000 8" preserveAspectRatio="none">
          <path d="M60 4 H940" stroke="var(--line)" strokeWidth="2" strokeDasharray="6 7" pathLength="1" />
        </svg>

        <Stagger className="grid gap-4 md:grid-cols-3">
          {STEPS.map((step) => {
            const Icon = step.icon
            return (
              <article
                key={step.n}
                className={`group relative overflow-hidden rounded-[28px] p-7 transition-transform duration-400 ease-expo hover:-translate-y-1.5 sm:p-9 ${step.tone}`}
              >
                <div className={`mb-14 text-5xl font-bold tracking-[-.07em] opacity-25 ${step.accent}`}>{step.n}</div>
                <Icon className={`mb-5 size-7 ${step.accent}`} aria-hidden />
                <h3 className="text-2xl font-bold">{step.title}</h3>
                <p className={`mt-3 text-sm leading-6 ${step.body}`}>{step.copy}</p>
                <span aria-hidden className="absolute -bottom-8 -right-8 size-28 rounded-full bg-current opacity-[.06] transition-transform duration-500 ease-expo group-hover:scale-125" />
              </article>
            )
          })}
        </Stagger>
      </div>
    </section>
  )
}

/* ══ Feature bento ═════════════════════════════════════════════════════ */
const FEATURES = [
  { icon: ScanLine, title: 'AI barcode scan', copy: 'Any packaged product, identified in about two seconds.', tone: 'bg-[#d9f8e4] text-[#078b4e]', span: 'sm:col-span-2' },
  { icon: Sparkles, title: 'Image & label scan', copy: 'No barcode? Photograph the label or the meal.', tone: 'bg-[#e7e1ff] text-[#6447da]', span: 'sm:col-span-2' },
  { icon: Check, title: 'One clear score', copy: 'A single 0–100 number with the math shown.', tone: 'bg-[#ffe5d3] text-[#d95a0a]', span: '' },
  { icon: Upload, title: 'Ingredient clarity', copy: 'Every additive named, explained and flagged.', tone: 'bg-[#dceeff] text-[#1774c8]', span: '' },
  { icon: Leaf, title: 'Personalised swaps', copy: 'Better options tuned to your goals.', tone: 'bg-[#d9f8e4] text-[#078b4e]', span: '' },
  { icon: Camera, title: 'Small scans, big trends', copy: 'Your diary becomes a picture of what works.', tone: 'bg-[#e7e1ff] text-[#6447da]', span: '' },
]

export function FeatureBento() {
  return (
    <section id="features" className="noise relative overflow-hidden bg-brand-900 py-20 text-white sm:py-28">
      <div className="fx-aurora fx-aurora--calm opacity-40" aria-hidden />
      <div className="container-ns relative z-10">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <Reveal className="max-w-[600px]">
            <p className="mb-4 text-xs font-bold uppercase tracking-[.2em] text-brand-300">Everything in one scan</p>
            <h2 className="text-[clamp(2rem,6vw,3.5rem)] font-bold tracking-[-.055em] text-white">
              Clarity you can <span className="text-lime-accent">feel.</span>
            </h2>
          </Reveal>
          <Reveal delay={120} className="max-w-[330px]">
            <p className="text-sm leading-6 text-[#a9c2b5]">
              Designed for real life — from grocery aisles to kitchen counters to your 6am training session.
            </p>
          </Reveal>
        </div>

        <Stagger className="mt-12 grid gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {FEATURES.map(({ icon: Icon, title, copy, tone, span }) => (
            <div key={title} className={`${span} min-h-[190px]`}>
              <TiltCard className="group h-full rounded-[26px] border border-white/10 bg-white/[.06] p-6 transition-colors duration-400 hover:border-brand-300/50 hover:bg-white/[.1]">
                <div className={`mb-10 grid size-11 place-items-center rounded-2xl ${tone}`}>
                  <Icon className="size-5" aria-hidden />
                </div>
                <h3 className="text-xl font-bold text-white">{title}</h3>
                <p className="mt-2 max-w-[240px] text-sm leading-6 text-[#a9c2b5]">{copy}</p>
                <ArrowRight aria-hidden className="absolute bottom-6 right-6 size-5 text-brand-300 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </TiltCard>
            </div>
          ))}
        </Stagger>
      </div>
    </section>
  )
}

/* ══ Live demo scanner — really runs the engine ════════════════════════ */
type Phase = 'idle' | 'scanning' | 'done'

const STEPS_LOG = [
  'Opening camera…',
  'Locating barcode…',
  'Matching product…',
  'Reading the ingredient list…',
  'Weighting against your profile…',
  'Building alternatives…',
]

export function LiveScanner() {
  const [phase, setPhase] = useState<Phase>('idle')
  const [logIndex, setLogIndex] = useState(0)
  const [result, setResult] = useState<{ product: Product; score: ScoreResult } | null>(null)
  const indexRef = useRef(0)
  const timers = useRef<number[]>([])

  const scan = useCallback(async () => {
    timers.current.forEach(window.clearTimeout)
    timers.current = []
    setPhase('scanning')
    setResult(null)
    setLogIndex(0)

    STEPS_LOG.forEach((_, i) => {
      timers.current.push(window.setTimeout(() => setLogIndex(i), i * 260))
    })

    const barcode = DEMO_BARCODES[indexRef.current % DEMO_BARCODES.length]
    indexRef.current += 1
    const data = await api.scanBarcode(barcode, null)
    setResult(data)
    setPhase('done')
  }, [])

  const copy = result ? BAND_COPY[result.score.band] : null

  return (
    <section id="live-demo" className="container-ns py-20 sm:py-28">
      <Reveal className="mx-auto max-w-[620px] text-center">
        <p className="mb-4 text-xs font-bold uppercase tracking-[.2em] text-brand-600">Try it without signing up</p>
        <h2 className="text-[clamp(2rem,6vw,3.5rem)] font-bold tracking-[-.055em]">Scan a real product, right here.</h2>
        <p className="mt-5 text-base leading-7 text-ink-500">
          This runs the same scoring engine as the app, on real nutrition data. Forty-one products, four of them in rotation below.
        </p>
      </Reveal>

      <Reveal variant="scale" delay={120} className="mx-auto mt-10 max-w-md">
        <div className="rounded-[34px] bg-brand-900 p-3 shadow-[0_25px_70px_rgba(5,46,31,.22)]">
          <div className="relative overflow-hidden rounded-[26px] bg-canvas p-5">
            <AnimatePresence mode="wait">
              {phase !== 'done' && (
                <motion.div
                  key="scanner"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.24 }}
                  className="fx-reticle relative flex aspect-[.86] flex-col items-center justify-center overflow-hidden rounded-[22px] bg-[linear-gradient(160deg,#dff7e6,#c2e3cd)] p-6 text-center"
                >
                  <span aria-hidden className="fx-reticle__corner" data-pos="tl" />
                  <span aria-hidden className="fx-reticle__corner" data-pos="tr" />
                  <span aria-hidden className="fx-reticle__corner" data-pos="bl" />
                  <span aria-hidden className="fx-reticle__corner" data-pos="br" />
                  {phase === 'scanning' && <span aria-hidden className="fx-laser" style={{ ['--laser-span' as string]: '210px' }} />}
                  <span aria-hidden className="absolute inset-6 rounded-[20px] border-2 border-dashed border-brand-600/40" />

                  <div className="relative grid size-20 place-items-center rounded-[28px] bg-white/85 text-brand-600 shadow-float">
                    {phase === 'scanning' ? <ScanLine className="size-9 animate-pulse" aria-hidden /> : <Camera className="size-9" aria-hidden />}
                  </div>

                  <h3 className="relative mt-6 text-xl font-bold text-ink-900">
                    {phase === 'scanning' ? 'Reading your label…' : 'Ready when you are'}
                  </h3>
                  <p className="relative mt-2 min-h-[42px] max-w-[280px] text-sm leading-6 text-ink-500">
                    {phase === 'scanning' ? STEPS_LOG[logIndex] : 'Hold the product inside the frame for the clearest result.'}
                  </p>

                  <MagneticButton
                    onClick={scan}
                    className="relative mt-6 rounded-full bg-brand-600 px-6 py-3.5 text-sm font-bold text-white shadow-glow"
                  >
                    {phase === 'scanning' ? 'Scanning…' : 'Scan a product'}
                  </MagneticButton>
                </motion.div>
              )}

              {phase === 'done' && result && (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={spring.soft}
                  className="rounded-[22px] bg-surface p-5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold uppercase tracking-[.16em] text-ink-300">{result.product.brand}</p>
                      <h3 className="mt-1 truncate text-lg font-bold text-ink-900">{result.product.name}</h3>
                      <p className="mt-0.5 text-xs text-ink-500">{result.product.servingSize}</p>
                    </div>
                    <span className="text-4xl" aria-hidden>{result.product.emoji}</span>
                  </div>

                  <div className="mt-5 flex items-center gap-5">
                    <ScoreRing score={result.score.score} band={result.score.band} size={128} />
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-ink-900">{copy?.label} choice</p>
                      <p className="mt-1.5 text-xs leading-5 text-ink-500">{result.score.verdict}</p>
                    </div>
                  </div>

                  <motion.div variants={chipContainer} initial="hidden" animate="show" className="mt-4 flex flex-wrap gap-1.5">
                    {result.score.flags.slice(0, 4).map((flag) => (
                      <motion.span key={flag} variants={chipIn}
                        className="rounded-full bg-canvas-2 px-2.5 py-1 text-[10px] font-semibold text-ink-700">
                        {flag}
                      </motion.span>
                    ))}
                  </motion.div>

                  <div className="mt-5 grid grid-cols-4 gap-2">
                    {[
                      ['kcal', result.product.per100g.kcal],
                      ['protein', result.product.per100g.protein],
                      ['fiber', result.product.per100g.fiber],
                      ['sugar', result.product.per100g.addedSugar],
                    ].map(([label, value]) => (
                      <div key={label as string} className="rounded-xl bg-canvas-2 px-2.5 py-2">
                        <div className="text-[10px] font-medium text-ink-500">{label}</div>
                        <div className="tabular text-sm font-bold text-ink-900">{nf(value as number, (value as number) < 10 ? 1 : 0)}g</div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-5 flex flex-col gap-2 min-[380px]:flex-row">
                    <Link href={`/app/result/${result.product.barcode}`}
                      className="press flex-1 rounded-full bg-brand-600 px-5 py-3.5 text-center text-sm font-bold text-white">
                      See the full breakdown
                    </Link>
                    <button onClick={scan}
                      className="press rounded-full border border-line px-5 py-3.5 text-sm font-bold text-ink-700">
                      Scan another
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <p className="mt-4 text-center text-xs text-ink-300">
          Camera access is entirely optional here — this demo runs on bundled data.
        </p>
      </Reveal>
    </section>
  )
}

/* Small helper reused by other sections for consistency. */
export function StatRow({ items }: { items: { label: string; value: number; suffix?: string }[] }) {
  return (
    <div className="flex flex-wrap gap-x-8 gap-y-4">
      {items.map((item) => (
        <div key={item.label}>
          <div className="tabular text-2xl font-bold tracking-[-.04em] text-ink-900">
            <CountUp value={item.value} suffix={item.suffix ?? ''} />
          </div>
          <div className="text-xs font-medium text-ink-500">{item.label}</div>
        </div>
      ))}
    </div>
  )
}
