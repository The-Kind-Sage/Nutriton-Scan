import type { Metadata } from 'next'
import { NutritionScreen } from '@/components/screens/library-screens'

export const metadata: Metadata = {
  title: 'Nutrition',
  description: 'Your daily calorie, macro, fiber and water targets, with a macro split preset and a per-meal distribution.',
}

export default function NutritionPage() {
  return <NutritionScreen />
}
