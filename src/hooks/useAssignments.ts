"use client";

import { useCallback, useMemo } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { Assignment } from '@/types';

const STORAGE_KEY = 'studypilot_assignments';

type SortField = 'title' | 'dueDate' | 'priority' | 'status';

export function useAssignments() {
  const [assignments, setAssignments] = useLocalStorage<Assignment[]>(STORAGE_KEY, []);

  const addAssignment = useCallback((assignment: Omit<Assignment, 'id' | 'createdAt'>) => {
    const newAssignment: Assignment = {
      ...assignment,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    };
    setAssignments(prev => [...prev, newAssignment]);
    return newAssignment;
  }, [setAssignments]);

  const updateAssignment = useCallback((id: string, updates: Partial<Assignment>) => {
    setAssignments(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a));
  }, [setAssignments]);

  const deleteAssignment = useCallback((id: string) => {
    setAssignments(prev => prev.filter(a => a.id !== id));
  }, [setAssignments]);

  const stats = useMemo(() => ({
    total: assignments.length,
    notStarted: assignments.filter(a => a.status === 'not-started').length,
    inProgress: assignments.filter(a => a.status === 'in-progress').length,
    completed: assignments.filter(a => a.status === 'completed').length,
  }), [assignments]);

  const getFilteredAndSorted = useCallback((
    search: string,
    status: string,
    priority: string,
    sortField: SortField,
    sortDirection: 'asc' | 'desc'
  ) => {
    return assignments
      .filter(a => {
        const matchesSearch = a.title.toLowerCase().includes(search.toLowerCase()) ||
                             a.subject.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = status === 'all' || a.status === status;
        const matchesPriority = priority === 'all' || a.priority === priority;
        return matchesSearch && matchesStatus && matchesPriority;
      })
      .sort((a, b) => {
        let comparison = 0;
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        const statusOrder = { 'not-started': 1, 'in-progress': 2, completed: 3 };

        switch (sortField) {
          case 'title': comparison = a.title.localeCompare(b.title); break;
          case 'dueDate': comparison = a.dueDate.getTime() - b.dueDate.getTime(); break;
          case 'priority': comparison = priorityOrder[a.priority] - priorityOrder[b.priority]; break;
          case 'status': comparison = statusOrder[a.status] - statusOrder[b.status]; break;
        }
        return sortDirection === 'asc' ? comparison : -comparison;
      });
  }, [assignments]);

  return {
    assignments,
    setAssignments,
    addAssignment,
    updateAssignment,
    deleteAssignment,
    stats,
    getFilteredAndSorted,
  };
}
