'use client'

/**
 * Effect 34 — toast stack. A tiny module-level emitter means any component can
 * fire a toast without context plumbing, and the host is mounted once per
 * screen. Max three visible, older ones scale back, swipe-up to dismiss.
 */

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { AlertTriangle, Check, Info } from 'lucide-react'
import { spring } from '@/lib/motion'

type ToastKind = 'success' | 'error' | 'info'
interface Toast { id: number; message: string; kind: ToastKind; action?: { label: string; run: () => void } }

let listeners: ((t: Omit<Toast, 'id'>) => void)[] = []
let counter = 0

export function toast(message: string, kind: ToastKind = 'success', action?: Toast['action']) {
  const payload = { message, kind, action }
  listeners.forEach((l) => l(payload))
}

const ICONS = { success: Check, error: AlertTriangle, info: Info }
const TONES = {
  success: 'text-brand-600',
  error: 'text-score-danger',
  info: 'text-sky-accent',
}

export function Toaster() {
  const [items, setItems] = useState<Toast[]>([])

  useEffect(() => {
    const add = (t: Omit<Toast, 'id'>) => {
      const id = ++counter
      setItems((prev) => [...prev.slice(-2), { ...t, id }])
      window.setTimeout(() => setItems((prev) => prev.filter((x) => x.id !== id)), t.action ? 6000 : 3600)
    }
    listeners.push(add)
    return () => { listeners = listeners.filter((l) => l !== add) }
  }, [])

  return (
    <div
      aria-live="polite"
      aria-atomic="false"
      className="pointer-events-none fixed inset-x-0 top-[max(0.75rem,var(--safe-t))] z-[90] flex flex-col items-center gap-2 px-4"
    >
      <AnimatePresence initial={false}>
        {items.map((t, i) => {
          const Icon = ICONS[t.kind]
          const isStale = i < items.length - 1
          return (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, y: -22, scale: 0.96 }}
              animate={{ opacity: isStale ? 0.72 : 1, y: 0, scale: isStale ? 0.96 : 1 }}
              exit={{ opacity: 0, y: -16, scale: 0.95 }}
              transition={spring.pop}
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={0.4}
              onDragEnd={(_, info) => { if (info.offset.y < -40) setItems((prev) => prev.filter((x) => x.id !== t.id)) }}
              className="glass pointer-events-auto flex w-full max-w-sm items-center gap-3 rounded-2xl px-4 py-3 shadow-float"
            >
              <span className={`grid size-7 shrink-0 place-items-center rounded-full bg-canvas-2 ${TONES[t.kind]}`}>
                <Icon className="size-4" aria-hidden />
              </span>
              <p className="min-w-0 flex-1 text-sm font-medium text-ink-900">{t.message}</p>
              {t.action && (
                <button
                  onClick={() => { t.action?.run(); setItems((prev) => prev.filter((x) => x.id !== t.id)) }}
                  className="press shrink-0 rounded-full bg-ink-900 px-3 py-1.5 text-xs font-bold text-white"
                >
                  {t.action.label}
                </button>
              )}
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
