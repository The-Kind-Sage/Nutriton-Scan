'use client'

/** Marketing header — Effect 12 (shrink + glass morph), 15 (underline), 02 (drawer stagger). */

import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { LogoMark } from '@/components/brand'
import { ThemeToggle } from '@/components/theme-toggle'
import { useScrolled } from '@/hooks'
import { spring } from '@/lib/motion'

const links = [
  { href: '/#how', label: 'How it works' },
  { href: '/#features', label: 'Features' },
  { href: '/#insights', label: 'Insights' },
  { href: '/pricing', label: 'Pricing' },
]

export function SiteHeader() {
  const scrolled = useScrolled(40)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <header className={`fx-header fixed inset-x-0 top-0 z-40 ${scrolled ? 'is-scrolled' : ''}`}>
      <div className={`container-ns flex items-center justify-between transition-[height] duration-300 ease-expo ${scrolled ? 'h-[58px]' : 'h-[72px]'}`}>
        <LogoMark />

        <nav className="hidden items-center gap-8 text-sm font-semibold text-ink-500 md:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="u-underline transition-colors hover:text-ink-900">
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link
            href="/app"
            className="press hidden rounded-full bg-brand-900 px-4 py-2.5 text-xs font-bold text-white transition-transform duration-300 ease-back hover:-translate-y-0.5 sm:block"
          >
            Open the app
          </Link>
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            className="press grid size-10 place-items-center rounded-full border border-line bg-surface text-ink-900 md:hidden"
          >
            {open ? <X className="size-4" aria-hidden /> : <Menu className="size-4" aria-hidden />}
          </button>
        </div>
      </div>

      {/* Full-screen drawer with staggered link reveal */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={spring.soft}
            className="glass border-t border-line md:hidden"
          >
            <nav className="container-ns flex flex-col gap-1 py-5">
              {links.map((l, i) => (
                <motion.div
                  key={l.href}
                  initial={{ opacity: 0, x: 18 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ ...spring.pop, delay: 0.04 + i * 0.05 }}
                >
                  <Link
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-2xl px-4 py-3.5 text-lg font-semibold text-ink-900 transition-colors hover:bg-brand-50"
                  >
                    {l.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ ...spring.pop, delay: 0.28 }}>
                <Link href="/app" onClick={() => setOpen(false)}
                  className="press mt-2 block rounded-2xl bg-brand-600 px-4 py-4 text-center text-base font-bold text-white">
                  Open the app
                </Link>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
