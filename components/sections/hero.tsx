'use client'

/**
 * Hero — the section that has to sell the whole product in one screen.
 * Effects: 01 word reveal · 03 parallax · 06 aurora · 07 blobs · 09 magnetic ·
 * 11 tilt · 19 count-up · 24 reticle lock · 43 chip fly-in · 45 gradient text.
 */

import Link from 'next/link'
import { ArrowRight, Check, Play, ScanLine, ShieldCheck, Sparkles } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { CountUp, MagneticButton, Parallax, TiltCard, WordReveal } from '@/components/motion'
import { ScoreRing, ScoreChip } from '@/components/score-ring'
import { PRODUCTS } from '@/lib/data/products'
import { scoreProduct } from '@/lib/score'
import { chipContainer, chipIn, spring } from '@/lib/motion'

const DEMO = PRODUCTS[0] // Hearth & Grain Granola
const DEMO_SCORE = scoreProduct(DEMO)

export function Hero() {
  const reduced = useReducedMotion()
  const [phase, setPhase] = useState<'idle' | 'scanning' | 'locked'>('idle')
  const timers = useRef<number[]>([])

  // A looping, interruptible demo. Tapping the phone restarts it.
  const runDemo = () => {
    timers.current.forEach(window.clearTimeout)
    timers.current = []
    if (reduced) { setPhase('locked'); return }
    setPhase('scanning')
    timers.current.push(window.setTimeout(() => setPhase('locked'), 2100))
    timers.current.push(window.setTimeout(() => setPhase('idle'), 7200))
  }

  useEffect(() => {
    const start = window.setTimeout(runDemo, 900)
    const loop = window.setInterval(() => { setPhase('idle'); window.setTimeout(runDemo, 350) }, 9000)
    return () => {
      window.clearTimeout(start)
      window.clearInterval(loop)
      timers.current.forEach(window.clearTimeout)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const locked = phase === 'locked'

  return (
    <section id="top" className="noise relative isolate overflow-hidden pb-16 pt-28 sm:pb-24 sm:pt-36 lg:pt-40">
      <div className="fx-aurora" aria-hidden />
      <div className="fx-blob fx-blob--1 absolute -right-16 top-16 size-56 sm:size-80" aria-hidden />
      <div className="fx-blob fx-blob--2 absolute -left-20 bottom-10 size-44 sm:size-64" aria-hidden />
      <div className="hero-grid absolute inset-0 -z-10" aria-hidden />

      <div className="container-ns relative z-10 grid items-center gap-14 lg:grid-cols-[1.04fr_.96fr] lg:gap-10">
        <div className="max-w-[650px]">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...spring.soft, delay: 0.1 }}
            className="glass mb-6 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-semibold text-brand-700"
          >
            <span className="relative flex size-1.5">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-brand-500 opacity-75" />
              <span className="relative inline-flex size-1.5 rounded-full bg-brand-500" />
            </span>
            Powered by AI vision
            <span className="text-ink-300">·</span>
            <span className="text-ink-500">2.4M products scanned</span>
          </motion.div>

          <WordReveal
            text="Know exactly what you're eating."
            highlight={['eating']}
            className="max-w-[680px] text-[clamp(2.6rem,8.4vw,4.6rem)] font-bold tracking-[-.06em]"
          />

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...spring.soft, delay: 0.5 }}
            className="mt-6 max-w-[560px] text-base leading-7 text-ink-500 sm:text-lg sm:leading-8"
          >
            Point your camera at a barcode, a label or a plate. Get an instant nutrition score,
            a plain-English ingredient breakdown and healthier swaps — personalised to your body and goals.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...spring.soft, delay: 0.62 }}
            className="mt-8 flex flex-col items-stretch gap-3 min-[420px]:flex-row min-[420px]:items-center"
          >
            <MagneticButton
              className="rounded-full bg-citrus px-6 py-4 text-sm font-bold text-white shadow-[0_12px_28px_rgba(255,122,26,.28)]"
              onClick={() => document.getElementById('live-demo')?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
            >
              Start scanning — free <ArrowRight className="ml-2 inline size-4" aria-hidden />
            </MagneticButton>
            <Link
              href="/#how"
              className="press glass inline-flex items-center justify-center rounded-full border border-line px-6 py-4 text-sm font-bold text-ink-700 transition hover:bg-surface"
            >
              <Play className="mr-2 size-3.5 fill-current" aria-hidden /> See how it works
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.85, duration: 0.6 }}
            className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs text-ink-500"
          >
            <div className="flex items-center gap-2">
              <span className="flex -space-x-2" aria-hidden>
                {[['AL', 'var(--accent-citrus)'], ['JM', 'var(--brand-300)'], ['RS', 'var(--accent-berry)']].map(([initials, tone]) => (
                  <span key={initials} className="grid size-7 place-items-center rounded-full border-2 border-canvas text-[10px] font-bold text-ink-900" style={{ background: tone }}>
                    {initials}
                  </span>
                ))}
              </span>
              <span>Join <CountUp value={180} suffix="K+" className="font-bold text-ink-900" /> people eating with clarity</span>
            </div>
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="size-4 text-brand-600" aria-hidden /> No data sold, ever
            </span>
          </motion.div>
        </div>

        {/* ── The phone demo ──────────────────────────────────────────── */}
        <Parallax rate={0.22} className="relative lg:pr-10">
          <div className="relative mx-auto w-[280px] sm:w-[320px]">
            {/* Effect 07/09 — floating data cards, offset phases so they never sync */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ ...spring.soft, delay: 1.1 }}
              className="fx-float absolute -left-16 top-28 z-20 hidden sm:block"
            >
              <div className="glass rounded-2xl px-3.5 py-2.5 shadow-float">
                <div className="text-[10px] font-medium text-ink-500">Added sugar</div>
                <div className="tabular text-sm font-bold text-brand-600">−9g <span className="text-[11px] font-semibold text-ink-300">vs. your last pick</span></div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ ...spring.soft, delay: 1.25 }}
              className="fx-float fx-float--alt absolute -right-14 bottom-32 z-20 hidden sm:block"
            >
              <div className="glass rounded-2xl px-3.5 py-2.5 shadow-float">
                <div className="flex items-center gap-1.5 text-[10px] font-medium text-ink-500">
                  <Check className="size-3 text-brand-500" aria-hidden /> Allergen check
                </div>
                <div className="text-sm font-bold text-ink-900">Clear for you</div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...spring.soft, delay: 1.4 }}
              className="fx-float fx-float--slow absolute -left-10 bottom-10 z-20 hidden sm:block"
            >
              <div className="glass rounded-2xl px-3.5 py-2.5 shadow-float">
                <div className="text-[10px] font-medium text-ink-500">Better swap found</div>
                <div className="tabular text-sm font-bold text-berry">Score 86 → 91</div>
              </div>
            </motion.div>

            <TiltCard className="relative" >
              <button
                type="button"
                onClick={runDemo}
                aria-label="Replay the scan demo"
                className="relative block w-full overflow-hidden rounded-[42px] border-[7px] border-[#18382c] bg-canvas text-left shadow-[0_30px_80px_rgba(5,46,31,.3)]"
              >
                <span aria-hidden className="absolute left-1/2 top-2 z-20 h-5 w-24 -translate-x-1/2 rounded-full bg-[#18382c]" />

                <div className="flex items-center justify-between px-5 pb-3 pt-9 text-[10px] font-bold text-ink-900">
                  <span>9:41</span>
                  <span className="flex items-center gap-1" aria-hidden><span>●●</span><span>▰</span></span>
                </div>

                <div className="px-4 pb-5">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-sm font-bold text-ink-900">Scan result</span>
                    <span className="rounded-full bg-brand-50 px-2 py-0.5 text-[9px] font-bold text-brand-700">
                      {locked ? 'Analysed' : 'Reading…'}
                    </span>
                  </div>

                  {/* Product visual with the reticle + laser */}
                  <div className={`fx-reticle relative mb-4 flex aspect-[.92] items-center justify-center overflow-hidden rounded-[22px] ${locked ? 'is-locked' : ''} ${phase !== 'idle' ? 'fx-scanlines' : ''}`}>
                    <span aria-hidden className="absolute inset-0 bg-[linear-gradient(160deg,#d9e9dd,#bcd6c4_60%,#a8c9b4)]" />
                    <span aria-hidden className="absolute inset-0 opacity-30" style={{ background: 'radial-gradient(circle at 28% 26%, #fff 0 5%, transparent 6%), radial-gradient(circle at 72% 66%, #fff 0 8%, transparent 9%)' }} />
                    <span aria-hidden className="fx-reticle__corner" data-pos="tl" />
                    <span aria-hidden className="fx-reticle__corner" data-pos="tr" />
                    <span aria-hidden className="fx-reticle__corner" data-pos="bl" />
                    <span aria-hidden className="fx-reticle__corner" data-pos="br" />
                    <span aria-hidden className="fx-reticle__ring" />

                    {phase === 'scanning' && <span aria-hidden className="fx-laser" style={{ ['--laser-span' as string]: '230px' }} />}

                    <div className="relative z-10 text-center">
                      <div className="text-5xl" aria-hidden>{DEMO.emoji}</div>
                      <div className="mt-2 rounded-xl border border-white/80 bg-white/80 px-3 py-2 backdrop-blur">
                        <div className="text-[9px] uppercase tracking-[.16em] text-ink-500">{locked ? DEMO.brand : 'Scanning label'}</div>
                        <div className="text-xs font-bold text-ink-900">{locked ? DEMO.name : 'Reading ingredients…'}</div>
                      </div>
                    </div>
                  </div>

                  {/* Result card — chips fly in on lock (Effect 43) */}
                  <div className="rounded-[22px] bg-surface p-4 shadow-[0_8px_24px_rgba(7,17,13,.07)]">
                    <div className="flex items-center gap-3.5">
                      <ScoreRing score={locked ? DEMO_SCORE.score : 0} band={locked ? DEMO_SCORE.band : 'ok'} size={104} strokeWidth={7} />
                      <div className="min-w-0">
                        <div className="text-sm font-bold text-ink-900">
                          {locked ? 'A great everyday pick' : 'Analysing…'}
                        </div>
                        <p className="mt-1 text-[10px] leading-relaxed text-ink-500">
                          High in whole grains<br />Low added sugar
                        </p>
                      </div>
                    </div>

                    <AnimatePresence>
                      {locked && (
                        <motion.div variants={chipContainer} initial="hidden" animate="show" exit="hidden" className="mt-3.5 flex flex-wrap gap-1.5">
                          {DEMO_SCORE.flags.slice(0, 3).map((flag) => (
                            <motion.span
                              key={flag}
                              variants={chipIn}
                              className="rounded-full bg-brand-50 px-2 py-1 text-[9px] font-semibold text-brand-700"
                            >
                              {flag}
                            </motion.span>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Tap affordance so it is obvious the demo is interactive */}
                <span className="pointer-events-none absolute inset-x-0 bottom-3 flex justify-center">
                  <span className="rounded-full bg-brand-900/85 px-3 py-1.5 text-[9px] font-bold uppercase tracking-widest text-lime-accent backdrop-blur">
                    Tap to replay
                  </span>
                </span>
              </button>
            </TiltCard>
          </div>
        </Parallax>
      </div>

      {/* Trust strip */}
      <div className="container-ns relative z-10 mt-14">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: 'Products scanned', value: 2.4, suffix: 'M', decimals: 1 },
            { label: 'Members', value: 180, suffix: 'K' },
            { label: 'Nutrients analysed', value: 61, suffix: 'M' },
            { label: 'Average rating', value: 4.9, suffix: '★', decimals: 1 },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...spring.soft, delay: 0.9 + i * 0.08 }}
              className="glass rounded-2xl px-4 py-3.5"
            >
              <div className="tabular text-xl font-bold tracking-[-.04em] text-ink-900">
                <CountUp value={stat.value} decimals={stat.decimals ?? 0} suffix={stat.suffix} />
              </div>
              <div className="mt-0.5 text-[11px] font-medium text-ink-500">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
