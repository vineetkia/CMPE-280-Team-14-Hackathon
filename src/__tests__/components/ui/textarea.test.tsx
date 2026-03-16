import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Textarea } from '@/components/ui/textarea';

describe('Textarea', () => {
  it('renders with placeholder', () => {
    render(<Textarea placeholder="Write something..." />);
    const textarea = screen.getByPlaceholderText('Write something...');
    expect(textarea).toBeInTheDocument();
    expect(textarea).toHaveAttribute('data-slot', 'textarea');
  });

  it('handles value and onChange', () => {
    const handleChange = vi.fn();
    render(<Textarea value="" onChange={handleChange} placeholder="type" />);
    const textarea = screen.getByPlaceholderText('type');
    fireEvent.change(textarea, { target: { value: 'new content' } });
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('applies custom className', () => {
    render(<Textarea className="my-textarea" placeholder="styled" />);
    const textarea = screen.getByPlaceholderText('styled');
    expect(textarea.className).toContain('my-textarea');
  });

  it('renders disabled', () => {
    render(<Textarea disabled placeholder="nope" />);
    const textarea = screen.getByPlaceholderText('nope');
    expect(textarea).toBeDisabled();
  });
});
