import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ConversationList } from '@/components/chat/ConversationList';
import { createMockConversation, createMockMessage } from '@/__tests__/test-utils';

const defaultProps = {
  activeConversationId: null,
  onSelect: vi.fn(),
  onDelete: vi.fn(),
  onCreate: vi.fn(),
  isOpen: false,
  onClose: vi.fn(),
};

describe('ConversationList', () => {
  it('renders conversation titles', () => {
    const conversations = [
      createMockConversation({ title: 'Physics Study' }),
      createMockConversation({ title: 'Math Help' }),
    ];
    render(<ConversationList {...defaultProps} conversations={conversations} />);
    // Desktop sidebar renders titles
    expect(screen.getAllByText('Physics Study').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Math Help').length).toBeGreaterThanOrEqual(1);
  });

  it('renders "New Chat" button', () => {
    render(<ConversationList {...defaultProps} conversations={[]} />);
    // There is at least one New Chat button (desktop sidebar)
    expect(screen.getAllByText('New Chat').length).toBeGreaterThanOrEqual(1);
  });

  it('calls onCreate when New Chat clicked', () => {
    const onCreate = vi.fn();
    render(<ConversationList {...defaultProps} conversations={[]} onCreate={onCreate} />);
    const buttons = screen.getAllByText('New Chat');
    fireEvent.click(buttons[0]);
    expect(onCreate).toHaveBeenCalledTimes(1);
  });

  it('shows message count', () => {
    const conversations = [
      createMockConversation({
        title: 'Test Chat',
        messages: [
          createMockMessage({ content: 'msg1' }),
          createMockMessage({ content: 'msg2' }),
          createMockMessage({ content: 'msg3' }),
        ],
      }),
    ];
    render(<ConversationList {...defaultProps} conversations={conversations} />);
    expect(screen.getAllByText('3 messages').length).toBeGreaterThanOrEqual(1);
  });

  it('calls onSelect when conversation is clicked', () => {
    const onSelect = vi.fn();
    const conversations = [
      createMockConversation({ id: 'conv-1', title: 'Click Me' }),
    ];
    render(<ConversationList {...defaultProps} conversations={conversations} onSelect={onSelect} />);
    // Click on the conversation item (in desktop sidebar)
    const titles = screen.getAllByText('Click Me');
    fireEvent.click(titles[0]);
    expect(onSelect).toHaveBeenCalledWith('conv-1');
  });

  it('calls onDelete when delete button clicked', () => {
    const onDelete = vi.fn();
    const conversations = [
      createMockConversation({ id: 'conv-del', title: 'Delete This' }),
    ];
    render(<ConversationList {...defaultProps} conversations={conversations} onDelete={onDelete} />);
    const deleteButtons = screen.getAllByLabelText('Delete conversation');
    fireEvent.click(deleteButtons[0]);
    expect(onDelete).toHaveBeenCalledWith('conv-del');
  });

  it('shows empty state when no conversations', () => {
    render(<ConversationList {...defaultProps} conversations={[]} />);
    expect(screen.getAllByText('No conversations yet').length).toBeGreaterThanOrEqual(1);
  });
});
