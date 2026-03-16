import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Label } from '@/components/ui/label';

describe('Label', () => {
  it('renders with text', () => {
    render(<Label>Username</Label>);
    const label = screen.getByText('Username');
    expect(label).toBeInTheDocument();
    expect(label).toHaveAttribute('data-slot', 'label');
  });

  it('applies custom className', () => {
    render(<Label className="my-label">Email</Label>);
    const label = screen.getByText('Email');
    expect(label.className).toContain('my-label');
  });
});
