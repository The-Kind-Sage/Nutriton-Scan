'use client'

import Link from 'next/link'
import { ChevronLeft, Search, Settings } from 'lucide-react'
import type { ReactNode } from 'react'
import { LogoMark } from '@/components/brand'
import { AppBottomNav } from '@/components/app-bottom-nav'
import { ThemeToggle } from '@/components/theme-toggle'
import { Toaster } from '@/components/toast'
import { useLowPower, useScrolled } from '@/hooks'

/**
 * Shared chrome for every /app screen: a compact glass header with an optional
 * back affordance, the bottom tab bar, and the toast host.
 *
 * Portrait-only: content is padded by the tab bar height plus the safe-area
 * inset so nothing is ever trapped behind the bar.
 */
export function AppShell({
  children,
  title,
  back,
  actions,
}: {
  children: ReactNode
  title?: string
  back?: { href: string; label: string }
  actions?: ReactNode
}) {
  useLowPower()
  const scrolled = useScrolled(20)

  return (
    <div className="min-h-[100dvh] bg-canvas">
      <header className={`fx-header fx-header--app sticky inset-x-0 top-0 z-40 ${scrolled ? 'is-scrolled' : ''}`}>
        <div className="container-ns flex h-[60px] items-center justify-between gap-3">
          {back ? (
            <div className="flex min-w-0 items-center gap-2">
              <Link
                href={back.href}
                aria-label={`Back to ${back.label}`}
                className="press grid size-9 shrink-0 place-items-center rounded-full border border-line bg-surface text-ink-700"
              >
                <ChevronLeft className="size-4" aria-hidden />
              </Link>
              <span className="truncate text-sm font-bold text-ink-900">{title ?? back.label}</span>
            </div>
          ) : (
            <LogoMark />
          )}

          <div className="flex shrink-0 items-center gap-2">
            {actions}
            {!back && (
              <>
                <Link href="/app/scan" aria-label="Search products"
                  className="press grid size-10 place-items-center rounded-full border border-line bg-surface text-ink-500">
                  <Search className="size-4" aria-hidden />
                </Link>
                <Link href="/app/profile" aria-label="Settings"
                  className="press hidden size-10 place-items-center rounded-full border border-line bg-surface text-ink-500 sm:grid">
                  <Settings className="size-4" aria-hidden />
                </Link>
              </>
            )}
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main id="main" className="pb-[calc(var(--tabbar-h)+2rem)] md:pb-16">
        {children}
      </main>

      <AppBottomNav />
      <Toaster />
    </div>
  )
}
