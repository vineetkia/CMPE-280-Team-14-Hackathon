import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AskAI } from '@/components/dashboard/AskAI';

const mockPush = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}));

describe('AskAI', () => {
  beforeEach(() => {
    mockPush.mockClear();
  });

  it('renders the heading "Ask AI Anything"', () => {
    render(<AskAI />);
    expect(screen.getByText('Ask AI Anything')).toBeInTheDocument();
  });

  it('renders the input with placeholder text', () => {
    render(<AskAI />);
    expect(
      screen.getByPlaceholderText('e.g., Explain quantum physics in simple terms...')
    ).toBeInTheDocument();
  });

  it('renders all suggestion buttons', () => {
    render(<AskAI />);
    expect(screen.getByText('Explain calculus')).toBeInTheDocument();
    expect(screen.getByText('Study tips')).toBeInTheDocument();
    expect(screen.getByText('Physics formulas')).toBeInTheDocument();
    expect(screen.getByText('Essay help')).toBeInTheDocument();
  });

  it('clicking a suggestion navigates to /chat with query param', async () => {
    const user = userEvent.setup();
    render(<AskAI />);
    await user.click(screen.getByText('Study tips'));
    expect(mockPush).toHaveBeenCalledWith('/chat?q=Study%20tips');
  });
});
