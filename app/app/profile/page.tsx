import type { Metadata } from 'next'
import { ProfileScreen } from '@/components/screens/profile-screen'

export const metadata: Metadata = {
  title: 'Your profile',
  description: 'Manage your goals, dietary restrictions, allergens, notifications and subscription.',
}

export default function ProfilePage() {
  return <ProfileScreen />
}
