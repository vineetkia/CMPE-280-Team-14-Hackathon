"use client";

import { useState, useEffect, FormEvent } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { motion } from 'motion/react';
import { CalendarEvent } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { gradientButton } from '@/lib/constants';
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

type EventType = 'class' | 'exam' | 'assignment' | 'study' | 'other';

interface EventFormData {
  title: string;
  description: string;
  type: EventType;
}

interface EventFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedDate: Date | null;
  existingEvents: CalendarEvent[];
  onSubmit: (data: EventFormData) => void;
  onDeleteEvent: (id: string) => void;
  onCancel: () => void;
}

const defaultFormData: EventFormData = {
  title: '',
  description: '',
  type: 'other',
};

export function EventForm({
  isOpen,
  onOpenChange,
  selectedDate,
  existingEvents,
  onSubmit,
  onDeleteEvent,
  onCancel,
}: EventFormProps) {
  const [formData, setFormData] = useState<EventFormData>(defaultFormData);

  useEffect(() => {
    if (isOpen) {
      setFormData(defaultFormData);
    }
  }, [isOpen]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !selectedDate) return;
    onSubmit(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="backdrop-blur-xl bg-[var(--popover)] border border-[var(--glass-border)]">
        <DialogHeader>
          <DialogTitle>
            {selectedDate && `Event for ${selectedDate.toLocaleDateString()}`}
          </DialogTitle>
        </DialogHeader>

        {existingEvents.length > 0 && (
          <div className="space-y-2 mb-4">
            <h3 className="font-semibold text-sm text-[var(--muted-foreground)]">Existing Events:</h3>
            {existingEvents.map(event => (
              <div
                key={event.id}
                className="flex items-center justify-between p-3 rounded-lg"
                style={{ backgroundColor: `${event.color}10` }}
              >
                <div>
                  <p className="font-medium" style={{ color: event.color }}>{event.title}</p>
                  {event.description && (
                    <p className="text-sm text-[var(--muted-foreground)]">{event.description}</p>
                  )}
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-2 rounded-lg hover:bg-red-500/20 text-red-500"
                      aria-label={`Delete event ${event.title}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </motion.button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Event</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete &quot;{event.title}&quot;? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => onDeleteEvent(event.id)}
                        className="bg-red-500 hover:bg-red-600"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Event Title</Label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter event title..."
            />
          </div>
          <div>
            <Label>Description (optional)</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Add more details..."
              rows={3}
            />
          </div>
          <div>
            <Label>Event Type</Label>
            <Select
              value={formData.type}
              onValueChange={(value: EventType) => setFormData({ ...formData, type: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="class">Class</SelectItem>
                <SelectItem value="exam">Exam</SelectItem>
                <SelectItem value="assignment">Assignment</SelectItem>
                <SelectItem value="study">Study Session</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-3 pt-4">
            <Button type="submit" className={'flex-1 ' + gradientButton}>
              <Plus className="w-4 h-4 mr-2" />
              Add Event
            </Button>
            <Button type="button" onClick={onCancel} variant="outline">
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
