/**
 * Mock service layer. Every screen talks to this file and nothing else, so
 * swapping to a real backend means editing exactly one module.
 *
 * Artificial latency (250–900 ms) is deliberate: it makes the skeleton and
 * loading states demonstrable instead of theoretical.
 */

import { PRODUCTS, byBarcode, byId } from './data/products'
import { FAMILY_PROFILE, SEED_DIARY, TESTIMONIALS, FAQS, PLANS, INTEGRATIONS } from './data/fixtures'
import { scoreProduct } from './score'
import { BAND_COPY } from './score'
import type { Alternative, DiaryEntry, Product, Profile, ScoreResult } from './types'

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms))
const jitter = (min: number, max: number) => min + Math.random() * (max - min)

export const api = {
  /** Simulates an AI vision pass on a barcode. */
  async scanBarcode(barcode: string, profile?: Profile | null): Promise<{ product: Product; score: ScoreResult } | null> {
    await wait(jitter(700, 1250))
    const product = byBarcode(barcode)
    if (!product) return null
    return { product, score: scoreProduct(product, profile) }
  },

  /** Simulates the AI reading a photographed label. Always resolves to a product. */
  async scanImage(seed = 'random', profile?: Profile | null): Promise<{ product: Product; score: ScoreResult }> {
    await wait(jitter(900, 1500))
    const product =
      seed === 'random'
        ? PRODUCTS[Math.floor(Math.random() * PRODUCTS.length)]
        : byId(seed) ?? PRODUCTS[0]
    return { product, score: scoreProduct(product, profile) }
  },

  async getProduct(id: string, profile?: Profile | null): Promise<{ product: Product; score: ScoreResult } | null> {
    await wait(jitter(180, 420))
    const product = byId(id)
    if (!product) return null
    return { product, score: scoreProduct(product, profile) }
  },

  /** Worse, similar and better options in the same category. */
  async getAlternatives(id: string, profile?: Profile | null): Promise<Alternative[]> {
    await wait(jitter(300, 650))
    const product = byId(id)
    if (!product) return []
    const current = scoreProduct(product, profile)

    return PRODUCTS
      .filter((cand) => cand.id !== product.id && cand.category === product.category)
      .map((cand) => {
        const s = scoreProduct(cand, profile)
        const reasons: string[] = []
        const d = s.score - current.score
        if (d > 0) reasons.push(`Scores ${d} points higher`)
        if (cand.per100g.addedSugar < product.per100g.addedSugar) reasons.push(`${(product.per100g.addedSugar - cand.per100g.addedSugar).toFixed(1)}g less added sugar`)
        if (cand.per100g.fiber > product.per100g.fiber) reasons.push(`${(cand.per100g.fiber - product.per100g.fiber).toFixed(1)}g more fiber`)
        if (cand.per100g.sodium < product.per100g.sodium) reasons.push(`${Math.round(product.per100g.sodium - cand.per100g.sodium)}mg less sodium`)
        if (cand.nova < product.nova) reasons.push('Less processed (NOVA ${} )'.replace('${}', String(cand.nova)))
        if (!reasons.length) reasons.push('Similar profile, different flavour')
        return { product: cand, score: s.score, deltaScore: d, deltaPrice: cand.priceIndex - product.priceIndex, reasons: reasons.slice(0, 3) }
      })
      .sort((a, b) => b.deltaScore - a.deltaScore)
      .slice(0, 6)
  },

  async search(query: string): Promise<Product[]> {
    await wait(jitter(200, 420))
    const q = query.trim().toLowerCase()
    if (!q) return []
    return PRODUCTS.filter(
      (x) => x.name.toLowerCase().includes(q) || x.brand.toLowerCase().includes(q) || x.category.toLowerCase().includes(q),
    ).slice(0, 8)
  },

  async getDiary(day: string): Promise<DiaryEntry[]> {
    await wait(jitter(250, 500))
    return SEED_DIARY.filter((e) => e.day === day)
  },

  async getProfile(): Promise<Profile> {
    await wait(jitter(150, 350))
    return FAMILY_PROFILE
  },

  async getInsights() {
    await wait(jitter(350, 700))
    return buildInsights()
  },

  async getTestimonials() { return TESTIMONIALS },
  async getFaqs() { return FAQS },
  async getPlans() { return PLANS },
  async getIntegrations() { return INTEGRATIONS },
}

function buildInsights() {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  return {
    week: days.map((d, i) => ({
      day: d,
      score: [71, 74, 68, 79, 82, 76, 84][i],
      kcal: [1840, 2010, 1760, 1950, 2100, 2230, 1890][i],
      fiber: [18, 21, 14, 24, 26, 19, 28][i],
      sugar: [48, 62, 54, 39, 36, 51, 31][i],
    })),
    streak: 4,
    nutrientOfWeek: {
      name: 'Fiber',
      headline: 'You averaged 21g of fiber a day.',
      copy: 'That is 6g above your four-week baseline, and 3g short of the 25g most adults should aim for. Oats and legumes at breakfast did most of the work.',
    },
    goals: [
      { label: 'Protein target', value: 84, target: 110, unit: 'g' },
      { label: 'Fiber target', value: 21, target: 25, unit: 'g' },
      { label: 'Water target', value: 1400, target: 2000, unit: 'ml' },
      { label: 'Scans logged', value: 12, target: 14, unit: '' },
    ],
    heatmap: Array.from({ length: 28 }, (_, i) => ({ day: i, score: [0, 62, 74, 0, 81, 68, 90, 0, 74, 66, 88, 0, 71, 79, 83, 0, 64, 92, 77, 0, 86, 73, 69, 0, 88, 91, 75, 0][i] })),
    insight: 'Your best days all started with a high-fiber breakfast. On the three days you skipped it, added sugar crept up by roughly 14g.',
    weekly: {
      delta: +6,
      label: 'Average score',
    },
  }
}

/** Re-export so consumers don't reach into the data folder directly. */
export { BAND_COPY }
