"use client";

import { useEffect, useRef, useState } from 'react';
import { LucideIcon } from 'lucide-react';
import { motion } from 'motion/react';
import { staggerItem } from '@/lib/animations';
import { glassCard } from '@/lib/constants';

interface StatCardProps {
  stat: {
    label: string;
    value: number;
    total: number;
    icon: LucideIcon;
    color: string;
    bgColor: string;
    iconColor: string;
  };
  index: number;
}

export function StatCard({ stat, index }: StatCardProps) {
  const Icon = stat.icon;
  const percentage = stat.total > 0 ? (stat.value / stat.total) * 100 : 0;

  const [displayValue, setDisplayValue] = useState(stat.value);
  const prevValueRef = useRef(stat.value);

  useEffect(() => {
    const from = prevValueRef.current;
    const to = stat.value;
    prevValueRef.current = to;

    // Skip animation if value hasn't changed
    if (from === to) return;

    const duration = 1200;
    const delay = from === 0 ? index * 150 : 0; // Only stagger on initial load
    const start = performance.now() + delay;

    let raf: number;
    const step = (now: number) => {
      const elapsed = now - start;
      if (elapsed < 0) { raf = requestAnimationFrame(step); return; }
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.round(from + (to - from) * eased));
      if (progress < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [stat.value, index]);

  return (
    <motion.div
      variants={staggerItem}
      whileHover={{ y: -4, scale: 1.02, transition: { type: 'spring', stiffness: 400, damping: 25 } }}
      whileTap={{ scale: 0.98 }}
      className={`${glassCard} p-4 md:p-6 glass-shine cursor-default`}
    >
      <div
        className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 hover:opacity-5 transition-opacity duration-300`}
      />
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-xl ${stat.bgColor}`}>
            <Icon className={`w-6 h-6 ${stat.iconColor}`} />
          </div>
          <span className="text-sm font-medium text-[var(--muted-foreground)]">
            {percentage.toFixed(0)}%
          </span>
        </div>
        <h3 className="text-3xl font-bold text-[var(--foreground)] mb-1">
          {displayValue}
          <span className="text-lg text-[var(--muted-foreground)]">/{stat.total}</span>
        </h3>
        <p className="text-sm text-[var(--muted-foreground)]">{stat.label}</p>
        <div className="mt-4 h-2 bg-[var(--muted)] rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{
              duration: 1.2,
              delay: index * 0.15 + 0.3,
              ease: [0.25, 0.1, 0.25, 1]
            }}
            className={`h-full bg-gradient-to-r ${stat.color} rounded-full`}
          />
        </div>
      </div>
    </motion.div>
  );
}
