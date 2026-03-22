"use client";

import { ReactNode } from 'react';
import { Plus } from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { gradientButton } from '@/lib/constants';

interface TodoHeaderProps {
  completedCount: number;
  totalCount: number;
  progressPercentage: number;
  onAddClick: () => void;
  extraActions?: ReactNode;
}

export function TodoHeader({
  completedCount,
  totalCount,
  progressPercentage,
  onAddClick,
  extraActions,
}: TodoHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="backdrop-blur-2xl bg-[var(--glass)] border border-[var(--glass-border)] rounded-2xl p-4 md:p-6 shadow-lg glass-panel"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
        <div>
          <h1 className="text-3xl font-bold text-[var(--foreground)]">My Todos</h1>
          <p className="text-[var(--muted-foreground)] mt-1">
            {completedCount} of {totalCount} tasks completed
          </p>
        </div>
        <div className="flex items-center gap-2">
          {extraActions}
          <Button onClick={onAddClick} className={gradientButton}>
            <Plus className="w-4 h-4 mr-2" />
            Add Todo
          </Button>
        </div>
      </div>
      <Progress value={progressPercentage} className="h-3" />
    </motion.div>
  );
}
