import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTodos } from '@/hooks/useTodos';

describe('useTodos', () => {
  it('initial state is empty array', () => {
    const { result } = renderHook(() => useTodos());
    expect(result.current.todos).toEqual([]);
  });

  it('addTodo creates todo with ID and createdAt', () => {
    const { result } = renderHook(() => useTodos());
    let newTodo: any;

    act(() => {
      newTodo = result.current.addTodo({
        title: 'Study',
        completed: false,
        priority: 'high',
        category: 'study',
      });
    });

    expect(newTodo.id).toBeDefined();
    expect(newTodo.createdAt).toBeInstanceOf(Date);
    expect(result.current.todos).toHaveLength(1);
    expect(result.current.todos[0].title).toBe('Study');
  });

  it('updateTodo modifies correct todo', () => {
    const { result } = renderHook(() => useTodos());
    let todo: any;

    act(() => {
      todo = result.current.addTodo({ title: 'Old', completed: false, priority: 'low', category: 'other' });
    });

    act(() => {
      result.current.updateTodo(todo.id, { title: 'New' });
    });

    expect(result.current.todos[0].title).toBe('New');
  });

  it('deleteTodo removes correct todo', () => {
    const { result } = renderHook(() => useTodos());
    let t1: any, t2: any;

    act(() => {
      t1 = result.current.addTodo({ title: 'Keep', completed: false, priority: 'low', category: 'study' });
    });
    act(() => {
      t2 = result.current.addTodo({ title: 'Remove', completed: false, priority: 'low', category: 'study' });
    });

    act(() => {
      result.current.deleteTodo(t2.id);
    });

    expect(result.current.todos).toHaveLength(1);
    expect(result.current.todos[0].id).toBe(t1.id);
  });

  it('toggleTodo flips completed status', () => {
    const { result } = renderHook(() => useTodos());
    let todo: any;

    act(() => {
      todo = result.current.addTodo({ title: 'Toggle me', completed: false, priority: 'medium', category: 'study' });
    });

    expect(result.current.todos[0].completed).toBe(false);

    act(() => {
      result.current.toggleTodo(todo.id);
    });

    expect(result.current.todos[0].completed).toBe(true);

    act(() => {
      result.current.toggleTodo(todo.id);
    });

    expect(result.current.todos[0].completed).toBe(false);
  });

  it('completedCount counts correctly', () => {
    const { result } = renderHook(() => useTodos());

    act(() => {
      result.current.addTodo({ title: 'A', completed: true, priority: 'low', category: 'study' });
    });
    act(() => {
      result.current.addTodo({ title: 'B', completed: false, priority: 'low', category: 'study' });
    });
    act(() => {
      result.current.addTodo({ title: 'C', completed: true, priority: 'low', category: 'study' });
    });

    expect(result.current.completedCount).toBe(2);
  });

  it('progressPercentage calculates correctly', () => {
    const { result } = renderHook(() => useTodos());

    // 0 todos should give 0%
    expect(result.current.progressPercentage).toBe(0);

    act(() => {
      result.current.addTodo({ title: 'A', completed: true, priority: 'low', category: 'study' });
    });
    act(() => {
      result.current.addTodo({ title: 'B', completed: false, priority: 'low', category: 'study' });
    });

    // 1 out of 2 = 50%
    expect(result.current.progressPercentage).toBe(50);
  });

  it('getFilteredTodos filters by search', () => {
    const { result } = renderHook(() => useTodos());

    act(() => {
      result.current.addTodo({ title: 'Math homework', completed: false, priority: 'low', category: 'study' });
    });
    act(() => {
      result.current.addTodo({ title: 'Read chapter', completed: false, priority: 'low', category: 'study' });
    });

    const filtered = result.current.getFilteredTodos('math', 'all', 'all');
    expect(filtered).toHaveLength(1);
    expect(filtered[0].title).toBe('Math homework');
  });

  it('getFilteredTodos filters by priority', () => {
    const { result } = renderHook(() => useTodos());

    act(() => {
      result.current.addTodo({ title: 'A', completed: false, priority: 'high', category: 'study' });
    });
    act(() => {
      result.current.addTodo({ title: 'B', completed: false, priority: 'low', category: 'study' });
    });

    const filtered = result.current.getFilteredTodos('', 'high', 'all');
    expect(filtered).toHaveLength(1);
    expect(filtered[0].title).toBe('A');
  });

  it('getFilteredTodos filters by category', () => {
    const { result } = renderHook(() => useTodos());

    act(() => {
      result.current.addTodo({ title: 'A', completed: false, priority: 'low', category: 'exam' });
    });
    act(() => {
      result.current.addTodo({ title: 'B', completed: false, priority: 'low', category: 'study' });
    });

    const filtered = result.current.getFilteredTodos('', 'all', 'exam');
    expect(filtered).toHaveLength(1);
    expect(filtered[0].title).toBe('A');
  });

  it('getFilteredTodos combines multiple filters', () => {
    const { result } = renderHook(() => useTodos());

    act(() => {
      result.current.addTodo({ title: 'Math exam', completed: false, priority: 'high', category: 'exam' });
    });
    act(() => {
      result.current.addTodo({ title: 'Math study', completed: false, priority: 'high', category: 'study' });
    });
    act(() => {
      result.current.addTodo({ title: 'Science exam', completed: false, priority: 'low', category: 'exam' });
    });

    const filtered = result.current.getFilteredTodos('math', 'high', 'exam');
    expect(filtered).toHaveLength(1);
    expect(filtered[0].title).toBe('Math exam');
  });

  it('getFilteredTodos searches in description', () => {
    const { result } = renderHook(() => useTodos());

    act(() => {
      result.current.addTodo({ title: 'Task', description: 'review algebra notes', completed: false, priority: 'low', category: 'study' });
    });
    act(() => {
      result.current.addTodo({ title: 'Other', completed: false, priority: 'low', category: 'study' });
    });

    const filtered = result.current.getFilteredTodos('algebra', 'all', 'all');
    expect(filtered).toHaveLength(1);
    expect(filtered[0].title).toBe('Task');
  });
});
