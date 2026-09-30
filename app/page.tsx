import type { Metadata } from 'next'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { ScrollProgressBar } from '@/components/motion'
import { Hero } from '@/components/sections/hero'
import { FeatureBento, HowItWorks, LiveScanner } from '@/components/sections/product-story'
import { ComparisonSlider, Faq, FinalCta, IntegrationsMarquee, ScoreExplainer, Testimonials } from '@/components/sections/proof'
import { AudienceTabs } from '@/components/sections/audiences'

export const metadata: Metadata = {
  title: 'Nutrition Scan — Scan it. Know it. Eat better.',
  description:
    'Point your camera at any barcode, label or meal. Instant nutrition score, plain-English ingredient analysis, and healthier swaps personalised to your body and goals.',
  alternates: { canonical: '/' },
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How is the nutrition score calculated?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Every product starts at 100. We subtract for added sugar, sodium, saturated fat, ultra-processing and flagged additives, and add back for fiber, protein and micronutrients. The full weighting is shown on every result screen.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does the score change for different people?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Conditions such as diabetes or hypertension re-weight the penalties, and products containing one of your allergens are not scored at all — you get a clear warning and safer alternatives instead.',
      },
    },
  ],
}

export default function Page() {
  return (
    <>
      <ScrollProgressBar />
      <SiteHeader />
      <main id="main">
        <Hero />
        <HowItWorks />
        <FeatureBento />
        <LiveScanner />
        <ScoreExplainer />
        <ComparisonSlider />
        <AudienceTabs />
        <Testimonials />
        <IntegrationsMarquee />
        <Faq />
        <FinalCta />
      </main>
      <SiteFooter />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
    </>
  )
}
