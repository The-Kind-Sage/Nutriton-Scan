import type { Metadata } from 'next'
import { TodayScreen } from '@/components/screens/today-screen'

export const metadata: Metadata = {
  title: 'Today',
  description:
    "Today's calorie budget, macros, healthy habits and diary in one screen — with a streak, a week strip and one-tap logging.",
}

export default function TodayPage() {
  return <TodayScreen />
}
