"use client";

import { useState, useCallback, useMemo, useEffect } from 'react';
import { Todo } from '@/types';

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch todos from API on mount
  useEffect(() => {
    fetch('/api/todos')
      .then(res => res.json())
      .then((data: Todo[]) => {
        setTodos(data.map(t => ({
          ...t,
          dueDate: t.dueDate ? new Date(t.dueDate) : undefined,
          createdAt: new Date(t.createdAt),
        })));
      })
      .catch(err => console.error('[useTodos] fetch error:', err))
      .finally(() => setLoading(false));
  }, []);

  const addTodo = useCallback(async (todo: Omit<Todo, 'id' | 'createdAt'>) => {
    const res = await fetch('/api/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(todo),
    });
    const newTodo = await res.json();
    const parsed: Todo = {
      ...newTodo,
      dueDate: newTodo.dueDate ? new Date(newTodo.dueDate) : undefined,
      createdAt: new Date(newTodo.createdAt),
    };
    setTodos(prev => [parsed, ...prev]);
    return parsed;
  }, []);

  const updateTodo = useCallback(async (id: string, updates: Partial<Todo>) => {
    await fetch(`/api/todos/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    setTodos(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  }, []);

  const deleteTodo = useCallback(async (id: string) => {
    await fetch(`/api/todos/${id}`, { method: 'DELETE' });
    setTodos(prev => prev.filter(t => t.id !== id));
  }, []);

  const toggleTodo = useCallback(async (id: string) => {
    const todo = todos.find(t => t.id === id);
    if (!todo) return;
    const newCompleted = !todo.completed;
    await fetch(`/api/todos/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: newCompleted }),
    });
    setTodos(prev => prev.map(t => t.id === id ? { ...t, completed: newCompleted } : t));
  }, [todos]);

  const completedCount = useMemo(() => todos.filter(t => t.completed).length, [todos]);
  const progressPercentage = useMemo(() => todos.length > 0 ? (completedCount / todos.length) * 100 : 0, [completedCount, todos.length]);

  const getFilteredTodos = useCallback((search: string, priority: string, category: string) => {
    return todos.filter(todo => {
      const matchesSearch = todo.title.toLowerCase().includes(search.toLowerCase()) ||
                           todo.description?.toLowerCase().includes(search.toLowerCase());
      const matchesPriority = priority === 'all' || todo.priority === priority;
      const matchesCategory = category === 'all' || todo.category === category;
      return matchesSearch && matchesPriority && matchesCategory;
    });
  }, [todos]);

  return {
    todos,
    setTodos,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleTodo,
    completedCount,
    progressPercentage,
    getFilteredTodos,
    loading,
  };
}
