/** Static fixtures: profile, diary history, testimonials, FAQ, plans, integrations. */

import type { DiaryEntry, FaqItem, Plan, Profile, Testimonial } from '../types'

export const FAMILY_PROFILE: Profile = {
  name: 'Maya',
  goal: 'maintain',
  diet: ['vegetarian', 'gluten-free'],
  allergies: ['shellfish'],
  conditions: ['diabetes'],
  /* Kept in step with DAILY_BASE and MACRO_TARGETS on the Today screen. */
  dailyTargets: { kcal: 2100, protein: 146, fiber: 30, waterMl: 3000 },
}

/** Diary history. Anchored to the same 'today' as lib/data/health.ts so the
 *  Today screen, the streak, the week strip and the charts can never disagree. */
const d = (offset: number) => {
  const date = new Date('2026-10-01T09:00:00Z')
  date.setUTCDate(date.getUTCDate() - offset)
  return date.toISOString().slice(0, 10)
}

export const TODAY = d(0)
export const DAYS = [d(0), d(1), d(2), d(3), d(4), d(5), d(6)]

export const SEED_DIARY: DiaryEntry[] = [
  { id: 'e1', productId: 'granola-hearth', barcode: '5060123456789', name: 'Hearth & Grain Granola', brand: 'Hearth & Grain', emoji: '🥣', meal: 'breakfast', score: 86, kcal: 185, protein: 5, carbs: 27, sugar: 6.3, fiber: 3.8, servings: 1, day: d(0), time: '8:42 AM' },
  { id: 'e2', productId: 'yogurt-greek', barcode: '5012345678901', name: 'Greek Yogurt Natural', brand: 'Green Valley', emoji: '🥛', meal: 'breakfast', score: 92, kcal: 165, protein: 15, carbs: 6.6, sugar: 6.1, fiber: 0, servings: 1, day: d(0), time: '8:45 AM' },
  { id: 'e3', productId: 'soup-lentil', barcode: '5065123456789', name: 'Harvest Lentil Soup', brand: 'Harvest Kitchen', emoji: '🍲', meal: 'lunch', score: 81, kcal: 344, protein: 20, carbs: 48, sugar: 10.4, fiber: 18.4, servings: 1, day: d(0), time: '12:06 PM' },
  { id: 'e4', productId: 'bar-dates-almond', barcode: '5061123456789', name: 'Date & Almond Energy Bar', brand: 'Trailhead', emoji: '🥜', meal: 'snack', score: 74, kcal: 164, protein: 3.6, carbs: 21, sugar: 13.6, fiber: 2.8, servings: 1, day: d(0), time: '4:20 PM' },

  { id: 'e5', productId: 'cereal-oat-bran', barcode: '5060323456789', name: 'Whole Oat Bran Flakes', brand: 'Morning Field', emoji: '🌾', meal: 'breakfast', score: 88, kcal: 143, protein: 4.8, carbs: 26, sugar: 2, fiber: 4.5, servings: 1, day: d(1), time: '7:58 AM' },
  { id: 'e6', productId: 'soup-lentil', barcode: '5065123456789', name: 'Harvest Lentil Soup', brand: 'Harvest Kitchen', emoji: '🍲', meal: 'lunch', score: 81, kcal: 344, protein: 20, carbs: 48, sugar: 10.4, fiber: 18.4, servings: 1, day: d(1), time: '1:12 PM' },
  { id: 'e7', productId: 'chips-salted', barcode: '5067123456789', name: 'Sea Salt Kettle Chips', brand: 'Crisp House', emoji: '🥔', meal: 'snack', score: 52, kcal: 161, protein: 1.9, carbs: 16, sugar: 0.2, fiber: 1.3, servings: 1, day: d(1), time: '5:40 PM' },
  { id: 'e8', productId: 'meal-frozen-vegcurry', barcode: '5065323456789', name: 'Frozen Veg Curry & Rice', brand: 'Harvest Kitchen', emoji: '🍛', meal: 'dinner', score: 72, kcal: 413, protein: 12.6, carbs: 63, sugar: 10.9, fiber: 11.2, servings: 1, day: d(1), time: '8:05 PM' },

  { id: 'e9', productId: 'yogurt-skyr', barcode: '5068423456789', name: 'High-Protein Skyr', brand: 'Green Valley', emoji: '🥛', meal: 'breakfast', score: 94, kcal: 95, protein: 16.5, carbs: 5.1, sugar: 4.7, fiber: 0, servings: 1, day: d(2), time: '7:30 AM' },
  { id: 'e10', productId: 'bread-sourdough', barcode: '5064123456789', name: 'Stoneground Sourdough', brand: 'Baker & Rye', emoji: '🍞', meal: 'lunch', score: 68, kcal: 201, protein: 6.9, carbs: 38, sugar: 1.9, fiber: 2.7, servings: 1, day: d(2), time: '12:45 PM' },
  { id: 'e11', productId: 'choc-milk-bar', barcode: '5067423456789', name: 'Creamy Milk Chocolate Bar', brand: 'Sweet Jar', emoji: '🍫', meal: 'snack', score: 24, kcal: 241, protein: 3.2, carbs: 26, sugar: 25.2, fiber: 0.6, servings: 1, day: d(2), time: '3:50 PM' },

  { id: 'e12', productId: 'granola-simple', barcode: '5068123456789', name: 'Naked Oats & Seeds Granola', brand: 'Hearth & Grain', emoji: '🥣', meal: 'breakfast', score: 84, kcal: 175, protein: 5.9, carbs: 23, sugar: 2.7, fiber: 4.8, servings: 1, day: d(3), time: '8:10 AM' },
  { id: 'e13', productId: 'pb-natural', barcode: '5066123456789', name: 'Natural Peanut Butter', brand: 'Grove', emoji: '🥜', meal: 'snack', score: 90, kcal: 191, protein: 8, carbs: 6.4, sugar: 1.7, fiber: 2, servings: 1, day: d(3), time: '11:15 AM' },
  { id: 'e14', productId: 'noodles-instant', barcode: '5065223456789', name: 'Instant Chicken Noodles', brand: 'Quick Bowl', emoji: '🍜', meal: 'dinner', score: 31, kcal: 339, protein: 6.8, carbs: 46, sugar: 3.2, fiber: 1.7, servings: 1, day: d(3), time: '7:55 PM' },
]

export const TESTIMONIALS: Testimonial[] = [
  {
    name: 'Priya Ranjan', role: 'Type 2 diabetes · Bengaluru', initials: 'PR', tone: 'var(--brand-100)', rating: 5,
    quote: 'The sugar weighting is what sold me. The same cereal I thought was healthy scored 41 for my profile, and it showed me a swap I actually like.',
  },
  {
    name: 'Daniel Okafor', role: 'Strength coach · Manchester', initials: 'DO', tone: 'var(--accent-berry)', rating: 5,
    quote: 'I scan 20 products a week for my clients. The protein-per-100g readout and the alternatives carousel save me an hour of label reading.',
  },
  {
    name: 'Hannah Weiss', role: 'Parent of two · Hamburg', initials: 'HW', tone: 'var(--accent-mango)', rating: 5,
    quote: 'My seven-year-old now asks me to scan things before they go in the trolley. The additive flags are written in language he understands.',
  },
  {
    name: 'Dr. Anand Shrestha', role: 'Registered dietitian · Kathmandu', initials: 'AS', tone: 'var(--accent-sky)', rating: 4,
    quote: 'I recommend it as a starting point between appointments. It is not a substitute for clinical assessment, and it never pretends to be.',
  },
  {
    name: 'Lena Petrova', role: 'Marathon runner · Sofia', initials: 'LP', tone: 'var(--brand-200)', rating: 5,
    quote: 'Chasing sodium before long runs used to mean spreadsheets. Now I scan, see the number, and move on with my day.',
  },
]

export const FAQS: FaqItem[] = [
  { q: 'How is the nutrition score calculated?', a: 'Every product starts at 100. We subtract for added sugar, sodium, saturated fat, ultra-processing (NOVA class) and flagged additives, and we add back for fiber, protein and key micronutrients. The exact weighting is shown on every result screen under "How we got this number" — we do not hide the math.' },
  { q: 'Does the score change for different people?', a: 'Yes. If you tell us you manage diabetes, sodium and sugar carry more weight for you. High blood pressure increases the sodium weighting. And if a product contains one of your allergens we do not score it at all — we show a clear warning and prioritise safer alternatives.' },
  { q: 'Do I need a barcode to use it?', a: 'No. Barcode scanning is the fastest path, but you can photograph a nutrition label or a meal and our vision model reads it. There is also manual search across 2.4 million products.' },
  { q: 'Is my camera footage stored?', a: 'No. Frames are processed to extract the label data and then discarded. Photos you upload are deleted after analysis unless you deliberately save them to your diary.' },
  { q: 'Is this medical advice?', a: 'No. Nutrition Scan is an educational tool. It helps you understand what is in your food. For medical decisions — particularly with chronic conditions, pregnancy or medication interactions — talk to your clinician or dietitian.' },
  { q: 'Does it work offline?', a: 'Your last ten scans and your full diary are available offline in the app. New scans need a connection.' },
  { q: 'Which diets and conditions does it support?', a: 'Gluten-free, dairy-free, vegan, vegetarian, keto, low-sugar, halal and organic labelling, plus condition profiles for diabetes, hypertension, chronic kidney disease and high cholesterol.' },
  { q: 'Can I share results with my dietitian?', a: 'On Plus and Pro you can export a seven or thirty day report as a PDF or a shareable link. Clinics on the enterprise plan get branded reports for their whole caseload.' },
  { q: 'How do you handle allergens?', a: 'We read allergens from the ingredient list and cross-reference official allergen declarations for your region. If a product is ambiguous we err towards warning you.' },
  { q: 'What does a score of 0 mean?', a: 'It means the product contains one of the allergens you flagged. We suppress the number rather than ranking a food that is unsafe for you.' },
  { q: 'Can I cancel anytime?', a: 'Yes, in two taps from Profile → Subscription. Annual plans are refundable pro-rata within the first thirty days.' },
  { q: 'Do you sell my health data?', a: 'Never. We do not sell or rent personal or health data, and anonymised analytics can be switched off entirely in Settings.' },
]

export const PLANS: Plan[] = [
  {
    id: 'free', name: 'Free', monthly: 0, annual: 0, tagline: 'Everything you need to start scanning.',
    features: ['20 scans per month', 'Nutrition score + grade', 'Ingredient breakdown', 'Basic alternatives', '7-day diary history'],
  },
  {
    id: 'plus', name: 'Plus', monthly: 7.99, annual: 63.99, tagline: 'For people building a real habit.', recommended: true,
    features: ['Unlimited scans', 'Personalised scoring for your conditions', 'Full alternatives engine', '90-day trends and insights', 'PDF report export', 'Offline diary'],
  },
  {
    id: 'pro', name: 'Pro', monthly: 14.99, annual: 119.99, tagline: 'For coaches, dietitians and clinics.',
    features: ['Everything in Plus', 'Up to 25 client profiles', 'White-label shareable reports', 'Client roster dashboard', 'Bulk product lookup', 'Priority support'],
  },
]

export const INTEGRATIONS = [
  { name: 'Apple Health', what: 'Syncs hydration and nutrition entries' },
  { name: 'Google Fit', what: 'Syncs activity to your daily picture' },
  { name: 'Fitbit', what: 'Imports calorie burn for net balance' },
  { name: 'Garmin', what: 'Training load alongside sodium needs' },
  { name: 'Oura', what: 'Sleep scores beside your nutrition trends' },
  { name: 'Strava', what: 'Long-run fuelling insights' },
  { name: 'Whoop', what: 'Recovery trends and intake correlation' },
  { name: 'MyFitnessPal', what: 'One-way export of your diary' },
]

/** Featured products used by the landing page demo scanner. */
export const DEMO_BARCODES = [
  '5060123456789', // granola 86
  '5065223456789', // instant noodles 31
  '5067423456789', // milk chocolate 24
  '5012345678901', // greek yogurt 92
]

export const LOGO_WALL = ['FitGym', 'NutriClinic', 'VitalDiet', 'PulseLab', 'WellnessHub', 'TokyoFit', 'MedDiet', 'CoreHealth']
