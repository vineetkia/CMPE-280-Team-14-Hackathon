"use client";

import { useState, useCallback, useRef, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { Conversation, ChatMessage } from '@/types';
import { streamChat, AIError } from '@/lib/azure-openai';
import { toast } from '@/hooks/useToast';

const STORAGE_KEY = 'studypilot_conversations';

function getMockResponse(): string {
  const mockResponses = [
    `That's a great question! Let me help you understand this better.\n\nHere are the key points:\n\n1. First, it's important to understand the fundamental concepts\n2. Then, we can build upon that foundation\n3. Finally, we'll look at practical applications\n\nWould you like me to elaborate on any of these points?`,
    `I'd be happy to help with that! Based on your question, here's what you need to know:\n\n• The main concept revolves around understanding the core principles\n• There are several approaches you can take\n• Practice and repetition are key to mastery\n\nIs there a specific aspect you'd like to dive deeper into?`,
    `Excellent question! Let's break this down step by step:\n\nStep 1: Start with the basics and build your understanding\nStep 2: Apply these concepts to real-world examples\nStep 3: Practice with exercises to reinforce your learning\n\nDo you have any follow-up questions?`,
  ];
  return mockResponses[Math.floor(Math.random() * mockResponses.length)];
}

export function useConversations() {
  const [conversations, setConversations] = useLocalStorage<Conversation[]>(STORAGE_KEY, []);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [streamingContent, setStreamingContent] = useState<string>('');
  const abortControllerRef = useRef<AbortController | null>(null);

  const activeConversation = conversations.find(c => c.id === activeConversationId) ?? null;

  // Cleanup: abort any in-flight request on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const createConversation = useCallback(() => {
    const newConversation: Conversation = {
      id: crypto.randomUUID(),
      title: 'New Conversation',
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setConversations(prev => [newConversation, ...prev]);
    setActiveConversationId(newConversation.id);
    return newConversation;
  }, [setConversations]);

  const deleteConversation = useCallback((id: string) => {
    setConversations(prev => prev.filter(c => c.id !== id));
    if (id === activeConversationId) {
      setActiveConversationId(null);
    }
  }, [setConversations, activeConversationId]);

  const renameConversation = useCallback((id: string, newTitle: string) => {
    if (!newTitle.trim()) return;
    setConversations(prev => prev.map(c =>
      c.id === id ? { ...c, title: newTitle.trim(), updatedAt: new Date() } : c
    ));
  }, [setConversations]);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim()) return;

    let convId = activeConversationId;

    if (!convId) {
      const newConv: Conversation = {
        id: crypto.randomUUID(),
        title: text.slice(0, 50),
        messages: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setConversations(prev => [newConv, ...prev]);
      convId = newConv.id;
      setActiveConversationId(convId);
    }

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    };

    const targetConvId = convId;

    // Get the current conversation before updating (for building chat history)
    const updatedConv = conversations.find(c => c.id === targetConvId) ?? {
      id: targetConvId,
      title: text.slice(0, 50),
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

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

    // Create empty assistant message placeholder
    const assistantMsgId = crypto.randomUUID();
    const assistantMessage: ChatMessage = {
      id: assistantMsgId,
      role: 'assistant',
      content: '',
      timestamp: new Date(),
    };

    // Add placeholder to conversation
    setConversations(prev => prev.map(c =>
      c.id === targetConvId
        ? { ...c, messages: [...c.messages, assistantMessage], updatedAt: new Date() }
        : c
    ));

    // Try streaming from AI
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    try {
      const chatMessages = updatedConv.messages
        .concat([userMessage])
        .map(m => ({ role: m.role, content: m.content }));

      let accumulated = '';
      for await (const chunk of streamChat(chatMessages, undefined, 'chat', abortController.signal)) {
        accumulated += chunk;
        setStreamingContent(accumulated);
        // Update the assistant message content in real-time
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
      setStreamingContent('');
      setIsLoading(false);
    } catch (error) {
      if (error instanceof AIError && error.shouldFallback) {
        // Fallback to mock response
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
      } else if ((error as Error).name !== 'AbortError') {
        // Real error - remove placeholder and show error toast
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
  }, [activeConversationId, conversations, setConversations]);

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
  };
}
