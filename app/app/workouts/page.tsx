import type { Metadata } from 'next'
import { WorkoutsScreen } from '@/components/screens/library-screens'

export const metadata: Metadata = {
  title: 'Workout routines',
  description: 'Six routines from a twenty minute home circuit to a full barbell session, with calories added to your budget.',
}

export default function Page() {
  return <WorkoutsScreen />
}
