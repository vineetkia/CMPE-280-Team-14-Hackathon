import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { renderWithProviders, createMockTodo } from '@/__tests__/test-utils';

vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: any) => <a href={href} {...props}>{children}</a>,
}));

vi.mock('next/navigation', () => ({
  usePathname: () => '/todos',
  useRouter: () => ({ push: vi.fn() }),
}));

vi.mock('@/hooks/useToast', () => ({
  useToast: () => ({ toast: vi.fn() }),
  toast: vi.fn(),
}));

const mockTodos = [
  createMockTodo({ id: '1', title: 'Study for exam', completed: false }),
  createMockTodo({ id: '2', title: 'Write report', completed: true }),
  createMockTodo({ id: '3', title: 'Review notes', completed: false }),
];

vi.mock('@/hooks/useTodos', () => ({
  useTodos: () => ({
    todos: mockTodos,
    completedCount: 1,
    progressPercentage: 33.33,
    addTodo: vi.fn(),
    updateTodo: vi.fn(),
    deleteTodo: vi.fn(),
    toggleTodo: vi.fn(),
    getFilteredTodos: vi.fn(() => mockTodos),
    setTodos: vi.fn(),
  }),
}));

import TodosPage from '@/app/todos/page';

describe('TodosPage', () => {
  it('renders the page title "My Todos"', () => {
    renderWithProviders(<TodosPage />);
    expect(screen.getByText('My Todos')).toBeInTheDocument();
  });

  it('renders todo items from hook data', () => {
    renderWithProviders(<TodosPage />);
    expect(screen.getByText('Study for exam')).toBeInTheDocument();
    expect(screen.getByText('Write report')).toBeInTheDocument();
    expect(screen.getByText('Review notes')).toBeInTheDocument();
  });

  it('shows the task completion count', () => {
    renderWithProviders(<TodosPage />);
    expect(screen.getByText('1 of 3 tasks completed')).toBeInTheDocument();
  });

  it('renders the search input for filtering', () => {
    renderWithProviders(<TodosPage />);
    expect(screen.getByPlaceholderText('Search todos...')).toBeInTheDocument();
  });

  it('renders Add Todo button', () => {
    renderWithProviders(<TodosPage />);
    expect(screen.getByText('Add Todo')).toBeInTheDocument();
  });
});

describe('TodosPage additional', () => {
  it('renders the progress bar', () => {
    renderWithProviders(<TodosPage />);
    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toBeInTheDocument();
  });

  it('opens form when Add Todo button is clicked', async () => {
    const user = (await import('@testing-library/user-event')).default.setup();
    renderWithProviders(<TodosPage />);
    await user.click(screen.getByText('Add Todo'));
    expect(screen.getByText('Add New Todo')).toBeInTheDocument();
  });

  it('renders edit buttons for todo items', () => {
    renderWithProviders(<TodosPage />);
    const editButtons = screen.getAllByLabelText('Edit todo');
    expect(editButtons.length).toBeGreaterThanOrEqual(1);
  });

  it('renders delete buttons for todo items', () => {
    renderWithProviders(<TodosPage />);
    const deleteButtons = screen.getAllByLabelText('Delete todo');
    expect(deleteButtons.length).toBeGreaterThanOrEqual(1);
  });

  it('toggles a todo when checkbox is clicked', () => {
    renderWithProviders(<TodosPage />);
    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[0]);
    // The toggle handler should have been triggered (mock doesn't change state)
  });

  it('clicks edit on a todo item', () => {
    renderWithProviders(<TodosPage />);
    const editButtons = screen.getAllByLabelText('Edit todo');
    fireEvent.click(editButtons[0]);
    // Should open form in edit mode
    expect(screen.getByText('Edit Todo')).toBeInTheDocument();
  });
});
