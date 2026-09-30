'use client'

/**
 * Effect 28 — route transitions, app-wide.
 *
 * A Next template re-mounts on every navigation inside its segment, which is
 * exactly the hook a page transition needs and avoids wrapping the whole tree
 * in AnimatePresence (which would fight the App Router's own suspense
 * boundaries). Screens push in from the right and fade, giving the stack-navigation
 * feel the app screens are supposed to have.
 *
 * `overflow-x: clip` on the wrapper means the incoming offset never produces a
 * horizontal scrollbar. Reduced motion renders the children untouched.
 */

import { motion, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'

export default function AppTemplate({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion()

  if (reduced) return <>{children}</>

  return (
    <motion.div
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.34, ease: [0.16, 1, 0.3, 1] }}
      style={{ overflowX: 'clip' }}
    >
      {children}
    </motion.div>
  )
}
