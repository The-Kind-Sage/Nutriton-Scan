import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Inter, Sora } from 'next/font/google'
import { RotateGuard } from '@/components/rotate-guard'
import { themeInitScript } from '@/components/theme-toggle'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' })
const sora = Sora({ subsets: ['latin'], variable: '--font-sora', display: 'swap', weight: ['400', '600', '700'] })

const SITE = 'https://nutritionscan.app'

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: {
    default: 'Nutrition Scan — Scan it. Know it. Eat better.',
    template: '%s · Nutrition Scan',
  },
  description:
    'Point your camera at any barcode or meal and get an instant nutrition score, a plain-English ingredient breakdown, and healthier swaps personalised to your body and goals.',
  applicationName: 'Nutrition Scan',
  keywords: ['nutrition scanner', 'barcode nutrition', 'AI food analysis', 'nutrition score', 'healthy food swaps', 'diet tracking'],
  authors: [{ name: 'Nutrition Scan' }],
  openGraph: {
    type: 'website',
    siteName: 'Nutrition Scan',
    title: 'Nutrition Scan — Scan it. Know it. Eat better.',
    description: 'AI-powered barcode and photo scanning, instant nutrition scores, and healthier swaps tuned to your body.',
    url: SITE,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nutrition Scan — Scan it. Know it. Eat better.',
    description: 'Know exactly what you are eating in two seconds.',
  },
  robots: { index: true, follow: true },
  icons: {
    icon: [
      { url: '/icon-light-32x32.png', media: '(prefers-color-scheme: light)' },
      { url: '/icon-dark-32x32.png', media: '(prefers-color-scheme: dark)' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  // NOTE 1: maximumScale/userScalable are intentionally NOT locked — disabling
  // pinch-zoom breaks WCAG 1.4.4. Zoom is a requirement; portrait is the design.
  // NOTE 2: Next 16 dropped `orientation` from the Viewport type (the old value
  // was silently dead and hidden by ignoreBuildErrors). Portrait-only is now
  // enforced properly: `viewportFit: cover` + safe-area insets, the CSS media
  // queries in globals.css §7, and the RotateGuard overlay.
  viewportFit: 'cover',
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f6faf8' },
    { media: '(prefers-color-scheme: dark)', color: '#06110e' },
  ],
}

const orgSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Nutrition Scan',
  url: SITE,
  description: 'AI-powered nutrition analysis: barcode and image scanning, instant nutrition scores, ingredient analysis and personalised recommendations.',
  sameAs: [],
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${sora.variable}`} suppressHydrationWarning>
      <head>
        {/* Applies the saved theme before paint so there is no flash of the wrong mode. */}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }} />
      </head>
      <body className="antialiased">
        {/* Visible on focus only — keyboard users get a fast path past the nav. */}
        <a
          href="#main"
          className="fixed left-4 top-4 z-[200] -translate-y-28 rounded-xl border border-line bg-surface px-4 py-3 text-sm font-bold text-ink-900 shadow-lg transition-transform duration-300 ease-expo focus:translate-y-0"
        >
          Skip to content
        </a>
        <RotateGuard />
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
