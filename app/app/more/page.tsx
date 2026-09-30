import type { Metadata } from 'next'
import { MoreScreen } from '@/components/screens/more-screen'

export const metadata: Metadata = {
  title: 'More',
  description: 'Intermittent fasting, sleep, glucose, recipe discovery, workout routines, goals, nutrition and your weekly report.',
}

export default function Page() {
  return <MoreScreen />
}
