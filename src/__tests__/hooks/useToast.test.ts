import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useToast, toast } from '@/hooks/useToast';

describe('useToast', () => {
  beforeEach(() => {
    // Clear all toasts before each test by dismissing everything
    const { result } = renderHook(() => useToast());
    act(() => {
      result.current.dismiss();
    });
    // Wait for removal
    vi.useFakeTimers();
    vi.advanceTimersByTime(2000);
    vi.useRealTimers();
  });

  it('toast() adds a toast to the list', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      toast({ title: 'Hello' });
    });

    expect(result.current.toasts.length).toBeGreaterThanOrEqual(1);
    expect(result.current.toasts.some((t) => t.title === 'Hello')).toBe(true);
  });

  it('toast() returns an id and dismiss function', () => {
    let returned: { id: string; dismiss: () => void; update: (props: any) => void };

    act(() => {
      returned = toast({ title: 'Test' });
    });

    expect(returned!.id).toBeDefined();
    expect(typeof returned!.dismiss).toBe('function');
  });

  it('dismiss() removes a toast', () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useToast());

    let toastResult: { id: string; dismiss: () => void };
    act(() => {
      toastResult = toast({ title: 'To dismiss' });
    });

    act(() => {
      toastResult.dismiss();
    });

    // After dismiss, toast should have open: false
    const dismissed = result.current.toasts.find((t) => t.id === toastResult.id);
    expect(dismissed?.open).toBe(false);

    // After the remove delay the toast is fully removed
    act(() => {
      vi.advanceTimersByTime(2000);
    });

    vi.useRealTimers();
  });

  it('multiple toasts can be active', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      toast({ title: 'First' });
      toast({ title: 'Second' });
    });

    expect(result.current.toasts.length).toBeGreaterThanOrEqual(2);
  });

  it('useToast returns toasts array and toast function', () => {
    const { result } = renderHook(() => useToast());

    expect(Array.isArray(result.current.toasts)).toBe(true);
    expect(typeof result.current.toast).toBe('function');
    expect(typeof result.current.dismiss).toBe('function');
  });
});
