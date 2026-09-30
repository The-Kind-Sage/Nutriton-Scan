/**
 * Route QA — drives every app route in a headless browser and reports hydration
 * errors, console errors, page errors and 5xx responses.
 *
 * A dev tool, not a dependency:
 *   npm i -D playwright && npx playwright install chromium
 *   npm run build && npx next start -p 3000 &
 *   PORT=3000 node tools/qa.mjs
 *
 * Pass explicit routes to check a subset:  PORT=3000 node tools/qa.mjs /app /app/more
 */
import { chromium } from 'playwright'

const PORT = process.env.PORT ?? '3000'
const DEFAULT_ROUTES = [
  '/', '/pricing',
  '/app', '/app/progress', '/app/more',
  '/app/weight', '/app/fasting', '/app/sleep', '/app/glucose',
  '/app/recipes', '/app/workouts', '/app/goals', '/app/nutrition',
  '/app/report', '/app/notes', '/app/devices', '/app/exercise',
  '/app/history', '/app/profile', '/app/scan',
]
const routes = process.argv.slice(2).length ? process.argv.slice(2) : DEFAULT_ROUTES

/* Vercel analytics only resolves on a Vercel deployment — not a real failure. */
const IGNORE = /_vercel\/insights|favicon/

const browser = await chromium.launch({ args: ['--no-sandbox'] })
let bad = 0

for (const r of routes) {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } })
  const errs = []
  page.on('pageerror', (e) => errs.push('pageerror: ' + e.message.split('\n')[0].slice(0, 110)))
  page.on('console', (m) => {
    const t = m.text()
    /* Chromium emits a generic "Failed to load resource" line for any 404 and
       the text carries no URL, so it cannot be filtered by URL here. Failures
       are caught by the response/requestfailed handlers below with the URL
       intact; ignore the bare message to avoid double-reporting. */
    if (/Failed to load resource/.test(t)) return
    if (m.type() === 'error' && !IGNORE.test(t)) errs.push('console: ' + t.slice(0, 110))
  })
  page.on('requestfailed', (r) => { if (!IGNORE.test(r.url())) errs.push(`requestfailed ${r.url().slice(0, 60)}`) })
  page.on('response', (res) => { if (res.status() >= 500 && !IGNORE.test(res.url())) errs.push(`${res.status()} ${res.url().slice(0, 60)}`) })

  await page.goto(`http://127.0.0.1:${PORT}${r}`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(700)

  if (errs.length) { bad++; console.log(`${r.padEnd(18)} FAIL  ${errs[0]}`) }
  else console.log(`${r.padEnd(18)} ok`)
  await page.close()
}

await browser.close()
console.log(bad ? `\n${bad} route(s) with problems` : '\nall routes clean')
process.exit(bad ? 1 : 0)
