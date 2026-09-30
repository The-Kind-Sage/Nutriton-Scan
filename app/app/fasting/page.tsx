import type { Metadata } from 'next'
import { FastingScreen } from '@/components/screens/metric-screens'

export const metadata: Metadata = {
  title: 'Intermittent fasting',
  description: 'Run a 14:10, 16:8, 18:6 or 20:4 fasting window with a live timer and fourteen day history.',
}

export default function Page() {
  return <FastingScreen />
}
