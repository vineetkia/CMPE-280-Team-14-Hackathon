"use client";

import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { CalendarEvent } from '@/types';

const STORAGE_KEY = 'studypilot_events';

export function useEvents() {
  const [events, setEvents] = useLocalStorage<CalendarEvent[]>(STORAGE_KEY, []);

  const addEvent = useCallback((event: Omit<CalendarEvent, 'id'>) => {
    const newEvent: CalendarEvent = {
      ...event,
      id: crypto.randomUUID(),
    };
    setEvents(prev => [...prev, newEvent]);
    return newEvent;
  }, [setEvents]);

  const updateEvent = useCallback((id: string, updates: Partial<CalendarEvent>) => {
    setEvents(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e));
  }, [setEvents]);

  const deleteEvent = useCallback((id: string) => {
    setEvents(prev => prev.filter(e => e.id !== id));
  }, [setEvents]);

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
  };
}
