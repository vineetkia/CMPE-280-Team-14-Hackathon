"use client";

import { useState, useMemo, useEffect } from 'react';
import { useAssignments } from '@/hooks/useAssignments';
import { useToast } from '@/hooks/useToast';
import { Assignment } from '@/types';
import { AssignmentStats } from '@/components/assignments/AssignmentStats';
import { AssignmentFilters } from '@/components/assignments/AssignmentFilters';
import { AssignmentTable } from '@/components/assignments/AssignmentTable';
import { AssignmentCard } from '@/components/assignments/AssignmentCard';
import { AssignmentForm } from '@/components/assignments/AssignmentForm';

type SortField = 'title' | 'dueDate' | 'priority' | 'status';

export default function AssignmentsPage() {
  const { stats, uniqueGrades, getFilteredAndSorted, addAssignment, updateAssignment, deleteAssignment } = useAssignments();
  const { toast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterGrade, setFilterGrade] = useState('all');
  const [sortField, setSortField] = useState<SortField>('dueDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(null);

  // Voice assistant: open add form when voice command triggers
  useEffect(() => {
    const handler = (e: Event) => {
      if ((e as CustomEvent).detail?.action === 'add_assignment') {
        setEditingAssignment(null);
        setIsFormOpen(true);
      }
    };
    window.addEventListener('voice:action', handler);
    return () => window.removeEventListener('voice:action', handler);
  }, []);

  const filteredAssignments = useMemo(
    () => getFilteredAndSorted(searchQuery, filterStatus, filterPriority, sortField, sortDirection, filterGrade),
    [getFilteredAndSorted, searchQuery, filterStatus, filterPriority, sortField, sortDirection, filterGrade]
  );

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleEdit = (assignment: Assignment) => {
    setEditingAssignment(assignment);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteAssignment(id);
    toast({ title: 'Assignment deleted', variant: 'default' });
  };

  const handleFormSubmit = (data: {
    title: string;
    subject: string;
    description: string;
    dueDate: string;
    status: 'not-started' | 'in-progress' | 'completed';
    priority: 'low' | 'medium' | 'high';
    grade: string;
  }) => {
    if (editingAssignment) {
      updateAssignment(editingAssignment.id, {
        ...data,
        dueDate: new Date(data.dueDate),
      });
      toast({ title: 'Assignment updated', variant: 'default' });
    } else {
      addAssignment({
        ...data,
        dueDate: new Date(data.dueDate),
      });
      toast({ title: 'Assignment added', variant: 'default' });
    }
    resetForm();
  };

  const resetForm = () => {
    setEditingAssignment(null);
    setIsFormOpen(false);
  };

  return (
    <div className="space-y-6">
      <AssignmentStats stats={stats} />

      <AssignmentFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filterStatus={filterStatus}
        onStatusChange={setFilterStatus}
        filterPriority={filterPriority}
        onPriorityChange={setFilterPriority}
        filterGrade={filterGrade}
        onGradeChange={setFilterGrade}
        availableGrades={uniqueGrades}
        onAddClick={() => setIsFormOpen(true)}
      />

      <AssignmentTable
        assignments={filteredAssignments}
        sortField={sortField}
        sortDirection={sortDirection}
        onToggleSort={toggleSort}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <AssignmentCard
        assignments={filteredAssignments}
        sortField={sortField}
        sortDirection={sortDirection}
        onToggleSort={toggleSort}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <AssignmentForm
        isOpen={isFormOpen}
        onOpenChange={(open) => { if (!open) resetForm(); }}
        editingAssignment={editingAssignment}
        onSubmit={handleFormSubmit}
        onCancel={resetForm}
      />
    </div>
  );
}
