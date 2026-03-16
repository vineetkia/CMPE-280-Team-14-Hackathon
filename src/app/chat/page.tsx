"use client";

import { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Plus, Sparkles, MessageSquare } from 'lucide-react';
import { motion } from 'motion/react';
import { useConversations } from '@/hooks/useConversations';
import { useToast } from '@/hooks/useToast';
import { Button } from '@/components/ui/button';
import { ConversationList } from '@/components/chat/ConversationList';
import { ChatMessages } from '@/components/chat/ChatMessages';
import { ChatInput } from '@/components/chat/ChatInput';
import { ChatEmptyState } from '@/components/chat/ChatEmptyState';

function ChatPageContent() {
  const {
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
  } = useConversations();

  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [input, setInput] = useState('');
  const [mobileListOpen, setMobileListOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const initialQueryHandled = useRef(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConversation?.messages.length, streamingContent]);

  // Handle ?q= URL parameter on mount
  useEffect(() => {
    if (initialQueryHandled.current) return;
    const q = searchParams.get('q');
    if (q) {
      initialQueryHandled.current = true;
      // Create a new conversation and send the message
      createConversation();
      // Use setTimeout to allow state to settle before sending
      setTimeout(() => {
        sendMessage(q);
      }, 0);
      // Clear the URL param without full page reload
      router.replace('/chat');
    }
  }, [searchParams, createConversation, sendMessage, router]);

  const handleSend = (messageText?: string) => {
    const text = messageText || input.trim();
    if (!text) return;
    sendMessage(text);
    setInput('');
  };

  const handleDelete = (id: string) => {
    deleteConversation(id);
    toast({
      title: 'Conversation deleted',
      description: 'The conversation has been removed.',
      variant: 'success',
    });
  };

  return (
    <div className="h-[calc(100vh-10rem)] flex gap-6">
      <ConversationList
        conversations={conversations}
        activeConversationId={activeConversationId}
        onSelect={setActiveConversationId}
        onDelete={handleDelete}
        onRename={renameConversation}
        onCreate={createConversation}
        isOpen={mobileListOpen}
        onClose={() => setMobileListOpen(false)}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="flex-1 min-w-0 backdrop-blur-xl bg-[var(--glass)] border border-[var(--glass-border)] rounded-2xl shadow-xl flex flex-col overflow-hidden"
      >
        {/* Mobile toggle for conversation list */}
        <div className="md:hidden p-3 border-b border-[var(--border)]">
          <Button
            variant="ghost"
            onClick={() => setMobileListOpen(true)}
            aria-label="Open conversation list"
            className="flex items-center gap-2"
          >
            <MessageSquare className="w-4 h-4" />
            Conversations
          </Button>
        </div>

        {activeConversation ? (
          <>
            {activeConversation.messages.length === 0 ? (
              <div className="flex-1 overflow-auto p-6">
                <div className="max-w-4xl mx-auto">
                  <ChatEmptyState onSendMessage={handleSend} />
                </div>
              </div>
            ) : (
              <ChatMessages
                messages={activeConversation.messages}
                isLoading={isLoading}
                messagesEndRef={messagesEndRef}
                streamingContent={streamingContent}
              />
            )}

            <ChatInput
              input={input}
              onInputChange={setInput}
              onSend={() => handleSend()}
              isLoading={isLoading}
            />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="inline-flex p-6 rounded-2xl bg-gradient-to-br from-[#667eea] to-[#764ba2] mb-6">
                <Sparkles className="w-16 h-16 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-[var(--foreground)] mb-2">
                AI Study Assistant
              </h2>
              <p className="text-[var(--muted-foreground)] mb-6">
                Start a new conversation to get help with your studies
              </p>
              <Button
                onClick={createConversation}
                className="bg-gradient-to-r from-[#667eea] to-[#764ba2] hover:shadow-lg hover:shadow-[#667eea]/30"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Chat
              </Button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={null}>
      <ChatPageContent />
    </Suspense>
  );
}
