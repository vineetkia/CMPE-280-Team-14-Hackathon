"use client";

import { useState, useRef, useEffect } from 'react';
import { MessageSquare, Plus, Trash2, X, Pencil, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Conversation } from '@/types';

interface ConversationListProps {
  conversations: Conversation[];
  activeConversationId: string | null;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onRename: (id: string, newTitle: string) => void;
  onCreate: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export function ConversationList({
  conversations,
  activeConversationId,
  onSelect,
  onDelete,
  onRename,
  onCreate,
  isOpen,
  onClose,
}: ConversationListProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const editInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingId && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, [editingId]);

  const startRename = (e: React.MouseEvent, conv: Conversation) => {
    e.stopPropagation();
    setEditingId(conv.id);
    setEditTitle(conv.title);
  };

  const confirmRename = (id: string) => {
    if (editTitle.trim()) {
      onRename(id, editTitle);
    }
    setEditingId(null);
  };

  const cancelRename = () => {
    setEditingId(null);
    setEditTitle('');
  };

  const listContent = (
    <>
      <div className="p-4 border-b border-[var(--border)]">
        <Button
          onClick={onCreate}
          className="w-full bg-[var(--primary-solid)] hover:shadow-lg hover:"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Chat
        </Button>
      </div>

      <ScrollArea className="flex-1 p-3">
        <div className="space-y-1.5">
          <AnimatePresence mode="popLayout">
            {conversations.map((conversation, index) => (
              <motion.div
                key={conversation.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.01, x: 2 }}
                onClick={() => {
                  if (editingId !== conversation.id) {
                    onSelect(conversation.id);
                    onClose();
                  }
                }}
                className={`
                  p-3 rounded-xl cursor-pointer transition-all group relative
                  ${activeConversationId === conversation.id
                    ? 'bg-[var(--primary-solid)] text-white'
                    : 'hover:bg-[var(--secondary)] text-[var(--foreground)]'}
                `}
              >
                <div className="flex items-start gap-2.5">
                  <MessageSquare className="w-4 h-4 mt-0.5 flex-shrink-0 opacity-70" />
                  <div className="flex-1 min-w-0">
                    {editingId === conversation.id ? (
                      <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
                        <input
                          ref={editInputRef}
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') confirmRename(conversation.id);
                            if (e.key === 'Escape') cancelRename();
                          }}
                          onBlur={() => confirmRename(conversation.id)}
                          className="flex-1 min-w-0 bg-transparent border-b border-current outline-none text-sm font-medium px-0 py-0.5"
                        />
                        <button
                          onClick={(e) => { e.stopPropagation(); confirmRename(conversation.id); }}
                          aria-label="Confirm rename"
                          className="p-0.5 rounded hover:bg-white/20 flex-shrink-0"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <p className="text-sm font-medium leading-snug line-clamp-2" title={conversation.title}>
                        {conversation.title}
                      </p>
                    )}
                    <p className={`text-xs mt-0.5 ${
                      activeConversationId === conversation.id
                        ? 'text-white/70'
                        : 'text-[var(--muted-foreground)]'
                    }`}>
                      {conversation.messages.length} messages
                    </p>
                  </div>
                  {editingId !== conversation.id && (
                    <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                      <motion.button
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => startRename(e, conversation)}
                        aria-label="Rename conversation"
                        className={`
                          p-1 rounded-lg
                          ${activeConversationId === conversation.id
                            ? 'hover:bg-white/20'
                            : 'hover:bg-[var(--secondary)]'}
                        `}
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(conversation.id);
                        }}
                        aria-label="Delete conversation"
                        className={`
                          p-1 rounded-lg
                          ${activeConversationId === conversation.id
                            ? 'hover:bg-white/20'
                            : 'hover:bg-red-500/20 text-red-500'}
                        `}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </motion.button>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {conversations.length === 0 && (
            <div className="text-center py-12 text-[var(--muted-foreground)]">
              <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No conversations yet</p>
              <p className="text-sm mt-1">Start a new chat to begin</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="w-72 hidden md:flex backdrop-blur-2xl bg-[var(--glass)] border border-[var(--glass-border)] rounded-2xl shadow-lg glass-panel flex-col overflow-hidden"
      >
        {listContent}
      </motion.div>

      {/* Mobile overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed top-0 left-0 bottom-0 w-[calc(100vw-3rem)] max-w-80 z-50 backdrop-blur-2xl bg-[var(--glass)] border-r border-[var(--glass-border)] shadow-xl glass-panel flex flex-col md:hidden"
            >
              <div className="flex justify-end p-3">
                <button
                  onClick={onClose}
                  aria-label="Close conversation list"
                  className="p-2 rounded-lg hover:bg-[var(--secondary)]"
                >
                  <X className="w-5 h-5 text-[var(--foreground)]" />
                </button>
              </div>
              {listContent}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
