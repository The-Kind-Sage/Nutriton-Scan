import type { Metadata } from 'next'
import { NotesScreen } from '@/components/screens/library-screens'

export const metadata: Metadata = {
  title: 'Notes',
  description: 'A one line a day journal with mood tags, kept alongside everything else you log.',
}

export default function Page() {
  return <NotesScreen />
}
