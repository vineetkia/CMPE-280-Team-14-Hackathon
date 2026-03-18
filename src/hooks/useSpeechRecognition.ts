"use client";

import { useState, useEffect, useRef, useCallback } from 'react';

interface UseSpeechRecognitionOptions {
  onResult: (transcript: string, isFinal: boolean) => void;
  onError?: (error: string) => void;
  onEnd?: () => void;
  continuous?: boolean;
  lang?: string;
}

interface UseSpeechRecognitionReturn {
  isSupported: boolean;
  isListening: boolean;
  start: () => void;
  stop: () => void;
}

/**
 * Reusable hook wrapping the Web Speech API SpeechRecognition.
 * Works in Chrome, Edge, and Safari. Falls back gracefully elsewhere.
 */
export function useSpeechRecognition({
  onResult,
  onError,
  onEnd,
  continuous = false,
  lang = 'en-US',
}: UseSpeechRecognitionOptions): UseSpeechRecognitionReturn {
  const [isSupported, setIsSupported] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const callbacksRef = useRef({ onResult, onError, onEnd });

  // Keep callbacks ref updated without causing effect re-runs
  useEffect(() => {
    callbacksRef.current = { onResult, onError, onEnd };
  });

  useEffect(() => {
    const SR = typeof window !== 'undefined'
      ? window.SpeechRecognition || window.webkitSpeechRecognition
      : null;
    setIsSupported(!!SR);
  }, []);

  const stop = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsListening(false);
  }, []);

  const start = useCallback(() => {
    // Stop any existing instance first
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }

    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;

    const recognition = new SR();
    recognition.lang = lang;
    recognition.interimResults = true;
    recognition.continuous = continuous;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscript += result[0].transcript;
        } else {
          interimTranscript += result[0].transcript;
        }
      }

      if (finalTranscript) {
        callbacksRef.current.onResult(finalTranscript, true);
      } else if (interimTranscript) {
        callbacksRef.current.onResult(interimTranscript, false);
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      if (event.error !== 'aborted') {
        callbacksRef.current.onError?.(event.error);
      }
      stop();
    };

    recognition.onend = () => {
      setIsListening(false);
      recognitionRef.current = null;
      callbacksRef.current.onEnd?.();
    };

    recognitionRef.current = recognition;
    recognition.start();
  }, [lang, continuous, stop]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  return { isSupported, isListening, start, stop };
}
