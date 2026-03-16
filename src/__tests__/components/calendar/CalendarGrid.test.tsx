import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CalendarGrid } from '@/components/calendar/CalendarGrid';

const currentDate = new Date(2026, 2, 15); // March 2026

// Generate days array for March 2026 (starts on Sunday)
function generateDays(): Date[] {
  const year = 2026;
  const month = 2; // March
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days: Date[] = [];

  // Fill leading days from previous month
  for (let i = firstDay - 1; i >= 0; i--) {
    days.push(new Date(year, month, -i));
  }
  // Fill current month
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(new Date(year, month, i));
  }
  // Fill trailing days
  while (days.length % 7 !== 0) {
    days.push(new Date(year, month + 1, days.length - firstDay - daysInMonth + 1));
  }
  return days;
}

const defaultProps = {
  days: generateDays(),
  currentDate,
  events: [],
  getEventsForDate: () => [],
  onDateClick: vi.fn(),
};

describe('CalendarGrid', () => {
  it('renders day headers (Sun-Sat)', () => {
    render(<CalendarGrid {...defaultProps} />);
    expect(screen.getByText('Sun')).toBeInTheDocument();
    expect(screen.getByText('Mon')).toBeInTheDocument();
    expect(screen.getByText('Tue')).toBeInTheDocument();
    expect(screen.getByText('Wed')).toBeInTheDocument();
    expect(screen.getByText('Thu')).toBeInTheDocument();
    expect(screen.getByText('Fri')).toBeInTheDocument();
    expect(screen.getByText('Sat')).toBeInTheDocument();
  });

  it('renders date numbers', () => {
    render(<CalendarGrid {...defaultProps} />);
    // Day 15 should be rendered
    expect(screen.getByText('15')).toBeInTheDocument();
    // Day 1 may appear for both current and next/prev month, so use getAllByText
    const ones = screen.getAllByText('1');
    expect(ones.length).toBeGreaterThanOrEqual(1);
  });

  it('calls onDateClick when a date cell is clicked', () => {
    const onDateClick = vi.fn();
    render(<CalendarGrid {...defaultProps} onDateClick={onDateClick} />);
    fireEvent.click(screen.getByText('15'));
    expect(onDateClick).toHaveBeenCalled();
  });

  it('renders events on date cells when events exist', () => {
    const events = [{ id: 'e1', title: 'Test Event', date: new Date(2026, 2, 15), type: 'class' as const, color: '#3b82f6' }];
    const getEventsForDate = (date: Date) => {
      if (date.getDate() === 15 && date.getMonth() === 2) return events;
      return [];
    };
    render(<CalendarGrid {...defaultProps} events={events} getEventsForDate={getEventsForDate} />);
    expect(screen.getByText('Test Event')).toBeInTheDocument();
  });
});
