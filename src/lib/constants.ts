// Shared design tokens used across components
export const glassCard = "backdrop-blur-xl bg-[var(--glass)] border border-[var(--glass-border)] rounded-2xl shadow-xl";

export const glassCardHover = "backdrop-blur-xl bg-[var(--glass)] border border-[var(--glass-border)] rounded-2xl shadow-xl hover:shadow-2xl transition-all";

export const gradientButton = "bg-gradient-to-r from-[#667eea] to-[#764ba2] hover:shadow-lg hover:shadow-[#667eea]/30 transition-all";

export const priorityColors = {
  high: 'bg-red-500/20 text-red-600 dark:text-red-400 border-red-500/30',
  medium: 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 border-yellow-500/30',
  low: 'bg-green-500/20 text-green-600 dark:text-green-400 border-green-500/30',
} as const;

export const statusColors = {
  'not-started': 'bg-gray-500/20 text-gray-600 dark:text-gray-400',
  'in-progress': 'bg-blue-500/20 text-blue-600 dark:text-blue-400',
  'completed': 'bg-green-500/20 text-green-600 dark:text-green-400',
} as const;

export const categoryColors = {
  study: 'bg-blue-500/20 text-blue-600 dark:text-blue-400',
  assignment: 'bg-purple-500/20 text-purple-600 dark:text-purple-400',
  exam: 'bg-red-500/20 text-red-600 dark:text-red-400',
  project: 'bg-green-500/20 text-green-600 dark:text-green-400',
  other: 'bg-gray-500/20 text-gray-600 dark:text-gray-400',
} as const;

export const eventTypeColors = {
  class: '#3b82f6',
  exam: '#ef4444',
  assignment: '#f59e0b',
  study: '#10b981',
  other: '#8b5cf6',
} as const;
