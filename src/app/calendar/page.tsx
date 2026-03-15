"use client";

import { useState, useMemo } from 'react';
import { useEvents } from '@/hooks/useEvents';
import { useToast } from '@/hooks/useToast';
import { eventTypeColors } from '@/lib/constants';
import { CalendarHeader } from '@/components/calendar/CalendarHeader';
import { CalendarGrid } from '@/components/calendar/CalendarGrid';
import { CalendarAgenda } from '@/components/calendar/CalendarAgenda';
import { EventForm } from '@/components/calendar/EventForm';

export default function CalendarPage() {
  const { events, addEvent, deleteEvent, getEventsForDate } = useEvents();
  const { toast } = useToast();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const days = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const result: Date[] = [];

    for (let i = firstDay - 1; i >= 0; i--) {
      result.push(new Date(year, month - 1, daysInPrevMonth - i));
    }
    for (let i = 1; i <= daysInMonth; i++) {
      result.push(new Date(year, month, i));
    }
    const remaining = 42 - result.length;
    for (let i = 1; i <= remaining; i++) {
      result.push(new Date(year, month + 1, i));
    }

    return result;
  }, [currentDate]);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setIsFormOpen(true);
  };

  const handleAddEvent = () => {
    setSelectedDate(new Date());
    setIsFormOpen(true);
  };

  const handleFormSubmit = (data: { title: string; description: string; type: 'class' | 'exam' | 'assignment' | 'study' | 'other' }) => {
    if (!selectedDate) return;
    addEvent({
      ...data,
      date: selectedDate,
      color: eventTypeColors[data.type],
    });
    toast({ title: 'Event added', variant: 'default' });
    resetForm();
  };

  const handleDeleteEvent = (id: string) => {
    deleteEvent(id);
    toast({ title: 'Event deleted', variant: 'default' });
  };

  const resetForm = () => {
    setSelectedDate(null);
    setIsFormOpen(false);
  };

  const existingEventsForSelected = selectedDate ? getEventsForDate(selectedDate) : [];

  return (
    <div className="space-y-6">
      <CalendarHeader
        currentDate={currentDate}
        onPrevMonth={handlePrevMonth}
        onNextMonth={handleNextMonth}
        onAddEvent={handleAddEvent}
      />

      <CalendarGrid
        days={days}
        currentDate={currentDate}
        events={events}
        getEventsForDate={getEventsForDate}
        onDateClick={handleDateClick}
      />

      <CalendarAgenda
        currentDate={currentDate}
        events={events}
        onDateClick={handleDateClick}
      />

      <EventForm
        isOpen={isFormOpen}
        onOpenChange={(open) => { if (!open) resetForm(); }}
        selectedDate={selectedDate}
        existingEvents={existingEventsForSelected}
        onSubmit={handleFormSubmit}
        onDeleteEvent={handleDeleteEvent}
        onCancel={resetForm}
      />
    </div>
  );
}
