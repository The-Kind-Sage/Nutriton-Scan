'use client'

/**
 * Shared UI kit for the health screens. Everything here is animated by default
 * and honours reduced motion, so a new screen gets the premium feel for free
 * rather than re-implementing it.
 */

import { useEffect, useRef, useState, type ReactNode } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronRight, Plus, Sparkles, type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { spring } from '@/lib/motion'

/* ── Section header ──────────────────────────────────────────────────── */
export function SectionHeader({
  eyebrow, title, action, className,
}: { eyebrow?: string; title: string; action?: { href: string; label: string }; className?: string }) {
  return (
    <div className={cn('flex items-end justify-between gap-4', className)}>
      <div className="min-w-0">
        {eyebrow && <p className="text-[11px] font-bold uppercase tracking-[.2em] text-brand-600">{eyebrow}</p>}
        <h2 className={cn('font-bold tracking-[-.045em] text-ink-900', eyebrow ? 'mt-1.5 text-xl' : 'text-xl')}>{title}</h2>
      </div>
      {action && (
        <Link href={action.href} className="press inline-flex shrink-0 items-center gap-1 text-sm font-bold text-brand-600">
          {action.label} <ChevronRight className="size-4" aria-hidden />
        </Link>
      )}
    </div>
  )
}

/* ── Card ────────────────────────────────────────────────────────────── */
export function Card({
  children, className, as = 'div', href, interactive,
}: { children: ReactNode; className?: string; as?: 'div' | 'section' | 'article'; href?: string; interactive?: boolean }) {
  const base = cn(
    'rounded-[26px] border border-line bg-surface',
    interactive && 'press transition-transform duration-300 ease-expo hover:-translate-y-0.5 hover:shadow-soft',
    className,
  )
  if (href) return <Link href={href} className={cn(base, 'block')}>{children}</Link>
  const Tag = as
  return <Tag className={base}>{children}</Tag>
}

/* ── Metric tile ─────────────────────────────────────────────────────── */
export function StatTile({
  label, value, unit, hint, tone = 'text-ink-900', progress, icon: Icon, href,
}: {
  label: string; value: ReactNode; unit?: string; hint?: string
  tone?: string; progress?: number; icon?: LucideIcon; href?: string
}) {
  const inner = (
    <div className="h-full rounded-2xl border border-line bg-surface p-4">
      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] font-medium text-ink-500">{label}</span>
        {Icon && <Icon className="size-4 shrink-0 text-ink-300" aria-hidden />}
      </div>
      <p className={cn('tabular mt-1.5 text-xl font-bold tracking-[-.03em]', tone)}>
        {value}
        {unit && <span className="ml-1 text-xs font-semibold text-ink-300">{unit}</span>}
      </p>
      {hint && <p className="mt-0.5 text-[11px] text-ink-300">{hint}</p>}
      {typeof progress === 'number' && (
        <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-canvas-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(100, progress)}%` }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="h-full rounded-full bg-brand-500"
          />
        </div>
      )}
    </div>
  )
  return href ? <Link href={href} className="press block h-full">{inner}</Link> : inner
}

/* ── Toggle-able segmented control (Effect 26) ───────────────────────── */
export function Segmented<T extends string>({
  options, value, onChange, label, size = 'md',
}: {
  options: { id: T; label: string; badge?: string }[]
  value: T
  onChange: (v: T) => void
  label: string
  size?: 'sm' | 'md'
}) {
  return (
    <div className="fx-seg" role="tablist" aria-label={label}>
      {options.map((opt) => {
        const active = opt.id === value
        return (
          <button
            key={opt.id}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(opt.id)}
            className={cn(
              'fx-seg__item press relative z-10 flex items-center justify-center gap-1.5 whitespace-nowrap rounded-full font-bold transition-colors',
              size === 'sm' ? 'min-h-9 px-3 text-[11px]' : 'min-h-10 px-4 text-xs',
              active ? 'text-ink-900' : 'text-ink-500',
            )}
          >
            {opt.label}
            {opt.badge && (
              <span className="rounded-full bg-berry/20 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-berry">
                {opt.badge}
              </span>
            )}
            {active && (
              <motion.span
                layoutId={`seg-${label}`}
                transition={spring.layout}
                className="absolute inset-0 -z-10 rounded-full bg-surface shadow-soft"
              />
            )}
          </button>
        )
      })}
    </div>
  )
}

/* ── Horizontal scroll rail (Effect 36) ──────────────────────────────── */
export function Rail({ children, label, className }: { children: ReactNode; label: string; className?: string }) {
  return (
    <div
      role="group"
      aria-label={label}
      className={cn('flex snap-x snap-mandatory gap-3 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden', className)}
    >
      {children}
    </div>
  )
}

/* ── Accordion row (Effect 30) ───────────────────────────────────────── */
export function Disclosure({
  question, children, defaultOpen = false, meta,
}: { question: ReactNode; children: ReactNode; defaultOpen?: boolean; meta?: ReactNode }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="fx-accordion border-b border-line last:border-0" data-open={open}>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="press flex w-full items-start justify-between gap-4 py-4 text-left"
      >
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-bold text-ink-900">{question}</span>
          {meta && <span className="mt-0.5 block text-xs text-ink-500">{meta}</span>}
        </span>
        <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full border border-line text-ink-500" aria-hidden>
          <Plus className="fx-accordion__chevron size-3" />
        </span>
      </button>
      <div className="fx-accordion__panel">
        <div className="pb-4 text-sm leading-6 text-ink-500">{children}</div>
      </div>
    </div>
  )
}

/* ── Bottom sheet (Effect 25) ────────────────────────────────────────── */
export function Sheet({
  open, onClose, title, children,
}: { open: boolean; onClose: () => void; title: string; children: ReactNode }) {
  const [dragY, setDragY] = useState(0)
  const [dragging, setDragging] = useState(false)
  const start = useRef({ y: 0, t: 0, velocity: 0, height: 500 })

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = '' }
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[70]">
          <motion.button
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            aria-label="Close"
            className="fx-scrim absolute inset-0 w-full"
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            initial={{ y: '100%' }}
            animate={{ y: dragging ? dragY : 0 }}
            exit={{ y: '100%' }}
            transition={dragging ? { duration: 0 } : spring.sheet}
            onPointerDown={(e) => {
              start.current = { y: e.clientY, t: performance.now(), velocity: 0, height: (e.currentTarget as HTMLElement).offsetHeight || 500 }
              setDragging(true)
              ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
            }}
            onPointerMove={(e) => {
              if (!dragging) return
              const raw = Math.max(0, e.clientY - start.current.y)
              const h = start.current.height
              const next = raw > h * 0.4 ? h * 0.4 + (raw - h * 0.4) * 0.55 : raw
              const now = performance.now()
              start.current.velocity = ((e.clientY - start.current.y) / Math.max(now - start.current.t, 1)) * 1000
              start.current.t = now
              setDragY(next)
            }}
            onPointerUp={() => {
              setDragging(false)
              if (start.current.velocity > 520 || dragY > start.current.height * 0.35) onClose()
              else setDragY(0)
            }}
            className={cn('fx-sheet absolute inset-x-0 bottom-0 mx-auto max-w-lg', dragging && 'is-dragging')}
          >
            <div className="fx-sheet__handle" aria-hidden />
            <div className="px-5 pb-5">
              <h2 className="text-lg font-bold tracking-[-.03em] text-ink-900">{title}</h2>
              <div className="mt-4">{children}</div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

/* ── Empty state ─────────────────────────────────────────────────────── */
export function EmptyState({
  icon: Icon = Sparkles, title, copy, action,
}: { icon?: LucideIcon; title: string; copy: string; action?: { href: string; label: string } }) {
  return (
    <div className="rounded-[26px] border border-dashed border-line bg-surface/60 p-8 text-center">
      <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-canvas-2 text-ink-300">
        <Icon className="size-5" aria-hidden />
      </span>
      <p className="mt-4 text-sm font-bold text-ink-900">{title}</p>
      <p className="mx-auto mt-2 max-w-[280px] text-sm leading-6 text-ink-500">{copy}</p>
      {action && (
        <Link href={action.href} className="press mt-5 inline-flex items-center gap-2 rounded-full bg-brand-600 px-5 py-3 text-sm font-bold text-white">
          {action.label}
        </Link>
      )}
    </div>
  )
}

/* ── Skeleton block ──────────────────────────────────────────────────── */
export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('skeleton', className)} aria-hidden />
}

/* ── Screen intro (consistent title block) ───────────────────────────── */
export function ScreenIntro({
  eyebrow, title, copy, action,
}: { eyebrow?: string; title: string; copy?: string; action?: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="min-w-0">
        {eyebrow && <p className="text-[11px] font-bold uppercase tracking-[.2em] text-brand-600">{eyebrow}</p>}
        <h1 className="mt-1.5 text-[clamp(1.6rem,6.5vw,2.25rem)] font-bold tracking-[-.05em] text-ink-900">{title}</h1>
        {copy && <p className="mt-2 max-w-lg text-sm leading-6 text-ink-500">{copy}</p>}
      </div>
      {action}
    </div>
  )
}
