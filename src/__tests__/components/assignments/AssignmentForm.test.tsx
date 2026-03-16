import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AssignmentForm } from '@/components/assignments/AssignmentForm';
import { createMockAssignment } from '@/__tests__/test-utils';

const defaultProps = {
  isOpen: true,
  onOpenChange: vi.fn(),
  editingAssignment: null,
  onSubmit: vi.fn(),
  onCancel: vi.fn(),
};

describe('AssignmentForm', () => {
  it('renders dialog title when open', () => {
    render(<AssignmentForm {...defaultProps} />);
    expect(screen.getByText('Add New Assignment')).toBeInTheDocument();
  });

  it('renders form fields', () => {
    render(<AssignmentForm {...defaultProps} />);
    expect(screen.getByPlaceholderText('Enter title...')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('e.g., Mathematics')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Add details about the assignment...')).toBeInTheDocument();
    expect(screen.getByText('Assignment Title')).toBeInTheDocument();
    expect(screen.getByText('Subject')).toBeInTheDocument();
    expect(screen.getByText('Due Date')).toBeInTheDocument();
  });

  it('shows Edit Assignment title when editing', () => {
    const editingAssignment = createMockAssignment({ title: 'Existing HW' });
    render(<AssignmentForm {...defaultProps} editingAssignment={editingAssignment} />);
    expect(screen.getByText('Edit Assignment')).toBeInTheDocument();
  });

  it('renders cancel button', () => {
    render(<AssignmentForm {...defaultProps} />);
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  it('calls onCancel when cancel button clicked', () => {
    const onCancel = vi.fn();
    render(<AssignmentForm {...defaultProps} onCancel={onCancel} />);
    fireEvent.click(screen.getByText('Cancel'));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('calls onSubmit when form is filled and submitted', () => {
    const onSubmit = vi.fn();
    render(<AssignmentForm {...defaultProps} onSubmit={onSubmit} />);
    fireEvent.change(screen.getByPlaceholderText('Enter title...'), { target: { value: 'New HW' } });
    // Set a due date
    const dateInputs = screen.getAllByDisplayValue('');
    const dateInput = dateInputs.find(el => el.getAttribute('type') === 'date');
    if (dateInput) {
      fireEvent.change(dateInput, { target: { value: '2026-04-01' } });
    }
    fireEvent.click(screen.getByText('Add Assignment'));
    expect(onSubmit).toHaveBeenCalled();
  });

  it('pre-fills form when editing assignment', () => {
    const editingAssignment = createMockAssignment({
      title: 'Pre-filled HW',
      subject: 'Science',
      description: 'Do the experiment',
    });
    render(<AssignmentForm {...defaultProps} editingAssignment={editingAssignment} />);
    expect((screen.getByPlaceholderText('Enter title...') as HTMLInputElement).value).toBe('Pre-filled HW');
    expect((screen.getByPlaceholderText('e.g., Mathematics') as HTMLInputElement).value).toBe('Science');
  });
});
