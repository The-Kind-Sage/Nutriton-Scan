'use client'

/**
 * Portrait-only policy (brief Section 5.0).
 *
 * Landscape phone is not a supported layout. Rather than relying on
 * `screen.orientation.lock()` — which throws on iOS Safari and silently no-ops
 * elsewhere — we gate on a CSS media query and offer this overlay. It is
 * dismissible once per session so it can never trap anyone, and the app
 * underneath stays degraded-but-not-broken if they keep going.
 */

import { useEffect, useState } from 'react'

export function RotateGuard() {
  const [dismissed, setDismissed] = useState(true) // assume dismissed until we check, avoids a flash

  useEffect(() => {
    const key = 'ns-rotate-dismissed'
    if (sessionStorage.getItem(key) !== '1') setDismissed(false)
  }, [])

  const dismiss = () => {
    sessionStorage.setItem('ns-rotate-dismissed', '1')
    setDismissed(true)
  }

  return (
    <div className="ns-rotate-guard" role="dialog" aria-modal="true" aria-labelledby="rotate-title" hidden={dismissed}>
      <div className="fx-aurora fx-aurora--calm" aria-hidden />
      <div className="relative z-10">
        <svg className="ns-rotate-guard__phone mx-auto mb-2 text-brand-600" width="72" height="72" viewBox="0 0 24 24"
          fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
          <rect x="6" y="2" width="12" height="20" rx="3" />
          <circle cx="12" cy="18.4" r="0.9" fill="currentColor" stroke="none" />
        </svg>
        <h2 id="rotate-title" className="text-xl font-bold tracking-[-.03em] text-ink-900">Built for portrait</h2>
        <p className="mx-auto mt-2 max-w-[34ch] text-sm leading-6 text-ink-500">
          Nutrition Scan is designed for upright screens. Turn your phone back to continue scanning.
        </p>
        <button onClick={dismiss} className="press mt-5 rounded-full bg-brand-600 px-5 py-3 text-sm font-bold text-white">
          Continue anyway
        </button>
      </div>
    </div>
  )
}
