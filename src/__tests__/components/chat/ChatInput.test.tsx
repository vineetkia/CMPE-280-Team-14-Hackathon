import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ChatInput } from '@/components/chat/ChatInput';

const defaultProps = {
  input: '',
  onInputChange: vi.fn(),
  onSend: vi.fn(),
  isLoading: false,
};

describe('ChatInput', () => {
  it('renders textarea with placeholder', () => {
    render(<ChatInput {...defaultProps} />);
    expect(screen.getByPlaceholderText('Ask me anything... or use the mic to speak')).toBeInTheDocument();
  });

  it('send button has aria-label', () => {
    render(<ChatInput {...defaultProps} />);
    expect(screen.getByLabelText('Send message')).toBeInTheDocument();
  });

  it('send button is disabled when input is empty', () => {
    render(<ChatInput {...defaultProps} input="" />);
    const sendButton = screen.getByLabelText('Send message');
    expect(sendButton).toBeDisabled();
  });

  it('calls onSend when button clicked with text', () => {
    const onSend = vi.fn();
    render(<ChatInput {...defaultProps} input="Hello" onSend={onSend} />);
    const sendButton = screen.getByLabelText('Send message');
    fireEvent.click(sendButton);
    expect(onSend).toHaveBeenCalledTimes(1);
  });

  it('calls onSend when Enter key is pressed', () => {
    const onSend = vi.fn();
    render(<ChatInput {...defaultProps} input="Hello" onSend={onSend} />);
    const textarea = screen.getByPlaceholderText('Ask me anything... or use the mic to speak');
    fireEvent.keyDown(textarea, { key: 'Enter', shiftKey: false });
    expect(onSend).toHaveBeenCalledTimes(1);
  });

  it('does not call onSend when Shift+Enter is pressed', () => {
    const onSend = vi.fn();
    render(<ChatInput {...defaultProps} input="Hello" onSend={onSend} />);
    const textarea = screen.getByPlaceholderText('Ask me anything... or use the mic to speak');
    fireEvent.keyDown(textarea, { key: 'Enter', shiftKey: true });
    expect(onSend).not.toHaveBeenCalled();
  });

  it('calls onInputChange when text is typed', () => {
    const onInputChange = vi.fn();
    render(<ChatInput {...defaultProps} onInputChange={onInputChange} />);
    const textarea = screen.getByPlaceholderText('Ask me anything... or use the mic to speak');
    fireEvent.change(textarea, { target: { value: 'test' } });
    expect(onInputChange).toHaveBeenCalledWith('test');
  });

  it('textarea is disabled when isLoading', () => {
    render(<ChatInput {...defaultProps} isLoading={true} />);
    const textarea = screen.getByPlaceholderText('Ask me anything... or use the mic to speak');
    expect(textarea).toBeDisabled();
  });
});
