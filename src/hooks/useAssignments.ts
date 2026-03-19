"use client";

import { useState, useCallback, useMemo, useEffect } from 'react';
import { Assignment } from '@/types';

type SortField = 'title' | 'dueDate' | 'priority' | 'status';

export function useAssignments() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/assignments')
      .then(res => res.json())
      .then((data: Assignment[]) => {
        setAssignments(data.map(a => ({
          ...a,
          dueDate: new Date(a.dueDate),
          createdAt: new Date(a.createdAt),
        })));
      })
      .catch(err => console.error('[useAssignments] fetch error:', err))
      .finally(() => setLoading(false));
  }, []);

  const addAssignment = useCallback(async (assignment: Omit<Assignment, 'id' | 'createdAt'>) => {
    const res = await fetch('/api/assignments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(assignment),
    });
    const newAssignment = await res.json();
    const parsed: Assignment = {
      ...newAssignment,
      dueDate: new Date(newAssignment.dueDate),
      createdAt: new Date(newAssignment.createdAt),
    };
    setAssignments(prev => [parsed, ...prev]);
    return parsed;
  }, []);

  const updateAssignment = useCallback(async (id: string, updates: Partial<Assignment>) => {
    await fetch(`/api/assignments/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    setAssignments(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a));
  }, []);

  const deleteAssignment = useCallback(async (id: string) => {
    await fetch(`/api/assignments/${id}`, { method: 'DELETE' });
    setAssignments(prev => prev.filter(a => a.id !== id));
  }, []);

  const stats = useMemo(() => ({
    total: assignments.length,
    notStarted: assignments.filter(a => a.status === 'not-started').length,
    inProgress: assignments.filter(a => a.status === 'in-progress').length,
    completed: assignments.filter(a => a.status === 'completed').length,
  }), [assignments]);

  // Unique grade values for filter dropdown
  const uniqueGrades = useMemo(() => {
    const grades = assignments
      .map(a => a.grade?.trim())
      .filter((g): g is string => !!g);
    return [...new Set(grades)].sort();
  }, [assignments]);

  const getFilteredAndSorted = useCallback((
    search: string,
    status: string,
    priority: string,
    sortField: SortField,
    sortDirection: 'asc' | 'desc',
    grade?: string
  ) => {
    return assignments
      .filter(a => {
        const matchesSearch = a.title.toLowerCase().includes(search.toLowerCase()) ||
                             a.subject.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = status === 'all' || a.status === status;
        const matchesPriority = priority === 'all' || a.priority === priority;
        const matchesGrade = !grade || grade === 'all'
          ? true
          : grade === 'ungraded'
            ? !a.grade || !a.grade.trim()
            : a.grade?.trim().toLowerCase() === grade.toLowerCase();
        return matchesSearch && matchesStatus && matchesPriority && matchesGrade;
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
    uniqueGrades,
    getFilteredAndSorted,
    loading,
  };
}
