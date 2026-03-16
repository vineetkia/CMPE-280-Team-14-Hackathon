import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Input } from '@/components/ui/input';

describe('Input', () => {
  it('renders with placeholder', () => {
    render(<Input placeholder="Enter text..." />);
    const input = screen.getByPlaceholderText('Enter text...');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('data-slot', 'input');
  });

  it('handles value and onChange', () => {
    const handleChange = vi.fn();
    render(<Input value="" onChange={handleChange} placeholder="type here" />);
    const input = screen.getByPlaceholderText('type here');
    fireEvent.change(input, { target: { value: 'hello' } });
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('applies type attribute', () => {
    render(<Input type="email" placeholder="email" />);
    const input = screen.getByPlaceholderText('email');
    expect(input).toHaveAttribute('type', 'email');
  });

  it('applies custom className', () => {
    render(<Input className="custom-class" placeholder="custom" />);
    const input = screen.getByPlaceholderText('custom');
    expect(input.className).toContain('custom-class');
  });

  it('renders disabled state', () => {
    render(<Input disabled placeholder="disabled" />);
    const input = screen.getByPlaceholderText('disabled');
    expect(input).toBeDisabled();
  });
});
