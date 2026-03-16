import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TodoFilters } from '@/components/todos/TodoFilters';

const defaultProps = {
  searchQuery: '',
  onSearchChange: vi.fn(),
  filterPriority: 'all',
  onPriorityChange: vi.fn(),
  filterCategory: 'all',
  onCategoryChange: vi.fn(),
};

describe('TodoFilters', () => {
  it('renders search input with placeholder', () => {
    render(<TodoFilters {...defaultProps} />);
    expect(screen.getByPlaceholderText('Search todos...')).toBeInTheDocument();
  });

  it('calls onSearchChange when typing in the search input', async () => {
    const onSearchChange = vi.fn();
    const user = userEvent.setup();
    render(<TodoFilters {...defaultProps} onSearchChange={onSearchChange} />);
    const input = screen.getByPlaceholderText('Search todos...');
    await user.type(input, 'test');
    expect(onSearchChange).toHaveBeenCalled();
  });
});
