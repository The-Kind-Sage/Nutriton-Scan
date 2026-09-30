import type { Metadata } from 'next'
import { DiaryScreen } from '@/components/screens/diary-screen'

export const metadata: Metadata = {
  title: 'Food diary',
  description: 'Every meal you have logged, day by day, with scores, macros and one-tap undo.',
}

export default function HistoryPage() {
  return <DiaryScreen />
}
