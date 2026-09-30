import type { Metadata } from 'next'
import { WeightScreen } from '@/components/screens/metric-screens'

export const metadata: Metadata = {
  title: 'Weight',
  description: 'Log and trend your weight against your target, with a rolling average and full history.',
}

export default function Page() {
  return <WeightScreen />
}
