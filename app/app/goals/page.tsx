import type { Metadata } from 'next'
import { GoalsScreen } from '@/components/screens/library-screens'

export const metadata: Metadata = {
  title: 'Goals',
  description: 'Every target in one place: weight, calories, macros, water, steps and fasting frequency.',
}

export default function Page() {
  return <GoalsScreen />
}
