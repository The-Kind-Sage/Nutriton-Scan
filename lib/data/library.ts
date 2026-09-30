/** Recipe discovery, meal plans, and workout routines. */

import type { MealPlanEntry, Recipe, WorkoutRoutine } from '../types'
import { dayOffset } from './health'

export const RECIPES: Recipe[] = [
  {
    id: 'r1', name: 'Red Lentil & Coconut Dal', emoji: '🍲', minutes: 32, servings: 4,
    description: 'One pot, four servings, and the cheapest protein-per-gram in this whole library. Freezes perfectly for weekday lunches.',
    kcal: 344, protein: 20, carbs: 48, fat: 6.2, fiber: 18, score: 91,
    diet: ['vegan', 'gluten-free', 'high-protein'], allergens: [], tags: ['High fiber', 'Meal prep', 'Budget'],
    ingredients: ['250 g red lentils', '400 ml light coconut milk', '1 tin chopped tomatoes', '1 onion, diced', '3 garlic cloves', '1 tbsp curry powder', '750 ml vegetable stock', 'Spinach, a large handful'],
    steps: ['Soften the onion and garlic in a splash of oil for 5 minutes.', 'Add the curry powder and toast for 30 seconds until fragrant.', 'Tip in the lentils, tomatoes, coconut milk and stock.', 'Simmer for 22 minutes until the lentils collapse.', 'Stir the spinach through, season, and finish with lime.'],
  },
  {
    id: 'r2', name: 'Overnight Oats, Three Ways', emoji: '🥣', minutes: 8, servings: 3,
    description: 'Five minutes before bed, breakfast handled for three days. Base recipe plus apple-cinnamon, berry, and cocoa-peanut variations.',
    kcal: 378, protein: 14, carbs: 52, fat: 11, fiber: 9, score: 88,
    diet: ['vegetarian', 'high-protein'], allergens: ['milk', 'nuts'], tags: ['Breakfast', 'Meal prep', 'No cook'],
    ingredients: ['150 g rolled oats', '400 ml milk of choice', '150 g Greek yogurt', '2 tbsp chia seeds', '1 tsp cinnamon', 'Fruit and nuts to finish'],
    steps: ['Mix the oats, milk, yogurt and chia in a bowl.', 'Divide between three jars.', 'Refrigerate overnight — minimum four hours.', 'Top with fruit, nuts or a spoon of peanut butter before eating.'],
  },
  {
    id: 'r3', name: 'Sheet-Pan Salmon & Greens', emoji: '🐟', minutes: 25, servings: 2,
    description: 'One tray, one wash-up, rich in omega-3 and vitamin D. Ready in less time than a delivery app.',
    kcal: 412, protein: 38, carbs: 14, fat: 24, fiber: 6, score: 89,
    diet: ['gluten-free', 'keto', 'high-protein'], allergens: ['fish'], tags: ['Dinner', 'Quick', 'Omega-3'],
    ingredients: ['2 salmon fillets', '400 g tenderstem broccoli', '200 g cherry tomatoes', '2 tbsp olive oil', '1 lemon', 'Garlic, capers, dill'],
    steps: ['Heat the oven to 200°C.', 'Toss the vegetables in oil, garlic and seasoning on a large tray.', 'Roast for 10 minutes.', 'Add the salmon, drizzle with lemon, and roast for 12 more minutes.', 'Scatter with capers and dill.'],
  },
  {
    id: 'r4', name: 'Chickpea & Spinach Curry', emoji: '🍛', minutes: 28, servings: 4,
    description: 'Plant protein and iron, with a score that holds up to any packaged meal. Batch it on a Sunday.',
    kcal: 298, protein: 15, carbs: 38, fat: 9, fiber: 12, score: 87,
    diet: ['vegan', 'gluten-free', 'high-protein'], allergens: [], tags: ['Batch cook', 'Budget', 'High fiber'],
    ingredients: ['2 tins chickpeas', '400 g spinach', '1 onion', '2 tins chopped tomatoes', '2 tbsp garam masala', '1 tsp turmeric', '200 ml vegetable stock'],
    steps: ['Soften the onion, then bloom the spices for a minute.', 'Add the tomatoes and stock, simmer for 12 minutes.', 'Add the chickpeas and warm through.', 'Fold in the spinach until just wilted.'],
  },
  {
    id: 'r5', name: 'Green Protein Smoothie', emoji: '🥤', minutes: 5, servings: 1,
    description: 'The breakfast that survives a rushed morning. Balanced enough to hold you until lunch.',
    kcal: 342, protein: 32, carbs: 34, fat: 8, fiber: 9, score: 90,
    diet: ['vegetarian', 'gluten-free', 'high-protein'], allergens: ['milk'], tags: ['Breakfast', '5 minutes', 'Post-workout'],
    ingredients: ['1 scoop unflavoured whey or pea protein', '1 frozen banana', 'A large handful of spinach', '250 ml milk', '1 tbsp peanut butter', '1 tbsp chia'],
    steps: ['Everything in the blender.', 'Blend for 45 seconds until completely smooth.', 'Thin with water if you prefer it drinkable rather than spoonable.'],
  },
  {
    id: 'r6', name: 'Sourdough, Egg & Avocado', emoji: '🥑', minutes: 12, servings: 2,
    description: 'The classic, done properly. Slow-release carbohydrate and a genuinely filling fat profile.',
    kcal: 398, protein: 18, carbs: 36, fat: 22, fiber: 10, score: 85,
    diet: ['vegetarian'], allergens: ['eggs', 'gluten'], tags: ['Breakfast', 'Quick', 'Classic'],
    ingredients: ['2 slices stoneground sourdough', '2 eggs', '1 ripe avocado', 'Chilli flakes', 'Lemon', 'Sea salt'],
    steps: ['Toast the sourdough properly — dark edges, still chewy.', 'Mash the avocado with lemon and salt.', 'Poach or fry the eggs to your preference.', 'Assemble and finish with chilli flakes.'],
  },
  {
    id: 'r7', name: 'Chicken, Quinoa & Roast Veg Bowl', emoji: '🥗', minutes: 35, servings: 3,
    description: 'Macros that look like a spreadsheets dream: 42 g protein, 11 g fiber, under 500 kcal per bowl.',
    kcal: 486, protein: 42, carbs: 41, fat: 14, fiber: 11, score: 93,
    diet: ['gluten-free', 'high-protein'], allergens: [], tags: ['Lunch', 'Meal prep', 'High protein'],
    ingredients: ['450 g chicken breast', '150 g dry quinoa', '1 courgette', '1 red pepper', '1 red onion', 'Olive oil, lemon, herbs'],
    steps: ['Roast the vegetables at 200°C for 25 minutes.', 'Cook the quinoa in salted water for 15 minutes.', 'Griddle the chicken and rest it before slicing.', 'Assemble bowls and dress with lemon and olive oil.'],
  },
  {
    id: 'r8', name: 'Berry Chia Pudding', emoji: '🫐', minutes: 6, servings: 2,
    description: 'Fiber-dense dessert that doubles as breakfast. Four ingredients, no cooking.',
    kcal: 224, protein: 8, carbs: 22, fat: 11, fiber: 12, score: 86,
    diet: ['vegan', 'gluten-free', 'low-sugar'], allergens: [], tags: ['Dessert', 'No cook', 'High fiber'],
    ingredients: ['4 tbsp chia seeds', '300 ml almond milk', '1 tsp vanilla', '150 g mixed berries', 'A drizzle of maple syrup'],
    steps: ['Whisk the chia into the milk with the vanilla.', 'Rest for 10 minutes, then whisk again to stop clumping.', 'Chill for at least 2 hours.', 'Top with berries just before serving.'],
  },
  {
    id: 'r9', name: 'Miso Mushroom & Tofu Stir-Fry', emoji: '🍜', minutes: 22, servings: 2,
    description: 'Umami without the sodium bomb of a takeaway — 640 mg per serving against roughly 1800 in the equivalent boxed version.',
    kcal: 366, protein: 26, carbs: 24, fat: 18, fiber: 7, score: 84,
    diet: ['vegan', 'gluten-free', 'high-protein'], allergens: ['soy', 'sesame'], tags: ['Dinner', 'Quick', 'Lower sodium'],
    ingredients: ['300 g firm tofu', '300 g mixed mushrooms', '2 tbsp white miso', '1 tbsp sesame oil', 'Pak choi', 'Spring onion, ginger'],
    steps: ['Press and cube the tofu, then fry until golden.', 'Add the mushrooms and cook hard until they colour.', 'Whisk the miso into 100 ml warm water and pour in.', 'Add the pak choi for the final two minutes. Finish with sesame oil.'],
  },
  {
    id: 'r10', name: 'Roasted Chickpeas, Two Ways', emoji: '🫘', minutes: 30, servings: 4,
    description: 'The crisp snack that replaces the crisps. Smoked paprika or honey-chilli, your call.',
    kcal: 188, protein: 9, carbs: 22, fat: 6, fiber: 8, score: 83,
    diet: ['vegan', 'gluten-free'], allergens: [], tags: ['Snack', 'Meal prep', 'Crowd pleaser'],
    ingredients: ['2 tins chickpeas', '2 tbsp olive oil', 'Smoked paprika, cumin, salt', 'Optional: 1 tsp honey and chilli flakes'],
    steps: ['Dry the chickpeas thoroughly — this is the whole trick.', 'Toss in oil and spices.', 'Roast at 200°C for 28 minutes, shaking halfway.', 'Cool completely before storing or they steam and go soft.'],
  },
  {
    id: 'r11', name: 'Cauliflower Crust Pizza', emoji: '🍕', minutes: 40, servings: 2,
    description: 'A lower-carb base that actually holds. Not a patch on a real pizza, but it scratches the itch.',
    kcal: 312, protein: 22, carbs: 18, fat: 17, fiber: 6, score: 76,
    diet: ['vegetarian', 'gluten-free', 'keto'], allergens: ['eggs', 'milk'], tags: ['Dinner', 'Lower carb'],
    ingredients: ['1 large cauliflower', '1 egg', '80 g mozzarella', '40 g parmesan', 'Passata, basil, toppings'],
    steps: ['Blitz and steam the cauliflower, then squeeze out every drop of water.', 'Mix with egg and parmesan and press into a crust.', 'Bake at 220°C for 18 minutes until firm.', 'Top and bake for 10 more minutes.'],
  },
  {
    id: 'r12', name: 'Date & Oat Energy Bites', emoji: '🟤', minutes: 15, servings: 12,
    description: 'Twelve bites, no refined sugar, and they survive a gym bag. Better than any packaged bar we scanned.',
    kcal: 142, protein: 4.2, carbs: 18, fat: 6.4, fiber: 3.6, score: 82,
    diet: ['vegan', 'gluten-free'], allergens: ['nuts'], tags: ['Snack', 'No bake', 'Gym bag'],
    ingredients: ['200 g medjool dates', '120 g rolled oats', '60 g almond butter', '2 tbsp cocoa nibs', 'Pinch of sea salt'],
    steps: ['Blitz the dates to a paste.', 'Add everything else and pulse until it clumps.', 'Roll into 12 balls.', 'Chill for 30 minutes to firm up.'],
  },
]

export const RECIPE_TAGS = ['All', 'High fiber', 'High protein', 'Meal prep', 'Quick', 'Breakfast', 'Dinner', 'Snack', 'Budget', 'No cook']

/** A pre-built day of meals the user can log in one tap. */
export const MEAL_PLAN: MealPlanEntry[] = [
  { id: 'mp1', name: 'Overnight Oats, Three Ways', emoji: '🥣', slot: 'breakfast', recipeId: 'r2', logged: true, day: dayOffset(0) },
  { id: 'mp2', name: 'Chicken, Quinoa & Roast Veg Bowl', emoji: '🥗', slot: 'lunch', recipeId: 'r7', logged: false, day: dayOffset(0) },
  { id: 'mp3', name: 'Miso Mushroom & Tofu Stir-Fry', emoji: '🍜', slot: 'dinner', recipeId: 'r9', logged: false, day: dayOffset(0) },
  { id: 'mp4', name: 'Date & Oat Energy Bites', emoji: '🟤', slot: 'snack', recipeId: 'r12', logged: false, day: dayOffset(0) },
]

export const WORKOUTS: WorkoutRoutine[] = [
  {
    id: 'w1', name: 'Full Body Foundation', emoji: '🏋️', focus: 'Strength · full body', minutes: 45, kcal: 320, level: 'beginner', equipment: 'Dumbbells',
    exercises: [
      { name: 'Goblet squat', sets: '3 × 10', rest: '60s' },
      { name: 'Dumbbell row', sets: '3 × 10 each', rest: '60s' },
      { name: 'Romanian deadlift', sets: '3 × 12', rest: '75s' },
      { name: 'Overhead press', sets: '3 × 10', rest: '60s' },
      { name: 'Plank', sets: '3 × 40s', rest: '45s' },
    ],
  },
  {
    id: 'w2', name: 'Upper Body Push', emoji: '💪', focus: 'Strength · chest & shoulders', minutes: 50, kcal: 355, level: 'intermediate', equipment: 'Barbell, bench',
    exercises: [
      { name: 'Bench press', sets: '4 × 8', rest: '90s' },
      { name: 'Incline dumbbell press', sets: '3 × 10', rest: '75s' },
      { name: 'Overhead press', sets: '4 × 6', rest: '90s' },
      { name: 'Lateral raise', sets: '3 × 15', rest: '45s' },
      { name: 'Triceps dip', sets: '3 × 12', rest: '60s' },
    ],
  },
  {
    id: 'w3', name: 'Interval Run', emoji: '🏃', focus: 'Cardio · VO₂ max', minutes: 36, kcal: 398, level: 'advanced', equipment: 'None',
    exercises: [
      { name: 'Warm-up jog', sets: '8 min easy', rest: '—' },
      { name: 'Hard effort', sets: '6 × 3 min', rest: '90s walk' },
      { name: 'Cool down', sets: '6 min easy', rest: '—' },
    ],
  },
  {
    id: 'w4', name: 'Mobility & Recovery', emoji: '🧘', focus: 'Mobility · recovery day', minutes: 25, kcal: 96, level: 'beginner', equipment: 'Mat',
    exercises: [
      { name: 'Cat-cow', sets: '2 × 10', rest: '—' },
      { name: '90/90 hip switch', sets: '2 × 8 each', rest: '—' },
      { name: 'Thoracic twist', sets: '2 × 8 each', rest: '—' },
      { name: 'Deep squat hold', sets: '3 × 45s', rest: '30s' },
      { name: 'Box breathing', sets: '5 min', rest: '—' },
    ],
  },
  {
    id: 'w5', name: 'Lower Body Power', emoji: '🦵', focus: 'Strength · legs', minutes: 55, kcal: 405, level: 'advanced', equipment: 'Barbell',
    exercises: [
      { name: 'Back squat', sets: '5 × 5', rest: '120s' },
      { name: 'Bulgarian split squat', sets: '3 × 8 each', rest: '90s' },
      { name: 'Hip thrust', sets: '4 × 10', rest: '90s' },
      { name: 'Calf raise', sets: '4 × 15', rest: '45s' },
      { name: 'Hanging leg raise', sets: '3 × 12', rest: '60s' },
    ],
  },
  {
    id: 'w6', name: '20-Minute Home Circuit', emoji: '⏱️', focus: 'Conditioning · no equipment', minutes: 20, kcal: 218, level: 'beginner', equipment: 'None',
    exercises: [
      { name: 'Bodyweight squat', sets: '40s on / 20s off', rest: '—' },
      { name: 'Press-up (knees if needed)', sets: '40s on / 20s off', rest: '—' },
      { name: 'Reverse lunge', sets: '40s on / 20s off', rest: '—' },
      { name: 'Mountain climber', sets: '40s on / 20s off', rest: '—' },
      { name: 'Repeat the round four times', sets: '4 rounds', rest: '60s between' },
    ],
  },
]

export const recipeById = (id: string) => RECIPES.find((r) => r.id === id)
