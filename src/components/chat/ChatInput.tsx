"use client";

import { useCallback, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { VoiceInput } from './VoiceInput';

interface ChatInputProps {
  input: string;
  onInputChange: (value: string) => void;
  onSend: () => void;
  isLoading: boolean;
}

export function ChatInput({ input, onInputChange, onSend, isLoading }: ChatInputProps) {
  // Keep a ref to current input for voice transcript appending
  const inputRef = useRef(input);
  useEffect(() => { inputRef.current = input; }, [input]);

  const handleVoiceTranscript = useCallback(
    (text: string) => {
      const current = inputRef.current;
      const separator = current.trim() ? ' ' : '';
      onInputChange(current + separator + text);
    },
    [onInputChange]
  );

  return (
    <div className="p-3 md:p-4 border-t border-[var(--border)]">
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
          placeholder="Ask me anything... or use the mic to speak"
          className="flex-1 min-h-[60px] max-h-[200px] bg-white/50 dark:bg-gray-800/50 resize-none"
          disabled={isLoading}
        />
        <VoiceInput onTranscript={handleVoiceTranscript} disabled={isLoading} />
        <Button
          onClick={onSend}
          disabled={!input.trim() || isLoading}
          aria-label="Send message"
          className="bg-[var(--primary-solid)] hover:shadow-lg hover: h-[60px] px-6"
        >
          <Send className="w-5 h-5" />
        </Button>
      </div>
      <p className="text-xs text-[var(--muted-foreground)] mt-3 text-center">
        Press Enter to send · Shift + Enter for new line · 🎤 Click mic for voice input
      </p>
    </div>
  );
}
