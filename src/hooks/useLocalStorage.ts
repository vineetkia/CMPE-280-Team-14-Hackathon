"use client";

import { useState, useEffect, useCallback } from 'react';

const dateKeys = new Set(['date', 'dueDate', 'createdAt', 'updatedAt', 'timestamp']);

function dateReviver(_key: string, value: unknown): unknown {
  if (typeof value === 'string' && dateKeys.has(_key)) {
    const date = new Date(value);
    if (!isNaN(date.getTime())) return date;
  }
  return value;
}

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void] {
  // Always start with initialValue to avoid SSR/client mismatch
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  // Hydrate from localStorage after mount (client-only)
  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        setStoredValue(JSON.parse(item, dateReviver));
      }
    } catch {
      // localStorage unavailable or parse error — keep initialValue
    }
  }, [key]);

  const setValue = useCallback((value: T | ((prev: T) => T)) => {
    setStoredValue(prev => {
      const newValue = value instanceof Function ? value(prev) : value;
      try {
        window.localStorage.setItem(key, JSON.stringify(newValue));
      } catch {
        // localStorage full or unavailable
      }
      return newValue;
    });
  }, [key]);

  return [storedValue, setValue];
}
