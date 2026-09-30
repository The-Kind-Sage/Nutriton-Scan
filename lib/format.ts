/** Formatting helpers. Kept separate so numerals stay consistent everywhere. */

export const nf = (n: number, decimals = 0) =>
  new Intl.NumberFormat('en-GB', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(n)

export const grams = (n: number) => `${nf(n, n < 10 ? 1 : 0)}g`
export const mg = (n: number) => `${nf(n)}mg`
export const kcal = (n: number) => `${nf(n)} kcal`

export const percent = (value: number, target: number) =>
  Math.min(100, Math.round((value / Math.max(target, 1)) * 100))

/* Dates are formatted from static tables rather than Intl. Node and the browser
   ship different ICU data, so `toLocaleDateString('en-GB', …)` renders
   "Thu 1 Oct" on the server and "Thu, 1 Oct" in Chromium — which is a hydration
   mismatch on every screen that shows a day. Hand-rolled formatting is
   identical on both sides, and cheaper. */
const WEEKDAY_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const
const WEEKDAY_LONG = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] as const
const MONTH_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] as const
const MONTH_LONG = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'] as const

const parts = (iso: string) => new Date(`${iso}T12:00:00Z`) // noon UTC: never crosses a date boundary

export function shortDay(iso: string) {
  const d = parts(iso)
  return `${WEEKDAY_SHORT[d.getUTCDay()]} ${d.getUTCDate()} ${MONTH_SHORT[d.getUTCMonth()]}`
}

export function longDay(iso: string) {
  const d = parts(iso)
  return `${WEEKDAY_LONG[d.getUTCDay()]} ${d.getUTCDate()} ${MONTH_LONG[d.getUTCMonth()]}`
}

export function relativeDay(iso: string, today: string) {
  if (iso === today) return 'Today'
  const t = new Date(`${today}T12:00:00Z`).getTime()
  const d = new Date(`${iso}T12:00:00Z`).getTime()
  const diff = Math.round((t - d) / 86_400_000)
  if (diff === 1) return 'Yesterday'
  if (diff < 7) return `${diff} days ago`
  return shortDay(iso)
}

/** Money that never renders a trailing .00 for whole numbers. */
export const money = (n: number) => (n % 1 === 0 ? `$${n}` : `$${n.toFixed(2)}`)

/** 24-hour clock, locale independent, safe for server and client. */
export function clock(date: Date) {
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}
