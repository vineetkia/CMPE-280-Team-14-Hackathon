"use client";

import { Edit2, Trash2, ArrowUpDown } from 'lucide-react';
import { AssignmentAIHelper } from './AssignmentAIHelper';
import { motion, AnimatePresence } from 'motion/react';
import { Assignment } from '@/types';
import { Badge } from '@/components/ui/badge';
import { glassCard, statusColors, priorityColors } from '@/lib/constants';
import { EmptyState } from '@/components/shared/EmptyState';
import { ClipboardList } from 'lucide-react';
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

interface AssignmentTableProps {
  assignments: Assignment[];
  sortField: SortField;
  sortDirection: 'asc' | 'desc';
  onToggleSort: (field: SortField) => void;
  onEdit: (assignment: Assignment) => void;
  onDelete: (id: string) => void;
}

export function AssignmentTable({
  assignments,
  sortField,
  sortDirection,
  onToggleSort,
  onEdit,
  onDelete,
}: AssignmentTableProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.2 }}
      className={glassCard + ' overflow-hidden hidden md:block'}
    >
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[var(--secondary)] border-b border-[var(--border)]">
            <tr>
              <th className="px-6 py-4 text-left">
                <button
                  onClick={() => onToggleSort('title')}
                  className="flex items-center gap-2 font-semibold text-[var(--foreground)] hover:text-[var(--primary-solid)] transition-colors"
                >
                  Assignment <ArrowUpDown className="w-4 h-4" />
                </button>
              </th>
              <th className="px-6 py-4 text-left font-semibold text-[var(--foreground)]">Subject</th>
              <th className="px-6 py-4 text-left">
                <button
                  onClick={() => onToggleSort('dueDate')}
                  className="flex items-center gap-2 font-semibold text-[var(--foreground)] hover:text-[var(--primary-solid)] transition-colors"
                >
                  Due Date <ArrowUpDown className="w-4 h-4" />
                </button>
              </th>
              <th className="px-6 py-4 text-left">
                <button
                  onClick={() => onToggleSort('status')}
                  className="flex items-center gap-2 font-semibold text-[var(--foreground)] hover:text-[var(--primary-solid)] transition-colors"
                >
                  Status <ArrowUpDown className="w-4 h-4" />
                </button>
              </th>
              <th className="px-6 py-4 text-left">
                <button
                  onClick={() => onToggleSort('priority')}
                  className="flex items-center gap-2 font-semibold text-[var(--foreground)] hover:text-[var(--primary-solid)] transition-colors"
                >
                  Priority <ArrowUpDown className="w-4 h-4" />
                </button>
              </th>
              <th className="px-6 py-4 text-left font-semibold text-[var(--foreground)]">Grade</th>
              <th className="px-6 py-4 text-right font-semibold text-[var(--foreground)]">Actions</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence mode="popLayout">
              {assignments.length > 0 ? (
                assignments.map((assignment, index) => (
                  <motion.tr
                    key={assignment.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-[var(--border)] hover:bg-[var(--secondary)] transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-[var(--foreground)]">{assignment.title}</p>
                        {assignment.description && (
                          <p className="text-sm text-[var(--muted-foreground)] truncate max-w-xs">{assignment.description}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[var(--foreground)]">{assignment.subject}</td>
                    <td className="px-6 py-4 text-[var(--foreground)]">{assignment.dueDate.toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <Badge className={statusColors[assignment.status]}>{assignment.status.replace('-', ' ')}</Badge>
                    </td>
                    <td className="px-6 py-4">
                      <Badge className={priorityColors[assignment.priority]} variant="outline">{assignment.priority}</Badge>
                    </td>
                    <td className="px-6 py-4">
                      {assignment.grade ? (
                        <span className="font-semibold text-green-600 dark:text-green-400">{assignment.grade}</span>
                      ) : (
                        <span className="text-[var(--muted-foreground)]">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
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
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7}>
                    <EmptyState
                      icon={ClipboardList}
                      title="No assignments found"
                      description="Try adjusting your filters or add a new assignment to get started."
                    />
                  </td>
                </tr>
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
