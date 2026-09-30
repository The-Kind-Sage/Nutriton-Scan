/**
 * Nutrition Scan — scoring engine.
 *
 * Deterministic: the same product + profile always produces the same number,
 * which matters for demos, screenshots and QA. Documented in the master brief,
 * Section 9.1. Pure functions only — no I/O, no randomness.
 */

import type {
  Product, Profile, ScoreResult, ScoreBand, ScoreFactor, Flag,
} from './types'

const clamp = (n: number, min = 0, max = 100) => Math.min(max, Math.max(min, n))
const r1 = (n: number) => Math.round(n * 10) / 10

/** Bands are inclusive at the lower bound. */
export function bandFor(score: number): ScoreBand {
  if (score >= 80) return 'excellent'
  if (score >= 60) return 'good'
  if (score >= 40) return 'ok'
  return 'poor'
}

export const BAND_COPY: Record<ScoreBand, { grade: string; label: string; verdict: string; token: string }> = {
  poor: {
    grade: 'D',
    label: 'Poor',
    verdict: 'Heavily processed and hard to fit into a balanced day. There is almost always a better swap nearby.',
    token: 'var(--score-danger)',
  },
  ok: {
    grade: 'C',
    label: 'OK',
    verdict: 'Fine occasionally, but not something to build a day around. Watch the standout problem nutrient.',
    token: 'var(--score-warn)',
  },
  good: {
    grade: 'B',
    label: 'Good',
    verdict: 'A solid everyday choice. Nothing here is working against you, with room to improve.',
    token: 'var(--score-good)',
  },
  excellent: {
    grade: 'A',
    label: 'Excellent',
    verdict: 'Eat freely. Strong nutrient density, minimal processing, nothing flagged.',
    token: 'var(--score-great)',
  },
}

/** Per-condition multipliers — how the same product lands differently per person. */
const CONDITION_WEIGHTS: Record<string, Partial<Record<'sugar' | 'sodium' | 'satFat' | 'netCarbs', number>>> = {
  diabetes: { sugar: 1.8, netCarbs: 1.6 },
  hypertension: { sodium: 2.2 },
  ckd: { sodium: 1.4 },
  'high-cholesterol': { satFat: 1.7 },
}

export function scoreProduct(product: Product, profile?: Profile | null): ScoreResult {
  const n = product.per100g
  const factors: ScoreFactor[] = []

  // ── Hard fail: an allergen the user has flagged. Score is suppressed.
  const allergenHit = profile?.allergies.filter((a) => product.allergens.includes(a)) ?? []
  const hardFail = allergenHit.length > 0

  const w = { sugar: 1, sodium: 1, satFat: 1, netCarbs: 1 }
  profile?.conditions.forEach((c) => {
    const m = CONDITION_WEIGHTS[c]
    if (!m) return
    for (const key of Object.keys(m) as (keyof typeof w)[]) w[key] *= m[key] ?? 1
    factors.push({
      label: `Adjusted for ${c.replace('-', ' ')}`,
      delta: 0,
      detail: 'Penalty weights increased for your health profile.',
    })
  })

  let score = 100

  // ── Penalties (per 100g)
  const sugarHit = clamp(n.addedSugar * 2.4 * w.sugar, 0, 28)
  if (sugarHit > 0) {
    score -= sugarHit
    factors.push({ label: `Added sugar ${r1(n.addedSugar)}g`, delta: -sugarHit, detail: 'Sugars added during processing, above what occurs naturally.' })
  }

  const sodiumHit = clamp((n.sodium / 100) * 3.2 * w.sodium, 0, 20)
  if (sodiumHit > 0) {
    score -= sodiumHit
    factors.push({ label: `Sodium ${Math.round(n.sodium)}mg`, delta: -sodiumHit, detail: 'Salt drives blood pressure and fluid retention.' })
  }

  const satHit = clamp(n.satFat * 2 * w.satFat, 0, 16)
  if (satHit > 0) {
    score -= satHit
    factors.push({ label: `Saturated fat ${r1(n.satFat)}g`, delta: -satHit, detail: 'Raises LDL cholesterol when it dominates the diet.' })
  }

  const novaHit = [0, 0, 2, 6, 14][product.nova] ?? 0
  if (novaHit > 0) {
    score -= novaHit
    factors.push({
      label: `NOVA class ${product.nova}`,
      delta: -novaHit,
      detail: `Level ${product.nova} of 4 — evidence links ultra-processing to poorer long-term health outcomes.`,
    })
  }

  const flagged = product.ingredients.filter((i) => i.flag === 'red')
  const additiveHit = clamp(flagged.length * 2.5, 0, 10)
  if (additiveHit > 0) {
    score -= additiveHit
    factors.push({ label: `${flagged.length} flagged additive${flagged.length > 1 ? 's' : ''}`, delta: -additiveHit, detail: flagged.map((f) => f.plainName).join(', ') })
  }

  if (n.transFat > 0.1) {
    score -= 25
    factors.push({ label: 'Trans fat present', delta: -25, detail: 'No safe level of industrial trans fat exists.' })
  }

  // ── Bonuses
  const fiberBonus = clamp(n.fiber * 1.6, 0, 12)
  if (fiberBonus > 0) { score += fiberBonus; factors.push({ label: `Fiber ${r1(n.fiber)}g`, delta: fiberBonus, detail: 'Feeds gut bacteria and slows glucose release.' }) }

  const proteinBonus = clamp(n.protein * 0.9, 0, 10)
  if (proteinBonus > 0) { score += proteinBonus; factors.push({ label: `Protein ${r1(n.protein)}g`, delta: proteinBonus, detail: 'Supports satiety and muscle maintenance.' }) }

  const microCount = [n.calcium >= 100, n.iron >= 2, n.potassium >= 300].filter(Boolean).length
  const microBonus = clamp(microCount * 2, 0, 6)
  if (microBonus > 0) { score += microBonus; factors.push({ label: `${microCount} key micronutrient${microCount > 1 ? 's' : ''}`, delta: microBonus, detail: 'Calcium, iron and potassium contribute to the daily picture.' }) }

  const finalScore = hardFail ? 0 : clamp(Math.round(score))
  const band = bandFor(finalScore)
  const copy = BAND_COPY[band]

  // ── Plain-language flags for the traffic-light chips
  const flags: string[] = []
  if (n.addedSugar >= 10) flags.push(`High added sugar (${r1(n.addedSugar)}g)`)
  if (n.fiber >= 5) flags.push(`Good fiber (${r1(n.fiber)}g)`)
  if (n.protein >= 10) flags.push(`Good protein (${r1(n.protein)}g)`)
  if (n.sodium >= 500) flags.push(`High sodium (${Math.round(n.sodium)}mg)`)
  if (n.satFat >= 5) flags.push(`High saturated fat (${r1(n.satFat)}g)`)
  if (product.nova === 4) flags.push('Ultra-processed')
  if (product.labels.length) flags.push(product.labels[0].replace('-', ' '))

  // ── Personal notes
  const personalNotes: string[] = []
  if (hardFail) personalNotes.push(`Contains ${allergenHit.join(', ')} — you flagged this as an allergen.`)
  if (profile?.conditions.includes('diabetes') && n.addedSugar >= 5) personalNotes.push(`Sugar is weighted heavier for you: ${r1(n.addedSugar)}g added sugar per 100g.`)
  if (profile?.conditions.includes('hypertension') && n.sodium >= 300) personalNotes.push(`Sodium is weighted heavier for you: ${Math.round(n.sodium)}mg per 100g.`)
  if (profile?.goal === 'build-muscle' && n.protein >= 8) personalNotes.push(`Good protein density (${r1(n.protein)}g/100g) for your muscle-building goal.`)
  if (profile?.goal === 'lose-fat' && n.fiber >= 5) personalNotes.push('High fiber helps with satiety while you are in a deficit.')
  if (!personalNotes.length) personalNotes.push('No conflicts with your profile — this one fits your current plan.')

  // Strongest factors first, cap the list so the UI stays readable
  const breakdown = [...factors].sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta)).slice(0, 7)

  return {
    score: finalScore,
    band,
    grade: hardFail ? '–' : copy.grade,
    verdict: hardFail ? 'Not safe for your allergen profile. Safer alternatives are below.' : copy.verdict,
    breakdown,
    flags,
    personalNotes,
    hardFail,
  }
}

/** Traffic-light classification for a single nutrient, per 100g. */
export function nutrientFlag(key: keyof Product['per100g'], value: number): Flag {
  const thresholds: Partial<Record<string, [number, number, boolean]>> = {
    // [greenBelow, redAbove, lowerIsBetter]
    addedSugar: [5, 15, true],
    sugar: [5, 15, true],
    sodium: [120, 600, true],
    satFat: [1.5, 5, true],
    fiber: [3, 1, false],
    protein: [8, 3, false],
  }
  const t = thresholds[key as string]
  if (!t) return 'green'
  const [a, b, lowerIsBetter] = t
  if (lowerIsBetter) return value <= a ? 'green' : value >= b ? 'red' : 'amber'
  return value >= a ? 'green' : value <= b ? 'red' : 'amber'
}

export function flagColor(flag: Flag): string {
  return flag === 'green' ? 'var(--score-good)' : flag === 'amber' ? 'var(--score-warn)' : 'var(--score-danger)'
}
