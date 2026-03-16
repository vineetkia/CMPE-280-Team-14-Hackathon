import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useConversations } from '@/hooks/useConversations';

vi.mock('@/lib/azure-openai', () => {
  class AIError extends Error {
    status: number;
    shouldFallback: boolean;
    constructor(m: string, status: number, shouldFallback: boolean) {
      super(m);
      this.name = 'AIError';
      this.status = status;
      this.shouldFallback = shouldFallback;
    }
  }

  return {
    streamChat: vi.fn().mockImplementation(async function* () {
      throw new AIError('not configured', 503, true);
    }),
    AIError,
  };
});

vi.mock('@/hooks/useToast', () => ({
  toast: vi.fn(),
  useToast: () => ({ toast: vi.fn() }),
}));

describe('useConversations', () => {
  it('initial state has empty conversations', () => {
    const { result } = renderHook(() => useConversations());
    expect(result.current.conversations).toEqual([]);
    expect(result.current.activeConversation).toBeNull();
  });

  it('createConversation creates and sets active', () => {
    const { result } = renderHook(() => useConversations());
    let conv: any;

    act(() => {
      conv = result.current.createConversation();
    });

    expect(conv.id).toBeDefined();
    expect(conv.title).toBe('New Conversation');
    expect(result.current.conversations).toHaveLength(1);
    expect(result.current.activeConversationId).toBe(conv.id);
    expect(result.current.activeConversation).not.toBeNull();
    expect(result.current.activeConversation!.id).toBe(conv.id);
  });

  it('deleteConversation removes and clears activeId if deleted', () => {
    const { result } = renderHook(() => useConversations());
    let conv: any;

    act(() => {
      conv = result.current.createConversation();
    });

    expect(result.current.activeConversationId).toBe(conv.id);

    act(() => {
      result.current.deleteConversation(conv.id);
    });

    expect(result.current.conversations).toHaveLength(0);
    expect(result.current.activeConversationId).toBeNull();
    expect(result.current.activeConversation).toBeNull();
  });

  it('sendMessage creates user message in active conversation', async () => {
    const { result } = renderHook(() => useConversations());

    act(() => {
      result.current.createConversation();
    });

    await act(async () => {
      await result.current.sendMessage('Hello AI');
    });

    await waitFor(() => {
      const conv = result.current.activeConversation!;
      expect(conv.messages.length).toBe(2);
      expect(conv.messages[0].role).toBe('user');
      expect(conv.messages[0].content).toBe('Hello AI');
      expect(conv.messages[1].role).toBe('assistant');
    });
  });

  it('sendMessage creates new conversation if none active', async () => {
    const { result } = renderHook(() => useConversations());

    // No active conversation
    expect(result.current.activeConversationId).toBeNull();

    await act(async () => {
      await result.current.sendMessage('Start fresh');
    });

    await waitFor(() => {
      expect(result.current.conversations).toHaveLength(1);
      expect(result.current.activeConversationId).not.toBeNull();
      // User message + assistant fallback message
      expect(result.current.activeConversation!.messages.length).toBeGreaterThanOrEqual(1);
      expect(result.current.activeConversation!.messages[0].content).toBe('Start fresh');
    });
  });

  it('activeConversation returns correct conversation', () => {
    const { result } = renderHook(() => useConversations());

    act(() => {
      result.current.createConversation();
    });
    act(() => {
      result.current.createConversation();
    });

    // activeConversation should be the second one created (most recent)
    const secondId = result.current.activeConversationId;
    expect(result.current.activeConversation!.id).toBe(secondId);

    // Switch to first conversation
    const firstId = result.current.conversations[1].id;
    act(() => {
      result.current.setActiveConversationId(firstId);
    });

    expect(result.current.activeConversation!.id).toBe(firstId);
  });
});
