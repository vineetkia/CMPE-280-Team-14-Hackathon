import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CalendarAgenda } from '@/components/calendar/CalendarAgenda';
import { createMockEvent } from '@/__tests__/test-utils';

const defaultProps = {
  currentDate: new Date(2026, 2, 1), // March 2026
  onDateClick: vi.fn(),
};

describe('CalendarAgenda', () => {
  it('renders event titles', () => {
    const events = [
      createMockEvent({ title: 'Math Lecture', date: new Date(2026, 2, 10) }),
      createMockEvent({ title: 'Physics Lab', date: new Date(2026, 2, 15) }),
    ];
    render(<CalendarAgenda {...defaultProps} events={events} />);
    expect(screen.getByText('Math Lecture')).toBeInTheDocument();
    expect(screen.getByText('Physics Lab')).toBeInTheDocument();
  });

  it('shows empty state when no events', () => {
    render(<CalendarAgenda {...defaultProps} events={[]} />);
    expect(screen.getByText('No events this month')).toBeInTheDocument();
  });

  it('renders event description when present', () => {
    const events = [
      createMockEvent({ title: 'Lab Session', description: 'Bring lab coat', date: new Date(2026, 2, 10) }),
    ];
    render(<CalendarAgenda {...defaultProps} events={events} />);
    expect(screen.getByText('Bring lab coat')).toBeInTheDocument();
  });
});
