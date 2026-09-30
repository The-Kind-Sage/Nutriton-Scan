'use client'

/**
 * Result screen. Effects in play: 20 score ring · 43 chip fly-in ·
 * 19 count-up macros · 26 morphing tabs · 30 accordion · 36 snap rail ·
 * 25 sticky action bar · 34 toast · 39 animated bars · 22 particle bloom.
 */

import Link from 'next/link'
import {
  AlertTriangle, BookOpen, Check, ChevronRight, Info, Leaf, Share2, Sparkles, TrendingUp,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { AppShell } from '@/components/app-shell'
import { CountUp, Reveal, SnapRail, TiltCard } from '@/components/motion'
import { ScoreRing } from '@/components/score-ring'
import { toast } from '@/components/toast'
import { PRODUCTS } from '@/lib/data/products'
import { BAND_COPY, flagColor, nutrientFlag, scoreProduct } from '@/lib/score'
import { chipContainer, chipIn, spring } from '@/lib/motion'
import { nf } from '@/lib/format'
import type { Flag, Product, ScoreResult } from '@/lib/types'

const TABS = ['Nutrition', 'Ingredients', 'Insights', 'Alternatives'] as const
type Tab = (typeof TABS)[number]

interface MacroRow {
  key: keyof Product['per100g']
  label: string
  unit: string
  /** Reference value used to scale the animated bar. */
  target: number
  /** Rendered indented beneath its parent row. */
  sub?: boolean
}

const MACROS: MacroRow[] = [
  { key: 'kcal', label: 'Energy', unit: 'kcal', target: 400 },
  { key: 'protein', label: 'Protein', unit: 'g', target: 20 },
  { key: 'carbs', label: 'Carbohydrate', unit: 'g', target: 60 },
  { key: 'sugar', label: 'Sugars', unit: 'g', target: 20 },
  { key: 'addedSugar', label: 'of which added', unit: 'g', target: 12, sub: true },
  { key: 'fat', label: 'Fat', unit: 'g', target: 25 },
  { key: 'satFat', label: 'Saturated fat', unit: 'g', target: 8, sub: true },
  { key: 'fiber', label: 'Fiber', unit: 'g', target: 10 },
  { key: 'sodium', label: 'Sodium', unit: 'mg', target: 600 },
]

export function ResultScreen({ product, score }: { product: Product; score: ScoreResult }) {
  const [tab, setTab] = useState<Tab>('Nutrition')
  const [direction, setDirection] = useState(1)
  const [saved, setSaved] = useState(false)
  const copy = BAND_COPY[score.band]

  const alternatives = useMemo(
    () =>
      PRODUCTS.filter((c) => c.category === product.category && c.id !== product.id)
        .map((c) => ({ product: c, score: scoreProduct(c) }))
        .sort((a, b) => b.score.score - a.score.score)
        .slice(0, 5),
    [product],
  )

  const selectTab = (next: Tab) => {
    setDirection(TABS.indexOf(next) > TABS.indexOf(tab) ? 1 : -1)
    setTab(next)
  }

  const save = () => {
    setSaved(true)
    toast(`${product.name} added to today's diary`, 'success', {
      label: 'Undo',
      run: () => setSaved(false),
    })
  }

  const share = async () => {
    const text = `${product.name} scored ${score.score}/100 on Nutrition Scan. ${score.verdict}`
    if (navigator.share) {
      try { await navigator.share({ title: product.name, text }) ; return } catch { /* user cancelled */ }
    }
    try {
      await navigator.clipboard.writeText(text)
      toast('Result copied to your clipboard', 'info')
    } catch {
      toast('Could not copy — long-press the score to select it', 'error')
    }
  }

  return (
    <AppShell title={product.name} back={{ href: '/app/scan', label: 'Scan' }}>
      <div className="container-ns pt-4">
        {/* ── Hero ───────────────────────────────────────────────────── */}
        <Reveal variant="scale">
          <TiltCard className="relative overflow-hidden rounded-[30px] border border-line bg-surface p-5 shadow-soft sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-[11px] font-bold uppercase tracking-[.16em] text-ink-300">{product.brand}</p>
                <h1 className="mt-1.5 text-2xl font-bold tracking-[-.045em] text-ink-900 sm:text-3xl">{product.name}</h1>
                <p className="mt-1 text-sm text-ink-500">
                  {product.servingSize} · per 100 g shown below
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {product.labels.slice(0, 3).map((label) => (
                    <span key={label} className="rounded-full bg-brand-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-brand-700">
                      {label.replace('-', ' ')}
                    </span>
                  ))}
                  <span className="rounded-full bg-canvas-2 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-ink-500">
                    NOVA {product.nova}
                  </span>
                </div>
              </div>
              <span className="text-5xl sm:text-6xl" aria-hidden>{product.emoji}</span>
            </div>

            <div className="mt-6 flex flex-col items-center gap-5 sm:flex-row sm:items-center sm:gap-7">
              <ScoreRing score={score.score} band={score.band} size={168} />
              <div className="min-w-0 text-center sm:text-left">
                <p className="text-xs font-bold uppercase tracking-[.16em]" style={{ color: copy.token }}>
                  {copy.label} · grade {score.grade}
                </p>
                <p className="mt-2 text-sm leading-6 text-ink-700">{score.verdict}</p>
                {score.personalNotes[0] && (
                  <p className="mt-3 rounded-xl bg-canvas-2 px-3 py-2 text-xs leading-5 text-ink-700">
                    <Sparkles className="mr-1 inline size-3.5 text-berry" aria-hidden />
                    {score.personalNotes[0]}
                  </p>
                )}
              </div>
            </div>

            {/* Effect 43 — traffic-light chips fly in behind the ring */}
            <motion.ul variants={chipContainer} initial="hidden" animate="show" className="mt-5 flex flex-wrap gap-1.5">
              {score.flags.map((flag) => {
                const tone = flag.toLowerCase().includes('high') ? 'var(--score-warn)'
                  : flag.toLowerCase().includes('good') ? 'var(--score-good)'
                    : 'var(--ink-500)'
                return (
                  <motion.li
                    key={flag}
                    variants={chipIn}
                    className="rounded-full px-2.5 py-1 text-[11px] font-semibold"
                    style={{ background: `color-mix(in oklab, ${tone} 14%, transparent)`, color: tone }}
                  >
                    {flag}
                  </motion.li>
                )
              })}
            </motion.ul>
          </TiltCard>
        </Reveal>

        {/* ── Allergen banner — impossible to miss, never auto-dismisses ── */}
        {score.hardFail && (
          <motion.div
            initial={{ opacity: 0, y: -14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={spring.soft}
            role="alert"
            className="mt-4 flex items-start gap-3 rounded-2xl border-2 border-score-danger bg-[color-mix(in_oklab,var(--score-danger)_10%,var(--surface))] p-4"
          >
            <AlertTriangle className="mt-0.5 size-5 shrink-0 text-score-danger" aria-hidden />
            <div>
              <p className="text-sm font-bold text-ink-900">Contains one of your allergens</p>
              <p className="mt-1 text-xs leading-5 text-ink-700">{score.personalNotes[0]}</p>
            </div>
          </motion.div>
        )}

        {/* ── Tabs (Effect 26) ──────────────────────────────────────── */}
        <div className="sticky top-[60px] z-30 -mx-5 mt-6 bg-canvas/85 px-5 py-3 backdrop-blur-xl sm:mx-0 sm:rounded-2xl sm:px-3">
          <div className="fx-seg" role="tablist" aria-label="Result sections">
            {TABS.map((t) => (
              <button
                key={t}
                role="tab"
                aria-selected={tab === t}
                onClick={() => selectTab(t)}
                className={`fx-seg__item press relative z-10 min-h-10 rounded-full px-3 text-xs font-bold transition-colors ${
                  tab === t ? 'text-ink-900' : 'text-ink-500'
                }`}
              >
                {t}
                {tab === t && (
                  <motion.span
                    layoutId="result-tab-pill"
                    transition={spring.layout}
                    className="absolute inset-0 -z-10 rounded-full bg-surface shadow-soft"
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* ── Panels ────────────────────────────────────────────────── */}
        <div className="mt-5">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={tab}
              custom={direction}
              initial={{ opacity: 0, x: direction * 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * -20 }}
              transition={spring.soft}
            >
              {tab === 'Nutrition' && <NutritionPanel product={product} />}
              {tab === 'Ingredients' && <IngredientsPanel product={product} />}
              {tab === 'Insights' && <InsightsPanel product={product} score={score} />}
              {tab === 'Alternatives' && <AlternativesPanel product={product} alternatives={alternatives} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* ── Sticky action bar (Effect 25 pattern, portrait thumb zone) ── */}
      <div className="fixed inset-x-0 bottom-[calc(var(--tabbar-h)+var(--safe-b))] z-30 px-4 pb-2 md:bottom-4">
        <div className="glass mx-auto flex max-w-md items-center gap-2 rounded-2xl p-2 shadow-float">
          <button
            onClick={save}
            disabled={saved}
            className={`press flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl text-sm font-bold text-white transition-colors ${
              saved ? 'bg-brand-700' : 'bg-brand-600'
            }`}
          >
            {saved ? <><Check className="size-4" aria-hidden /> Saved to diary</> : <><BookOpen className="size-4" aria-hidden /> Save to diary</>}
          </button>
          <button
            onClick={share}
            aria-label="Share this result"
            className="press grid size-12 shrink-0 place-items-center rounded-xl border border-line bg-surface text-ink-700"
          >
            <Share2 className="size-4" aria-hidden />
          </button>
        </div>
      </div>
    </AppShell>
  )
}

/* ── Nutrition ─────────────────────────────────────────────────────────── */
function NutritionPanel({ product }: { product: Product }) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    const id = window.setTimeout(() => setMounted(true), 120)
    return () => window.clearTimeout(id)
  }, [])

  return (
    <div className="space-y-3">
      <div className="rounded-[26px] border border-line bg-surface p-5">
        <h2 className="text-base font-bold text-ink-900">Per 100 g</h2>
        <p className="mt-0.5 text-xs text-ink-500">
          Traffic lights follow the UK FSA thresholds, adjusted for the fact this is per 100 g rather than per serving.
        </p>

        <ul className="mt-5 space-y-3.5">
          {MACROS.map((m, i) => {
            const value = product.per100g[m.key]
            const pct = Math.min(100, Math.round((value / m.target) * 100))
            const flag: Flag = m.key === 'kcal' ? 'green' : nutrientFlag(m.key, value)
            return (
              <li key={m.key} className={m.sub ? 'pl-4' : undefined}>
                <div className="flex items-baseline justify-between gap-3">
                  <span className={`text-sm ${m.sub ? 'text-ink-500' : 'font-semibold text-ink-900'}`}>
                    <span className="mr-1.5 inline-block size-2 rounded-full align-middle" style={{ background: flagColor(flag) }} aria-hidden />
                    {m.label}
                  </span>
                  <span className="tabular text-sm font-bold text-ink-900">
                    {m.unit === 'kcal' ? nf(value) : nf(value, value < 10 ? 1 : 0)}
                    <span className="ml-0.5 text-xs font-medium text-ink-300">{m.unit}</span>
                  </span>
                </div>
                <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-canvas-2" role="presentation">
                  <div
                    className="h-full rounded-full transition-[width] duration-700 ease-expo"
                    style={{
                      width: mounted ? `${pct}%` : '0%',
                      background: flagColor(flag),
                      transitionDelay: `${i * 45}ms`,
                    }}
                  />
                </div>
              </li>
            )
          })}
        </ul>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Potassium', value: product.per100g.potassium, unit: 'mg' },
          { label: 'Calcium', value: product.per100g.calcium, unit: 'mg' },
          { label: 'Iron', value: product.per100g.iron, unit: 'mg' },
        ].map((m) => (
          <div key={m.label} className="rounded-2xl border border-line bg-surface p-3.5">
            <p className="text-[11px] font-medium text-ink-500">{m.label}</p>
            <p className="tabular mt-1 text-base font-bold text-ink-900">
              {nf(m.value, m.value < 10 ? 1 : 0)}<span className="ml-0.5 text-[11px] font-medium text-ink-300">{m.unit}</span>
            </p>
          </div>
        ))}
      </div>

      <div className="flex items-start gap-3 rounded-2xl bg-canvas-2 p-4">
        <Info className="mt-0.5 size-4 shrink-0 text-ink-500" aria-hidden />
        <p className="text-xs leading-5 text-ink-500">
          Percentages are against a 2,000 kcal reference intake and are guidance, not a prescription.
          Your personal targets live in Profile.
        </p>
      </div>
    </div>
  )
}

/* ── Ingredients ───────────────────────────────────────────────────────── */
function IngredientsPanel({ product }: { product: Product }) {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {(['green', 'amber', 'red'] as Flag[]).map((f) => {
          const count = product.ingredients.filter((i) => i.flag === f).length
          if (!count) return null
          const label = f === 'green' ? 'Fine' : f === 'amber' ? 'Worth knowing' : 'Flagged'
          return (
            <span key={f} className="rounded-full px-3 py-1.5 text-xs font-semibold"
              style={{ background: `color-mix(in oklab, ${flagColor(f)} 14%, transparent)`, color: flagColor(f) }}>
              {count} {label}
            </span>
          )
        })}
      </div>

      <div className="divide-y divide-line overflow-hidden rounded-[26px] border border-line bg-surface">
        {product.ingredients.map((ing, i) => {
          const isOpen = open === i
          return (
            <div key={ing.name} className="fx-accordion" data-open={isOpen}>
              <button
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                className="press flex w-full items-center gap-3 p-4 text-left"
              >
                <span className="mt-0.5 size-2.5 shrink-0 rounded-full" style={{ background: flagColor(ing.flag) }} aria-hidden />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold text-ink-900">{ing.name}</span>
                  <span className="block truncate text-xs text-ink-500">{ing.purpose}</span>
                </span>
                <ChevronRight className={`fx-accordion__chevron size-4 shrink-0 text-ink-300 ${isOpen ? 'rotate-90' : ''}`} aria-hidden />
              </button>
              <div className="fx-accordion__panel">
                <div className="px-4 pb-4 pl-[42px]">
                  <p className="text-xs font-semibold text-ink-700">Also known as: {ing.plainName}</p>
                  <p className="mt-1.5 text-xs leading-5 text-ink-500">{ing.note}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {product.allergens.length > 0 && (
        <div className="rounded-[26px] border border-line bg-surface p-5">
          <h2 className="text-sm font-bold text-ink-900">Declared allergens</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {product.allergens.map((a) => (
              <span key={a} className="rounded-full border border-score-danger/40 bg-score-danger/10 px-3 py-1.5 text-xs font-bold capitalize text-score-danger">
                {a}
              </span>
            ))}
          </div>
          <p className="mt-3 text-xs leading-5 text-ink-500">
            May also contain traces of other allergens from shared production lines. Always check the physical packet if a reaction would be severe.
          </p>
        </div>
      )}
    </div>
  )
}

/* ── Insights ──────────────────────────────────────────────────────────── */
function InsightsPanel({ product, score }: { product: Product; score: ScoreResult }) {
  return (
    <div className="space-y-3">
      <div className="rounded-[26px] border border-line bg-surface p-5">
        <h2 className="text-base font-bold text-ink-900">How we got {score.score}</h2>
        <p className="mt-0.5 text-xs text-ink-500">Every product starts at 100. Here is the arithmetic, in order of impact.</p>
        <ul className="mt-5 space-y-2.5">
          {score.breakdown.map((f, i) => (
            <motion.li
              key={f.label}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ ...spring.soft, delay: i * 0.05 }}
              className="flex items-start gap-3 rounded-2xl bg-canvas-2 p-3.5"
            >
              <span className={`tabular mt-0.5 shrink-0 rounded-lg px-2 py-0.5 text-xs font-bold ${
                f.delta < 0 ? 'bg-score-danger/12 text-score-danger' : f.delta > 0 ? 'bg-brand-500/12 text-brand-700' : 'bg-surface text-ink-500'
              }`}>
                {f.delta > 0 ? '+' : ''}{f.delta === 0 ? '—' : nf(f.delta, 1)}
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-semibold text-ink-900">{f.label}</span>
                <span className="mt-0.5 block text-xs leading-5 text-ink-500">{f.detail}</span>
              </span>
            </motion.li>
          ))}
        </ul>
      </div>

      <div className="rounded-[26px] border border-line bg-surface p-5">
        <h2 className="text-base font-bold text-ink-900">Personal fit</h2>
        <ul className="mt-3 space-y-2">
          {score.personalNotes.map((note) => (
            <li key={note} className="flex items-start gap-2.5 text-sm leading-6 text-ink-700">
              <Leaf className="mt-1 size-4 shrink-0 text-brand-600" aria-hidden />
              {note}
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-[26px] border border-line bg-surface p-5">
        <h2 className="flex items-center gap-2 text-base font-bold text-ink-900">
          <TrendingUp className="size-4 text-berry" aria-hidden /> Processing level
        </h2>
        <div className="mt-4 flex gap-1.5" role="img" aria-label={`NOVA class ${product.nova} of 4`}>
          {[1, 2, 3, 4].map((n) => (
            <span
              key={n}
              className="h-2 flex-1 rounded-full"
              style={{ background: n <= product.nova ? (product.nova === 4 ? 'var(--score-danger)' : product.nova === 3 ? 'var(--score-warn)' : 'var(--score-good)') : 'var(--canvas-2)' }}
            />
          ))}
        </div>
        <p className="mt-3 text-xs leading-5 text-ink-500">
          NOVA {product.nova} of 4 —{' '}
          {product.nova === 4
            ? 'ultra-processed. Evidence links diets dominated by NOVA 4 foods to poorer long-term health outcomes.'
            : product.nova === 3
              ? 'processed. Fine as part of a varied diet, less so as a staple.'
              : product.nova === 2
                ? 'a processed culinary ingredient. Nothing to worry about here.'
                : 'unprocessed or minimally processed. This is as close to whole food as packaged gets.'}
        </p>
      </div>
    </div>
  )
}

/* ── Alternatives ──────────────────────────────────────────────────────── */
function AlternativesPanel({
  product,
  alternatives,
}: {
  product: Product
  alternatives: { product: Product; score: ScoreResult }[]
}) {
  if (!alternatives.length) {
    return (
      <div className="rounded-[26px] border border-line bg-surface p-8 text-center">
        <p className="text-sm text-ink-500">
          No better options in this category yet. We add new products every week.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="rounded-[26px] border border-line bg-surface p-5">
        <h2 className="text-base font-bold text-ink-900">Better options in {product.category}</h2>
        <p className="mt-0.5 text-xs text-ink-500">Ranked by score gain, then by how well they fit your allergens and goals.</p>
      </div>

      <SnapRail label="Healthier alternatives">
        {alternatives.map(({ product: alt, score: altScore }) => {
          const delta = altScore.score - scoreProduct(product).score
          return (
            <TiltCard key={alt.id} className="w-[268px] shrink-0 snap-start">
              <article className="flex h-full flex-col rounded-[26px] border border-line bg-surface p-5 shadow-soft">
                <div className="flex items-start justify-between">
                  <span className="text-3xl" aria-hidden>{alt.emoji}</span>
                  {delta > 0 && (
                    <span className="rounded-full bg-brand-500/14 px-2.5 py-1 text-xs font-bold text-brand-700">
                      +{delta} pts
                    </span>
                  )}
                </div>
                <h3 className="mt-3 text-sm font-bold text-ink-900">{alt.name}</h3>
                <p className="text-xs text-ink-500">{alt.brand}</p>

                <div className="mt-4 flex items-center gap-2">
                  <span className="tabular text-3xl font-bold tracking-[-.06em]" style={{ color: BAND_COPY[altScore.band].token }}>
                    <CountUp value={altScore.score} />
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-ink-300">{BAND_COPY[altScore.band].label}</span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2 text-[11px] text-ink-500">
                  <span className="tabular">{nf(alt.per100g.addedSugar, 1)}g added sugar</span>
                  <span className="tabular">{alt.per100g.protein}g protein</span>
                  <span className="tabular">NOVA {alt.nova}</span>
                  <span>{alt.priceIndex > product.priceIndex ? 'Costs more' : alt.priceIndex < product.priceIndex ? 'Costs less' : 'Similar price'}</span>
                </div>

                <Link
                  href={`/app/result/${alt.barcode}`}
                  className="press mt-5 flex items-center justify-center gap-1.5 rounded-xl bg-canvas-2 py-3 text-xs font-bold text-ink-900"
                >
                  View this swap <ChevronRight className="size-3.5" aria-hidden />
                </Link>
              </article>
            </TiltCard>
          )
        })}
      </SnapRail>
    </div>
  )
}
