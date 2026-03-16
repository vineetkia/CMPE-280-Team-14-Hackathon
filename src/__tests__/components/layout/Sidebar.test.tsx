import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Sidebar } from '@/components/layout/Sidebar';

vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: any) => <a href={href} {...props}>{children}</a>,
}));

vi.mock('next/navigation', () => ({
  usePathname: () => '/',
  useRouter: () => ({ push: vi.fn() }),
}));

describe('Sidebar', () => {
  it('renders all navigation items', () => {
    render(<Sidebar isOpen={true} onClose={vi.fn()} />);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Todos')).toBeInTheDocument();
    expect(screen.getByText('Calendar')).toBeInTheDocument();
    expect(screen.getByText('Assignments')).toBeInTheDocument();
    expect(screen.getByText('AI Chat')).toBeInTheDocument();
  });

  it('has a navigation element with aria-label', () => {
    render(<Sidebar isOpen={true} onClose={vi.fn()} />);
    const nav = screen.getByRole('navigation', { name: 'Main navigation' });
    expect(nav).toBeInTheDocument();
  });

  it('has a close button with aria-label', () => {
    render(<Sidebar isOpen={true} onClose={vi.fn()} />);
    expect(screen.getByLabelText('Close sidebar')).toBeInTheDocument();
  });
});
