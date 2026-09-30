/** Domain types for Nutrition Scan. Single source of truth for shapes. */

export type ScoreBand = 'poor' | 'ok' | 'good' | 'excellent'
export type Flag = 'green' | 'amber' | 'red'
export type DietTag =
  | 'vegan' | 'vegetarian' | 'gluten-free' | 'dairy-free' | 'keto'
  | 'low-sugar' | 'organic' | 'halal' | 'high-protein' | 'kid-friendly'

export interface Ingredient {
  name: string
  plainName: string
  purpose: string
  flag: Flag
  note: string
}

export interface Nutrients {
  kcal: number
  protein: number
  carbs: number
  sugar: number
  addedSugar: number
  fat: number
  satFat: number
  transFat: number
  fiber: number
  sodium: number   // mg
  potassium: number // mg
  calcium: number   // mg
  iron: number      // mg
}

export interface Product {
  id: string
  barcode: string
  name: string
  brand: string
  category: string
  /** Emoji used as a lightweight product visual (no external assets). */
  emoji: string
  servingSize: string
  servingGrams: number
  per100g: Nutrients
  nova: 1 | 2 | 3 | 4
  ingredients: Ingredient[]
  allergens: Allergen[]
  labels: DietTag[]
  priceIndex: 1 | 2 | 3
}

export type Allergen = 'gluten' | 'milk' | 'soy' | 'nuts' | 'peanuts' | 'eggs' | 'sesame' | 'fish' | 'shellfish'

export interface ScoreResult {
  score: number
  band: ScoreBand
  grade: string
  verdict: string
  breakdown: ScoreFactor[]
  flags: string[]
  personalNotes: string[]
  hardFail: boolean
}

export interface ScoreFactor {
  label: string
  delta: number   // negative = penalty, positive = bonus
  detail: string
}

export interface Profile {
  name: string
  goal: 'lose-fat' | 'build-muscle' | 'maintain' | 'manage-condition'
  diet: DietTag[]
  allergies: Allergen[]
  conditions: Condition[]
  dailyTargets: { kcal: number; protein: number; fiber: number; waterMl: number }
}

export type Condition = 'diabetes' | 'hypertension' | 'ckd' | 'high-cholesterol'

export interface DiaryEntry {
  id: string
  productId: string
  barcode: string
  name: string
  brand: string
  emoji: string
  meal: 'breakfast' | 'lunch' | 'dinner' | 'snack'
  score: number
  kcal: number
  protein: number
  carbs: number
  sugar: number
  fiber: number
  servings: number
  /** ISO day, e.g. 2026-09-30 */
  day: string
  time: string
}

export interface Alternative {
  product: Product
  score: number
  deltaScore: number
  deltaPrice: number
  reasons: string[]
}

export interface Testimonial {
  name: string
  role: string
  quote: string
  initials: string
  tone: string
  rating: number
}

export interface FaqItem {
  q: string
  a: string
}

export interface Plan {
  id: 'free' | 'plus' | 'pro'
  name: string
  monthly: number
  annual: number
  tagline: string
  features: string[]
  recommended?: boolean
}

/* ══════════════════════════════════════════════════════════════════════
   Health & lifestyle domains — parity with the reference feature set
   ═════════════════════════════════════════════════════════════════════ */

export interface WeightEntry {
  /** ISO day. */
  day: string
  kg: number
}

export interface ExerciseEntry {
  id: string
  name: string
  /** Minutes of activity. */
  minutes: number
  /** Estimated kcal burned. */
  kcal: number
  day: string
  time: string
  intensity: 'low' | 'moderate' | 'high'
  /** Whether it came from a connected device rather than manual entry. */
  source: 'manual' | 'device'
}

export interface StepEntry {
  day: string
  steps: number
}

export interface SleepEntry {
  day: string
  /** Hours asleep. */
  hours: number
  /** 0–100 sleep quality. */
  quality: number
  bedtime: string
  wake: string
}

export interface GlucoseEntry {
  id: string
  /** mg/dL */
  value: number
  day: string
  time: string
  /** When the reading was taken — matters clinically. */
  context: 'fasting' | 'pre-meal' | 'post-meal' | 'bedtime'
  note?: string
}

export type FastingPlan = '14:10' | '16:8' | '18:6' | '20:4' | 'custom'

export interface FastingSession {
  id: string
  plan: FastingPlan
  day: string
  /** Hours fasted. */
  hours: number
  completed: boolean
}

export interface HabitLog {
  day: string
  waterMl: number
  exerciseMinutes: number
  steps: number
  /** Servings of fruit & vegetables. */
  produce: number
  /** Whether the user journaled. */
  noted: boolean
}

export interface Goal {
  id: string
  kind: 'weight' | 'calories' | 'macros' | 'water' | 'steps' | 'fasting' | 'custom'
  label: string
  unit: string
  current: number
  target: number
  /** ISO day. */
  startedAt: string
  /** ISO day. */
  dueAt?: string
  /** true when a lower number is the goal (weight loss, sodium). */
  lowerIsBetter?: boolean
}

export interface NoteEntry {
  id: string
  day: string
  time: string
  body: string
  mood?: 'great' | 'good' | 'ok' | 'low'
}

export interface Recipe {
  id: string
  name: string
  description: string
  emoji: string
  /** Total minutes including prep. */
  minutes: number
  servings: number
  kcal: number
  protein: number
  carbs: number
  fat: number
  fiber: number
  score: number
  diet: DietTag[]
  allergens: Allergen[]
  ingredients: string[]
  steps: string[]
  tags: string[]
}

export interface MealPlanEntry {
  id: string
  name: string
  emoji: string
  slot: 'breakfast' | 'lunch' | 'dinner' | 'snack'
  recipeId: string
  logged: boolean
  day: string
}

export interface WorkoutRoutine {
  id: string
  name: string
  focus: string
  emoji: string
  minutes: number
  kcal: number
  level: 'beginner' | 'intermediate' | 'advanced'
  equipment: string
  exercises: { name: string; sets: string; rest: string }[]
}

export interface ConnectedDevice {
  id: string
  name: string
  kind: 'watch' | 'band' | 'scale' | 'cgm' | 'phone'
  syncing: boolean
  lastSync: string
  metrics: string[]
}
