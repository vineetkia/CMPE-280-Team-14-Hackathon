"use client";

import { RefObject } from 'react';
import { Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ChatMessage } from '@/types';
import { StreamingText } from './StreamingText';
import { MarkdownRenderer } from './MarkdownRenderer';

interface ChatMessagesProps {
  messages: ChatMessage[];
  isLoading: boolean;
  messagesEndRef: RefObject<HTMLDivElement | null>;
  streamingContent?: string;
}

export function ChatMessages({ messages, isLoading, messagesEndRef, streamingContent }: ChatMessagesProps) {
  return (
    <div className="flex-1 min-h-0 overflow-y-auto p-3 md:p-6">
      <div className="space-y-6 max-w-4xl mx-auto">
        <AnimatePresence mode="popLayout">
          {messages.map((message, index) => {
            const isLastAssistant = isLoading && index === messages.length - 1 && message.role === 'assistant';

            return (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.role === 'assistant' && (
                  <div className="w-9 h-9 rounded-xl bg-[var(--primary-solid)] flex items-center justify-center flex-shrink-0 mt-1">
                    <Sparkles className={`w-4 h-4 text-white ${isLastAssistant ? 'animate-pulse' : ''}`} />
                  </div>
                )}
                <div
                  className={`
                    max-w-[75%] p-4 rounded-2xl overflow-hidden
                    ${message.role === 'user'
                      ? 'bg-[var(--primary-solid)] text-white'
                      : 'bg-[var(--secondary)] text-[var(--foreground)]'}
                  `}
                >
                  <div className="text-sm leading-relaxed">
                    {isLastAssistant ? (
                      <>
                        <StreamingText content={message.content} isStreaming={true} />
                        <span className="streaming-cursor" />
                      </>
                    ) : message.role === 'assistant' ? (
                      <MarkdownRenderer content={message.content} />
                    ) : (
                      <span className="whitespace-pre-wrap break-words prose-chat">
                        {message.content}
                      </span>
                    )}
                  </div>
                  {!isLastAssistant && (
                    <p
                      className={`text-xs mt-2 ${
                        message.role === 'user' ? 'text-white/70' : 'text-[var(--muted-foreground)]'
                      }`}
                    >
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </p>
                  )}
                </div>
                {message.role === 'user' && (
                  <div className="w-9 h-9 rounded-xl bg-[var(--primary-solid)] flex items-center justify-center flex-shrink-0 text-white font-semibold text-xs mt-1">
                    JD
                  </div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>

        {isLoading && (messages.length === 0 || messages[messages.length - 1]?.role !== 'assistant') && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-3"
          >
            <div className="w-9 h-9 rounded-xl bg-[var(--primary-solid)] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white animate-pulse" />
            </div>
            <div className="bg-[var(--secondary)] px-5 py-3 rounded-2xl">
              <div className="flex items-center gap-1.5">
                <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.2, delay: 0 }} className="w-1.5 h-1.5 rounded-full bg-[var(--muted-foreground)]" />
                <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.2, delay: 0.2 }} className="w-1.5 h-1.5 rounded-full bg-[var(--muted-foreground)]" />
                <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.2, delay: 0.4 }} className="w-1.5 h-1.5 rounded-full bg-[var(--muted-foreground)]" />
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}
