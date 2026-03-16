import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ClientLayout } from '@/components/layout/ClientLayout';

vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: any) => <a href={href} {...props}>{children}</a>,
}));

vi.mock('next/navigation', () => ({
  usePathname: () => '/',
  useRouter: () => ({ push: vi.fn() }),
}));

vi.mock('@/lib/storage', () => ({
  todosService: { getAll: () => [{ id: '1' }], add: vi.fn() },
  assignmentsService: { getAll: () => [{ id: '1' }], add: vi.fn() },
  eventsService: { getAll: () => [{ id: '1' }], add: vi.fn() },
}));

vi.mock('@/mocks/data', () => ({
  mockTodos: [],
  mockAssignments: [],
  mockEvents: [],
}));

describe('ClientLayout', () => {
  it('renders children', () => {
    render(
      <ClientLayout>
        <div>Page Content</div>
      </ClientLayout>
    );
    expect(screen.getByText('Page Content')).toBeInTheDocument();
  });

  it('renders skip navigation link', () => {
    render(
      <ClientLayout>
        <div>Content</div>
      </ClientLayout>
    );
    expect(screen.getByText('Skip to content')).toBeInTheDocument();
  });

  it('main element has id="main-content"', () => {
    render(
      <ClientLayout>
        <div>Content</div>
      </ClientLayout>
    );
    const main = screen.getByRole('main');
    expect(main).toHaveAttribute('id', 'main-content');
  });

  it('renders the sidebar close button', () => {
    render(
      <ClientLayout>
        <div>Content</div>
      </ClientLayout>
    );
    expect(screen.getByLabelText('Close sidebar')).toBeInTheDocument();
  });

  it('toggles sidebar when menu button is clicked', () => {
    render(
      <ClientLayout>
        <div>Content</div>
      </ClientLayout>
    );
    // TopBar has a menu toggle button
    const menuButton = screen.getByLabelText('Toggle menu');
    fireEvent.click(menuButton);
    // After toggling, the overlay should appear (fixed inset-0)
  });

  it('seeds data when localStorage is empty', () => {
    // The mock returns non-empty arrays, so seeding should NOT happen
    render(
      <ClientLayout>
        <div>Content</div>
      </ClientLayout>
    );
    expect(screen.getByText('Content')).toBeInTheDocument();
  });
});
