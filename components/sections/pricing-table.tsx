'use client'

/**
 * Pricing. Effects: 26 morphing segmented toggle · 19 count-up price morph ·
 * 13 gradient border trace on the recommended tier · 32 shimmer · 38 confetti.
 */

import { useRef, useState } from 'react'
import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import { Building2, Check, Sparkles } from 'lucide-react'
import { MagneticButton, Reveal, Stagger } from '@/components/motion'
import { PLANS } from '@/lib/data/fixtures'
import { spring } from '@/lib/motion'
import { money } from '@/lib/format'

export function PricingTable() {
  const [annual, setAnnual] = useState(true)
  const reduced = useReducedMotion()
  const burstRef = useRef<HTMLDivElement>(null)

  const celebrate = () => {
    const host = burstRef.current
    if (!host || reduced) return
    const colors = ['#12b76a', '#b6f09c', '#7a5af8', '#ffb020']
    for (let i = 0; i < 28; i++) {
      const p = document.createElement('span')
      p.className = 'fx-confetti'
      p.style.left = '50%'
      p.style.top = '40%'
      p.style.background = colors[i % colors.length]
      p.style.setProperty('--dx', `${(Math.random() * 240 - 120).toFixed(0)}px`)
      p.style.setProperty('--dy', `${(Math.random() * -160 - 40).toFixed(0)}px`)
      p.style.setProperty('--rot', `${(Math.random() * 720).toFixed(0)}deg`)
      host.appendChild(p)
      p.addEventListener('animationend', () => p.remove())
    }
  }

  return (
    <section ref={burstRef} className="noise relative overflow-hidden py-16 sm:py-24">
      <div className="fx-aurora fx-aurora--calm opacity-60" aria-hidden />
      <div className="container-ns relative z-10">
        <Reveal className="mx-auto max-w-[620px] text-center">
          <p className="mb-4 text-xs font-bold uppercase tracking-[.2em] text-brand-600">Pricing</p>
          <h1 className="text-[clamp(2.2rem,7vw,3.8rem)] font-bold tracking-[-.06em]">
            Start free. <span className="text-brand-600">Upgrade when it earns it.</span>
          </h1>
          <p className="mt-5 text-base leading-7 text-ink-500">
            Twenty scans a month costs nothing, forever. No card, no countdown, no dark patterns —
            cancel in two taps if Plus ever stops being useful.
          </p>
        </Reveal>

        {/* Billing toggle */}
        <Reveal delay={80} className="mt-9 flex justify-center">
          <div className="fx-seg" role="group" aria-label="Billing period">
            {(['monthly', 'annual'] as const).map((period) => {
              const isActive = (period === 'annual') === annual
              return (
                <button
                  key={period}
                  onClick={() => setAnnual(period === 'annual')}
                  aria-pressed={isActive}
                  className={`fx-seg__item press relative z-10 min-h-11 rounded-full px-5 text-sm font-bold capitalize transition-colors ${
                    isActive ? 'text-ink-900' : 'text-ink-500'
                  }`}
                >
                  {period}
                  {period === 'annual' && (
                    <span className="ml-2 rounded-full bg-mango/25 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-citrus-text">
                      Save 33%
                    </span>
                  )}
                  {isActive && (
                    <motion.span
                      layoutId="billing-pill"
                      transition={spring.layout}
                      className="absolute inset-0 -z-10 rounded-full bg-surface shadow-soft"
                    />
                  )}
                </button>
              )
            })}
          </div>
        </Reveal>

        {/* Plans */}
        <Stagger className="mt-10 grid gap-4 lg:grid-cols-3">
          {PLANS.map((plan) => {
            const price = annual ? plan.annual / 12 : plan.monthly
            const showMonthlyEquivalent = annual && plan.annual > 0
            return (
              <div key={plan.id} className={plan.recommended ? 'lg:-mt-4' : ''}>
                <div
                  className={`fx-trace relative flex h-full flex-col rounded-[30px] border p-6 sm:p-7 ${
                    plan.recommended
                      ? 'border-transparent bg-surface shadow-float'
                      : 'border-line bg-surface/70'
                  }`}
                  data-active={plan.recommended}
                >
                  {plan.recommended && (
                    <span className="absolute -top-3 left-6 rounded-full bg-brand-600 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white">
                      Most popular
                    </span>
                  )}

                  <h2 className="text-lg font-bold text-ink-900">{plan.name}</h2>
                  <p className="mt-1.5 min-h-[40px] text-sm leading-6 text-ink-500">{plan.tagline}</p>

                  <div className="mt-5 flex items-baseline gap-1.5">
                    <motion.span
                      key={`${plan.id}-${annual}`}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={spring.pop}
                      className="tabular text-[clamp(2.2rem,8vw,3rem)] font-bold tracking-[-.06em] text-ink-900"
                    >
                      {plan.monthly === 0 ? 'Free' : money(Number(price.toFixed(2)))}
                    </motion.span>
                    {plan.monthly > 0 && <span className="text-sm font-medium text-ink-300">/month</span>}
                  </div>
                  <p className="mt-1 h-5 text-xs text-ink-300">
                    {showMonthlyEquivalent ? `Billed ${money(plan.annual)} yearly · save ${money(plan.monthly * 12 - plan.annual)}` : plan.monthly > 0 ? 'Billed monthly · cancel anytime' : 'No card required'}
                  </p>

                  <MagneticButton
                    onClick={celebrate}
                    className={`mt-6 w-full rounded-full px-5 py-3.5 text-sm font-bold ${
                      plan.recommended ? 'bg-brand-600 text-white shadow-glow' : 'border border-line bg-canvas text-ink-900'
                    }`}
                  >
                    {plan.monthly === 0 ? 'Start scanning free' : `Choose ${plan.name}`}
                  </MagneticButton>

                  <ul className="mt-6 space-y-2.5">
                    {plan.features.map((feature, i) => (
                      <motion.li
                        key={feature}
                        initial={{ opacity: 0, x: -8 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.04, duration: 0.4 }}
                        className="flex items-start gap-2.5 text-sm leading-6 text-ink-700"
                      >
                        <Check className="mt-1 size-4 shrink-0 text-brand-600" aria-hidden />
                        {feature}
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </div>
            )
          })}
        </Stagger>

        {/* Enterprise strip */}
        <Reveal delay={120} className="mt-6">
          <div className="flex flex-col items-start gap-5 rounded-[30px] bg-brand-900 p-6 text-white sm:flex-row sm:items-center sm:justify-between sm:p-8">
            <div className="flex items-start gap-4">
              <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-white/10 text-lime-accent">
                <Building2 className="size-5" aria-hidden />
              </span>
              <div>
                <h2 className="text-lg font-bold">Clinics, gyms & wellness centres</h2>
                <p className="mt-1 max-w-[520px] text-sm leading-6 text-[#a9c2b5]">
                  Unlimited seats, branded dashboards, member challenges and a dedicated onboarding
                  session. Volume pricing from ten seats.
                </p>
              </div>
            </div>
            <Link href="mailto:teams@nutritionscan.app" className="press shrink-0 rounded-full bg-lime-accent px-5 py-3.5 text-sm font-bold text-brand-900">
              Talk to us
            </Link>
          </div>
        </Reveal>

        <Reveal delay={160} className="mt-8 flex items-center justify-center gap-2 text-xs text-ink-500">
          <Sparkles className="size-4 text-berry" aria-hidden />
          Student and healthcare-worker discounts available — email us from your work address.
        </Reveal>
      </div>
    </section>
  )
}
