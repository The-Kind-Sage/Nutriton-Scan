import { redirect } from 'next/navigation'

/** Water has no dedicated screen — it lives on Today. Redirect so the quick-add
 *  sheet and any shared link still land somewhere useful. */
export default function WaterPage() {
  redirect('/app?log=water')
}
