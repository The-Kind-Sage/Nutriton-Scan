/**
 * Canonical Framer Motion layer.
 *
 * Rule: components import springs/variants from here — never inline magic
 * numbers. These mirror the CSS custom properties in globals.css so the CSS
 * and JS halves of the motion language can never drift apart.
 */

import type { Transition, Variants } from 'framer-motion'

export const spring = {
  soft: { type: 'spring', stiffness: 220, damping: 28, mass: 0.9 } as Transition,
  pop: { type: 'spring', stiffness: 420, damping: 18, mass: 0.6 } as Transition,
  sheet: { type: 'spring', stiffness: 300, damping: 34, mass: 1.1 } as Transition,
  bouncy: { type: 'spring', stiffness: 600, damping: 12, mass: 1 } as Transition,
  layout: { type: 'spring', stiffness: 420, damping: 34 } as Transition,
} satisfies Record<string, Transition>

/** Tuple form so TS accepts them as cubic-bezier easings. */
export const ease = {
  outExpo: [0.16, 1, 0.3, 1],
  inOutQuart: [0.76, 0, 0.24, 1],
  backOut: [0.34, 1.56, 0.64, 1],
  anticipate: [0.68, -0.55, 0.27, 1.55],
  smooth: [0.4, 0, 0.2, 1],
} as const

export const dur = { instant: 0.09, fast: 0.16, base: 0.24, slow: 0.42, slower: 0.68, cinematic: 1.1 } as const

/** Fire once, 18% visible, inset so nothing animates off-screen. */
export const inViewOnce = { once: true, amount: 0.18, margin: '-10% 0px -10% 0px' } as const

const base = (from: Record<string, unknown>): Variants => ({
  hidden: { opacity: 0, ...from },
  show: {
    opacity: 1, y: 0, x: 0, scale: 1, filter: 'blur(0px)',
    transition: { duration: dur.slower, ease: ease.outExpo },
  },
})

export const reveal = {
  /** Effect 01 — rise from a clip mask with a blur burn-off. */
  blurUp: { hidden: { opacity: 0, y: '0.62em', filter: 'blur(10px)' }, show: { opacity: 1, y: 0, filter: 'blur(0px)' } } as Variants,
  /** Effect 02 — the workhorse. */
  up: base({ y: 24 }),
  down: base({ y: -24 }),
  left: base({ x: 32 }),
  right: base({ x: -32 }),
  scale: base({ scale: 0.93 }),
  /** Organic "leaf unfurl" for illustrated tiles. */
  unfold: {
    hidden: { opacity: 0, scaleX: 0.88, scaleY: 0.62, filter: 'blur(6px)' },
    show: { opacity: 1, scaleX: 1, scaleY: 1, filter: 'blur(0px)', transition: { duration: dur.slower, ease: ease.backOut } },
  } as Variants,
} satisfies Record<string, Variants>

export const stagger = (step = 0.06): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: step, delayChildren: 0.04, when: 'start' } },
})

/** Effect 43 — nutrient chips flying in from the scan centre. */
export const chipIn: Variants = {
  hidden: { opacity: 0, scale: 0.6, filter: 'blur(6px)', y: 8 },
  show: { opacity: 1, scale: 1, filter: 'blur(0px)', y: 0, transition: spring.pop },
}
export const chipContainer: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.055 } } }

/** Effect 28 — page transitions. */
export const pageVariants: Variants = {
  initial: { opacity: 0, x: 24 },
  animate: { opacity: 1, x: 0, transition: { duration: dur.slow, ease: ease.outExpo } },
  exit: { opacity: 0, x: -24, transition: { duration: dur.fast, ease: ease.smooth } },
}

/** Effect 46 — layout-animated list items. */
export const layoutItem = (i = 0) => ({
  layout: true,
  initial: { opacity: 0, scale: 0.7, y: -8 },
  animate: { opacity: 1, scale: 1, y: 0, transition: { ...spring.pop, delay: i * 0.03 } },
  exit: { opacity: 0, scale: 0.9, transition: { duration: dur.fast } },
})

/** Effect 30 — accordion auto-height. */
export const accordionPanel = {
  initial: { height: 0, opacity: 0 },
  animate: { height: 'auto', opacity: 1 },
  exit: { height: 0, opacity: 0 },
  transition: { duration: dur.base, ease: ease.inOutQuart },
} as const
