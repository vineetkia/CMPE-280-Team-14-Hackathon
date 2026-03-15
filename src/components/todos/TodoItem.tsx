"use client";

import { Trash2, Edit2 } from 'lucide-react';
import { motion } from 'motion/react';
import { Todo } from '@/types';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { glassCard, priorityColors, categoryColors } from '@/lib/constants';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onEdit: (todo: Todo) => void;
  onDelete: (id: string) => void;
}

export function TodoItem({ todo, onToggle, onEdit, onDelete }: TodoItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }}
      whileHover={{ y: -2, scale: 1.005, transition: { type: 'spring', stiffness: 400, damping: 30 } }}
      className={`${glassCard} p-6 glass-shine hover:shadow-2xl transition-shadow group`}
    >
      <div className="flex items-start gap-4">
        <Checkbox
          checked={todo.completed}
          onCheckedChange={() => onToggle(todo.id)}
          className="mt-1"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4 mb-2">
            <h3
              className={`text-lg font-semibold text-[var(--foreground)] ${
                todo.completed ? 'line-through opacity-60' : ''
              }`}
            >
              {todo.title}
            </h3>
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onEdit(todo)}
                aria-label="Edit todo"
                className="p-2 rounded-lg hover:bg-[var(--secondary)] text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
              >
                <Edit2 className="w-4 h-4" />
              </motion.button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label="Delete todo"
                    className="p-2 rounded-lg hover:bg-red-500/20 text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </motion.button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Todo</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete &quot;{todo.title}&quot;? This action
                      cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => onDelete(todo.id)}
                      className="bg-red-500 hover:bg-red-600"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
          {todo.description && (
            <p
              className={`text-[var(--muted-foreground)] mb-3 ${
                todo.completed ? 'line-through opacity-60' : ''
              }`}
            >
              {todo.description}
            </p>
          )}
          <div className="flex flex-wrap items-center gap-2">
            <Badge className={priorityColors[todo.priority]} variant="outline">
              {todo.priority}
            </Badge>
            <Badge className={categoryColors[todo.category]}>{todo.category}</Badge>
            {todo.dueDate && (
              <span className="text-sm text-[var(--muted-foreground)]">
                Due: {new Date(todo.dueDate).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
