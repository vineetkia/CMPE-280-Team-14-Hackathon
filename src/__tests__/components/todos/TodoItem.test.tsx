import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { createMockTodo } from '@/__tests__/test-utils';
import { TodoItem } from '@/components/todos/TodoItem';

const defaultProps = {
  onToggle: vi.fn(),
  onEdit: vi.fn(),
  onDelete: vi.fn(),
};

describe('TodoItem', () => {
  it('renders the todo title', () => {
    const todo = createMockTodo({ title: 'Study linear algebra' });
    render(<TodoItem todo={todo} {...defaultProps} />);
    expect(screen.getByText('Study linear algebra')).toBeInTheDocument();
  });

  it('renders priority badge', () => {
    const todo = createMockTodo({ priority: 'high' });
    render(<TodoItem todo={todo} {...defaultProps} />);
    expect(screen.getByText('high')).toBeInTheDocument();
  });

  it('renders category badge', () => {
    const todo = createMockTodo({ category: 'exam' });
    render(<TodoItem todo={todo} {...defaultProps} />);
    expect(screen.getByText('exam')).toBeInTheDocument();
  });

  it('shows due date when present', () => {
    const dueDate = new Date(2026, 3, 15);
    const todo = createMockTodo({ dueDate });
    render(<TodoItem todo={todo} {...defaultProps} />);
    expect(screen.getByText(`Due: ${dueDate.toLocaleDateString()}`)).toBeInTheDocument();
  });

  it('has an Edit button with aria-label', () => {
    const todo = createMockTodo();
    render(<TodoItem todo={todo} {...defaultProps} />);
    expect(screen.getByLabelText('Edit todo')).toBeInTheDocument();
  });

  it('has a Delete button with aria-label', () => {
    const todo = createMockTodo();
    render(<TodoItem todo={todo} {...defaultProps} />);
    expect(screen.getByLabelText('Delete todo')).toBeInTheDocument();
  });

  it('applies line-through styling when todo is completed', () => {
    const todo = createMockTodo({ title: 'Completed task', completed: true });
    render(<TodoItem todo={todo} {...defaultProps} />);
    const titleEl = screen.getByText('Completed task');
    expect(titleEl.className).toContain('line-through');
  });

  it('calls onEdit when edit button clicked', () => {
    const onEdit = vi.fn();
    const todo = createMockTodo({ title: 'Editable' });
    render(<TodoItem todo={todo} onToggle={vi.fn()} onEdit={onEdit} onDelete={vi.fn()} />);
    fireEvent.click(screen.getByLabelText('Edit todo'));
    expect(onEdit).toHaveBeenCalledWith(todo);
  });

  it('calls onToggle when checkbox is clicked', () => {
    const onToggle = vi.fn();
    const todo = createMockTodo({ id: 'toggle-id' });
    render(<TodoItem todo={todo} onToggle={onToggle} onEdit={vi.fn()} onDelete={vi.fn()} />);
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    expect(onToggle).toHaveBeenCalledWith('toggle-id');
  });

  it('renders description when present', () => {
    const todo = createMockTodo({ description: 'Some detailed description' });
    render(<TodoItem todo={todo} {...defaultProps} />);
    expect(screen.getByText('Some detailed description')).toBeInTheDocument();
  });
});
