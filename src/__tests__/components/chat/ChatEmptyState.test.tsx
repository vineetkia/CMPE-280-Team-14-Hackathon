import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ChatEmptyState } from '@/components/chat/ChatEmptyState';

describe('ChatEmptyState', () => {
  it('renders "How can I help you today?" heading', () => {
    render(<ChatEmptyState onSendMessage={vi.fn()} />);
    expect(screen.getByText('How can I help you today?')).toBeInTheDocument();
  });

  it('renders suggested prompts', () => {
    render(<ChatEmptyState onSendMessage={vi.fn()} />);
    expect(screen.getByText('Explain quantum physics in simple terms')).toBeInTheDocument();
    expect(screen.getByText('Help me prepare for my calculus midterm')).toBeInTheDocument();
    expect(screen.getByText('Create flashcards for Chemistry chapter 5')).toBeInTheDocument();
  });

  it('calls onSendMessage when prompt clicked', () => {
    const onSendMessage = vi.fn();
    render(<ChatEmptyState onSendMessage={onSendMessage} />);
    fireEvent.click(screen.getByText('Help me prepare for my calculus midterm'));
    expect(onSendMessage).toHaveBeenCalledWith('Help me prepare for my calculus midterm');
  });
});
