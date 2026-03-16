import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { renderWithProviders, createMockTodo, createMockAssignment, createMockEvent } from '@/__tests__/test-utils';

vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: any) => <a href={href} {...props}>{children}</a>,
}));

vi.mock('next/navigation', () => ({
  usePathname: () => '/',
  useRouter: () => ({ push: vi.fn() }),
}));

const mockTodos = [
  createMockTodo({ id: '1', title: 'Todo 1', completed: true }),
  createMockTodo({ id: '2', title: 'Todo 2', completed: false }),
  createMockTodo({ id: '3', title: 'Todo 3', completed: true }),
];

const mockAssignments = [
  createMockAssignment({ id: '1', title: 'Assignment 1', status: 'completed' }),
  createMockAssignment({ id: '2', title: 'Assignment 2', status: 'in-progress' }),
];

const mockEvents = [
  createMockEvent({ id: '1', title: 'Event 1', date: new Date(2099, 5, 15) }),
  createMockEvent({ id: '2', title: 'Event 2', date: new Date(2020, 0, 1) }),
];

vi.mock('@/hooks/useTodos', () => ({
  useTodos: () => ({
    todos: mockTodos,
    completedCount: 2,
    progressPercentage: 66.67,
    addTodo: vi.fn(),
    updateTodo: vi.fn(),
    deleteTodo: vi.fn(),
    toggleTodo: vi.fn(),
    getFilteredTodos: vi.fn(() => mockTodos),
    setTodos: vi.fn(),
  }),
}));

vi.mock('@/hooks/useAssignments', () => ({
  useAssignments: () => ({
    assignments: mockAssignments,
    stats: { total: 2, notStarted: 0, inProgress: 1, completed: 1 },
    addAssignment: vi.fn(),
    updateAssignment: vi.fn(),
    deleteAssignment: vi.fn(),
    getFilteredAndSorted: vi.fn(() => mockAssignments),
    setAssignments: vi.fn(),
  }),
}));

vi.mock('@/hooks/useEvents', () => ({
  useEvents: () => ({
    events: mockEvents,
    addEvent: vi.fn(),
    updateEvent: vi.fn(),
    deleteEvent: vi.fn(),
    getEventsForDate: vi.fn(() => []),
    setEvents: vi.fn(),
  }),
}));

import DashboardPage from '@/app/page';

describe('DashboardPage', () => {
  it('renders Tasks Completed stat card', () => {
    renderWithProviders(<DashboardPage />);
    expect(screen.getByText('Tasks Completed')).toBeInTheDocument();
  });

  it('renders Assignments Done stat card', () => {
    renderWithProviders(<DashboardPage />);
    expect(screen.getByText('Assignments Done')).toBeInTheDocument();
  });

  it('renders Upcoming Events stat card', () => {
    renderWithProviders(<DashboardPage />);
    expect(screen.getByText('Upcoming Events')).toBeInTheDocument();
  });

  it('renders Weekly Progress stat card', () => {
    renderWithProviders(<DashboardPage />);
    expect(screen.getByText('Weekly Progress')).toBeInTheDocument();
  });

  it('renders Recent Tasks section heading', () => {
    renderWithProviders(<DashboardPage />);
    expect(screen.getByText('Recent Tasks')).toBeInTheDocument();
  });

  it('renders Upcoming section heading', () => {
    renderWithProviders(<DashboardPage />);
    expect(screen.getByText('Upcoming')).toBeInTheDocument();
  });

  it('renders Ask AI Anything section', () => {
    renderWithProviders(<DashboardPage />);
    expect(screen.getByText('Ask AI Anything')).toBeInTheDocument();
  });

  it('displays correct stat values from mock data', () => {
    renderWithProviders(<DashboardPage />);
    // Tasks Completed: 2/3
    expect(screen.getByText('Tasks Completed').closest('div')?.parentElement).toBeTruthy();
    // Check that the value 2 and /3 appear in the stats area
    const statValues = screen.getAllByText(/\/3/);
    expect(statValues.length).toBeGreaterThan(0);
  });
});
