/**
 * Visual verification harness — a dev tool, deliberately not a dependency.
 * Install it only when you want it:  npm i -D playwright && npx playwright install chromium
 * Scrolls each route so the in-view reveal
 * observers fire, then captures a viewport shot (what the phone sees) plus a
 * full-page shot, and reports every console error and failed request.
 *
 *   PORT=3000 node tools/visual-check.mjs /app /app/progress /outdir
 */
import { chromium } from 'playwright'
import { mkdirSync } from 'node:fs'

const routes = process.argv.slice(2, -1)
const out = process.argv[process.argv.length - 1]
mkdirSync(out, { recursive: true })

const PORT = process.env.PORT ?? '3000'
const BASE = process.env.BASE ?? `http://127.0.0.1:${PORT}`
const browser = await chromium.launch({ args: ['--no-sandbox'] })
const page = await browser.newPage({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 2,
  isMobile: true,
  hasTouch: true,
})

const problems = []
page.on('pageerror', (e) => problems.push(`[${page.url()}] pageerror: ${e.message}`))
page.on('console', (m) => {
  if (m.type() === 'error') problems.push(`[${page.url()}] console: ${m.text().slice(0, 200)}`)
})
page.on('requestfailed', (r) => problems.push(`[${page.url()}] failed: ${r.url()}`))

for (const r of routes) {
  await page.goto(BASE + r, { waitUntil: 'networkidle' })
  // Walk down the page so every whileInView reveal has fired.
  // Walk down the page so every whileInView reveal has fired. Re-read the
  // scroll height each step: it grows as sections reveal, and stopping short
  // leaves the lower half of the page at opacity 0 in the capture.
  await page.evaluate(async () => {
    const step = Math.round(window.innerHeight * 0.6)
    let y = 0
    while (y < document.body.scrollHeight) {
      window.scrollTo(0, y)
      await new Promise((res) => setTimeout(res, 220))
      y += step
    }
    window.scrollTo(0, document.body.scrollHeight)
    await new Promise((res) => setTimeout(res, 400))
    window.scrollTo(0, 0)
  })
  await page.waitForTimeout(1000)

  const slug = r === '/' ? 'home' : r.replace(/^\/|\/$/g, '').replace(/[\/?=]/g, '-')
  await page.screenshot({ path: `${out}/${slug}.png` })
  await page.screenshot({ path: `${out}/${slug}--full.png`, fullPage: true })

  const h = await page.evaluate(() => document.body.scrollHeight)
  console.log(`shot ${r}  (${h}px tall)`)
}

await browser.close()

if (problems.length) {
  console.log('\n--- PROBLEMS ---')
  for (const p of [...new Set(problems)]) console.log(p)
} else {
  console.log('\nno console errors, no failed requests')
}
