"use client";

import { motion } from 'motion/react';
import { Loader2, Mic } from 'lucide-react';

interface VoiceTranscriptProps {
  text: string;
  type: 'listening' | 'processing' | 'feedback' | 'hint';
}

/**
 * Glassmorphism bubble above the voice orb showing real-time state.
 */
export function VoiceTranscript({ text, type }: VoiceTranscriptProps) {
  if (!text) return null;

  // Hint mode — compact, subtle
  if (type === 'hint') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 6, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 6, scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 400, damping: 28 }}
        className="absolute bottom-full mb-3 left-0 whitespace-nowrap px-3 py-1.5 rounded-full backdrop-blur-xl bg-black/60 border border-white/10 shadow-lg"
      >
        <div className="flex items-center gap-1.5">
          <Mic className="w-3 h-3 text-white/60" />
          <p className="text-[11px] text-white/70 font-medium">{text}</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className="absolute bottom-full mb-3 left-0 min-w-[180px] max-w-[280px] px-4 py-3 rounded-2xl backdrop-blur-xl bg-[var(--glass)] border border-[var(--glass-border)] shadow-xl"
    >
      <div className="flex items-start gap-2">
        {type === 'listening' && (
          <div className="flex items-center gap-0.5 mt-1 shrink-0">
            {[0, 0.15, 0.3].map((delay, i) => (
              <motion.div
                key={i}
                animate={{ scaleY: [0.4, 1, 0.4] }}
                transition={{ repeat: Infinity, duration: 0.8, delay }}
                className="w-[3px] h-3 rounded-full bg-purple-500"
              />
            ))}
          </div>
        )}
        {type === 'processing' && (
          <Loader2 className="w-3.5 h-3.5 animate-spin text-[#667eea] shrink-0 mt-0.5" />
        )}
        <p className="text-sm text-[var(--foreground)] leading-snug">
          {text}
        </p>
      </div>

      {/* Speech bubble arrow */}
      <div className="absolute -bottom-1.5 left-6 w-3 h-3 rotate-45 backdrop-blur-xl bg-[var(--glass)] border-r border-b border-[var(--glass-border)]" />
    </motion.div>
  );
}
