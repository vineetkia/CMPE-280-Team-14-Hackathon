"use client";

import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface ChatInputProps {
  input: string;
  onInputChange: (value: string) => void;
  onSend: () => void;
  isLoading: boolean;
}

export function ChatInput({ input, onInputChange, onSend, isLoading }: ChatInputProps) {
  return (
    <div className="p-6 border-t border-[var(--border)]">
      <div className="flex gap-3">
        <Textarea
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              onSend();
            }
          }}
          placeholder="Ask me anything..."
          className="flex-1 min-h-[60px] max-h-[200px] bg-white/50 dark:bg-gray-800/50 resize-none"
          disabled={isLoading}
        />
        <Button
          onClick={onSend}
          disabled={!input.trim() || isLoading}
          aria-label="Send message"
          className="bg-gradient-to-r from-[#667eea] to-[#764ba2] hover:shadow-lg hover:shadow-[#667eea]/30 h-[60px] px-6"
        >
          <Send className="w-5 h-5" />
        </Button>
      </div>
      <p className="text-xs text-[var(--muted-foreground)] mt-3 text-center">
        Press Enter to send, Shift + Enter for new line
      </p>
    </div>
  );
}
