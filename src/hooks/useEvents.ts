"use client";

import { useState, useCallback, useEffect } from 'react';
import { CalendarEvent } from '@/types';

export function useEvents() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/events')
      .then(res => res.json())
      .then((data: CalendarEvent[]) => {
        setEvents(data.map(e => ({
          ...e,
          date: new Date(e.date),
        })));
      })
      .catch(err => console.warn('[useEvents] fetch error:', err))
      .finally(() => setLoading(false));
  }, []);

  const addEvent = useCallback(async (event: Omit<CalendarEvent, 'id'>) => {
    const res = await fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(event),
    });
    const newEvent = await res.json();
    const parsed: CalendarEvent = {
      ...newEvent,
      date: new Date(newEvent.date),
    };
    setEvents(prev => [...prev, parsed]);
    return parsed;
  }, []);

  const updateEvent = useCallback(async (id: string, updates: Partial<CalendarEvent>) => {
    await fetch(`/api/events/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    setEvents(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e));
  }, []);

  const deleteEvent = useCallback(async (id: string) => {
    await fetch(`/api/events/${id}`, { method: 'DELETE' });
    setEvents(prev => prev.filter(e => e.id !== id));
  }, []);

  const getEventsForDate = useCallback((date: Date) => {
    return events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.toDateString() === date.toDateString();
    });
  }, [events]);

  return {
    events,
    setEvents,
    addEvent,
    updateEvent,
    deleteEvent,
    getEventsForDate,
    loading,
  };
}
