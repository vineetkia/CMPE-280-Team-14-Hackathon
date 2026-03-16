import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { createMockTodo } from '@/__tests__/test-utils';
import { RecentTasks } from '@/components/dashboard/RecentTasks';

vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: any) => <a href={href} {...props}>{children}</a>,
}));

describe('RecentTasks', () => {
  it('renders todo titles', () => {
    const todos = [
      createMockTodo({ id: '1', title: 'Read chapter 5', completed: false }),
      createMockTodo({ id: '2', title: 'Submit homework', completed: true }),
    ];
    render(<RecentTasks todos={todos} />);
    expect(screen.getByText('Read chapter 5')).toBeInTheDocument();
    expect(screen.getByText('Submit homework')).toBeInTheDocument();
  });

  it('shows Done badge for completed todos and Pending for incomplete', () => {
    const todos = [
      createMockTodo({ id: '1', title: 'Done task', completed: true }),
      createMockTodo({ id: '2', title: 'Pending task', completed: false }),
    ];
    render(<RecentTasks todos={todos} />);
    expect(screen.getByText('Done')).toBeInTheDocument();
    expect(screen.getByText('Pending')).toBeInTheDocument();
  });

  it('shows empty state when no todos', () => {
    render(<RecentTasks todos={[]} />);
    expect(screen.getByText('No tasks yet')).toBeInTheDocument();
  });

  it('has a View All link pointing to /todos', () => {
    const todos = [createMockTodo({ id: '1', title: 'Task 1' })];
    render(<RecentTasks todos={todos} />);
    const viewAllLink = screen.getByText('View All').closest('a');
    expect(viewAllLink).toHaveAttribute('href', '/todos');
  });
});
