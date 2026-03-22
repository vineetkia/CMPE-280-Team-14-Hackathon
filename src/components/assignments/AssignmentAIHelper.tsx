"use client";

import { useState, useRef } from 'react';
import { Sparkles, Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger
} from '@/components/ui/dialog';
import { MarkdownRenderer } from '@/components/chat/MarkdownRenderer';
import { streamChat, AIError, UserContext } from '@/lib/azure-openai';
import { toast } from '@/hooks/useToast';
import type { Assignment } from '@/types';

interface AssignmentAIHelperProps {
  assignment: Assignment;
}

interface AIMessage {
  role: 'user' | 'assistant';
  content: string;
}

export function AssignmentAIHelper({ assignment }: AssignmentAIHelperProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const sendMessage = async (text?: string) => {
    const messageText = text || input.trim();
    if (!messageText || isLoading) return;

    setInput('');
    const userMsg: AIMessage = { role: 'user', content: messageText };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setIsLoading(true);

    const context: UserContext = {
      assignments: [{
        title: assignment.title,
        subject: assignment.subject,
        description: assignment.description,
        dueDate: new Date(assignment.dueDate).toLocaleDateString(),
        status: assignment.status,
        priority: assignment.priority,
      }],
    };

    const abortController = new AbortController();
    abortRef.current = abortController;

    try {
      let accumulated = '';
      const assistantMsg: AIMessage = { role: 'assistant', content: '' };
      setMessages(prev => [...prev, assistantMsg]);

      for await (const chunk of streamChat(
        newMessages.map(m => ({ role: m.role, content: m.content })),
        context,
        'assignment-helper',
        abortController.signal
      )) {
        accumulated += chunk;
        setMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: 'assistant', content: accumulated };
          return updated;
        });
      }
    } catch (error) {
      if (error instanceof AIError && error.shouldFallback) {
        toast({ title: 'AI unavailable', description: 'Try again later.' });
        setMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            role: 'assistant',
            content: `I'd suggest breaking down "${assignment.title}" into smaller steps. Start by reviewing the core concepts for ${assignment.subject}, then outline your approach before diving into the work.`
          };
          return updated;
        });
      } else if ((error as Error).name !== 'AbortError') {
        toast({ title: 'Error', variant: 'destructive' });
        setMessages(prev => prev.slice(0, -1)); // Remove empty assistant msg
      }
    } finally {
      setIsLoading(false);
      scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const suggestedQuestions = [
    `How should I approach "${assignment.title}"?`,
    `Explain key concepts for ${assignment.subject}`,
    `Help me create an outline`,
    `What are common mistakes to avoid?`,
  ];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label="AI help for assignment"
          className="text-violet-500 hover:text-violet-600 hover:bg-violet-500/10"
        >
          <Sparkles className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] flex flex-col overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-violet-500" />
            AI Help: {assignment.title}
          </DialogTitle>
          <p className="text-sm text-[var(--muted-foreground)]">
            {assignment.subject} &bull; Due {new Date(assignment.dueDate).toLocaleDateString()}
          </p>
        </DialogHeader>

        <div className="flex-1 min-h-[200px] max-h-[400px] overflow-y-auto pr-1">
          {messages.length === 0 && (
            <div className="space-y-2 py-4">
              <p className="text-sm text-[var(--muted-foreground)] mb-3">Suggested questions:</p>
              {suggestedQuestions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(q)}
                  className="block w-full text-left text-sm p-3 rounded-xl hover:bg-[var(--secondary)] transition-colors text-[var(--foreground)]"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {messages.map((msg, i) => (
            <div key={i} className={`mb-3 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
              <div className={`inline-block max-w-[85%] p-3 rounded-xl text-sm overflow-hidden ${
                msg.role === 'user'
                  ? 'bg-[var(--primary-solid)] text-white'
                  : 'bg-[var(--secondary)] text-[var(--foreground)]'
              }`}>
                <div className="break-words">
                  {msg.role === 'assistant' ? (
                    <>
                      <MarkdownRenderer content={msg.content} />
                      {isLoading && i === messages.length - 1 && (
                        <span className="streaming-cursor" />
                      )}
                    </>
                  ) : (
                    <span className="whitespace-pre-wrap prose-chat">{msg.content}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
          <div ref={scrollRef} />
        </div>

        <div className="flex gap-2 pt-2 border-t border-[var(--glass-border)]">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about this assignment..."
            className="min-h-[44px] max-h-[100px] resize-none"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
          />
          <Button
            onClick={() => sendMessage()}
            disabled={!input.trim() || isLoading}
            size="icon"
            className="bg-[var(--primary-solid)] text-white shrink-0"
            aria-label="Send message"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
