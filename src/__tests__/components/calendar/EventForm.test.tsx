import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { EventForm } from '@/components/calendar/EventForm';
import { createMockEvent } from '@/__tests__/test-utils';

const defaultProps = {
  isOpen: true,
  onOpenChange: vi.fn(),
  selectedDate: new Date(2026, 2, 20),
  existingEvents: [],
  onSubmit: vi.fn(),
  onDeleteEvent: vi.fn(),
  onCancel: vi.fn(),
};

describe('EventForm', () => {
  it('renders dialog with date title when open', () => {
    render(<EventForm {...defaultProps} />);
    const expectedDateStr = new Date(2026, 2, 20).toLocaleDateString();
    expect(screen.getByText(`Event for ${expectedDateStr}`)).toBeInTheDocument();
  });

  it('renders form fields (title input, type select)', () => {
    render(<EventForm {...defaultProps} />);
    expect(screen.getByPlaceholderText('Enter event title...')).toBeInTheDocument();
    expect(screen.getByText('Event Title')).toBeInTheDocument();
    expect(screen.getByText('Event Type')).toBeInTheDocument();
  });

  it('renders cancel button and calls onCancel', () => {
    const onCancel = vi.fn();
    render(<EventForm {...defaultProps} onCancel={onCancel} />);
    fireEvent.click(screen.getByText('Cancel'));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('renders existing events section when events exist', () => {
    const existingEvents = [
      createMockEvent({ title: 'Existing Meeting', date: new Date(2026, 2, 20) }),
    ];
    render(<EventForm {...defaultProps} existingEvents={existingEvents} />);
    expect(screen.getByText('Existing Events:')).toBeInTheDocument();
    expect(screen.getByText('Existing Meeting')).toBeInTheDocument();
  });

  it('renders Add Event button', () => {
    render(<EventForm {...defaultProps} />);
    expect(screen.getByText('Add Event')).toBeInTheDocument();
  });

  it('calls onSubmit when form is filled and submitted', () => {
    const onSubmit = vi.fn();
    render(<EventForm {...defaultProps} onSubmit={onSubmit} />);
    fireEvent.change(screen.getByPlaceholderText('Enter event title...'), { target: { value: 'New Event' } });
    fireEvent.click(screen.getByText('Add Event'));
    expect(onSubmit).toHaveBeenCalled();
  });

  it('updates title input when typing', () => {
    render(<EventForm {...defaultProps} />);
    const input = screen.getByPlaceholderText('Enter event title...') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'Typing test' } });
    expect(input.value).toBe('Typing test');
  });
});
