"use client";

import { AnimatePresence } from 'motion/react';
import { useVoiceAssistant } from '@/context/VoiceAssistantContext';
import { VoiceTranscript } from './VoiceTranscript';

/**
 * Renders voice transcript bubbles as a fixed overlay.
 * Lives in ClientLayout, reads state from VoiceAssistantContext.
 */
export function VoiceTranscriptOverlay() {
  const { state, isSupported, isPassiveListening } = useVoiceAssistant();
  const { orbState, transcript, feedback } = state;

  if (!isSupported) return null;

  return (
    <AnimatePresence>
      {orbState === 'listening' && (
        <VoiceTranscript key="transcript" text={transcript || 'Listening...'} type="listening" />
      )}
      {orbState === 'processing' && (
        <VoiceTranscript key="processing" text="Processing..." type="processing" />
      )}
      {orbState === 'speaking' && feedback && (
        <VoiceTranscript key="feedback" text={feedback} type="feedback" />
      )}
    </AnimatePresence>
  );
}
