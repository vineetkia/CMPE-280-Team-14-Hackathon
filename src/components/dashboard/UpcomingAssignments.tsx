"use client";

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import { Assignment } from '@/types';
import { Button } from '@/components/ui/button';

interface UpcomingAssignmentsProps {
  assignments: Assignment[];
}

const item = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function UpcomingAssignments({ assignments }: UpcomingAssignmentsProps) {
  const upcomingAssignments = assignments
    .filter((a) => a.status !== 'completed')
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 3);

  return (
    <motion.div
      variants={item}
      className="backdrop-blur-xl bg-[var(--glass)] border border-[var(--glass-border)] rounded-2xl p-6 shadow-xl glass-shine"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-[var(--foreground)]">Upcoming</h2>
        <Link href="/assignments">
          <Button variant="ghost" size="sm" aria-label="View all assignments">
            <ChevronRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>
      <div className="space-y-3">
        {upcomingAssignments.length > 0 ? (
          upcomingAssignments.map((assignment, index) => (
            <motion.div
              key={assignment.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="p-4 rounded-xl bg-gradient-to-br from-[var(--secondary)] to-[var(--accent)] hover:shadow-lg transition-all cursor-pointer"
            >
              <h3 className="font-medium text-[var(--foreground)] mb-1">
                {assignment.title}
              </h3>
              <p className="text-sm text-[var(--muted-foreground)] mb-2">
                {assignment.subject}
              </p>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[var(--muted-foreground)]">
                  {new Date(assignment.dueDate).toLocaleDateString()}
                </span>
                <span
                  className={`px-2 py-1 rounded-md font-medium ${
                    assignment.priority === 'high'
                      ? 'bg-red-500/20 text-red-600 dark:text-red-400'
                      : assignment.priority === 'medium'
                        ? 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400'
                        : 'bg-green-500/20 text-green-600 dark:text-green-400'
                  }`}
                >
                  {assignment.priority}
                </span>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-[var(--muted-foreground)] text-sm">
              No upcoming assignments
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
