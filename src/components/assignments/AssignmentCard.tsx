"use client";

import { Edit2, Trash2, Calendar, ClipboardList } from 'lucide-react';
import { AssignmentAIHelper } from './AssignmentAIHelper';
import { motion, AnimatePresence } from 'motion/react';
import { Assignment } from '@/types';
import { Badge } from '@/components/ui/badge';
import { glassCard, statusColors, priorityColors } from '@/lib/constants';
import { EmptyState } from '@/components/shared/EmptyState';
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

type SortField = 'title' | 'dueDate' | 'priority' | 'status';

interface AssignmentCardProps {
  assignments: Assignment[];
  sortField: SortField;
  sortDirection: 'asc' | 'desc';
  onToggleSort: (field: SortField) => void;
  onEdit: (assignment: Assignment) => void;
  onDelete: (id: string) => void;
}

export function AssignmentCard({
  assignments,
  onEdit,
  onDelete,
}: AssignmentCardProps) {
  return (
    <div className="block md:hidden space-y-4">
      <AnimatePresence mode="popLayout">
        {assignments.length > 0 ? (
          assignments.map((assignment, index) => (
            <motion.div
              key={assignment.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -3, scale: 1.01, transition: { type: 'spring', stiffness: 400, damping: 25 } }}
              className={glassCard + ' p-4 glass-shine'}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-[var(--foreground)] truncate">{assignment.title}</h3>
                  <p className="text-sm text-[var(--muted-foreground)]">{assignment.subject}</p>
                </div>
                <div className="flex items-center gap-1 ml-2 shrink-0">
                  <AssignmentAIHelper assignment={assignment} />
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onEdit(assignment)}
                    className="p-2 rounded-lg hover:bg-[var(--accent)] text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                    aria-label={`Edit ${assignment.title}`}
                  >
                    <Edit2 className="w-4 h-4" />
                  </motion.button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-2 rounded-lg hover:bg-red-500/20 text-red-500"
                        aria-label={`Delete ${assignment.title}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Assignment</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete &quot;{assignment.title}&quot;? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => onDelete(assignment.id)}
                          className="bg-red-500 hover:bg-red-600"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>

              {assignment.description && (
                <p className="text-sm text-[var(--muted-foreground)] mb-3 line-clamp-2">{assignment.description}</p>
              )}

              <div className="flex items-center gap-2 mb-3 text-sm text-[var(--muted-foreground)]">
                <Calendar className="w-3.5 h-3.5" />
                <span>{assignment.dueDate.toLocaleDateString()}</span>
                {assignment.grade && (
                  <span className="ml-auto font-semibold text-green-600 dark:text-green-400">{assignment.grade}</span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Badge className={statusColors[assignment.status]}>{assignment.status.replace('-', ' ')}</Badge>
                <Badge className={priorityColors[assignment.priority]} variant="outline">{assignment.priority}</Badge>
              </div>
            </motion.div>
          ))
        ) : (
          <div className={glassCard}>
            <EmptyState
              icon={ClipboardList}
              title="No assignments found"
              description="Try adjusting your filters or add a new assignment to get started."
            />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
