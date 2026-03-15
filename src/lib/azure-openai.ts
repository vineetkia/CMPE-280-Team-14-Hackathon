"use client";

export class AIError extends Error {
  constructor(
    message: string,
    public status: number,
    public shouldFallback: boolean
  ) {
    super(message);
    this.name = 'AIError';
  }
}

export interface UserContext {
  todos?: Array<{ title: string; completed: boolean; priority: string; category: string; dueDate?: string }>;
  assignments?: Array<{ title: string; subject: string; description: string; dueDate: string; status: string; priority: string }>;
  events?: Array<{ title: string; date: string; type: string }>;
}

export interface ChatRequestMessage {
  role: 'user' | 'assistant';
  content: string;
}

export type AIFeature = 'chat' | 'study-plan' | 'assignment-helper' | 'todo-suggestions';

// Streaming chat - yields text chunks as they arrive
export async function* streamChat(
  messages: ChatRequestMessage[],
  context?: UserContext,
  feature: AIFeature = 'chat',
  signal?: AbortSignal
): AsyncGenerator<string> {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages, context, feature, stream: true }),
    signal,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new AIError(
      errorData.error || 'AI request failed',
      response.status,
      errorData.fallback === true
    );
  }

  const reader = response.body?.getReader();
  if (!reader) throw new AIError('No response stream', 500, true);

  const decoder = new TextDecoder();
  let buffer = '';

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || !trimmed.startsWith('data: ')) continue;

        const data = trimmed.slice(6);
        if (data === '[DONE]') return;

        try {
          const parsed = JSON.parse(data);
          if (parsed.text) yield parsed.text;
        } catch {
          // Skip malformed JSON lines
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
}

// Non-streaming chat - returns complete response text
export async function sendChat(
  messages: ChatRequestMessage[],
  context?: UserContext,
  feature: AIFeature = 'chat',
  signal?: AbortSignal
): Promise<string> {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages, context, feature, stream: false }),
    signal,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new AIError(
      errorData.error || 'AI request failed',
      response.status,
      errorData.fallback === true
    );
  }

  const data = await response.json();
  return data.text || '';
}
