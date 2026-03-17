"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/useToast';

interface VoiceInputProps {
  onTranscript: (text: string) => void;
  disabled?: boolean;
}

/**
 * Voice input button using the Web Speech API (SpeechRecognition).
 * Shows a pulsing microphone when actively listening, and sends
 * transcribed text back via the onTranscript callback.
 */
export function VoiceInput({ onTranscript, disabled = false }: VoiceInputProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [interimText, setInterimText] = useState('');
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    const SpeechRecognition =
      typeof window !== 'undefined'
        ? window.SpeechRecognition || window.webkitSpeechRecognition
        : null;
    setIsSupported(!!SpeechRecognition);
  }, []);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsListening(false);
    setInterimText('');
  }, []);

  const startListening = useCallback(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = true;
    recognition.continuous = true;
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
        onTranscript(finalTranscript);
        setInterimText('');
      } else {
        setInterimText(interimTranscript);
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      if (event.error === 'not-allowed') {
        toast({
          title: 'Microphone access denied',
          description: 'Please allow microphone access in your browser settings.',
          variant: 'destructive',
        });
      } else if (event.error !== 'aborted') {
        toast({
          title: 'Voice input error',
          description: 'Could not process speech. Please try again.',
          variant: 'destructive',
        });
      }
      stopListening();
    };

    recognition.onend = () => {
      setIsListening(false);
      setInterimText('');
      recognitionRef.current = null;
    };

    recognitionRef.current = recognition;
    recognition.start();
  }, [onTranscript, stopListening]);

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  if (!isSupported) return null;

  return (
    <div className="relative">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={toggleListening}
        disabled={disabled}
        aria-label={isListening ? 'Stop voice input' : 'Start voice input'}
        className={`relative h-[60px] w-[60px] rounded-xl transition-all ${
          isListening
            ? 'bg-red-500/10 hover:bg-red-500/20 text-red-500'
            : 'hover:bg-[var(--secondary)] text-[var(--muted-foreground)]'
        }`}
      >
        <AnimatePresence mode="wait">
          {isListening ? (
            <motion.div
              key="listening"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
              >
                <MicOff className="w-5 h-5" />
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="idle"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            >
              <Mic className="w-5 h-5" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pulsing ring animation when listening */}
        {isListening && (
          <motion.div
            className="absolute inset-0 rounded-xl border-2 border-red-500"
            animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
          />
        )}
      </Button>

      {/* Interim transcript tooltip */}
      <AnimatePresence>
        {isListening && interimText && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-3 py-2 rounded-lg bg-[var(--popover)] border border-[var(--border)] shadow-lg text-xs text-[var(--foreground)] max-w-[200px] whitespace-nowrap overflow-hidden text-ellipsis"
          >
            <div className="flex items-center gap-1.5">
              <Loader2 className="w-3 h-3 animate-spin text-red-500 shrink-0" />
              <span className="truncate">{interimText}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
