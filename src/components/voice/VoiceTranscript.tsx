"use client";

import { motion } from 'motion/react';
import { Loader2, Mic } from 'lucide-react';

interface VoiceTranscriptProps {
  text: string;
  type: 'listening' | 'processing' | 'feedback' | 'hint';
}

/**
 * Floating transcript badge — appears at top-center of the main content area.
 * Shows real-time voice state without overlapping any navigation.
 */
export function VoiceTranscript({ text, type }: VoiceTranscriptProps) {
  if (!text) return null;

  // Hint mode — compact pill
  if (type === 'hint') {
    return (
      <motion.div
        initial={{ opacity: 0, y: -10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 400, damping: 28 }}
        className="fixed top-16 left-1/2 -translate-x-1/2 z-50 whitespace-nowrap px-4 py-2 rounded-full backdrop-blur-2xl bg-[var(--popover)] border border-[var(--glass-border)] shadow-xl glass-panel"
      >
        <div className="flex items-center gap-2">
          <Mic className="w-3.5 h-3.5 text-[var(--muted-foreground)]" />
          <p className="text-xs text-[var(--muted-foreground)] font-medium">{text}</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -12, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -12, scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className="fixed top-16 left-1/2 -translate-x-1/2 z-50 min-w-0 sm:min-w-[200px] max-w-[calc(100vw-2rem)] sm:max-w-[360px] px-5 py-3 rounded-2xl backdrop-blur-2xl bg-[var(--popover)] border border-[var(--glass-border)] shadow-xl glass-panel"
    >
      <div className="flex items-center gap-2.5">
        {type === 'listening' && (
          <div className="flex items-center gap-0.5 shrink-0">
            {[0, 0.15, 0.3].map((delay, i) => (
              <motion.div
                key={i}
                animate={{ scaleY: [0.4, 1, 0.4] }}
                transition={{ repeat: Infinity, duration: 0.8, delay }}
                className="w-[3px] h-3 rounded-full bg-[var(--primary-solid)]"
              />
            ))}
          </div>
        )}
        {type === 'processing' && (
          <Loader2 className="w-4 h-4 animate-spin text-[var(--primary-solid)] shrink-0" />
        )}
        {type === 'feedback' && (
          <div className="w-4 h-4 rounded-full bg-[var(--primary-solid)] flex items-center justify-center shrink-0">
            <Mic className="w-2.5 h-2.5 text-white" />
          </div>
        )}
        <p className="text-sm text-[var(--foreground)] leading-snug">
          {text}
        </p>
      </div>
    </motion.div>
  );
}
