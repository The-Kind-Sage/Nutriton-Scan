/**
 * Health & lifestyle fixtures — 8 weeks of history for every tracked metric,
 * so charts have something real to draw and trends read plausibly.
 *
 * Deterministic values (no Math.random at module scope) so server and client
 * render identically and there is never a hydration mismatch.
 */

import type {
  ConnectedDevice, ExerciseEntry, FastingSession, GlucoseEntry, Goal,
  HabitLog, NoteEntry, SleepEntry, StepEntry, WeightEntry,
} from '../types'

/** Anchor day for all fixtures. */
export const TODAY = '2026-10-01'

export function dayOffset(n: number): string {
  const d = new Date(`${TODAY}T12:00:00Z`)
  d.setUTCDate(d.getUTCDate() - n)
  return d.toISOString().slice(0, 10)
}

export const LAST_28 = Array.from({ length: 28 }, (_, i) => dayOffset(27 - i))
export const LAST_7 = LAST_28.slice(-7)
export const LAST_14 = LAST_28.slice(-14)

/* ── Weight: a believable 8 kg loss over 8 weeks, with plateaus ───────── */
const WEIGHT_SERIES = [
  81.4, 81.1, 80.8, 80.9, 80.5, 80.2, 79.9, 80.0,
  79.7, 79.6, 79.2, 79.4, 79.0, 78.8, 78.9, 78.5,
  78.6, 78.2, 78.3, 78.0, 77.9, 78.1, 77.7, 77.5,
  77.6, 77.2, 77.4, 77.2,
]

export const WEIGHT: WeightEntry[] = LAST_28.map((day, i) => ({ day, kg: WEIGHT_SERIES[i] }))

export const WEIGHT_START = WEIGHT_SERIES[0]
export const WEIGHT_CURRENT = WEIGHT_SERIES.at(-1) ?? WEIGHT_SERIES[0]
export const WEIGHT_TARGET = 72

/* ── Exercise: a realistic mix of manual and device-sourced sessions ──── */
export const EXERCISE: ExerciseEntry[] = [
  { id: 'x1', name: 'Morning run', minutes: 42, kcal: 412, day: dayOffset(0), time: '6:40 AM', intensity: 'high', source: 'device' },
  { id: 'x2', name: 'Walk to the shop', minutes: 24, kcal: 96, day: dayOffset(0), time: '11:20 AM', intensity: 'low', source: 'device' },
  { id: 'x3', name: 'Strength — upper body', minutes: 55, kcal: 330, day: dayOffset(1), time: '7:10 PM', intensity: 'high', source: 'manual' },
  { id: 'x4', name: 'Yoga flow', minutes: 30, kcal: 118, day: dayOffset(2), time: '8:05 AM', intensity: 'low', source: 'manual' },
  { id: 'x5', name: 'Cycling commute', minutes: 38, kcal: 285, day: dayOffset(2), time: '6:15 PM', intensity: 'moderate', source: 'device' },
  { id: 'x6', name: 'Interval session', minutes: 36, kcal: 398, day: dayOffset(3), time: '6:30 AM', intensity: 'high', source: 'device' },
  { id: 'x7', name: 'Swim', minutes: 45, kcal: 402, day: dayOffset(4), time: '7:00 PM', intensity: 'moderate', source: 'manual' },
  { id: 'x8', name: 'Long walk', minutes: 78, kcal: 310, day: dayOffset(5), time: '10:00 AM', intensity: 'low', source: 'device' },
  { id: 'x9', name: 'Strength — legs', minutes: 50, kcal: 355, day: dayOffset(6), time: '6:50 PM', intensity: 'high', source: 'manual' },
  { id: 'x10', name: 'Morning run', minutes: 40, kcal: 388, day: dayOffset(7), time: '6:45 AM', intensity: 'high', source: 'device' },
]

export const STEPS: StepEntry[] = LAST_28.map((day, i) => ({
  day,
  steps: [8420, 11240, 6980, 12890, 10240, 9360, 13480, 7210, 10580, 12310, 8890, 14260, 9980, 7640, 11720, 10390, 8940, 13110, 10870, 9580, 12440, 7860, 13920, 10110, 11030, 8650, 12760, 9840][i],
}))

export const STEP_GOAL = 10000

/* ── Sleep: 7 nights, varying quality ────────────────────────────────── */
export const SLEEP: SleepEntry[] = [
  { day: dayOffset(0), hours: 7.4, quality: 82, bedtime: '23:20', wake: '06:44' },
  { day: dayOffset(1), hours: 6.2, quality: 61, bedtime: '00:40', wake: '06:52' },
  { day: dayOffset(2), hours: 7.9, quality: 88, bedtime: '23:05', wake: '07:00' },
  { day: dayOffset(3), hours: 5.8, quality: 52, bedtime: '01:10', wake: '06:58' },
  { day: dayOffset(4), hours: 8.1, quality: 91, bedtime: '22:50', wake: '06:56' },
  { day: dayOffset(5), hours: 7.1, quality: 76, bedtime: '23:35', wake: '06:42' },
  { day: dayOffset(6), hours: 6.8, quality: 70, bedtime: '23:50', wake: '06:38' },
]

/* ── Glucose: readings with clinical context ─────────────────────────── */
export const GLUCOSE: GlucoseEntry[] = [
  { id: 'g1', value: 96, day: dayOffset(0), time: '7:05 AM', context: 'fasting' },
  { id: 'g2', value: 138, day: dayOffset(0), time: '9:10 AM', context: 'post-meal', note: 'Granola + yogurt' },
  { id: 'g3', value: 104, day: dayOffset(0), time: '1:20 PM', context: 'pre-meal' },
  { id: 'g4', value: 142, day: dayOffset(0), time: '3:05 PM', context: 'post-meal', note: 'Lentil soup' },
  { id: 'g5', value: 92, day: dayOffset(1), time: '7:00 AM', context: 'fasting' },
  { id: 'g6', value: 168, day: dayOffset(1), time: '9:40 PM', context: 'post-meal', note: 'Instant noodles — flagged by the app' },
  { id: 'g7', value: 101, day: dayOffset(2), time: '7:15 AM', context: 'fasting' },
  { id: 'g8', value: 118, day: dayOffset(2), time: '8:50 AM', context: 'post-meal' },
  { id: 'g9', value: 89, day: dayOffset(3), time: '6:55 AM', context: 'fasting' },
  { id: 'g10', value: 112, day: dayOffset(3), time: '9:00 AM', context: 'post-meal' },
  { id: 'g11', value: 128, day: dayOffset(4), time: '11:30 PM', context: 'bedtime' },
  { id: 'g12', value: 94, day: dayOffset(5), time: '7:10 AM', context: 'fasting' },
  { id: 'g13', value: 126, day: dayOffset(6), time: '8:55 AM', context: 'post-meal' },
]

/* ── Fasting: a 16:8 pattern with a couple of lapses ─────────────────── */
export const FASTING: FastingSession[] = LAST_14.map((day, i) => ({
  id: `f${i}`,
  plan: '16:8' as const,
  day,
  hours: [16.2, 15.4, 16.8, 14.1, 16.0, 16.5, 17.2, 13.6, 16.3, 15.9, 16.7, 16.1, 16.4, 15.2][i],
  completed: [true, false, true, false, true, true, true, false, true, true, true, true, true, false][i],
}))

/* ── Habits: one row per day, driving the Today screen symbols ───────── */
export const HABITS: HabitLog[] = LAST_28.map((day, i) => ({
  day,
  waterMl: [1400, 1800, 900, 2100, 1600, 1200, 2000, 1100, 1750, 1450, 2200, 1650, 1300, 1900, 1500, 2400, 1700, 1250, 1850, 1550, 2050, 1350, 1950, 1600, 1750, 1400, 2150, 1500][i],
  exerciseMinutes: [42, 0, 55, 30, 38, 36, 45, 0, 78, 50, 40, 25, 60, 0, 35, 48, 0, 52, 30, 44, 0, 58, 40, 36, 0, 50, 45, 42][i],
  steps: STEPS[i].steps,
  produce: [4, 3, 5, 2, 4, 3, 6, 2, 5, 4, 3, 5, 2, 4, 5, 6, 3, 4, 2, 5, 4, 6, 3, 5, 4, 3, 5, 4][i],
  noted: [true, false, true, false, true, true, false, false, true, true, false, true, false, true, false, true, false, true, false, true, false, true, true, false, true, false, true, true][i],
}))

export const todayHabits = (): HabitLog => HABITS.at(-1)!

/* ── Goals ───────────────────────────────────────────────────────────── */
export const GOALS: Goal[] = [
  { id: 'goal-weight', kind: 'weight', label: 'Reach 72 kg', unit: 'kg', current: WEIGHT_CURRENT, target: WEIGHT_TARGET, startedAt: dayOffset(56), dueAt: dayOffset(-56), lowerIsBetter: true },
  { id: 'goal-cal', kind: 'calories', label: 'Daily energy budget', unit: 'kcal', current: 0, target: 2100, startedAt: dayOffset(56) },
  { id: 'goal-protein', kind: 'macros', label: 'Protein a day', unit: 'g', current: 0, target: 146, startedAt: dayOffset(56) },
  { id: 'goal-water', kind: 'water', label: 'Water a day', unit: 'ml', current: 1500, target: 2500, startedAt: dayOffset(28) },
  { id: 'goal-steps', kind: 'steps', label: 'Steps a day', unit: 'steps', current: 9840, target: STEP_GOAL, startedAt: dayOffset(28) },
  { id: 'goal-fasting', kind: 'fasting', label: '16:8 five days a week', unit: 'days', current: 4, target: 5, startedAt: dayOffset(14) },
]

/* ── Notes ───────────────────────────────────────────────────────────── */
export const NOTES: NoteEntry[] = [
  { id: 'n1', day: dayOffset(0), time: '9:15 AM', body: 'Swapped the cereal for oat bran and my post-breakfast reading dropped 20 points. Worth keeping.', mood: 'great' },
  { id: 'n2', day: dayOffset(1), time: '10:30 PM', body: 'Late noodles again after the gym. The app flagged 1160 mg sodium — that explains the thirst all night.', mood: 'low' },
  { id: 'n3', day: dayOffset(3), time: '7:40 AM', body: 'Slept badly, craved sugar all afternoon. Notice this happens every time I am under 6 hours.', mood: 'ok' },
  { id: 'n4', day: dayOffset(6), time: '6:20 PM', body: 'Meal prepped four lentil soups for the week. Cheapest protein per gram I have found.', mood: 'good' },
]

/* ── Connected devices ───────────────────────────────────────────────── */
export const DEVICES: ConnectedDevice[] = [
  { id: 'd1', name: 'Apple Watch Series 10', kind: 'watch', syncing: true, lastSync: '4 minutes ago', metrics: ['Steps', 'Exercise', 'Heart rate', 'Sleep'] },
  { id: 'd2', name: 'Withings Body+', kind: 'scale', syncing: true, lastSync: 'Today, 7:02 AM', metrics: ['Weight', 'Body fat'] },
  { id: 'd3', name: 'Dexcom G7', kind: 'cgm', syncing: false, lastSync: 'Never connected', metrics: ['Glucose'] },
  { id: 'd4', name: 'iPhone (Health)', kind: 'phone', syncing: true, lastSync: '2 minutes ago', metrics: ['Steps', 'Flights climbed', 'Distance'] },
]

/** Calorie budget maths — the calculation the Today screen is built on. */
export function calorieBudget(base: number, food: number, exercise: number) {
  const remaining = Math.max(0, base + exercise - food)
  return {
    base,
    food,
    exercise,
    remaining,
    /** Percentage of the day's budget consumed, clamped for the ring. */
    usedPct: Math.min(100, Math.round((food / Math.max(1, base + exercise)) * 100)),
    leftPct: Math.max(0, 100 - Math.round((food / Math.max(1, base + exercise)) * 100)),
  }
}
