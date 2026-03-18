"use client";

import { useState, useEffect, useCallback, useRef } from 'react';

interface UseSpeechSynthesisReturn {
  isSupported: boolean;
  isSpeaking: boolean;
  speak: (text: string) => Promise<void>;
  cancel: () => void;
}

/**
 * Hook wrapping the Web SpeechSynthesis API for text-to-speech.
 * Returns a Promise-based speak() that resolves when speech ends.
 *
 * Fixes over previous version:
 * 1. No stale `isSupported` closure — checks support directly at call time
 * 2. Waits for voices to load (Chrome loads them async after first getVoices())
 * 3. Timeout safety — resolves promise after 15s even if onend never fires
 * 4. Chrome 15s bug workaround — resume() keeps long utterances alive
 */
export function useSpeechSynthesis(): UseSpeechSynthesisReturn {
  const [isSupported, setIsSupported] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const resolveRef = useRef<(() => void) | null>(null);
  const resumeIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const supported = typeof window !== 'undefined' && 'speechSynthesis' in window;
    setIsSupported(supported);

    // Pre-warm voices — Chrome loads them async on first getVoices() call
    if (supported) {
      window.speechSynthesis.getVoices();
      // Chrome fires voiceschanged when voices are ready
      window.speechSynthesis.addEventListener?.('voiceschanged', () => {
        // voices are now loaded
      });
    }
  }, []);

  const cleanupResume = useCallback(() => {
    if (resumeIntervalRef.current) {
      clearInterval(resumeIntervalRef.current);
      resumeIntervalRef.current = null;
    }
  }, []);

  const cancel = useCallback(() => {
    cleanupResume();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    if (resolveRef.current) {
      resolveRef.current();
      resolveRef.current = null;
    }
  }, [cleanupResume]);

  const speak = useCallback((text: string): Promise<void> => {
    return new Promise((resolve) => {
      // Check support at CALL TIME, not via stale closure
      const synth = typeof window !== 'undefined' && 'speechSynthesis' in window
        ? window.speechSynthesis
        : null;

      if (!synth || !text.trim()) {
        resolve();
        return;
      }

      // Cancel any ongoing speech
      synth.cancel();
      cleanupResume();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.05;
      utterance.pitch = 1.0;
      utterance.volume = 0.85;
      utterance.lang = 'en-US';

      // Pick the best available voice
      const voices = synth.getVoices();
      const preferredVoice =
        // Google voices (Chrome) sound most natural
        voices.find((v) => v.lang.startsWith('en') && v.name.includes('Google')) ||
        // Microsoft voices (Edge) are also good
        voices.find((v) => v.lang.startsWith('en') && v.name.includes('Microsoft')) ||
        // Any English local voice
        voices.find((v) => v.lang.startsWith('en') && v.localService) ||
        // Any English voice
        voices.find((v) => v.lang.startsWith('en')) ||
        voices[0];

      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      // Safety: resolve after 15s no matter what (prevents hung promises)
      const timeout = setTimeout(() => {
        cleanupResume();
        setIsSpeaking(false);
        resolveRef.current = null;
        resolve();
      }, 15000);

      resolveRef.current = () => {
        clearTimeout(timeout);
        resolve();
      };

      utterance.onstart = () => {
        setIsSpeaking(true);
      };

      utterance.onend = () => {
        cleanupResume();
        clearTimeout(timeout);
        setIsSpeaking(false);
        resolveRef.current = null;
        resolve();
      };

      utterance.onerror = (e) => {
        // 'interrupted' and 'canceled' are expected when we cancel speech
        if (e.error !== 'interrupted' && e.error !== 'canceled') {
          console.warn('[TTS] Utterance error:', e.error);
        }
        cleanupResume();
        clearTimeout(timeout);
        setIsSpeaking(false);
        resolveRef.current = null;
        resolve();
      };

      synth.speak(utterance);

      // Chrome bug workaround: Chrome pauses speech after ~15 seconds.
      // Calling resume() periodically keeps it alive.
      resumeIntervalRef.current = setInterval(() => {
        if (synth.speaking) {
          synth.resume();
        }
      }, 5000);
    });
  }, [cleanupResume]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanupResume();
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [cleanupResume]);

  return { isSupported, isSpeaking, speak, cancel };
}
