/**
 * Mock product database — 32 realistic packaged foods across 11 categories,
 * with a deliberate spread of scores so alternatives always have a better
 * option to offer. All figures are per 100 g and nutritionally plausible.
 *
 * Swap this file for a real API response and nothing else needs to change.
 */

import type { Allergen, DietTag, Ingredient, Nutrients, Product } from '../types'

type N = [kcal: number, protein: number, carbs: number, sugar: number, addedSugar: number, fat: number, satFat: number, transFat: number, fiber: number, sodium: number, potassium: number, calcium: number, iron: number]
type I = [name: string, plainName: string, purpose: string, flag: Ingredient['flag'], note: string]

function p(
  id: string, barcode: string, name: string, brand: string, category: string, emoji: string,
  servingSize: string, servingGrams: number, n: N, nova: 1 | 2 | 3 | 4,
  allergens: Allergen[], labels: DietTag[], priceIndex: 1 | 2 | 3, ingredients: I[],
): Product {
  const [kcal, protein, carbs, sugar, addedSugar, fat, satFat, transFat, fiber, sodium, potassium, calcium, iron] = n
  const per100g: Nutrients = { kcal, protein, carbs, sugar, addedSugar, fat, satFat, transFat, fiber, sodium, potassium, calcium, iron }
  return {
    id, barcode, name, brand, category, emoji, servingSize, servingGrams, per100g, nova,
    allergens, labels, priceIndex,
    ingredients: ingredients.map(([iname, plainName, purpose, flag, note]) => ({ name: iname, plainName, purpose, flag, note })),
  }
}

export const PRODUCTS: Product[] = [
  // ── Granola & cereal ──────────────────────────────────────────────────
  p('granola-hearth', '5060123456789', 'Hearth & Grain Granola', 'Hearth & Grain', 'Granola & Cereal', '🥣',
    '45 g (1/2 cup)', 45, [412, 11, 61, 14, 6, 13, 2.1, 0, 8.4, 78, 420, 62, 3.4], 3,
    ['nuts', 'gluten'], ['vegan', 'high-protein'], 3, [
      ['Whole rolled oats', 'Whole oats', 'Base grain', 'green', 'A minimally processed whole grain with beta-glucan fiber.'],
      ['Almonds', 'Almonds', 'Healthy fat + crunch', 'green', 'Provides vitamin E and unsaturated fat.'],
      ['Maple syrup', 'Maple syrup', 'Sweetener', 'amber', 'A sugar. Naturally sourced does not mean low-sugar.'],
      ['Sunflower oil', 'Sunflower oil', 'Binder', 'amber', 'Refined oil used to help the clusters hold together.'],
      ['Sea salt', 'Salt', 'Flavour', 'green', 'Low in the grand scheme of this recipe.'],
    ]),
  p('cereal-choco-crunch', '5060223456789', 'Choco Crunch Loops', 'Kiddo Mills', 'Granola & Cereal', '🍫',
    '30 g', 30, [401, 6, 76, 34, 27, 7, 3.4, 0, 3.1, 480, 210, 30, 6.2], 4,
    ['gluten', 'milk'], ['kid-friendly'], 1, [
      ['Wheat flour', 'Refined wheat flour', 'Base', 'amber', 'Stripped of bran and germ, so most fiber is gone.'],
      ['Sugar', 'Sugar', 'Sweetener', 'red', 'Main ingredient by weight after flour.'],
      ['Glucose-fructose syrup', 'Liquid sugar', 'Sweetener + texture', 'red', 'A cheap sugar syrup that spikes blood glucose quickly.'],
      ['Cocoa powder', 'Cocoa', 'Flavour and colour', 'green', 'Real cocoa, though only 3% of the recipe.'],
      ['Palm oil', 'Palm oil', 'Fat', 'amber', 'High in saturated fat and linked to deforestation.'],
      ['E322 lecithin', 'Soy lecithin', 'Emulsifier', 'green', 'Common and considered safe.'],
      ['E150d', 'Caramel colour (sulphite ammonia)', 'Colour', 'red', 'Ultra-processed colour; some studies flag it in high doses.'],
      ['Salt', 'Salt', 'Flavour', 'amber', 'Adds up fast in cereal.'],
      ['Vitamin D3, Iron', 'Added vitamins', 'Fortification', 'green', 'Replaces nutrients lost during refining.'],
    ]),
  p('cereal-oat-bran', '5060323456789', 'Whole Oat Bran Flakes', 'Morning Field', 'Granola & Cereal', '🌾',
    '40 g', 40, [358, 12, 66, 5, 4, 4, 0.8, 0, 11.2, 290, 480, 45, 8.1], 3,
    ['gluten'], ['vegan', 'high-protein'], 2, [
      ['Wholegrain oats', 'Whole oats', 'Base grain', 'green', 'Beta-glucan fiber helps lower LDL cholesterol.'],
      ['Wheat bran', 'Wheat bran', 'Fiber', 'green', 'Concentrated insoluble fiber.'],
      ['Cane sugar', 'Sugar', 'Sweetener', 'amber', 'Only 4 g per 100 g — modest.'],
      ['Salt', 'Salt', 'Flavour', 'green', 'Low.'],
      ['Iron, Vitamin B12', 'Added vitamins', 'Fortification', 'green', 'Useful for plant-forward diets.'],
    ]),
  p('cereal-cinnamon-squares', '5060423456789', 'Cinnamon Crunch Squares', 'Sweet Start', 'Granola & Cereal', '🧇',
    '30 g', 30, [389, 7, 79, 22, 18, 4, 1.1, 0, 4.4, 620, 190, 25, 4.8], 4,
    ['gluten'], [], 2, [
      ['Corn flour', 'Refined corn flour', 'Base', 'amber', 'Low fiber once refined.'],
      ['Sugar', 'Sugar', 'Sweetener', 'red', 'Second ingredient.'],
      ['High-fructose corn syrup', 'Liquid sugar', 'Sweetener', 'red', 'Cheapest available sweetener; high in free fructose.'],
      ['Cinnamon', 'Cinnamon', 'Flavour', 'green', 'Genuine spice.'],
      ['BHT (E321)', 'BHT', 'Preservative', 'red', 'Antioxidant preservative; restricted in several countries.'],
      ['Tricalcium phosphate', 'Calcium phosphate', 'Anti-caking', 'green', 'Provides a little calcium.'],
      ['Salt', 'Salt', 'Flavour', 'red', '620 mg per 100 g is very high for a breakfast food.'],
    ]),

  // ── Yogurt ───────────────────────────────────────────────────────────
  p('yogurt-greek', '5012345678901', 'Greek Yogurt Natural', 'Green Valley', 'Yogurt', '🥛',
    '170 g pot', 170, [97, 9, 3.9, 3.6, 0, 5, 3.3, 0, 0, 46, 141, 110, 0.1], 1,
    ['milk'], ['vegetarian', 'high-protein', 'gluten-free', 'kid-friendly'], 2, [
      ['Pasteurised milk', 'Milk', 'Base', 'green', 'Single ingredient. That is the whole label.'],
      ['Live cultures', 'Yogurt bacteria', 'Fermentation', 'green', 'L. bulgaricus and S. thermophilus.'],
    ]),
  p('yogurt-strawberry-fruit', '5012445678901', 'Strawberry Fruit Yogurt', 'Creamery Co', 'Yogurt', '🍓',
    '150 g pot', 150, [94, 3.4, 14, 13, 8, 2.6, 1.7, 0, 0.4, 58, 150, 105, 0.1], 4,
    ['milk'], ['vegetarian'], 1, [
      ['Milk', 'Milk', 'Base', 'green', 'Reconstituted from milk powder.'],
      ['Sugar', 'Sugar', 'Sweetener', 'red', '13 g sugar per 100 g — roughly a third of the pot.'],
      ['Strawberry puree', 'Strawberries', 'Flavour', 'green', 'Only 4% fruit.'],
      ['Modified maize starch', 'Modified starch', 'Thickener', 'amber', 'Ultra-processed thickener with no nutritional value.'],
      ['E120 carmine', 'Carmine colour', 'Colour', 'red', 'Insect-derived colourant; not vegan despite the fruit imagery.'],
      ['Natural flavouring', 'Flavouring', 'Aroma', 'amber', 'Umbrella term — the exact compounds are not disclosed.'],
    ]),

  // ── Snack bars ───────────────────────────────────────────────────────
  p('bar-dates-almond', '5061123456789', 'Date & Almond Energy Bar', 'Trailhead', 'Snack Bar', '🥜',
    '40 g bar', 40, [410, 9, 52, 34, 0, 18, 1.8, 0, 7, 24, 540, 90, 1.9], 2,
    ['nuts'], ['vegan', 'gluten-free', 'high-protein'], 3, [
      ['Dates', 'Dates', 'Base + sweetener', 'green', 'Whole fruit sugar with fiber attached — gentler on blood glucose.'],
      ['Almonds', 'Almonds', 'Fat + protein', 'green', 'Unprocessed nut.'],
      ['Cocoa nibs', 'Cocoa', 'Flavour', 'green', 'Minimally processed.'],
      ['Sea salt', 'Salt', 'Flavour', 'green', 'Trace amount.'],
    ]),
  p('bar-protein-crisp', '5061223456789', 'Protein Crisp Bar Chocolate', 'IronPeak', 'Snack Bar', '🍫',
    '60 g bar', 60, [372, 28, 39, 8, 6, 11, 6.2, 0, 6, 320, 380, 240, 2.6], 4,
    ['milk', 'soy', 'nuts'], ['high-protein', 'gluten-free'], 2, [
      ['Whey protein isolate', 'Milk protein', 'Protein source', 'green', 'High-quality complete protein.'],
      ['Soy protein crisps', 'Soy protein', 'Texture + protein', 'green', 'Plant protein, well studied.'],
      ['Maltitol syrup', 'Sugar alcohol', 'Sweetener', 'amber', 'Lower glycemic impact but commonly causes bloating.'],
      ['Palm kernel oil', 'Palm kernel oil', 'Fat', 'red', 'Very high in saturated fat.'],
      ['Sodium caseinate', 'Milk protein', 'Texture', 'green', 'Milk-derived binder.'],
      ['E322 lecithin', 'Soy lecithin', 'Emulsifier', 'green', 'Safe and common.'],
      ['Sucralose', 'Artificial sweetener', 'Sweetness', 'amber', '600× sweeter than sugar; may affect gut bacteria.'],
      ['Salt', 'Salt', 'Flavour', 'amber', 'High for a snack bar.'],
    ]),

  // ── Drinks ───────────────────────────────────────────────────────────
  p('soda-cola', '5449000000996', 'Classic Cola', 'FizzWorks', 'Drinks', '🥤',
    '330 ml can', 330, [42, 0, 10.6, 10.6, 9.8, 0, 0, 0, 0, 4, 2, 2, 0], 4,
    [], [], 1, [
      ['Carbonated water', 'Sparkling water', 'Base', 'green', 'Fine on its own.'],
      ['Sugar', 'Sugar', 'Sweetener', 'red', '35 g of sugar in the can — more than a day’s ideal for most adults.'],
      ['E150d', 'Caramel colour', 'Colour', 'red', 'Ultra-processed colouring.'],
      ['Phosphoric acid', 'Acidulant', 'Tang + shelf life', 'amber', 'Contributes to enamel erosion.'],
      ['Caffeine', 'Caffeine', 'Stimulant', 'amber', '34 mg per can.'],
      ['Natural flavourings', 'Flavour blend', 'Aroma', 'amber', 'Undisclosed blend.'],
    ]),
  p('juice-orange-notfrom', '5062123456789', '100% Orange Juice', 'Sunpress', 'Drinks', '🍊',
    '250 ml glass', 250, [45, 0.7, 10.4, 8.9, 0, 0.2, 0, 0, 0.4, 3, 200, 11, 0.2], 3,
    [], ['vegan', 'gluten-free'], 2, [
      ['Pressed oranges', 'Oranges', 'Base', 'green', 'Real fruit — but the fiber has been left behind.'],
    ]),
  p('juice-orange-drink', '5062223456789', 'Orange Squash Drink', 'Sunpress', 'Drinks', '🧃',
    '250 ml glass', 250, [38, 0.2, 9.6, 9.4, 9.1, 0, 0, 0, 0, 12, 40, 4, 0], 4,
    [], [], 1, [
      ['Water', 'Water', 'Base', 'green', 'Fine.'],
      ['Sugar', 'Sugar', 'Sweetener', 'red', '9 g per 100 ml.'],
      ['Orange juice concentrate', 'Concentrate', 'Flavour', 'amber', 'Only 6% juice.'],
      ['Citric acid', 'Acidulant', 'Tang', 'green', 'Common and safe.'],
      ['E211 sodium benzoate', 'Sodium benzoate', 'Preservative', 'red', 'Can form trace benzene when combined with vitamin C.'],
      ['E102 tartrazine', 'Tartrazine yellow', 'Colour', 'red', 'Azo dye linked to hyperactivity in some children.'],
      ['Aspartame', 'Artificial sweetener', 'Sweetness', 'amber', 'Classified as possibly carcinogenic; avoid in phenylketonuria.'],
    ]),
  p('milk-oat-barista', '5063123456789', 'Barista Oat Milk', 'Fieldwork', 'Plant Milk', '🌱',
    '200 ml', 200, [59, 3.1, 6.7, 3.3, 0, 3, 0.3, 0, 0.8, 46, 130, 120, 0.1], 4,
    ['gluten'], ['vegan', 'dairy-free'], 2, [
      ['Water', 'Water', 'Base', 'green', 'Fine.'],
      ['Oats', 'Oats', 'Base', 'green', 'Whole grain — though most fiber is filtered out.'],
      ['Rapeseed oil', 'Rapeseed oil', 'Creaminess', 'amber', 'Unsaturated oil, used for texture.'],
      ['Calcium carbonate', 'Calcium', 'Fortification', 'green', 'Matches dairy milk for calcium.'],
      ['Salt', 'Salt', 'Flavour', 'green', 'Low.'],
    ]),
  p('protein-shake-rtd', '5063223456789', 'Ready-to-Drink Protein Shake', 'IronPeak', 'Drinks', '🥛',
    '330 ml bottle', 330, [68, 8, 4.2, 3.9, 3.5, 1.8, 1.1, 0, 0.6, 62, 180, 130, 0.4], 4,
    ['milk', 'soy'], ['high-protein', 'gluten-free'], 2, [
      ['Milk protein concentrate', 'Milk protein', 'Protein', 'green', 'Slow-digesting casein blend.'],
      ['Skimmed milk', 'Milk', 'Base', 'green', 'Real dairy.'],
      ['Sucralose', 'Artificial sweetener', 'Sweetness', 'amber', 'Zero-calorie sweetener.'],
      ['Carrageenan (E407)', 'Carrageenan', 'Thickener', 'amber', 'Seaweed-derived; some evidence of gut irritation.'],
      ['Vitamin blend', 'Vitamins', 'Fortification', 'green', 'Covers common gaps.'],
    ]),

  // ── Bread ────────────────────────────────────────────────────────────
  p('bread-sourdough', '5064123456789', 'Stoneground Sourdough', 'Baker & Rye', 'Bread', '🍞',
    '2 slices (80 g)', 80, [251, 8.6, 47, 2.4, 0, 1.6, 0.4, 0, 3.4, 420, 130, 30, 2.6], 3,
    ['gluten'], ['vegan'], 3, [
      ['Stoneground wheat flour', 'Whole wheat flour', 'Base', 'green', 'Retains bran and germ.'],
      ['Water', 'Water', 'Base', 'green', 'Fine.'],
      ['Sourdough culture', 'Wild yeast', 'Leavening', 'green', 'Long fermentation reduces phytates and improves digestibility.'],
      ['Sea salt', 'Salt', 'Flavour', 'amber', '420 mg per 100 g is on the higher side for bread.'],
    ]),
  p('bread-white-milk', '5064223456789', 'Soft White Milk Bread', 'Daily Loaf', 'Bread', '🍞',
    '2 slices (70 g)', 70, [272, 7.8, 50, 6.4, 5.2, 4.3, 1.9, 0, 1.6, 480, 110, 90, 1.4], 4,
    ['gluten', 'milk', 'soy'], ['kid-friendly'], 1, [
      ['Wheat flour', 'Refined wheat flour', 'Base', 'amber', 'Fiber largely removed.'],
      ['Water', 'Water', 'Base', 'green', 'Fine.'],
      ['Sugar', 'Sugar', 'Sweetener + browning', 'amber', 'Sweetened for softness.'],
      ['Palm oil', 'Palm oil', 'Fat', 'red', 'Saturated fat used for shelf softness.'],
      ['Mono- and diglycerides (E471)', 'Emulsifier', 'Softness', 'amber', 'May contain trace trans fats.'],
      ['Calcium propionate (E282)', 'Preservative', 'Mould prevention', 'amber', 'Common in commercial bread.'],
      ['Salt', 'Salt', 'Flavour', 'amber', 'Moderate.'],
    ]),

  // ── Ready meals & soup ───────────────────────────────────────────────
  p('soup-lentil', '5065123456789', 'Harvest Lentil Soup', 'Harvest Kitchen', 'Ready Meals', '🍲',
    '400 g bowl', 400, [86, 5.1, 12, 2.6, 0, 1.9, 0.3, 0, 4.6, 320, 260, 32, 1.8], 3,
    ['gluten'], ['vegan', 'high-protein'], 2, [
      ['Lentils', 'Lentils', 'Base', 'green', 'Legume protein plus fermentable fiber.'],
      ['Carrot', 'Carrot', 'Vegetable', 'green', 'Real vegetable.'],
      ['Tomato', 'Tomato', 'Base', 'green', 'Lycopene source.'],
      ['Olive oil', 'Olive oil', 'Fat', 'green', 'Unsaturated fat.'],
      ['Vegetable stock', 'Stock', 'Flavour', 'amber', 'Usually carries the salt.'],
      ['Salt', 'Salt', 'Flavour', 'amber', '320 mg per 100 g.'],
    ]),
  p('noodles-instant', '5065223456789', 'Instant Chicken Noodles', 'Quick Bowl', 'Ready Meals', '🍜',
    '1 pack (75 g)', 75, [452, 9, 61, 4.2, 3.1, 18, 8.6, 0.2, 2.2, 1160, 190, 22, 3.1], 4,
    ['gluten', 'soy', 'eggs'], [], 1, [
      ['Wheat flour', 'Refined flour', 'Noodle base', 'amber', 'Refined, low fiber.'],
      ['Palm oil', 'Palm oil', 'Frying + texture', 'red', 'Noodles are typically flash-fried in saturated fat.'],
      ['Salt', 'Salt', 'Flavour', 'red', '1160 mg per 100 g — over half a day’s sodium in one pack.'],
      ['Monosodium glutamate (E621)', 'MSG', 'Umami', 'amber', 'Safe for most people but signals heavy processing.'],
      ['Sugar', 'Sugar', 'Sweetener', 'amber', 'Hidden in a savoury product.'],
      ['Disodium inosinate (E631)', 'Flavour enhancer', 'Umami booster', 'amber', 'Usually paired with MSG.'],
      ['TBHQ (E319)', 'TBHQ', 'Antioxidant', 'red', 'Synthetic preservative; intake limits exist in some countries.'],
      ['Chicken powder', 'Chicken flavouring', 'Flavour', 'amber', 'Contains around 1% chicken.'],
    ]),
  p('meal-frozen-vegcurry', '5065323456789', 'Frozen Veg Curry & Rice', 'Harvest Kitchen', 'Ready Meals', '🍛',
    '350 g tray', 350, [118, 3.6, 18, 3.1, 0.4, 3.6, 0.9, 0, 3.2, 280, 210, 28, 1.1], 3,
    ['milk'], ['vegetarian'], 2, [
      ['Basmati rice', 'Rice', 'Base', 'green', 'Whole grain would be better; still reasonable.'],
      ['Chickpeas', 'Chickpeas', 'Protein + fiber', 'green', 'Real legume.'],
      ['Spinach', 'Spinach', 'Vegetable', 'green', 'Iron and folate.'],
      ['Coconut milk', 'Coconut milk', 'Creaminess', 'amber', 'Contains saturated fat, though in a modest amount here.'],
      ['Spices', 'Spices', 'Flavour', 'green', 'Whole spices ground on site.'],
      ['Salt', 'Salt', 'Flavour', 'amber', 'Moderate.'],
    ]),

  // ── Spreads & sauces ─────────────────────────────────────────────────
  p('pb-natural', '5066123456789', 'Natural Peanut Butter', 'Grove', 'Spreads', '🥜',
    '2 tbsp (32 g)', 32, [596, 25, 20, 5.2, 0, 50, 8.2, 0, 6.4, 180, 640, 43, 1.9], 1,
    ['peanuts'], ['vegan', 'keto', 'gluten-free', 'high-protein'], 2, [
      ['Peanuts', 'Peanuts', 'Base', 'green', 'One ingredient. 99% of the jar.'],
      ['Sea salt', 'Salt', 'Flavour', 'green', 'A pinch.'],
    ]),
  p('pb-choco-spread', '5066223456789', 'Choco Hazelnut Spread', 'Sweet Jar', 'Spreads', '🍫',
    '2 tbsp (37 g)', 37, [539, 6.3, 57, 56, 48, 31, 10.5, 0, 3.2, 60, 420, 90, 2.2], 4,
    ['milk', 'nuts', 'soy'], [], 2, [
      ['Sugar', 'Sugar', 'Base + sweetener', 'red', 'The first ingredient — 56 g per 100 g.'],
      ['Palm oil', 'Palm oil', 'Fat + texture', 'red', 'Palm oil is why it spreads at room temperature.'],
      ['Hazelnuts', 'Hazelnuts', 'Flavour', 'green', 'Only 13% of the jar.'],
      ['Skimmed milk powder', 'Milk powder', 'Creaminess', 'green', 'Real dairy.'],
      ['Cocoa powder', 'Cocoa', 'Flavour', 'amber', 'Low cocoa solids, treated with alkali.'],
      ['E322 lecithin', 'Soy lecithin', 'Emulsifier', 'green', 'Safe.'],
      ['Vanillin', 'Artificial vanilla', 'Aroma', 'amber', 'Synthetic flavouring.'],
    ]),
  p('sauce-tomato-passata', '5066323456789', 'Slow-Cooked Tomato Passata', 'Grove', 'Spreads', '🍅',
    '125 g', 125, [32, 1.6, 5.2, 4.1, 0, 0.4, 0.1, 0, 1.6, 24, 340, 18, 0.7], 2,
    [], ['vegan', 'gluten-free', 'kid-friendly'], 2, [
      ['Tomatoes', 'Tomatoes', 'Base', 'green', 'Just crushed tomatoes.'],
      ['Olive oil', 'Olive oil', 'Fat', 'green', 'Unsaturated.'],
      ['Basil', 'Basil', 'Flavour', 'green', 'Real herb.'],
    ]),
  p('sauce-bbq', '5066423456789', 'Smoky BBQ Sauce', 'Sweet Jar', 'Spreads', '🥫',
    '2 tbsp (34 g)', 34, [146, 0.8, 34, 31, 26, 0.3, 0.1, 0, 0.6, 980, 210, 12, 0.4], 4,
    ['gluten'], [], 1, [
      ['High-fructose corn syrup', 'Liquid sugar', 'Base + sweetener', 'red', 'First ingredient in most BBQ sauces.'],
      ['Tomato paste', 'Tomato', 'Base', 'green', 'Real tomato, though it plays second fiddle.'],
      ['Vinegar', 'Vinegar', 'Tang', 'green', 'Fine.'],
      ['Molasses', 'Molasses', 'Colour + sugar', 'amber', 'Another form of added sugar.'],
      ['Sodium benzoate (E211)', 'Preservative', 'Shelf life', 'red', 'Preservative with documented concerns.'],
      ['Caramel colour (E150c)', 'Colour', 'Appearance', 'red', 'Ultra-processed colouring.'],
      ['Salt', 'Salt', 'Flavour', 'red', '980 mg per 100 g.'],
    ]),

  // ── Snacks & sweets ──────────────────────────────────────────────────
  p('chips-salted', '5067123456789', 'Sea Salt Kettle Chips', 'Crisp House', 'Snacks', '🥔',
    '30 g bag', 30, [536, 6.2, 53, 0.6, 0, 32, 3.1, 0, 4.4, 520, 780, 24, 1.4], 3,
    [], ['vegan', 'gluten-free'], 2, [
      ['Potatoes', 'Potatoes', 'Base', 'green', 'Sliced with skin on.'],
      ['Sunflower oil', 'Sunflower oil', 'Frying', 'amber', 'Refined oil, still unsaturated.'],
      ['Sea salt', 'Salt', 'Flavour', 'amber', '520 mg per 100 g.'],
    ]),
  p('chips-prawn-crisps', '5067223456789', 'Prawn Cocktail Crisps', 'Crisp House', 'Snacks', '🦐',
    '25 g bag', 25, [522, 5.4, 55, 3.2, 2.1, 30, 2.6, 0, 3.1, 890, 320, 20, 1.1], 4,
    ['shellfish', 'milk'], [], 1, [
      ['Potato starch', 'Potato starch', 'Base', 'amber', 'Refined starch rather than whole potato.'],
      ['Sunflower oil', 'Sunflower oil', 'Frying', 'amber', 'Refined.'],
      ['Sugar', 'Sugar', 'Sweetness', 'amber', 'Hidden in a savoury snack.'],
      ['Prawn powder', 'Prawn flavouring', 'Flavour', 'amber', 'Allergen; around 2% of the recipe.'],
      ['Monosodium glutamate (E621)', 'MSG', 'Umami', 'amber', 'Flavour enhancer.'],
      ['E102 tartrazine / E110 sunset yellow', 'Azo dyes', 'Colour', 'red', 'Linked to hyperactivity in sensitive children.'],
      ['Salt', 'Salt', 'Flavour', 'red', '890 mg per 100 g.'],
    ]),
  p('choc-dark-85', '5067323456789', '85% Dark Chocolate', 'Cacao Trail', 'Sweets', '🍫',
    '2 squares (20 g)', 20, [592, 9.4, 22, 12, 8, 52, 30, 0, 12.5, 20, 720, 60, 11.4], 2,
    ['milk'], ['vegetarian', 'gluten-free'], 3, [
      ['Cocoa mass', 'Cocoa solids', 'Base', 'green', '85% cocoa — high flavanol content.'],
      ['Cocoa butter', 'Cocoa butter', 'Fat', 'green', 'Natural fat from the bean.'],
      ['Cane sugar', 'Sugar', 'Sweetener', 'amber', 'Only 12 g per 100 g.'],
      ['Vanilla', 'Vanilla', 'Flavour', 'green', 'Real vanilla.'],
    ]),
  p('choc-milk-bar', '5067423456789', 'Creamy Milk Chocolate Bar', 'Sweet Jar', 'Sweets', '🍫',
    '1 bar (45 g)', 45, [535, 7.1, 58, 56, 44, 30, 18, 0.3, 1.4, 210, 380, 190, 1.2], 4,
    ['milk', 'soy', 'nuts'], [], 1, [
      ['Sugar', 'Sugar', 'Base + sweetener', 'red', 'Over half the bar.'],
      ['Cocoa butter', 'Cocoa butter', 'Fat', 'green', 'Real cocoa fat.'],
      ['Whole milk powder', 'Milk powder', 'Creaminess', 'green', 'Explains the milk allergen.'],
      ['Cocoa mass', 'Cocoa', 'Flavour', 'amber', 'Only about 20% cocoa.'],
      ['Palm oil', 'Palm oil', 'Cheaper fat', 'red', 'Used to cut cost.'],
      ['E322 lecithin', 'Soy lecithin', 'Emulsifier', 'green', 'Safe.'],
      ['Artificial vanilla (vanillin)', 'Vanillin', 'Aroma', 'amber', 'Synthetic.'],
    ]),
  p('cheese-cheddar', '5067523456789', 'Mature Cheddar', 'Dale Farm', 'Dairy', '🧀',
    '30 g slice', 30, [416, 25, 0.1, 0.1, 0, 35, 22, 0.4, 0, 720, 98, 740, 0.3], 2,
    ['milk'], ['vegetarian', 'keto', 'gluten-free', 'high-protein'], 3, [
      ['Milk', 'Milk', 'Base', 'green', 'Single ingredient plus cultures.'],
      ['Salt', 'Salt', 'Flavour + preservation', 'amber', '720 mg per 100 g — high, but the portion is small.'],
      ['Vegetarian rennet', 'Rennet', 'Curdling', 'green', 'Suitable for vegetarians.'],
    ]),
  p('baby-fruit-pouch', '5067623456789', 'Baby Fruit & Oat Pouch', 'Littlefield', 'Baby', '🍎',
    '100 g pouch', 100, [64, 1.1, 14, 11, 4, 0.6, 0.1, 0, 1.2, 12, 140, 18, 0.6], 3,
    ['gluten'], ['kid-friendly', 'vegan'], 2, [
      ['Apple puree', 'Apple', 'Base', 'green', 'Real fruit.'],
      ['Banana puree', 'Banana', 'Base', 'green', 'Real fruit.'],
      ['Wholegrain oats', 'Oats', 'Body + fiber', 'green', 'Adds slow carbohydrates.'],
      ['Calcium carbonate', 'Calcium', 'Fortification', 'green', 'Supports bone development.'],
      ['Ascorbic acid', 'Vitamin C', 'Preservation + nutrition', 'green', 'Natural antioxidant.'],
    ]),

  // ── Extras used by alternatives ───────────────────────────────────────
  p('granola-simple', '5068123456789', 'Naked Oats & Seeds Granola', 'Hearth & Grain', 'Granola & Cereal', '🥣',
    '45 g', 45, [389, 13, 52, 6.1, 1.2, 14, 1.9, 0, 10.6, 42, 480, 88, 4.1], 2,
    ['gluten', 'nuts'], ['vegan', 'high-protein', 'low-sugar'], 3, [
      ['Whole rolled oats', 'Whole oats', 'Base', 'green', 'Whole grain.'],
      ['Pumpkin seeds', 'Pumpkin seeds', 'Protein + minerals', 'green', 'Magnesium and zinc.'],
      ['Chia seeds', 'Chia seeds', 'Fiber + omega-3', 'green', '7 g fiber per serving here.'],
      ['Cinnamon', 'Cinnamon', 'Flavour', 'green', 'Sweetness without sugar.'],
    ]),
  p('bar-oat-berry', '5068223456789', 'Oat & Berry Bar', 'Trailhead', 'Snack Bar', '🫐',
    '40 g bar', 40, [364, 8.2, 58, 18, 2.4, 9.4, 1.1, 0, 8.8, 30, 420, 60, 2.2], 3,
    ['gluten'], ['vegan', 'low-sugar'], 2, [
      ['Wholegrain oats', 'Oats', 'Base', 'green', 'Whole grain.'],
      ['Dried berries', 'Berries', 'Flavour + sugar', 'green', 'Fruit sugar with some fiber.'],
      ['Tapioca syrup', 'Tapioca syrup', 'Binder', 'amber', 'Glucose syrup — better than HFCS, still a sugar.'],
      ['Chia seeds', 'Chia seeds', 'Fiber', 'green', 'Real seeds.'],
      ['Sunflower seeds', 'Sunflower seeds', 'Protein', 'green', 'Unsaturated fat.'],
    ]),
  p('soda-sparkling-lime', '5068323456789', 'Sparkling Lime Water', 'FizzWorks', 'Drinks', '🍋',
    '330 ml can', 330, [1, 0, 0.2, 0, 0, 0, 0, 0, 0, 2, 4, 3, 0], 1,
    [], ['vegan', 'gluten-free', 'low-sugar', 'keto'], 1, [
      ['Carbonated water', 'Sparkling water', 'Base', 'green', 'Water and bubbles.'],
      ['Natural lime essence', 'Lime oil', 'Flavour', 'green', 'Pressed from real limes.'],
    ]),
  p('yogurt-skyr', '5068423456789', 'High-Protein Skyr', 'Green Valley', 'Yogurt', '🥛',
    '150 g pot', 150, [63, 11, 3.4, 3.1, 0, 0.2, 0.1, 0, 0, 42, 160, 130, 0.1], 1,
    ['milk'], ['vegetarian', 'high-protein', 'gluten-free', 'low-sugar'], 2, [
      ['Pasteurised skimmed milk', 'Milk', 'Base', 'green', 'Whole food base.'],
      ['Live cultures', 'Yogurt bacteria', 'Fermentation', 'green', 'Gut-friendly cultures.'],
    ]),
]

/** Lookup helpers — used by the mock API layer. */
export const byBarcode = (barcode: string) => PRODUCTS.find((x) => x.barcode === barcode)
export const byId = (id: string) => PRODUCTS.find((x) => x.id === id)
export const CATEGORIES = [...new Set(PRODUCTS.map((x) => x.category))].sort()
