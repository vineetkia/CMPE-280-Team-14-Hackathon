import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { Toaster } from '@/components/ui/toaster';

vi.mock('@/hooks/useToast', () => ({
  useToast: () => ({
    toasts: [
      {
        id: '1',
        title: 'Test Toast',
        description: 'Toast description',
        variant: 'success',
        open: true,
      },
      {
        id: '2',
        title: 'Error Toast',
        description: 'Something went wrong',
        variant: 'destructive',
        open: true,
      },
      {
        id: '3',
        title: 'Default Toast',
        open: true,
      },
    ],
    toast: vi.fn(),
    dismiss: vi.fn(),
  }),
}));

describe('Toaster', () => {
  it('renders toasts from useToast hook', () => {
    const { container } = render(<Toaster />);
    // Should render the toast provider with toasts
    expect(container.querySelector('ol')).toBeInTheDocument();
  });

  it('renders toast titles and descriptions', () => {
    const { getByText } = render(<Toaster />);
    expect(getByText('Test Toast')).toBeInTheDocument();
    expect(getByText('Toast description')).toBeInTheDocument();
    expect(getByText('Error Toast')).toBeInTheDocument();
    expect(getByText('Default Toast')).toBeInTheDocument();
  });
});
