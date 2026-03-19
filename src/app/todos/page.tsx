"use client";

import { useState, useMemo, useEffect } from 'react';
import { AnimatePresence } from 'motion/react';
import { CheckCircle2 } from 'lucide-react';
import { Todo } from '@/types';
import { useTodos } from '@/hooks/useTodos';
import { useAssignments } from '@/hooks/useAssignments';
import { useEvents } from '@/hooks/useEvents';
import { useToast } from '@/hooks/useToast';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/shared/EmptyState';
import { TodoHeader } from '@/components/todos/TodoHeader';
import { TodoFilters } from '@/components/todos/TodoFilters';
import { TodoItem } from '@/components/todos/TodoItem';
import { TodoForm, TodoFormData } from '@/components/todos/TodoForm';
import { TodoAISuggestions } from '@/components/todos/TodoAISuggestions';

export default function TodosPage() {
  const {
    todos,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleTodo,
    completedCount,
    progressPercentage,
    getFilteredTodos,
  } = useTodos();
  const { assignments } = useAssignments();
  const { events } = useEvents();
  const { toast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);

  // Voice assistant: open add dialog when voice command triggers
  useEffect(() => {
    const handler = (e: Event) => {
      if ((e as CustomEvent).detail?.action === 'add_todo') {
        setIsAddDialogOpen(true);
      }
    };
    window.addEventListener('voice:action', handler);
    return () => window.removeEventListener('voice:action', handler);
  }, []);

  const filteredTodos = useMemo(
    () => getFilteredTodos(searchQuery, filterPriority, filterCategory),
    [getFilteredTodos, searchQuery, filterPriority, filterCategory]
  );

  const handleSubmit = (formData: TodoFormData) => {
    if (editingTodo) {
      updateTodo(editingTodo.id, {
        ...formData,
        dueDate: formData.dueDate ? new Date(formData.dueDate) : undefined,
      });
      toast({
        title: 'Todo updated',
        description: `"${formData.title}" has been updated.`,
      });
    } else {
      addTodo({
        ...formData,
        completed: false,
        dueDate: formData.dueDate ? new Date(formData.dueDate) : undefined,
      });
      toast({
        title: 'Todo added',
        description: `"${formData.title}" has been added to your list.`,
      });
    }
    resetForm();
  };

  const resetForm = () => {
    setEditingTodo(null);
    setIsAddDialogOpen(false);
  };

  const handleEdit = (todo: Todo) => {
    setEditingTodo(todo);
    setIsAddDialogOpen(true);
  };

  const handleToggle = (id: string) => {
    const todo = todos.find((t) => t.id === id);
    if (todo) {
      toggleTodo(id);
      toast({
        title: todo.completed ? 'Todo reopened' : 'Todo completed',
        description: `"${todo.title}" marked as ${todo.completed ? 'pending' : 'done'}.`,
      });
    }
  };

  const handleDelete = (id: string) => {
    const todo = todos.find((t) => t.id === id);
    deleteTodo(id);
    toast({
      title: 'Todo deleted',
      description: todo ? `"${todo.title}" has been deleted.` : 'Todo has been deleted.',
      variant: 'destructive',
    });
  };

  const hasActiveFilters =
    searchQuery !== '' || filterPriority !== 'all' || filterCategory !== 'all';

  return (
    <div className="space-y-6">
      <TodoHeader
        completedCount={completedCount}
        totalCount={todos.length}
        progressPercentage={progressPercentage}
        onAddClick={() => setIsAddDialogOpen(true)}
        extraActions={
          <TodoAISuggestions
            todos={todos}
            assignments={assignments}
            events={events}
            onAddTodo={addTodo}
          />
        }
      />

      <TodoFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filterPriority={filterPriority}
        onPriorityChange={setFilterPriority}
        filterCategory={filterCategory}
        onCategoryChange={setFilterCategory}
      />

      <AnimatePresence mode="popLayout">
        {filteredTodos.length > 0 ? (
          <div className="space-y-3">
            {filteredTodos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={handleToggle}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        ) : (
          <div className="backdrop-blur-xl bg-[var(--glass)] border border-[var(--glass-border)] rounded-2xl shadow-xl">
            <EmptyState
              icon={CheckCircle2}
              title="No todos found"
              description={
                hasActiveFilters
                  ? 'Try adjusting your filters'
                  : 'Click "Add Todo" to get started'
              }
            />
          </div>
        )}
      </AnimatePresence>

      <TodoForm
        isOpen={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        editingTodo={editingTodo}
        onSubmit={handleSubmit}
        onCancel={resetForm}
      />
    </div>
  );
}
