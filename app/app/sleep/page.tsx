import type { Metadata } from 'next'
import { SleepScreen } from '@/components/screens/metric-screens'

export const metadata: Metadata = {
  title: 'Sleep',
  description: 'Nightly duration, quality score and bedtime pattern, and how they track with your intake.',
}

export default function Page() {
  return <SleepScreen />
}
