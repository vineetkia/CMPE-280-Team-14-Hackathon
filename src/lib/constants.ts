// Shared design tokens used across components
export const glassCard = "backdrop-blur-2xl bg-[var(--glass)] border border-[var(--glass-border)] rounded-2xl shadow-lg glass-panel";

export const glassCardHover = "backdrop-blur-2xl bg-[var(--glass)] border border-[var(--glass-border)] rounded-2xl shadow-lg glass-panel hover:shadow-xl hover:border-[var(--border)] transition-all";

export const gradientButton = "bg-[var(--primary-solid)] hover:opacity-90 transition-opacity";

export const priorityColors = {
  high: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20',
  medium: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
  low: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
} as const;

export const statusColors = {
  'not-started': 'bg-zinc-500/10 text-zinc-600 dark:text-zinc-400',
  'in-progress': 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  'completed': 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
} as const;

export const categoryColors = {
  study: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  assignment: 'bg-violet-500/10 text-violet-600 dark:text-violet-400',
  exam: 'bg-red-500/10 text-red-600 dark:text-red-400',
  project: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  other: 'bg-zinc-500/10 text-zinc-600 dark:text-zinc-400',
} as const;

export const eventTypeColors = {
  class: '#3b82f6',
  exam: '#ef4444',
  assignment: '#f59e0b',
  study: '#10b981',
  other: '#8b5cf6',
} as const;
