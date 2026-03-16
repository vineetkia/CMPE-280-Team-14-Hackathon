import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ScrollArea } from '@/components/ui/scroll-area';

describe('ScrollArea', () => {
  it('renders children', () => {
    render(
      <ScrollArea>
        <p>Scroll content</p>
      </ScrollArea>
    );

    expect(screen.getByText('Scroll content')).toBeInTheDocument();
  });

  it('applies className', () => {
    const { container } = render(
      <ScrollArea className="my-custom-class">
        <p>Content</p>
      </ScrollArea>
    );

    const root = container.querySelector('[data-slot="scroll-area"]');
    expect(root?.className).toContain('my-custom-class');
  });
});
