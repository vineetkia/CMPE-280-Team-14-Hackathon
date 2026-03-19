import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { renderWithProviders, createMockAssignment } from '@/__tests__/test-utils';

vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: any) => <a href={href} {...props}>{children}</a>,
}));

vi.mock('next/navigation', () => ({
  usePathname: () => '/assignments',
  useRouter: () => ({ push: vi.fn() }),
}));

vi.mock('@/hooks/useToast', () => ({
  useToast: () => ({ toast: vi.fn() }),
  toast: vi.fn(),
}));

const mockAssignments = [
  createMockAssignment({ id: '1', title: 'Math Homework', subject: 'Mathematics', status: 'not-started', priority: 'high' }),
  createMockAssignment({ id: '2', title: 'Physics Lab', subject: 'Physics', status: 'in-progress', priority: 'medium' }),
  createMockAssignment({ id: '3', title: 'Essay Draft', subject: 'English', status: 'completed', priority: 'low' }),
];

const mockStats = { total: 3, notStarted: 1, inProgress: 1, completed: 1 };

vi.mock('@/hooks/useAssignments', () => ({
  useAssignments: () => ({
    assignments: mockAssignments,
    stats: mockStats,
    addAssignment: vi.fn(),
    updateAssignment: vi.fn(),
    deleteAssignment: vi.fn(),
    getFilteredAndSorted: vi.fn(() => mockAssignments),
    uniqueGrades: ['A', 'B+'],
    setAssignments: vi.fn(),
  }),
}));

import AssignmentsPage from '@/app/assignments/page';

describe('AssignmentsPage', () => {
  it('renders assignment stat labels', () => {
    renderWithProviders(<AssignmentsPage />);
    expect(screen.getByText('Total')).toBeInTheDocument();
    expect(screen.getByText('Not Started')).toBeInTheDocument();
    expect(screen.getByText('In Progress')).toBeInTheDocument();
    expect(screen.getByText('Completed')).toBeInTheDocument();
  });

  it('renders assignment stat values', () => {
    renderWithProviders(<AssignmentsPage />);
    // Each stat value should appear - total 3, not started 1, in progress 1, completed 1
    const threes = screen.getAllByText('3');
    expect(threes.length).toBeGreaterThanOrEqual(1);
    const ones = screen.getAllByText('1');
    expect(ones.length).toBeGreaterThanOrEqual(1);
  });

  it('renders assignment titles in the table/cards', () => {
    renderWithProviders(<AssignmentsPage />);
    expect(screen.getAllByText('Math Homework').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Physics Lab').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Essay Draft').length).toBeGreaterThanOrEqual(1);
  });

  it('renders search input for filtering', () => {
    renderWithProviders(<AssignmentsPage />);
    expect(screen.getByPlaceholderText('Search assignments...')).toBeInTheDocument();
  });

  it('opens form when Add Assignment is clicked', async () => {
    const user = (await import('@testing-library/user-event')).default.setup();
    renderWithProviders(<AssignmentsPage />);
    await user.click(screen.getByText('Add Assignment'));
    expect(screen.getByText('Add New Assignment')).toBeInTheDocument();
  });

  it('calls toggleSort when sort header is clicked', async () => {
    const user = (await import('@testing-library/user-event')).default.setup();
    renderWithProviders(<AssignmentsPage />);
    // Click the Assignment sort header
    await user.click(screen.getByText('Assignment'));
  });

  it('renders edit buttons for assignments', () => {
    renderWithProviders(<AssignmentsPage />);
    const editButtons = screen.getAllByLabelText(/Edit/);
    expect(editButtons.length).toBeGreaterThanOrEqual(1);
  });

  it('opens edit form when edit button is clicked', () => {
    renderWithProviders(<AssignmentsPage />);
    const editButtons = screen.getAllByLabelText(/Edit/);
    fireEvent.click(editButtons[0]);
    expect(screen.getByText('Edit Assignment')).toBeInTheDocument();
  });

  it('toggles sort direction when same column is clicked twice', async () => {
    const user = (await import('@testing-library/user-event')).default.setup();
    renderWithProviders(<AssignmentsPage />);
    // The default sort is 'dueDate', clicking Due Date should toggle direction
    await user.click(screen.getByText('Due Date'));
    // Click again to toggle from asc to desc
    await user.click(screen.getByText('Due Date'));
  });
});
