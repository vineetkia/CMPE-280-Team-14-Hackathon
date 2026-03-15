"use client";

import { motion } from 'motion/react';
import { glassCard } from '@/lib/constants';

interface AssignmentStatsProps {
  stats: {
    total: number;
    notStarted: number;
    inProgress: number;
    completed: number;
  };
}

const statItems = [
  { key: 'total' as const, label: 'Total', color: 'from-blue-400 to-cyan-400' },
  { key: 'notStarted' as const, label: 'Not Started', color: 'from-gray-400 to-slate-400' },
  { key: 'inProgress' as const, label: 'In Progress', color: 'from-yellow-400 to-orange-400' },
  { key: 'completed' as const, label: 'Completed', color: 'from-green-400 to-emerald-400' },
];

export function AssignmentStats({ stats }: AssignmentStatsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-1 md:grid-cols-4 gap-4"
    >
      {statItems.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 16, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            delay: index * 0.08,
            type: 'spring',
            stiffness: 300,
            damping: 24
          }}
          whileHover={{ scale: 1.05, y: -5, transition: { type: 'spring', stiffness: 400, damping: 25 } }}
          className={glassCard + ' p-6 glass-shine'}
        >
          <h3 className="text-sm text-[var(--muted-foreground)] mb-2">{stat.label}</h3>
          <p className={`text-4xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
            {stats[stat.key]}
          </p>
        </motion.div>
      ))}
    </motion.div>
  );
}
