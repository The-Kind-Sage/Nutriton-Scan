import { redirect } from 'next/navigation'

/** Insights and Progress are the same job. One canonical surface, so no data
 *  can ever disagree with itself. Old links keep working. */
export default function InsightsPage() {
  redirect('/app/progress')
}
