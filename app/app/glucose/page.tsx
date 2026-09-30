import type { Metadata } from 'next'
import { GlucoseScreen } from '@/components/screens/metric-screens'

export const metadata: Metadata = {
  title: 'Glucose',
  description: 'Log fasting and post-meal glucose readings against a target range, with context and history.',
}

export default function Page() {
  return <GlucoseScreen />
}
