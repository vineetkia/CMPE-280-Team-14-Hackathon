import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useLocalStorage } from '@/hooks/useLocalStorage';

describe('useLocalStorage', () => {
  it('returns initial value on first render when localStorage is empty', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'default'));
    expect(result.current[0]).toBe('default');
  });

  it('reads existing value from localStorage on mount', () => {
    localStorage.setItem('test-key', JSON.stringify('stored-value'));
    const { result } = renderHook(() => useLocalStorage('test-key', 'default'));
    expect(result.current[0]).toBe('stored-value');
  });

  it('updates state and persists to localStorage', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));

    act(() => {
      result.current[1]('updated');
    });

    expect(result.current[0]).toBe('updated');
    expect(JSON.parse(localStorage.getItem('test-key')!)).toBe('updated');
  });

  it('handles function updater pattern', () => {
    const { result } = renderHook(() => useLocalStorage<number>('counter', 0));

    act(() => {
      result.current[1](prev => prev + 1);
    });
    expect(result.current[0]).toBe(1);

    act(() => {
      result.current[1](prev => prev + 5);
    });
    expect(result.current[0]).toBe(6);
    expect(JSON.parse(localStorage.getItem('counter')!)).toBe(6);
  });

  it('handles JSON parse errors gracefully (returns initial value)', () => {
    localStorage.setItem('bad-key', 'this is not valid JSON{{{');
    const { result } = renderHook(() => useLocalStorage('bad-key', 'fallback'));
    expect(result.current[0]).toBe('fallback');
  });

  it('revives date fields correctly', () => {
    const dateStr = '2026-03-15T00:00:00.000Z';
    const obj = { createdAt: dateStr, dueDate: dateStr, name: 'test' };
    localStorage.setItem('date-key', JSON.stringify(obj));

    const { result } = renderHook(() =>
      useLocalStorage<{ createdAt: Date; dueDate: Date; name: string }>('date-key', {
        createdAt: new Date(),
        dueDate: new Date(),
        name: '',
      })
    );

    expect(result.current[0].createdAt).toBeInstanceOf(Date);
    expect(result.current[0].dueDate).toBeInstanceOf(Date);
    expect(result.current[0].name).toBe('test');
  });

  it('works with arrays', () => {
    const { result } = renderHook(() => useLocalStorage<string[]>('arr-key', []));

    act(() => {
      result.current[1](prev => [...prev, 'item1']);
    });
    expect(result.current[0]).toEqual(['item1']);

    act(() => {
      result.current[1](prev => [...prev, 'item2']);
    });
    expect(result.current[0]).toEqual(['item1', 'item2']);
    expect(JSON.parse(localStorage.getItem('arr-key')!)).toEqual(['item1', 'item2']);
  });
});
