'use client'

/** Effect 27 — circular theme wipe using the View Transitions API. */

import { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'

export const themeInitScript = `(function(){try{var t=localStorage.getItem('ns-theme');var d=t?t==='dark':matchMedia('(prefers-color-scheme: dark)').matches;document.documentElement.classList.toggle('dark',d);}catch(e){}})();`

export function ThemeToggle({ className }: { className?: string }) {
  const [dark, setDark] = useState(false)

  useEffect(() => {
    setDark(document.documentElement.classList.contains('dark'))
  }, [])

  const toggle = (event: React.MouseEvent<HTMLButtonElement>) => {
    const next = !dark
    const apply = () => {
      document.documentElement.classList.toggle('dark', next)
      try { localStorage.setItem('ns-theme', next ? 'dark' : 'light') } catch { /* ignore */ }
      setDark(next)
    }
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const doc = document as Document & { startViewTransition?: (cb: () => void) => { ready: Promise<void> } }

    if (!doc.startViewTransition || reduced) { apply(); return }

    const rect = event.currentTarget.getBoundingClientRect()
    const x = rect.left + rect.width / 2
    const y = rect.top + rect.height / 2
    const transition = doc.startViewTransition(apply)
    transition.ready.then(() => {
      document.documentElement.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(150% at ${x}px ${y}px)`] },
        { duration: 620, easing: 'cubic-bezier(0.16,1,0.3,1)', pseudoElement: '::view-transition-new(root)' },
      )
    }).catch(() => { /* transition unsupported — theme already applied */ })
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'}
      aria-pressed={dark}
      className={`press grid size-10 place-items-center rounded-full border border-line bg-surface text-ink-500 transition hover:text-ink-900 ${className ?? ''}`}
    >
      {dark ? <Sun className="size-4" aria-hidden /> : <Moon className="size-4" aria-hidden />}
    </button>
  )
}
