import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TodoHeader } from '@/components/todos/TodoHeader';

const defaultProps = {
  completedCount: 3,
  totalCount: 7,
  progressPercentage: 42.86,
  onAddClick: vi.fn(),
};

describe('TodoHeader', () => {
  it('renders the title "My Todos"', () => {
    render(<TodoHeader {...defaultProps} />);
    expect(screen.getByText('My Todos')).toBeInTheDocument();
  });

  it('shows the task completion count', () => {
    render(<TodoHeader {...defaultProps} />);
    expect(screen.getByText('3 of 7 tasks completed')).toBeInTheDocument();
  });

  it('calls onAddClick when Add Todo button is clicked', async () => {
    const onAddClick = vi.fn();
    const user = userEvent.setup();
    render(<TodoHeader {...defaultProps} onAddClick={onAddClick} />);
    await user.click(screen.getByText('Add Todo'));
    expect(onAddClick).toHaveBeenCalledOnce();
  });
});
