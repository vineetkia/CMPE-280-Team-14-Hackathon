import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TodoForm } from '@/components/todos/TodoForm';
import { createMockTodo } from '@/__tests__/test-utils';

const defaultProps = {
  isOpen: true,
  onOpenChange: vi.fn(),
  editingTodo: null,
  onSubmit: vi.fn(),
  onCancel: vi.fn(),
};

describe('TodoForm', () => {
  it('renders "Add New Todo" title when open', () => {
    render(<TodoForm {...defaultProps} />);
    expect(screen.getByText('Add New Todo')).toBeInTheDocument();
  });

  it('renders form fields (title, description, priority, category, due date)', () => {
    render(<TodoForm {...defaultProps} />);
    expect(screen.getByLabelText('Title')).toBeInTheDocument();
    expect(screen.getByLabelText('Description (optional)')).toBeInTheDocument();
    expect(screen.getByLabelText('Priority')).toBeInTheDocument();
    expect(screen.getByLabelText('Category')).toBeInTheDocument();
    expect(screen.getByLabelText('Due Date (optional)')).toBeInTheDocument();
  });

  it('renders "Edit Todo" title when editing', () => {
    const todo = createMockTodo({ title: 'Existing todo' });
    render(<TodoForm {...defaultProps} editingTodo={todo} />);
    expect(screen.getByText('Edit Todo')).toBeInTheDocument();
  });

  it('renders cancel button and calls onCancel when clicked', () => {
    const onCancel = vi.fn();
    render(<TodoForm {...defaultProps} onCancel={onCancel} />);
    fireEvent.click(screen.getByText('Cancel'));
    expect(onCancel).toHaveBeenCalled();
  });

  it('renders Add Todo submit button', () => {
    render(<TodoForm {...defaultProps} />);
    expect(screen.getByText('Add Todo')).toBeInTheDocument();
  });

  it('calls onSubmit when form is submitted with valid data', () => {
    const onSubmit = vi.fn();
    render(<TodoForm {...defaultProps} onSubmit={onSubmit} />);
    const titleInput = screen.getByLabelText('Title');
    fireEvent.change(titleInput, { target: { value: 'New Todo Title' } });
    fireEvent.click(screen.getByText('Add Todo'));
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it('updates input values when typing', () => {
    render(<TodoForm {...defaultProps} />);
    const titleInput = screen.getByLabelText('Title') as HTMLInputElement;
    fireEvent.change(titleInput, { target: { value: 'Typing test' } });
    expect(titleInput.value).toBe('Typing test');

    const descInput = screen.getByLabelText('Description (optional)') as HTMLTextAreaElement;
    fireEvent.change(descInput, { target: { value: 'Some desc' } });
    expect(descInput.value).toBe('Some desc');
  });

  it('populates form with editing todo data', () => {
    const todo = createMockTodo({
      title: 'Edit me',
      description: 'Existing desc',
      priority: 'high',
      category: 'exam',
      dueDate: new Date(2026, 5, 15),
    });
    render(<TodoForm {...defaultProps} editingTodo={todo} />);
    const titleInput = screen.getByLabelText('Title') as HTMLInputElement;
    expect(titleInput.value).toBe('Edit me');
  });
});
