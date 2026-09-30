import type { Metadata } from 'next'
import { ProgressScreen } from '@/components/screens/progress-screen'

export const metadata: Metadata = {
  title: 'Progress',
  description: 'Seven and twenty-eight day trends: weight, calorie balance, nutrient totals and macro split, with goals and a weekly digest.',
}

export default function Page() {
  return <ProgressScreen />
}
