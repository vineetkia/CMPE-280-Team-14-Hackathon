import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { ChatMessages } from '@/components/chat/ChatMessages';
import { createMockMessage } from '@/__tests__/test-utils';

describe('ChatMessages', () => {
  const messagesEndRef = React.createRef<HTMLDivElement>();

  it('renders user messages', () => {
    const messages = [
      createMockMessage({ content: 'Hello from user', role: 'user' }),
    ];
    render(
      <ChatMessages messages={messages} isLoading={false} messagesEndRef={messagesEndRef} />
    );
    expect(screen.getByText('Hello from user')).toBeInTheDocument();
  });

  it('renders assistant messages with sparkle icon wrapper', () => {
    const messages = [
      createMockMessage({ content: 'AI response here', role: 'assistant' }),
    ];
    const { container } = render(
      <ChatMessages messages={messages} isLoading={false} messagesEndRef={messagesEndRef} />
    );
    expect(screen.getByText('AI response here')).toBeInTheDocument();
    // The assistant message should have a gradient wrapper div for the sparkle icon
    const gradientDiv = container.querySelector('.bg-gradient-to-br');
    expect(gradientDiv).toBeInTheDocument();
  });

  it('shows loading dots when isLoading', () => {
    const { container } = render(
      <ChatMessages messages={[]} isLoading={true} messagesEndRef={messagesEndRef} />
    );
    // Loading state renders 3 dots (rounded-full divs)
    const dots = container.querySelectorAll('.rounded-full');
    expect(dots.length).toBeGreaterThanOrEqual(3);
  });

  it('shows timestamp', () => {
    const timestamp = new Date(2026, 2, 15, 10, 30, 0);
    const messages = [
      createMockMessage({ content: 'Timed msg', timestamp }),
    ];
    render(
      <ChatMessages messages={messages} isLoading={false} messagesEndRef={messagesEndRef} />
    );
    expect(screen.getByText(timestamp.toLocaleTimeString())).toBeInTheDocument();
  });
});
