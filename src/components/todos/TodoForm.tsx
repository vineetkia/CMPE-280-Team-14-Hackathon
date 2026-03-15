"use client";

import { useState, useEffect, FormEvent } from 'react';
import { Check, X } from 'lucide-react';
import { Todo } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { gradientButton } from '@/lib/constants';

type TodoPriority = 'low' | 'medium' | 'high';
type TodoCategory = 'study' | 'assignment' | 'exam' | 'project' | 'other';

export interface TodoFormData {
  title: string;
  description: string;
  priority: TodoPriority;
  category: TodoCategory;
  dueDate: string;
}

interface TodoFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editingTodo: Todo | null;
  onSubmit: (data: TodoFormData) => void;
  onCancel: () => void;
}

const defaultFormData: TodoFormData = {
  title: '',
  description: '',
  priority: 'medium',
  category: 'study',
  dueDate: '',
};

export function TodoForm({
  isOpen,
  onOpenChange,
  editingTodo,
  onSubmit,
  onCancel,
}: TodoFormProps) {
  const [formData, setFormData] = useState<TodoFormData>(defaultFormData);

  useEffect(() => {
    if (editingTodo) {
      setFormData({
        title: editingTodo.title,
        description: editingTodo.description || '',
        priority: editingTodo.priority,
        category: editingTodo.category,
        dueDate: editingTodo.dueDate
          ? new Date(editingTodo.dueDate).toISOString().split('T')[0]
          : '',
      });
    } else {
      setFormData(defaultFormData);
    }
  }, [editingTodo, isOpen]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;
    onSubmit(formData);
    setFormData(defaultFormData);
  };

  const handleCancel = () => {
    setFormData(defaultFormData);
    onCancel();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) handleCancel(); else onOpenChange(open); }}>
      <DialogContent className="backdrop-blur-xl bg-[var(--popover)] border border-[var(--glass-border)]">
        <DialogHeader>
          <DialogTitle>{editingTodo ? 'Edit Todo' : 'Add New Todo'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="todo-title">Title</Label>
            <Input
              id="todo-title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter todo title..."
              required
            />
          </div>
          <div>
            <Label htmlFor="todo-description">Description (optional)</Label>
            <Textarea
              id="todo-description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Add more details..."
              rows={3}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="todo-priority">Priority</Label>
              <Select
                value={formData.priority}
                onValueChange={(value: TodoPriority) =>
                  setFormData({ ...formData, priority: value })
                }
              >
                <SelectTrigger id="todo-priority">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="todo-category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value: TodoCategory) =>
                  setFormData({ ...formData, category: value })
                }
              >
                <SelectTrigger id="todo-category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="study">Study</SelectItem>
                  <SelectItem value="assignment">Assignment</SelectItem>
                  <SelectItem value="exam">Exam</SelectItem>
                  <SelectItem value="project">Project</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label htmlFor="todo-due-date">Due Date (optional)</Label>
            <Input
              id="todo-due-date"
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
            />
          </div>
          <div className="flex gap-3 pt-4">
            <Button type="submit" className={`flex-1 ${gradientButton}`}>
              <Check className="w-4 h-4 mr-2" />
              {editingTodo ? 'Update' : 'Add'} Todo
            </Button>
            <Button type="button" onClick={handleCancel} variant="outline">
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
