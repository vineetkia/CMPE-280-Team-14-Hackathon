import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAssignments } from '@/hooks/useAssignments';

describe('useAssignments', () => {
  it('initial state is empty array', () => {
    const { result } = renderHook(() => useAssignments());
    expect(result.current.assignments).toEqual([]);
  });

  it('addAssignment creates with ID and createdAt', () => {
    const { result } = renderHook(() => useAssignments());
    let assignment: any;

    act(() => {
      assignment = result.current.addAssignment({
        title: 'HW1',
        subject: 'CS',
        description: 'First assignment',
        dueDate: new Date(2026, 3, 1),
        status: 'not-started',
        priority: 'high',
      });
    });

    expect(assignment.id).toBeDefined();
    expect(assignment.createdAt).toBeInstanceOf(Date);
    expect(result.current.assignments).toHaveLength(1);
  });

  it('updateAssignment modifies correct assignment', () => {
    const { result } = renderHook(() => useAssignments());
    let a: any;

    act(() => {
      a = result.current.addAssignment({
        title: 'Old',
        subject: 'Math',
        description: '',
        dueDate: new Date(),
        status: 'not-started',
        priority: 'low',
      });
    });

    act(() => {
      result.current.updateAssignment(a.id, { title: 'Updated', status: 'in-progress' });
    });

    expect(result.current.assignments[0].title).toBe('Updated');
    expect(result.current.assignments[0].status).toBe('in-progress');
  });

  it('deleteAssignment removes correctly', () => {
    const { result } = renderHook(() => useAssignments());
    let a1: any, a2: any;

    act(() => {
      a1 = result.current.addAssignment({ title: 'Keep', subject: 'S', description: '', dueDate: new Date(), status: 'not-started', priority: 'low' });
    });
    act(() => {
      a2 = result.current.addAssignment({ title: 'Remove', subject: 'S', description: '', dueDate: new Date(), status: 'not-started', priority: 'low' });
    });

    act(() => {
      result.current.deleteAssignment(a2.id);
    });

    expect(result.current.assignments).toHaveLength(1);
    expect(result.current.assignments[0].id).toBe(a1.id);
  });

  it('stats computes all 4 counts', () => {
    const { result } = renderHook(() => useAssignments());

    act(() => {
      result.current.addAssignment({ title: 'A1', subject: 'S', description: '', dueDate: new Date(), status: 'not-started', priority: 'low' });
    });
    act(() => {
      result.current.addAssignment({ title: 'A2', subject: 'S', description: '', dueDate: new Date(), status: 'in-progress', priority: 'medium' });
    });
    act(() => {
      result.current.addAssignment({ title: 'A3', subject: 'S', description: '', dueDate: new Date(), status: 'completed', priority: 'high' });
    });
    act(() => {
      result.current.addAssignment({ title: 'A4', subject: 'S', description: '', dueDate: new Date(), status: 'completed', priority: 'low' });
    });

    expect(result.current.stats).toEqual({
      total: 4,
      notStarted: 1,
      inProgress: 1,
      completed: 2,
    });
  });

  it('getFilteredAndSorted filters by search (title and subject)', () => {
    const { result } = renderHook(() => useAssignments());

    act(() => {
      result.current.addAssignment({ title: 'Physics Lab', subject: 'Physics', description: '', dueDate: new Date(), status: 'not-started', priority: 'low' });
    });
    act(() => {
      result.current.addAssignment({ title: 'Essay', subject: 'English', description: '', dueDate: new Date(), status: 'not-started', priority: 'low' });
    });

    const filtered = result.current.getFilteredAndSorted('physics', 'all', 'all', 'title', 'asc');
    expect(filtered).toHaveLength(1);
    expect(filtered[0].title).toBe('Physics Lab');
  });

  it('getFilteredAndSorted filters by status', () => {
    const { result } = renderHook(() => useAssignments());

    act(() => {
      result.current.addAssignment({ title: 'A1', subject: 'S', description: '', dueDate: new Date(), status: 'completed', priority: 'low' });
    });
    act(() => {
      result.current.addAssignment({ title: 'A2', subject: 'S', description: '', dueDate: new Date(), status: 'not-started', priority: 'low' });
    });

    const filtered = result.current.getFilteredAndSorted('', 'completed', 'all', 'title', 'asc');
    expect(filtered).toHaveLength(1);
    expect(filtered[0].title).toBe('A1');
  });

  it('getFilteredAndSorted sorts by dueDate asc', () => {
    const { result } = renderHook(() => useAssignments());

    act(() => {
      result.current.addAssignment({ title: 'Later', subject: 'S', description: '', dueDate: new Date(2026, 5, 15), status: 'not-started', priority: 'low' });
    });
    act(() => {
      result.current.addAssignment({ title: 'Sooner', subject: 'S', description: '', dueDate: new Date(2026, 3, 1), status: 'not-started', priority: 'low' });
    });

    const sorted = result.current.getFilteredAndSorted('', 'all', 'all', 'dueDate', 'asc');
    expect(sorted[0].title).toBe('Sooner');
    expect(sorted[1].title).toBe('Later');
  });

  it('getFilteredAndSorted sorts by priority desc', () => {
    const { result } = renderHook(() => useAssignments());

    act(() => {
      result.current.addAssignment({ title: 'Low', subject: 'S', description: '', dueDate: new Date(), status: 'not-started', priority: 'low' });
    });
    act(() => {
      result.current.addAssignment({ title: 'High', subject: 'S', description: '', dueDate: new Date(), status: 'not-started', priority: 'high' });
    });
    act(() => {
      result.current.addAssignment({ title: 'Med', subject: 'S', description: '', dueDate: new Date(), status: 'not-started', priority: 'medium' });
    });

    const sorted = result.current.getFilteredAndSorted('', 'all', 'all', 'priority', 'desc');
    expect(sorted[0].title).toBe('High');
    expect(sorted[1].title).toBe('Med');
    expect(sorted[2].title).toBe('Low');
  });

  it('getFilteredAndSorted filters by priority', () => {
    const { result } = renderHook(() => useAssignments());

    act(() => {
      result.current.addAssignment({ title: 'A1', subject: 'S', description: '', dueDate: new Date(), status: 'not-started', priority: 'high' });
    });
    act(() => {
      result.current.addAssignment({ title: 'A2', subject: 'S', description: '', dueDate: new Date(), status: 'not-started', priority: 'low' });
    });

    const filtered = result.current.getFilteredAndSorted('', 'all', 'high', 'title', 'asc');
    expect(filtered).toHaveLength(1);
    expect(filtered[0].title).toBe('A1');
  });
});
