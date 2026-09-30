import type { Metadata } from 'next'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { ScrollProgressBar } from '@/components/motion'
import { PricingTable } from '@/components/sections/pricing-table'
import { Faq } from '@/components/sections/proof'

export const metadata: Metadata = {
  title: 'Pricing',
  description:
    'Free forever for twenty scans a month. Plus for personalised scoring and unlimited scans. Pro for dietitians, coaches and clinics.',
  alternates: { canonical: '/pricing' },
}

export default function PricingPage() {
  return (
    <>
      <ScrollProgressBar />
      <SiteHeader />
      <main id="main" className="pt-24">
        <PricingTable />
        <Faq />
      </main>
      <SiteFooter />
    </>
  )
}
