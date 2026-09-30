import Link from 'next/link'
import { LogoLockup } from '@/components/brand'

const COLUMNS = [
  {
    title: 'Product',
    links: [
      { href: '/#how', label: 'How it works' },
      { href: '/#features', label: 'Features' },
      { href: '/#insights', label: 'Insights' },
      { href: '/pricing', label: 'Pricing' },
      { href: '/app', label: 'Open the app' },
    ],
  },
  {
    title: 'Who it is for',
    links: [
      { href: '/#audiences', label: 'Fitness & training' },
      { href: '/#audiences', label: 'Families' },
      { href: '/#audiences', label: 'Medical diets' },
      { href: '/#audiences', label: 'Dietitians' },
      { href: '/#audiences', label: 'Gyms & clinics' },
    ],
  },
  {
    title: 'Support',
    links: [
      { href: '/#faq', label: 'FAQ' },
      { href: 'mailto:hello@nutritionscan.app', label: 'Contact us' },
      { href: '/#insights', label: 'Nutrition science' },
      { href: '/#features', label: 'Data & privacy' },
      { href: '/#features', label: 'Accessibility' },
    ],
  },
]

export function SiteFooter() {
  return (
    <footer className="hairline-t bg-surface pt-14">
      <div className="container-ns">
        <div className="grid gap-10 pb-12 md:grid-cols-[1.3fr_repeat(3,.7fr)]">
          <div>
            <LogoLockup className="h-9 w-auto" />
            <p className="mt-4 max-w-[280px] text-sm leading-6 text-ink-500">
              Scan anything. Understand everything. Nutrition clarity for real life — built with
              registered dietitians and open about every number we publish.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Badge>4.9 ★ App Store</Badge>
              <Badge>Editor&apos;s choice 2026</Badge>
            </div>
          </div>

          {COLUMNS.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <h2 className="text-xs font-bold uppercase tracking-[.16em] text-ink-900">{col.title}</h2>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={`${col.title}-${l.label}`}>
                    <Link href={l.href} className="text-sm text-ink-500 transition-colors hover:text-brand-600">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="flex flex-col gap-4 border-t border-line py-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-ink-300">
            © {new Date().getFullYear()} Nutrition Scan. Educational information — not medical advice.
          </p>
          <div className="flex flex-wrap gap-5 text-xs text-ink-300">
            <Link href="/#features" className="transition-colors hover:text-ink-700">Privacy</Link>
            <Link href="/#features" className="transition-colors hover:text-ink-700">Terms</Link>
            <Link href="/#features" className="transition-colors hover:text-ink-700">Cookies</Link>
            <Link href="/#faq" className="transition-colors hover:text-ink-700">Allergen disclaimer</Link>
          </div>
        </div>
      </div>
      {/* Bottom breathing room so the app tab bar never covers footer links */}
      <div className="h-[var(--tabbar-h)] md:hidden" aria-hidden />
    </footer>
  )
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-line bg-canvas px-3 py-1.5 text-[11px] font-semibold text-ink-500">
      {children}
    </span>
  )
}
