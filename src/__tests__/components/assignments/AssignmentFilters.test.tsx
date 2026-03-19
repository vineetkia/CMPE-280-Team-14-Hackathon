import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AssignmentFilters } from '@/components/assignments/AssignmentFilters';

const defaultProps = {
  searchQuery: '',
  onSearchChange: vi.fn(),
  filterStatus: 'all',
  onStatusChange: vi.fn(),
  filterPriority: 'all',
  onPriorityChange: vi.fn(),
  filterGrade: 'all',
  onGradeChange: vi.fn(),
  availableGrades: ['A', 'B+', 'C'],
  onAddClick: vi.fn(),
};

describe('AssignmentFilters', () => {
  it('renders search input', () => {
    render(<AssignmentFilters {...defaultProps} />);
    expect(screen.getByPlaceholderText('Search assignments...')).toBeInTheDocument();
  });

  it('renders Add Assignment button', () => {
    render(<AssignmentFilters {...defaultProps} />);
    expect(screen.getByText('Add Assignment')).toBeInTheDocument();
  });

  it('calls onAddClick when button clicked', () => {
    const onAddClick = vi.fn();
    render(<AssignmentFilters {...defaultProps} onAddClick={onAddClick} />);
    fireEvent.click(screen.getByText('Add Assignment'));
    expect(onAddClick).toHaveBeenCalledTimes(1);
  });

  it('calls onSearchChange when search input changes', () => {
    const onSearchChange = vi.fn();
    render(<AssignmentFilters {...defaultProps} onSearchChange={onSearchChange} />);
    const input = screen.getByPlaceholderText('Search assignments...');
    fireEvent.change(input, { target: { value: 'math' } });
    expect(onSearchChange).toHaveBeenCalledWith('math');
  });
});
