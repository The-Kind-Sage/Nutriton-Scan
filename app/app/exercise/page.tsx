import type { Metadata } from 'next'
import { ExerciseScreen } from '@/components/screens/library-screens'

export const metadata: Metadata = {
  title: 'Exercise',
  description: 'Sessions logged manually and from your watch, with calories burned fed back into your daily budget.',
}

export default function Page() {
  return <ExerciseScreen />
}
