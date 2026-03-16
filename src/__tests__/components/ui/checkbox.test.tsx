import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Checkbox } from '@/components/ui/checkbox';

describe('Checkbox', () => {
  it('renders unchecked by default', () => {
    render(<Checkbox aria-label="toggle" />);
    const checkbox = screen.getByRole('checkbox', { name: /toggle/i });
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).toHaveAttribute('data-state', 'unchecked');
  });

  it('handles checked change', () => {
    const handleChange = vi.fn();
    render(<Checkbox aria-label="toggle" onCheckedChange={handleChange} />);
    const checkbox = screen.getByRole('checkbox', { name: /toggle/i });
    fireEvent.click(checkbox);
    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange).toHaveBeenCalledWith(true);
  });

  it('renders checked state', () => {
    render(<Checkbox aria-label="toggle" checked />);
    const checkbox = screen.getByRole('checkbox', { name: /toggle/i });
    expect(checkbox).toHaveAttribute('data-state', 'checked');
  });
});
