import type { Metadata } from 'next'
import { RecipesScreen } from '@/components/screens/library-screens'

export const metadata: Metadata = {
  title: 'Recipes',
  description: 'Twelve scored recipes filtered to your diet and allergens, with ingredients, method and macros.',
}

export default function Page() {
  return <RecipesScreen />
}
