"use client";

import Link from 'next/link';
import { Plus, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import { Todo } from '@/types';
import { Button } from '@/components/ui/button';

interface RecentTasksProps {
  todos: Todo[];
}

const item = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function RecentTasks({ todos }: RecentTasksProps) {
  const recentTodos = todos.slice(0, 5);

  return (
    <motion.div
      variants={item}
      className="lg:col-span-2 backdrop-blur-2xl bg-[var(--glass)] border border-[var(--glass-border)] rounded-2xl p-4 md:p-6 shadow-lg glass-panel glass-shine"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-[var(--foreground)]">Recent Tasks</h2>
        <Link href="/todos">
          <Button variant="ghost" size="sm" className="gap-2">
            View All
            <ChevronRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>
      <div className="space-y-3">
        {recentTodos.length > 0 ? (
          recentTodos.map((todo, index) => (
            <motion.div
              key={todo.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ x: 4, transition: { type: 'spring', stiffness: 400, damping: 25 } }}
              className="flex items-center gap-3 p-4 rounded-xl bg-[var(--secondary)] hover:bg-[var(--accent)] transition-all cursor-pointer group"
            >
              <div
                className={`w-2 h-2 rounded-full ${
                  todo.priority === 'high'
                    ? 'bg-red-500'
                    : todo.priority === 'medium'
                      ? 'bg-yellow-500'
                      : 'bg-green-500'
                }`}
              />
              <div className="flex-1 min-w-0">
                <p
                  className={`font-medium text-[var(--foreground)] ${
                    todo.completed ? 'line-through opacity-60' : ''
                  }`}
                >
                  {todo.title}
                </p>
                {todo.description && (
                  <p className="text-sm text-[var(--muted-foreground)] truncate">
                    {todo.description}
                  </p>
                )}
              </div>
              <div
                className={`px-3 py-1 rounded-lg text-xs font-medium ${
                  todo.completed
                    ? 'bg-green-500/20 text-green-600 dark:text-green-400'
                    : 'bg-blue-500/20 text-blue-600 dark:text-blue-400'
                }`}
              >
                {todo.completed ? 'Done' : 'Pending'}
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-[var(--muted-foreground)]">No tasks yet</p>
            <Link href="/todos">
              <Button variant="outline" size="sm" className="mt-4">
                <Plus className="w-4 h-4 mr-2" />
                Add Task
              </Button>
            </Link>
          </div>
        )}
      </div>
    </motion.div>
  );
}
