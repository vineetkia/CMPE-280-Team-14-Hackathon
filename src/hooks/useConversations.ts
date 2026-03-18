"use client";

import { useState, useCallback, useRef, useEffect } from 'react';
import { Conversation, ChatMessage } from '@/types';
import { streamChat, AIError } from '@/lib/azure-openai';
import { toast } from '@/hooks/useToast';

function getMockResponse(): string {
  const mockResponses = [
    `That's a great question! Let me help you understand this better.\n\nHere are the key points:\n\n1. First, it's important to understand the fundamental concepts\n2. Then, we can build upon that foundation\n3. Finally, we'll look at practical applications\n\nWould you like me to elaborate on any of these points?`,
    `I'd be happy to help with that! Based on your question, here's what you need to know:\n\n• The main concept revolves around understanding the core principles\n• There are several approaches you can take\n• Practice and repetition are key to mastery\n\nIs there a specific aspect you'd like to dive deeper into?`,
    `Excellent question! Let's break this down step by step:\n\nStep 1: Start with the basics and build your understanding\nStep 2: Apply these concepts to real-world examples\nStep 3: Practice with exercises to reinforce your learning\n\nDo you have any follow-up questions?`,
  ];
  return mockResponses[Math.floor(Math.random() * mockResponses.length)];
}

function parseConversation(c: Conversation): Conversation {
  return {
    ...c,
    createdAt: new Date(c.createdAt),
    updatedAt: new Date(c.updatedAt),
    messages: c.messages.map(m => ({
      ...m,
      timestamp: new Date(m.timestamp),
    })),
  };
}

export function useConversations() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [streamingContent, setStreamingContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const abortControllerRef = useRef<AbortController | null>(null);

  const activeConversation = conversations.find(c => c.id === activeConversationId) ?? null;

  // Fetch conversations from API on mount
  useEffect(() => {
    fetch('/api/conversations')
      .then(res => res.json())
      .then((data: Conversation[]) => {
        setConversations(data.map(parseConversation));
      })
      .catch(err => console.error('[useConversations] fetch error:', err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const createConversation = useCallback(async () => {
    const res = await fetch('/api/conversations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'New Conversation' }),
    });
    const newConv = parseConversation(await res.json());
    setConversations(prev => [newConv, ...prev]);
    setActiveConversationId(newConv.id);
    return newConv;
  }, []);

  const deleteConversation = useCallback(async (id: string) => {
    await fetch(`/api/conversations/${id}`, { method: 'DELETE' });
    setConversations(prev => prev.filter(c => c.id !== id));
    if (id === activeConversationId) {
      setActiveConversationId(null);
    }
  }, [activeConversationId]);

  const renameConversation = useCallback(async (id: string, newTitle: string) => {
    if (!newTitle.trim()) return;
    await fetch(`/api/conversations/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: newTitle.trim() }),
    });
    setConversations(prev => prev.map(c =>
      c.id === id ? { ...c, title: newTitle.trim(), updatedAt: new Date() } : c
    ));
  }, []);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim()) return;

    let convId = activeConversationId;

    if (!convId) {
      const res = await fetch('/api/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: text.slice(0, 50) }),
      });
      const newConv = parseConversation(await res.json());
      setConversations(prev => [newConv, ...prev]);
      convId = newConv.id;
      setActiveConversationId(convId);
    }

    const targetConvId = convId;

    // Save user message to DB
    const userMsgRes = await fetch(`/api/conversations/${targetConvId}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: 'user', content: text }),
    });
    const userMessage: ChatMessage = {
      ...await userMsgRes.json(),
      timestamp: new Date(),
    };

    // Update local state with user message
    setConversations(prev => prev.map(c => {
      if (c.id !== targetConvId) return c;
      return {
        ...c,
        messages: [...c.messages, userMessage],
        title: c.messages.length === 0 ? text.slice(0, 50) : c.title,
        updatedAt: new Date(),
      };
    }));

    setIsLoading(true);
    setStreamingContent('');

    // Create placeholder assistant message
    const assistantMsgId = crypto.randomUUID();
    const assistantMessage: ChatMessage = {
      id: assistantMsgId,
      role: 'assistant',
      content: '',
      timestamp: new Date(),
    };

    setConversations(prev => prev.map(c =>
      c.id === targetConvId
        ? { ...c, messages: [...c.messages, assistantMessage], updatedAt: new Date() }
        : c
    ));

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    try {
      // Get current conversation messages for context
      const currentConv = conversations.find(c => c.id === targetConvId);
      const chatMessages = (currentConv?.messages || [])
        .concat([userMessage])
        .map(m => ({ role: m.role as 'user' | 'assistant', content: m.content }));

      let accumulated = '';
      for await (const chunk of streamChat(chatMessages, undefined, 'chat', abortController.signal)) {
        accumulated += chunk;
        setStreamingContent(accumulated);
        setConversations(prev => prev.map(c =>
          c.id === targetConvId
            ? {
                ...c,
                messages: c.messages.map(m =>
                  m.id === assistantMsgId ? { ...m, content: accumulated } : m
                ),
              }
            : c
        ));
      }

      // Save assistant message to DB
      await fetch(`/api/conversations/${targetConvId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: 'assistant', content: accumulated }),
      });

      setStreamingContent('');
      setIsLoading(false);
    } catch (error) {
      if (error instanceof AIError && error.shouldFallback) {
        toast({
          title: 'Using offline mode',
          description: 'AI is currently unavailable. Using simulated responses.',
        });
        const mockResponse = getMockResponse();
        setConversations(prev => prev.map(c =>
          c.id === targetConvId
            ? {
                ...c,
                messages: c.messages.map(m =>
                  m.id === assistantMsgId ? { ...m, content: mockResponse } : m
                ),
              }
            : c
        ));
        // Save mock response to DB
        await fetch(`/api/conversations/${targetConvId}/messages`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ role: 'assistant', content: mockResponse }),
        });
      } else if ((error as Error).name !== 'AbortError') {
        toast({
          title: 'Something went wrong',
          description: 'Please try again.',
          variant: 'destructive',
        });
        setConversations(prev => prev.map(c =>
          c.id === targetConvId
            ? { ...c, messages: c.messages.filter(m => m.id !== assistantMsgId) }
            : c
        ));
      }
      setStreamingContent('');
      setIsLoading(false);
    }
  }, [activeConversationId, conversations]);

  return {
    conversations,
    activeConversation,
    activeConversationId,
    setActiveConversationId,
    isLoading,
    streamingContent,
    createConversation,
    deleteConversation,
    renameConversation,
    sendMessage,
    loading,
  };
}
