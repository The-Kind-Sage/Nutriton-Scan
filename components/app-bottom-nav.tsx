'use client'

/**
 * Bottom navigation — three destinations plus a centre quick-add FAB, mirroring
 * the reference app's structure (Today / Progress / More) while keeping the
 * scan action one thumb-reach away.
 *
 * Effects: 12 (glass morph) · 14 (ripple) · 24 (sheet) · 26 (morphing indicator)
 * · 30 (nav press) · 02 (stagger into the quick-add sheet) · 34 (toast).
 *
 * Portrait-only: owns the bottom 68px + safe-area inset, every target is at
 * least 44px, and it hides on scroll-down so long screens are never cropped.
 */

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  Bookmark, Camera, ChevronRight, Droplets, NotebookPen, ScanLine, Scale,
  TrendingUp, Utensils, X, Zap,
} from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import { toast } from '@/components/toast'

const TABS = [
  { href: '/app', label: 'Today', icon: Zap },
  { href: '/app/progress', label: 'Progress', icon: TrendingUp },
  { href: '/app/more', label: 'More', icon: Bookmark },
]

const QUICK = [
  { href: '/app/scan', label: 'Scan a barcode', detail: 'Point at any packaged product', icon: ScanLine, primary: true },
  { href: '/app/scan?mode=meal', label: 'Scan a meal', detail: 'Photo analysis in one shot', icon: Camera },
  { href: '/app/water', label: 'Add water', detail: '250 ml glass', icon: Droplets },
  { href: '/app/weight', label: 'Log weight', detail: 'Today, any time', icon: Scale },
  { href: '/app/notes', label: 'Write a note', detail: 'Energy, cravings, sleep', icon: NotebookPen },
  { href: '/app/recipes', label: 'Find a recipe', detail: 'Filtered to your profile', icon: Utensils },
]

export function AppBottomNav() {
  const pathname = usePathname()
  const router = useRouter()
  const [hidden, setHidden] = useState(false)
  const [sheetOpen, setSheetOpen] = useState(false)
  const lastY = useRef(0)

  useEffect(() => {
    let raf = 0
    const onScroll = () => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        const y = window.scrollY
        if (Math.abs(y - lastY.current) > 8) {
          setHidden(y > lastY.current && y > 140)
          lastY.current = y
        }
        raf = 0
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => { window.removeEventListener('scroll', onScroll); if (raf) cancelAnimationFrame(raf) }
  }, [])

  /* Lock the page while the quick-add sheet is open. */
  useEffect(() => {
    if (!sheetOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [sheetOpen])

  const isActive = (href: string) => (href === '/app' ? pathname === href : pathname.startsWith(href))
  const left = TABS.slice(0, 2)
  const right = TABS.slice(2)

  return (
    <>
      <nav
        aria-label="Primary"
        className={cn(
          'fx-nav fixed inset-x-0 bottom-0 z-50 transition-transform duration-300 ease-[cubic-bezier(.16,1,.3,1)]',
          hidden && '-translate-y-[130%]',
        )}
      >
        <div className="mx-auto max-w-[720px] px-3 pb-[max(env(safe-area-inset-bottom),10px)] pt-2">
          <div className="fx-nav-bar relative flex items-stretch justify-around rounded-[26px]">
            {left.map((t) => (
              <Tab key={t.href} {...t} active={isActive(t.href)} />
            ))}

            {/* Centre FAB */}
            <div className="relative w-[76px] shrink-0">
              <button
                onClick={() => setSheetOpen(true)}
                aria-label="Quick add"
                aria-expanded={sheetOpen}
                className="fx-fab absolute left-1/2 top-0 grid size-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full text-white shadow-[0_10px_30px_-8px_rgba(7,132,86,.7)]"
              >
                <ScanLine className="size-6" aria-hidden />
                <span className="fx-fab__ring" aria-hidden />
              </button>
              <span className="pointer-events-none absolute inset-x-0 bottom-1.5 text-center text-[10px] font-bold text-ink-500">
                Log
              </span>
            </div>

            {right.map((t) => (
              <Tab key={t.href} {...t} active={isActive(t.href)} />
            ))}
          </div>
        </div>
      </nav>

      {/* Quick-add sheet */}
      <AnimatePresence>
        {sheetOpen && (
          <>
            <motion.button
              key="scrim"
              aria-label="Close quick add"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
              onClick={() => setSheetOpen(false)}
              className="fixed inset-0 z-[60] bg-[color-mix(in_oklab,#04150f_62%,transparent)] backdrop-blur-[3px]"
            />
            <motion.div
              key="sheet"
              role="dialog"
              aria-modal="true"
              aria-label="Quick add"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%', transition: { duration: 0.24, ease: [0.4, 0, 1, 1] } }}
              transition={{ type: 'spring', stiffness: 380, damping: 34, mass: 0.85 }}
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={{ top: 0, bottom: 0.5 }}
              onDragEnd={(_, i) => { if (i.offset.y > 110 || i.velocity.y > 620) setSheetOpen(false) }}
              className="fixed inset-x-0 bottom-0 z-[61] mx-auto max-w-[720px] rounded-t-[30px] border-t border-line bg-surface pb-[max(env(safe-area-inset-bottom),16px)]"
            >
              <div className="flex justify-center pt-3">
                <span className="h-1.5 w-11 rounded-full bg-canvas-2" aria-hidden />
              </div>
              <div className="flex items-center justify-between px-5 pt-3">
                <h2 className="text-lg font-bold tracking-[-.03em] text-ink-900">What are you logging?</h2>
                <button onClick={() => setSheetOpen(false)} aria-label="Close"
                  className="press grid size-9 place-items-center rounded-full bg-canvas-2 text-ink-500">
                  <X className="size-4" aria-hidden />
                </button>
              </div>

              <ul className="mt-3 max-h-[62vh] overflow-y-auto px-3 pb-2">
                {QUICK.map((item, i) => (
                  <motion.li
                    key={item.href}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.04 + i * 0.035, duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <button
                      onClick={() => {
                        setSheetOpen(false)
                        if (item.href.includes('?')) toast('Opening camera', 'info')
                        router.push(item.href)
                      }}
                      className="press flex w-full items-center gap-3.5 rounded-2xl p-3 text-left active:bg-canvas-2"
                    >
                      <span className={cn('grid size-11 shrink-0 place-items-center rounded-2xl',
                        item.primary ? 'bg-brand-600 text-white' : 'bg-canvas-2 text-ink-700')}>
                        <item.icon className="size-5" aria-hidden />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-bold text-ink-900">{item.label}</span>
                        <span className="block text-xs text-ink-500">{item.detail}</span>
                      </span>
                      <ChevronRight className="size-4 shrink-0 text-ink-300" aria-hidden />
                    </button>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

function Tab({
  href, label, icon: Icon, active,
}: { href: string; label: string; icon: React.ElementType; active: boolean }) {
  return (
    <Link
      href={href}
      aria-current={active ? 'page' : undefined}
      className="press relative flex flex-1 flex-col items-center justify-center gap-1 py-2.5"
    >
      <Icon className={cn('size-[22px] transition-colors', active ? 'text-brand-600' : 'text-ink-300')} aria-hidden />
      <span className={cn('text-[10px] font-bold transition-colors', active ? 'text-brand-600' : 'text-ink-500')}>
        {label}
      </span>
      {active && (
        <motion.span
          layoutId="nav-pill"
          transition={{ type: 'spring', stiffness: 420, damping: 34 }}
          className="absolute inset-x-3 inset-y-1 -z-10 rounded-2xl bg-brand-500/10"
          aria-hidden
        />
      )}
    </Link>
  )
}
