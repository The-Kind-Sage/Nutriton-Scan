import type { Metadata } from 'next'
import { DevicesScreen } from '@/components/screens/library-screens'

export const metadata: Metadata = {
  title: 'Apps & devices',
  description: 'Connect Apple Watch, Withings, Dexcom or Google Fit so steps, weight and glucose sync automatically.',
}

export default function Page() {
  return <DevicesScreen />
}
