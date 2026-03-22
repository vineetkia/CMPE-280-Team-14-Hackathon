"use client";

import { useMemo } from 'react';
import { CheckCircle2, Clock, TrendingUp, BookOpen } from 'lucide-react';
import { motion } from 'motion/react';
import { useTodos } from '@/hooks/useTodos';
import { useAssignments } from '@/hooks/useAssignments';
import { useEvents } from '@/hooks/useEvents';
import { Skeleton } from '@/components/ui/skeleton';
import { StatCard } from '@/components/dashboard/StatCard';
import { RecentTasks } from '@/components/dashboard/RecentTasks';
import { UpcomingAssignments } from '@/components/dashboard/UpcomingAssignments';
import { AskAI } from '@/components/dashboard/AskAI';
import { StudyPlanGenerator } from '@/components/dashboard/StudyPlanGenerator';

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

function DashboardSkeleton() {
  return (
    <div className="space-y-4 md:space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="backdrop-blur-xl bg-[var(--glass)] border border-[var(--glass-border)] rounded-2xl p-6 shadow-lg glass-panel"
          >
            <div className="flex items-center justify-between mb-4">
              <Skeleton className="w-12 h-12 rounded-xl" />
              <Skeleton className="w-10 h-4" />
            </div>
            <Skeleton className="w-24 h-8 mb-1" />
            <Skeleton className="w-28 h-4 mt-2" />
            <Skeleton className="w-full h-2 mt-4 rounded-full" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 backdrop-blur-xl bg-[var(--glass)] border border-[var(--glass-border)] rounded-2xl p-6 shadow-lg glass-panel">
          <Skeleton className="w-32 h-6 mb-6" />
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="w-full h-16 mb-3 rounded-xl" />
          ))}
        </div>
        <div className="backdrop-blur-xl bg-[var(--glass)] border border-[var(--glass-border)] rounded-2xl p-6 shadow-lg glass-panel">
          <Skeleton className="w-24 h-6 mb-6" />
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="w-full h-24 mb-3 rounded-xl" />
          ))}
        </div>
      </div>
      <div className="backdrop-blur-2xl bg-[var(--glass)] border border-[var(--glass-border)] rounded-2xl p-8 shadow-lg glass-panel">
        <Skeleton className="w-48 h-6 mb-6" />
        <Skeleton className="w-full h-10" />
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { todos, completedCount } = useTodos();
  const { assignments, stats: assignmentStats } = useAssignments();
  const { events } = useEvents();

  const upcomingEventsCount = useMemo(
    () => events.filter((e) => new Date(e.date) > new Date()).length,
    [events]
  );

  // Compute weekly progress from actual data instead of hardcoded values
  const weeklyProgress = useMemo(() => {
    const totalItems = todos.length + assignments.length;
    if (totalItems === 0) return { value: 0, total: 100 };
    const completedItems = completedCount + assignmentStats.completed;
    const percentage = Math.round((completedItems / totalItems) * 100);
    return { value: percentage, total: 100 };
  }, [todos.length, assignments.length, completedCount, assignmentStats.completed]);

  const stats = useMemo(
    () => [
      {
        label: 'Tasks Completed',
        value: completedCount,
        total: todos.length,
        icon: CheckCircle2,
        color: 'from-emerald-400 to-cyan-400',
        bgColor: 'bg-emerald-500/10',
        iconColor: 'text-emerald-500',
      },
      {
        label: 'Assignments Done',
        value: assignmentStats.completed,
        total: assignments.length,
        icon: BookOpen,
        color: 'from-violet-400 to-purple-400',
        bgColor: 'bg-violet-500/10',
        iconColor: 'text-violet-500',
      },
      {
        label: 'Upcoming Events',
        value: upcomingEventsCount,
        total: events.length,
        icon: Clock,
        color: 'from-amber-400 to-orange-400',
        bgColor: 'bg-amber-500/10',
        iconColor: 'text-amber-500',
      },
      {
        label: 'Weekly Progress',
        value: weeklyProgress.value,
        total: weeklyProgress.total,
        icon: TrendingUp,
        color: 'from-pink-400 to-rose-400',
        bgColor: 'bg-pink-500/10',
        iconColor: 'text-pink-500',
      },
    ],
    [
      completedCount,
      todos.length,
      assignmentStats.completed,
      assignments.length,
      upcomingEventsCount,
      events.length,
      weeklyProgress,
    ]
  );

  return (
    <motion.div variants={container} initial="hidden" animate="visible" className="space-y-4 md:space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        {stats.map((stat, index) => (
          <StatCard key={stat.label} stat={stat} index={index} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <RecentTasks todos={todos} />
        <UpcomingAssignments assignments={assignments} />
      </div>

      <AskAI />

      <StudyPlanGenerator />
    </motion.div>
  );
}
