"use client";

import { useState, useEffect, FormEvent } from 'react';
import { Check, X } from 'lucide-react';
import { Assignment } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { gradientButton } from '@/lib/constants';

interface AssignmentFormData {
  title: string;
  subject: string;
  description: string;
  dueDate: string;
  status: 'not-started' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  grade: string;
}

interface AssignmentFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editingAssignment: Assignment | null;
  onSubmit: (data: AssignmentFormData) => void;
  onCancel: () => void;
}

const defaultFormData: AssignmentFormData = {
  title: '',
  subject: '',
  description: '',
  dueDate: '',
  status: 'not-started',
  priority: 'medium',
  grade: '',
};

export function AssignmentForm({
  isOpen,
  onOpenChange,
  editingAssignment,
  onSubmit,
  onCancel,
}: AssignmentFormProps) {
  const [formData, setFormData] = useState<AssignmentFormData>(defaultFormData);

  useEffect(() => {
    if (editingAssignment) {
      setFormData({
        title: editingAssignment.title,
        subject: editingAssignment.subject,
        description: editingAssignment.description,
        dueDate: editingAssignment.dueDate.toISOString().split('T')[0],
        status: editingAssignment.status,
        priority: editingAssignment.priority,
        grade: editingAssignment.grade || '',
      });
    } else {
      setFormData(defaultFormData);
    }
  }, [editingAssignment, isOpen]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.dueDate) return;
    onSubmit(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="backdrop-blur-xl bg-[var(--popover)] border border-[var(--glass-border)] max-w-2xl">
        <DialogHeader>
          <DialogTitle>{editingAssignment ? 'Edit Assignment' : 'Add New Assignment'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>Assignment Title</Label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter title..."
              />
            </div>
            <div>
              <Label>Subject</Label>
              <Input
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="e.g., Mathematics"
              />
            </div>
          </div>
          <div>
            <Label>Description</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Add details about the assignment..."
              rows={3}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>Due Date</Label>
              <Input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              />
            </div>
            <div>
              <Label>Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: 'not-started' | 'in-progress' | 'completed') =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="not-started">Not Started</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>Priority</Label>
              <Select
                value={formData.priority}
                onValueChange={(value: 'low' | 'medium' | 'high') =>
                  setFormData({ ...formData, priority: value })
                }
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Grade (optional)</Label>
              <Input
                value={formData.grade}
                onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                placeholder="e.g., A, B+, 95%"
              />
            </div>
          </div>
          <div className="flex gap-3 pt-4">
            <Button type="submit" className={'flex-1 ' + gradientButton}>
              <Check className="w-4 h-4 mr-2" />
              {editingAssignment ? 'Update' : 'Add'} Assignment
            </Button>
            <Button type="button" onClick={onCancel} variant="outline">
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
