import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { EmptyState } from '@/components/shared/EmptyState';
import { FileText, Plus } from 'lucide-react';

describe('EmptyState', () => {
  it('renders icon, title, and description', () => {
    render(
      <EmptyState
        icon={FileText}
        title="No documents"
        description="You haven't created any documents yet."
      />
    );
    expect(screen.getByText('No documents')).toBeInTheDocument();
    expect(
      screen.getByText("You haven't created any documents yet.")
    ).toBeInTheDocument();
  });

  it('renders action button when provided', () => {
    const handleClick = vi.fn();
    render(
      <EmptyState
        icon={FileText}
        title="No items"
        description="Start by adding one."
        action={{ label: 'Add Item', onClick: handleClick, icon: Plus }}
      />
    );
    expect(screen.getByRole('button', { name: /add item/i })).toBeInTheDocument();
  });

  it('calls action onClick when button clicked', () => {
    const handleClick = vi.fn();
    render(
      <EmptyState
        icon={FileText}
        title="No items"
        description="Start by adding one."
        action={{ label: 'Create New', onClick: handleClick }}
      />
    );
    fireEvent.click(screen.getByRole('button', { name: /create new/i }));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
