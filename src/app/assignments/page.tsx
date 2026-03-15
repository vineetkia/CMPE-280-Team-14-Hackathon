"use client";

import { useState, useMemo } from 'react';
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
  const { stats, getFilteredAndSorted, addAssignment, updateAssignment, deleteAssignment } = useAssignments();
  const { toast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [sortField, setSortField] = useState<SortField>('dueDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(null);

  const filteredAssignments = useMemo(
    () => getFilteredAndSorted(searchQuery, filterStatus, filterPriority, sortField, sortDirection),
    [getFilteredAndSorted, searchQuery, filterStatus, filterPriority, sortField, sortDirection]
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
