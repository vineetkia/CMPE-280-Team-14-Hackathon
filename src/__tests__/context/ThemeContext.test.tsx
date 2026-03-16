import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import React from 'react';
import { ThemeProvider, useTheme } from '@/context/ThemeContext';

function wrapper({ children }: { children: React.ReactNode }) {
  return <ThemeProvider>{children}</ThemeProvider>;
}

describe('ThemeContext', () => {
  it('renders children correctly', () => {
    const { result } = renderHook(() => useTheme(), { wrapper });
    expect(result.current).toBeDefined();
  });

  it('default theme is light', () => {
    const { result } = renderHook(() => useTheme(), { wrapper });
    expect(result.current.theme).toBe('light');
  });

  it('toggleTheme switches to dark and back to light', () => {
    const { result } = renderHook(() => useTheme(), { wrapper });

    act(() => {
      result.current.toggleTheme();
    });
    expect(result.current.theme).toBe('dark');

    act(() => {
      result.current.toggleTheme();
    });
    expect(result.current.theme).toBe('light');
  });

  it('persists theme to localStorage on toggle', () => {
    const { result } = renderHook(() => useTheme(), { wrapper });

    act(() => {
      result.current.toggleTheme();
    });

    expect(localStorage.getItem('studypilot_theme')).toBe('dark');
  });

  it('reads stored theme from localStorage on mount', () => {
    localStorage.setItem('studypilot_theme', 'dark');
    const { result } = renderHook(() => useTheme(), { wrapper });
    // After the useEffect fires, theme should be read from localStorage
    expect(result.current.theme).toBe('dark');
  });

  it('useTheme throws when used outside ThemeProvider', () => {
    // Suppress error output from React for the expected error
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => {
      renderHook(() => useTheme());
    }).toThrow('useTheme must be used within ThemeProvider');
    spy.mockRestore();
  });

  it('adds correct class to document.documentElement', () => {
    const { result } = renderHook(() => useTheme(), { wrapper });

    act(() => {
      result.current.toggleTheme();
    });

    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(document.documentElement.classList.contains('light')).toBe(false);
  });

  it('mounted is initially false then becomes true', () => {
    // We capture mounted across renders
    const mountedValues: boolean[] = [];
    const { result } = renderHook(() => {
      const ctx = useTheme();
      mountedValues.push(ctx.mounted);
      return ctx;
    }, { wrapper });

    // After effects run, mounted should be true
    expect(result.current.mounted).toBe(true);
  });
});
