"use client";

import { useCallback, useMemo } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { Todo } from '@/types';

const STORAGE_KEY = 'studypilot_todos';

export function useTodos() {
  const [todos, setTodos] = useLocalStorage<Todo[]>(STORAGE_KEY, []);

  const addTodo = useCallback((todo: Omit<Todo, 'id' | 'createdAt'>) => {
    const newTodo: Todo = {
      ...todo,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    };
    setTodos(prev => [...prev, newTodo]);
    return newTodo;
  }, [setTodos]);

  const updateTodo = useCallback((id: string, updates: Partial<Todo>) => {
    setTodos(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  }, [setTodos]);

  const deleteTodo = useCallback((id: string) => {
    setTodos(prev => prev.filter(t => t.id !== id));
  }, [setTodos]);

  const toggleTodo = useCallback((id: string) => {
    setTodos(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  }, [setTodos]);

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
  };
}
