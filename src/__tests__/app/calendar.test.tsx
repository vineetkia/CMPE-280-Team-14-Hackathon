import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { renderWithProviders, createMockEvent } from '@/__tests__/test-utils';

vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: any) => <a href={href} {...props}>{children}</a>,
}));

vi.mock('next/navigation', () => ({
  usePathname: () => '/calendar',
  useRouter: () => ({ push: vi.fn() }),
}));

vi.mock('@/hooks/useToast', () => ({
  useToast: () => ({ toast: vi.fn() }),
  toast: vi.fn(),
}));

const mockEvents = [
  createMockEvent({ id: '1', title: 'Lecture', date: new Date() }),
];

vi.mock('@/hooks/useEvents', () => ({
  useEvents: () => ({
    events: mockEvents,
    addEvent: vi.fn(),
    updateEvent: vi.fn(),
    deleteEvent: vi.fn(),
    getEventsForDate: vi.fn(() => []),
    setEvents: vi.fn(),
  }),
}));

import CalendarPage from '@/app/calendar/page';

describe('CalendarPage', () => {
  it('renders the Calendar heading', () => {
    renderWithProviders(<CalendarPage />);
    expect(screen.getByText('Calendar')).toBeInTheDocument();
  });

  it('renders the current month and year', () => {
    renderWithProviders(<CalendarPage />);
    const now = new Date();
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December',
    ];
    const expectedText = `${monthNames[now.getMonth()]} ${now.getFullYear()}`;
    expect(screen.getByText(expectedText)).toBeInTheDocument();
  });

  it('renders day headers (Sun through Sat)', () => {
    renderWithProviders(<CalendarPage />);
    const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    dayHeaders.forEach((day) => {
      expect(screen.getByText(day)).toBeInTheDocument();
    });
  });

  it('renders the Add Event button', () => {
    renderWithProviders(<CalendarPage />);
    expect(screen.getByText('Add Event')).toBeInTheDocument();
  });

  it('renders prev and next month navigation buttons', () => {
    renderWithProviders(<CalendarPage />);
    expect(screen.getByLabelText('Previous month')).toBeInTheDocument();
    expect(screen.getByLabelText('Next month')).toBeInTheDocument();
  });

  it('opens event form when Add Event is clicked', async () => {
    const user = (await import('@testing-library/user-event')).default.setup();
    renderWithProviders(<CalendarPage />);
    await user.click(screen.getByText('Add Event'));
    expect(screen.getByText('Event Title')).toBeInTheDocument();
  });

  it('navigates to previous month when prev button clicked', async () => {
    const user = (await import('@testing-library/user-event')).default.setup();
    renderWithProviders(<CalendarPage />);
    const prevBtn = screen.getByLabelText('Previous month');
    await user.click(prevBtn);
    // After clicking prev, the month should change
    const now = new Date();
    const prevMonth = new Date(now.getFullYear(), now.getMonth() - 1);
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December',
    ];
    expect(screen.getByText(`${monthNames[prevMonth.getMonth()]} ${prevMonth.getFullYear()}`)).toBeInTheDocument();
  });

  it('navigates to next month when next button clicked', async () => {
    const user = (await import('@testing-library/user-event')).default.setup();
    renderWithProviders(<CalendarPage />);
    const nextBtn = screen.getByLabelText('Next month');
    await user.click(nextBtn);
    const now = new Date();
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1);
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December',
    ];
    expect(screen.getByText(`${monthNames[nextMonth.getMonth()]} ${nextMonth.getFullYear()}`)).toBeInTheDocument();
  });
});
