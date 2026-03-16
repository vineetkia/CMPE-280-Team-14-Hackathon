import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Skeleton } from '@/components/ui/skeleton';

describe('Skeleton', () => {
  it('renders with default classes', () => {
    const { container } = render(<Skeleton />);
    const el = container.querySelector('[data-slot="skeleton"]');
    expect(el).toBeInTheDocument();
    expect(el?.className).toContain('animate-pulse');
    expect(el?.className).toContain('rounded-md');
  });

  it('applies custom className and dimensions', () => {
    const { container } = render(
      <Skeleton className="h-12 w-12 rounded-full" />
    );
    const el = container.querySelector('[data-slot="skeleton"]');
    expect(el?.className).toContain('h-12');
    expect(el?.className).toContain('w-12');
    expect(el?.className).toContain('rounded-full');
  });
});
