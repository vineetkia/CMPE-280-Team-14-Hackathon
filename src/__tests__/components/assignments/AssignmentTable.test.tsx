import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AssignmentTable } from '@/components/assignments/AssignmentTable';
import { createMockAssignment } from '@/__tests__/test-utils';

const defaultProps = {
  sortField: 'title' as const,
  sortDirection: 'asc' as const,
  onToggleSort: vi.fn(),
  onEdit: vi.fn(),
  onDelete: vi.fn(),
};

describe('AssignmentTable', () => {
  it('renders table headers', () => {
    render(<AssignmentTable {...defaultProps} assignments={[]} />);
    expect(screen.getByText('Assignment')).toBeInTheDocument();
    expect(screen.getByText('Subject')).toBeInTheDocument();
    expect(screen.getByText('Due Date')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Priority')).toBeInTheDocument();
    expect(screen.getByText('Grade')).toBeInTheDocument();
    expect(screen.getByText('Actions')).toBeInTheDocument();
  });

  it('renders assignment data in rows', () => {
    const assignments = [
      createMockAssignment({ title: 'Essay Draft', subject: 'English' }),
    ];
    render(<AssignmentTable {...defaultProps} assignments={assignments} />);
    expect(screen.getByText('Essay Draft')).toBeInTheDocument();
    expect(screen.getByText('English')).toBeInTheDocument();
  });

  it('sort buttons render', () => {
    render(<AssignmentTable {...defaultProps} assignments={[]} />);
    // There are sort buttons for Assignment, Due Date, Status, Priority
    const buttons = screen.getAllByRole('button');
    // At least 4 sort header buttons
    expect(buttons.length).toBeGreaterThanOrEqual(4);
  });

  it('calls onToggleSort when sort button clicked', () => {
    const onToggleSort = vi.fn();
    render(<AssignmentTable {...defaultProps} assignments={[]} onToggleSort={onToggleSort} />);
    fireEvent.click(screen.getByText('Assignment'));
    expect(onToggleSort).toHaveBeenCalledWith('title');
  });

  it('calls onEdit when edit button clicked', () => {
    const onEdit = vi.fn();
    const assignments = [
      createMockAssignment({ title: 'Edit Test' }),
    ];
    render(<AssignmentTable {...defaultProps} assignments={assignments} onEdit={onEdit} />);
    fireEvent.click(screen.getByLabelText('Edit Edit Test'));
    expect(onEdit).toHaveBeenCalled();
  });

  it('shows empty state when no assignments', () => {
    render(<AssignmentTable {...defaultProps} assignments={[]} />);
    expect(screen.getByText('No assignments found')).toBeInTheDocument();
  });
});
