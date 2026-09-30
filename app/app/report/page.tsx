import type { Metadata } from 'next'
import { ReportScreen } from '@/components/screens/library-screens'

export const metadata: Metadata = {
  title: 'Weekly report',
  description: 'Your seven day digest: score by day, best day, movement, sleep and what to change next week.',
}

export default function Page() {
  return <ReportScreen />
}
