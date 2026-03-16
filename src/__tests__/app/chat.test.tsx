import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders, createMockConversation, createMockMessage } from '@/__tests__/test-utils';

// Mock scrollIntoView for jsdom
Element.prototype.scrollIntoView = vi.fn();

vi.mock('next/navigation', () => ({
  usePathname: () => '/chat',
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
}));

vi.mock('@/hooks/useToast', () => ({
  useToast: () => ({ toast: vi.fn() }),
  toast: vi.fn(),
}));

const mockCreateConversation = vi.fn();
const mockDeleteConversation = vi.fn();
const mockSendMessage = vi.fn();
const mockSetActiveConversationId = vi.fn();

let mockActiveConversation: any = null;

vi.mock('@/hooks/useConversations', () => ({
  useConversations: () => ({
    conversations: [],
    activeConversation: mockActiveConversation,
    activeConversationId: mockActiveConversation?.id ?? null,
    setActiveConversationId: mockSetActiveConversationId,
    isLoading: false,
    streamingContent: '',
    createConversation: mockCreateConversation,
    deleteConversation: mockDeleteConversation,
    sendMessage: mockSendMessage,
  }),
}));

import ChatPage from '@/app/chat/page';

describe('ChatPage - no active conversation', () => {
  beforeEach(() => {
    mockActiveConversation = null;
  });

  it('renders AI Study Assistant text when no conversation is active', () => {
    renderWithProviders(<ChatPage />);
    expect(screen.getByText('AI Study Assistant')).toBeInTheDocument();
  });

  it('renders the prompt to start a new conversation', () => {
    renderWithProviders(<ChatPage />);
    expect(screen.getByText('Start a new conversation to get help with your studies')).toBeInTheDocument();
  });

  it('renders New Chat button in the empty state', () => {
    renderWithProviders(<ChatPage />);
    const newChatButtons = screen.getAllByText('New Chat');
    expect(newChatButtons.length).toBeGreaterThanOrEqual(1);
  });

  it('calls createConversation when New Chat button is clicked', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ChatPage />);
    const newChatButtons = screen.getAllByText('New Chat');
    await user.click(newChatButtons[newChatButtons.length - 1]);
    expect(mockCreateConversation).toHaveBeenCalled();
  });

  it('renders Conversations button for mobile view', () => {
    renderWithProviders(<ChatPage />);
    expect(screen.getByLabelText('Open conversation list')).toBeInTheDocument();
  });
});

describe('ChatPage - with active conversation', () => {
  beforeEach(() => {
    mockActiveConversation = {
      id: 'active-conv',
      title: 'Test Chat',
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockSendMessage.mockClear();
  });

  it('renders ChatEmptyState when conversation has no messages', () => {
    renderWithProviders(<ChatPage />);
    expect(screen.getByText('How can I help you today?')).toBeInTheDocument();
  });

  it('renders ChatInput when conversation is active', () => {
    renderWithProviders(<ChatPage />);
    expect(screen.getByPlaceholderText('Ask me anything...')).toBeInTheDocument();
  });

  it('sends message from empty state prompt click', () => {
    renderWithProviders(<ChatPage />);
    fireEvent.click(screen.getByText('Explain quantum physics in simple terms'));
    expect(mockSendMessage).toHaveBeenCalledWith('Explain quantum physics in simple terms');
  });

  it('renders messages when conversation has messages', () => {
    mockActiveConversation = {
      id: 'active-conv',
      title: 'Chat With Messages',
      messages: [
        createMockMessage({ content: 'Hello there', role: 'user' }),
        createMockMessage({ content: 'Hi! How can I help?', role: 'assistant' }),
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    renderWithProviders(<ChatPage />);
    expect(screen.getByText('Hello there')).toBeInTheDocument();
    expect(screen.getByText('Hi! How can I help?')).toBeInTheDocument();
  });
});
