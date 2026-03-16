import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Progress } from '@/components/ui/progress';

describe('Progress', () => {
  it('renders with value', () => {
    const { container } = render(<Progress value={50} />);
    const root = container.querySelector('[data-slot="progress"]');
    expect(root).toBeInTheDocument();
    const indicator = container.querySelector('[data-slot="progress-indicator"]');
    expect(indicator).toBeInTheDocument();
    expect(indicator).toHaveStyle({ transform: 'translateX(-50%)' });
  });

  it('renders with zero value', () => {
    const { container } = render(<Progress value={0} />);
    const indicator = container.querySelector('[data-slot="progress-indicator"]');
    expect(indicator).toHaveStyle({ transform: 'translateX(-100%)' });
  });

  it('renders with 100 value', () => {
    const { container } = render(<Progress value={100} />);
    const indicator = container.querySelector('[data-slot="progress-indicator"]');
    expect(indicator).toHaveStyle({ transform: 'translateX(-0%)' });
  });
});
