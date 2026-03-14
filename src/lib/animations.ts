import type { Variants, Transition } from 'motion/react';

// ─── Base Transitions ────────────────────────────────────────
export const springTransition: Transition = {
  type: 'spring',
  stiffness: 400,
  damping: 30,
};

export const smoothTransition: Transition = {
  type: 'tween',
  ease: [0.25, 0.1, 0.25, 1], // cubic-bezier - premium feel
  duration: 0.4,
};

export const quickTransition: Transition = {
  type: 'tween',
  ease: 'easeOut',
  duration: 0.2,
};

// ─── Fade Variants ───────────────────────────────────────────
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: smoothTransition },
  exit: { opacity: 0, y: -8, transition: quickTransition },
};

export const fadeInDown: Variants = {
  hidden: { opacity: 0, y: -16 },
  visible: { opacity: 1, y: 0, transition: smoothTransition },
  exit: { opacity: 0, y: 8, transition: quickTransition },
};

export const fadeInLeft: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: smoothTransition },
  exit: { opacity: 0, x: -20, transition: quickTransition },
};

export const fadeInRight: Variants = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0, transition: smoothTransition },
  exit: { opacity: 0, x: 20, transition: quickTransition },
};

// ─── Scale Variants ──────────────────────────────────────────
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1, transition: springTransition },
  exit: { opacity: 0, scale: 0.95, transition: quickTransition },
};

export const popIn: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: 'spring', stiffness: 500, damping: 25 }
  },
  exit: { opacity: 0, scale: 0.9, transition: quickTransition },
};

// ─── Stagger Containers ──────────────────────────────────────
export const staggerContainer = (staggerDelay = 0.06): Variants => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: staggerDelay,
      delayChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    transition: { staggerChildren: 0.03, staggerDirection: -1 },
  },
});

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 300, damping: 24 }
  },
  exit: { opacity: 0, y: -8, transition: { duration: 0.15 } },
};

// Fast stagger for large lists (tables, grids)
export const fastStaggerContainer = (staggerDelay = 0.03): Variants => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: staggerDelay },
  },
});

export const fastStaggerItem: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: quickTransition },
};

// ─── Page Transition ─────────────────────────────────────────
export const pageTransition: Variants = {
  initial: { opacity: 0, y: 12, filter: 'blur(4px)' },
  animate: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }
  },
  exit: {
    opacity: 0,
    y: -8,
    filter: 'blur(2px)',
    transition: { duration: 0.2 }
  },
};

// ─── Slide Variants (for drawers, panels) ────────────────────
export const slideFromLeft: Variants = {
  hidden: { x: '-100%', opacity: 0.5 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 300, damping: 30 }
  },
  exit: {
    x: '-100%',
    opacity: 0,
    transition: { duration: 0.25, ease: 'easeIn' }
  },
};

export const slideFromRight: Variants = {
  hidden: { x: '100%', opacity: 0.5 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 300, damping: 30 }
  },
  exit: {
    x: '100%',
    opacity: 0,
    transition: { duration: 0.25, ease: 'easeIn' }
  },
};

export const slideFromBottom: Variants = {
  hidden: { y: '100%', opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 300, damping: 30 }
  },
  exit: {
    y: '100%',
    opacity: 0,
    transition: { duration: 0.2 }
  },
};

// ─── Hover & Tap Presets ─────────────────────────────────────
// Use these as spread props: {...cardHover}
export const cardHover = {
  whileHover: { y: -2, scale: 1.01, transition: { duration: 0.2 } },
  whileTap: { scale: 0.99, transition: { duration: 0.1 } },
};

export const buttonHover = {
  whileHover: { scale: 1.03, transition: { duration: 0.15 } },
  whileTap: { scale: 0.97, transition: { duration: 0.1 } },
};

export const subtleHover = {
  whileHover: { x: 3, transition: { duration: 0.15 } },
  whileTap: { scale: 0.98, transition: { duration: 0.1 } },
};

export const iconButtonHover = {
  whileHover: { scale: 1.1, rotate: 5, transition: { duration: 0.15 } },
  whileTap: { scale: 0.9, transition: { duration: 0.1 } },
};

// ─── Counter / Number Animation Config ───────────────────────
// For use with useMotionValue + useTransform for animated numbers
export const counterSpring = {
  type: 'spring' as const,
  stiffness: 100,
  damping: 20,
  duration: 1.2,
};

// ─── Skeleton / Loading Variants ─────────────────────────────
export const skeletonPulse: Variants = {
  hidden: { opacity: 0.3 },
  visible: {
    opacity: [0.3, 0.6, 0.3],
    transition: { repeat: Infinity, duration: 1.5, ease: 'easeInOut' },
  },
};

// ─── Backdrop / Overlay ──────────────────────────────────────
export const backdrop: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};
