import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useEvents } from '@/hooks/useEvents';

describe('useEvents', () => {
  it('initial state is empty array', () => {
    const { result } = renderHook(() => useEvents());
    expect(result.current.events).toEqual([]);
  });

  it('addEvent creates event with ID', () => {
    const { result } = renderHook(() => useEvents());
    let event: any;

    act(() => {
      event = result.current.addEvent({
        title: 'CS Lecture',
        date: new Date(2026, 2, 20),
        type: 'class',
      });
    });

    expect(event.id).toBeDefined();
    expect(event.title).toBe('CS Lecture');
    expect(result.current.events).toHaveLength(1);
  });

  it('deleteEvent removes correctly', () => {
    const { result } = renderHook(() => useEvents());
    let e1: any, e2: any;

    act(() => {
      e1 = result.current.addEvent({ title: 'Keep', date: new Date(2026, 2, 20), type: 'class' });
    });
    act(() => {
      e2 = result.current.addEvent({ title: 'Remove', date: new Date(2026, 2, 21), type: 'exam' });
    });

    act(() => {
      result.current.deleteEvent(e2.id);
    });

    expect(result.current.events).toHaveLength(1);
    expect(result.current.events[0].id).toBe(e1.id);
  });

  it('getEventsForDate returns events on matching date', () => {
    const { result } = renderHook(() => useEvents());
    const targetDate = new Date(2026, 2, 20);

    act(() => {
      result.current.addEvent({ title: 'Match', date: new Date(2026, 2, 20, 10, 0), type: 'class' });
    });
    act(() => {
      result.current.addEvent({ title: 'No Match', date: new Date(2026, 2, 21), type: 'exam' });
    });
    act(() => {
      result.current.addEvent({ title: 'Also Match', date: new Date(2026, 2, 20, 14, 30), type: 'study' });
    });

    const eventsForDate = result.current.getEventsForDate(targetDate);
    expect(eventsForDate).toHaveLength(2);
    expect(eventsForDate.map((e: any) => e.title)).toContain('Match');
    expect(eventsForDate.map((e: any) => e.title)).toContain('Also Match');
  });

  it('getEventsForDate returns empty for date with no events', () => {
    const { result } = renderHook(() => useEvents());

    act(() => {
      result.current.addEvent({ title: 'E', date: new Date(2026, 2, 20), type: 'class' });
    });

    const eventsForDate = result.current.getEventsForDate(new Date(2026, 5, 1));
    expect(eventsForDate).toEqual([]);
  });

  it('updateEvent modifies the correct event', () => {
    const { result } = renderHook(() => useEvents());
    let event: any;

    act(() => {
      event = result.current.addEvent({ title: 'Old Title', date: new Date(2026, 2, 20), type: 'class' });
    });

    act(() => {
      result.current.updateEvent(event.id, { title: 'New Title' });
    });

    expect(result.current.events[0].title).toBe('New Title');
  });
});
