import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { renderWithProviders } from '@/__tests__/test-utils';
import { TopBar } from '@/components/layout/TopBar';

describe('TopBar', () => {
  it('renders "Welcome back!" text', () => {
    renderWithProviders(<TopBar onMenuToggle={vi.fn()} />);
    expect(screen.getByText(/Welcome back!/)).toBeInTheDocument();
  });

  it('has a theme toggle button with aria-label', () => {
    renderWithProviders(<TopBar onMenuToggle={vi.fn()} />);
    expect(screen.getByLabelText('Toggle theme')).toBeInTheDocument();
  });

  it('has a notifications button with aria-label', () => {
    renderWithProviders(<TopBar onMenuToggle={vi.fn()} />);
    expect(screen.getByLabelText('Notifications')).toBeInTheDocument();
  });

  it('has a menu toggle button with aria-label', () => {
    renderWithProviders(<TopBar onMenuToggle={vi.fn()} />);
    expect(screen.getByLabelText('Toggle menu')).toBeInTheDocument();
  });
});
