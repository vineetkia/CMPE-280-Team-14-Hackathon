import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { ThemeProvider } from '@/context/ThemeContext';
import { Todo, Assignment, CalendarEvent, Conversation, ChatMessage } from '@/types';

function AllProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      {children}
    </ThemeProvider>
  );
}

export function renderWithProviders(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  return render(ui, { wrapper: AllProviders, ...options });
}

// Factory functions
let mockIdCounter = 0;
const nextId = () => `mock-id-${++mockIdCounter}`;

beforeEach(() => {
  mockIdCounter = 0;
});

export function createMockTodo(overrides?: Partial<Todo>): Todo {
  return {
    id: nextId(),
    title: 'Test Todo',
    description: 'Test description',
    completed: false,
    priority: 'medium',
    category: 'study',
    dueDate: new Date(2026, 2, 25),
    createdAt: new Date(2026, 2, 15),
    ...overrides,
  };
}

export function createMockAssignment(overrides?: Partial<Assignment>): Assignment {
  return {
    id: nextId(),
    title: 'Test Assignment',
    subject: 'Mathematics',
    description: 'Test assignment description',
    dueDate: new Date(2026, 2, 25),
    status: 'not-started',
    priority: 'medium',
    createdAt: new Date(2026, 2, 15),
    ...overrides,
  };
}

export function createMockEvent(overrides?: Partial<CalendarEvent>): CalendarEvent {
  return {
    id: nextId(),
    title: 'Test Event',
    description: 'Test event description',
    date: new Date(2026, 2, 20),
    type: 'class',
    color: '#3b82f6',
    ...overrides,
  };
}

export function createMockMessage(overrides?: Partial<ChatMessage>): ChatMessage {
  return {
    id: nextId(),
    role: 'user',
    content: 'Test message',
    timestamp: new Date(2026, 2, 15),
    ...overrides,
  };
}

export function createMockConversation(overrides?: Partial<Conversation>): Conversation {
  return {
    id: nextId(),
    title: 'Test Conversation',
    messages: [],
    createdAt: new Date(2026, 2, 15),
    updatedAt: new Date(2026, 2, 15),
    ...overrides,
  };
}

export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';
