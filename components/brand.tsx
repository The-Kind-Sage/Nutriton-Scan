import Link from 'next/link'
import { Leaf } from 'lucide-react'

/**
 * Brand mark. The lens of the magnifier is drawn as a scan reticle so the logo
 * itself tells the product story. Rendered inline (no image request) and it
 * works at 24px and 240px.
 */
export function LogoMark({ compact = false, invert = false }: { compact?: boolean; invert?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-2.5" aria-label="Nutrition Scan — home">
      <span className="relative grid size-9 shrink-0 place-items-center rounded-[13px] bg-brand-900 text-lime-accent shadow-[0_5px_18px_rgba(5,46,31,.22)]">
        <Leaf className="size-5 -rotate-12" strokeWidth={2.4} aria-hidden />
        <span aria-hidden className="absolute bottom-1.5 left-2.5 h-2.5 w-px rotate-45 bg-lime-accent" />
        <span aria-hidden className="absolute right-1.5 top-1.5 size-1 rounded-full bg-lime-accent/70" />
      </span>
      {!compact && (
        <span className={`text-[17px] font-semibold tracking-[-.04em] ${invert ? 'text-white' : 'text-ink-900'}`}>
          Nutrition<span className="font-bold text-brand-600">Scan</span>
        </span>
      )}
    </Link>
  )
}

/** Inline SVG logo used in the footer and the OG/print contexts. */
export function LogoLockup({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 190 40" className={className} role="img" aria-label="Nutrition Scan">
      <circle cx="22" cy="19" r="12.5" fill="none" stroke="var(--brand-600)" strokeWidth="2.2" />
      <path d="M31 28.5 L39 36.5" stroke="var(--brand-600)" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M16.5 19 h11 M18.5 15.5 h7 M18.5 22.5 h7" stroke="var(--brand-300)" strokeWidth="1.4" strokeLinecap="round" />
      <text x="50" y="26" fontFamily="var(--font-display)" fontSize="17" fontWeight="600" letterSpacing="-0.04em" fill="var(--ink-900)">
        Nutrition
      </text>
      <text x="127" y="26" fontFamily="var(--font-display)" fontSize="17" fontWeight="700" letterSpacing="-0.04em" fill="var(--brand-600)">
        Scan
      </text>
    </svg>
  )
}
