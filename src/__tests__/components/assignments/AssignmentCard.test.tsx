import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AssignmentCard } from '@/components/assignments/AssignmentCard';
import { createMockAssignment } from '@/__tests__/test-utils';

const defaultProps = {
  sortField: 'title' as const,
  sortDirection: 'asc' as const,
  onToggleSort: vi.fn(),
  onEdit: vi.fn(),
  onDelete: vi.fn(),
};

describe('AssignmentCard', () => {
  it('renders assignment titles', () => {
    const assignments = [
      createMockAssignment({ title: 'Math Homework' }),
      createMockAssignment({ title: 'Science Report' }),
    ];
    render(<AssignmentCard {...defaultProps} assignments={assignments} />);
    expect(screen.getByText('Math Homework')).toBeInTheDocument();
    expect(screen.getByText('Science Report')).toBeInTheDocument();
  });

  it('renders subject and due date', () => {
    const dueDate = new Date(2026, 3, 10);
    const assignments = [
      createMockAssignment({ subject: 'Physics', dueDate }),
    ];
    render(<AssignmentCard {...defaultProps} assignments={assignments} />);
    expect(screen.getByText('Physics')).toBeInTheDocument();
    expect(screen.getByText(dueDate.toLocaleDateString())).toBeInTheDocument();
  });

  it('edit button has aria-label', () => {
    const assignments = [
      createMockAssignment({ title: 'Algebra HW' }),
    ];
    render(<AssignmentCard {...defaultProps} assignments={assignments} />);
    expect(screen.getByLabelText('Edit Algebra HW')).toBeInTheDocument();
  });

  it('calls onEdit when edit button clicked', () => {
    const onEdit = vi.fn();
    const assignments = [
      createMockAssignment({ title: 'Click Edit' }),
    ];
    render(<AssignmentCard {...defaultProps} assignments={assignments} onEdit={onEdit} />);
    fireEvent.click(screen.getByLabelText('Edit Click Edit'));
    expect(onEdit).toHaveBeenCalled();
  });

  it('shows empty state when no assignments', () => {
    render(<AssignmentCard {...defaultProps} assignments={[]} />);
    expect(screen.getByText('No assignments found')).toBeInTheDocument();
  });

  it('renders description when present', () => {
    const assignments = [
      createMockAssignment({ description: 'Complete chapter 5 exercises' }),
    ];
    render(<AssignmentCard {...defaultProps} assignments={assignments} />);
    expect(screen.getByText('Complete chapter 5 exercises')).toBeInTheDocument();
  });
});
