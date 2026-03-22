"use client";

import { LucideIcon } from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
    icon?: LucideIcon;
  };
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-16 px-8 text-center"
    >
      <div className="p-4 rounded-2xl bg-[var(--secondary)] mb-6">
        <Icon className="w-12 h-12 text-[var(--muted-foreground)]" />
      </div>
      <h3 className="text-lg font-semibold text-[var(--foreground)] mb-2">
        {title}
      </h3>
      <p className="text-sm text-[var(--muted-foreground)] max-w-sm mb-6">
        {description}
      </p>
      {action && (
        <Button
          onClick={action.onClick}
          className="bg-[var(--primary-solid)] hover:shadow-lg hover:"
        >
          {action.icon && <action.icon className="w-4 h-4 mr-2" />}
          {action.label}
        </Button>
      )}
    </motion.div>
  );
}
