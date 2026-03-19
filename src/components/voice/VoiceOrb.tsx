"use client";

import { motion, AnimatePresence } from 'motion/react';
import { Mic, X } from 'lucide-react';
import { useVoiceAssistant } from '@/context/VoiceAssistantContext';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { VoiceTranscript } from './VoiceTranscript';
import './voice-orb.css';

/**
 * Voice Orb — ethereal smoke / aurora style.
 *
 * Multiple soft color blobs drift, scale, and fade independently
 * creating an organic, smoky atmosphere around a glass sphere.
 * Each state has a unique color mood and movement speed.
 */

const ORB_SIZE = 72;

// ── State palettes ──────────────────────────────────────────
interface SmokePalette {
  blobs: string[];
  core: string;
  bg: string;
  shadow: string;
  speed: number;
}

const PALETTES: Record<string, SmokePalette> = {
  idle: {
    blobs: [
      'rgba(139,92,246,0.55)',
      'rgba(99,102,241,0.45)',
      'rgba(59,130,246,0.4)',
      'rgba(168,85,247,0.35)',
      'rgba(79,70,229,0.3)',
    ],
    core: 'rgba(199,210,254,0.5)',
    bg: 'radial-gradient(circle at 50% 50%, #1e1b4b 0%, #0f0a2a 100%)',
    shadow: '0 0 20px rgba(99,102,241,0.3), inset 0 0 20px rgba(99,102,241,0.1)',
    speed: 1,
  },
  listening: {
    blobs: [
      'rgba(236,72,153,0.6)',
      'rgba(168,85,247,0.55)',
      'rgba(56,189,248,0.5)',
      'rgba(232,121,249,0.5)',
      'rgba(34,211,238,0.4)',
    ],
    core: 'rgba(250,232,255,0.6)',
    bg: 'radial-gradient(circle at 50% 50%, #1e1044 0%, #0a0520 100%)',
    shadow: '0 0 30px rgba(168,85,247,0.45), inset 0 0 25px rgba(168,85,247,0.15)',
    speed: 2,
  },
  processing: {
    blobs: [
      'rgba(129,140,248,0.55)',
      'rgba(99,102,241,0.5)',
      'rgba(165,180,252,0.45)',
      'rgba(192,132,252,0.4)',
      'rgba(139,92,246,0.35)',
    ],
    core: 'rgba(224,231,255,0.55)',
    bg: 'radial-gradient(circle at 50% 50%, #1a1545 0%, #0c0825 100%)',
    shadow: '0 0 25px rgba(99,102,241,0.4), inset 0 0 20px rgba(99,102,241,0.1)',
    speed: 1.5,
  },
  speaking: {
    blobs: [
      'rgba(34,211,238,0.55)',
      'rgba(6,182,212,0.5)',
      'rgba(56,189,248,0.5)',
      'rgba(52,211,153,0.4)',
      'rgba(20,184,166,0.35)',
    ],
    core: 'rgba(207,250,254,0.55)',
    bg: 'radial-gradient(circle at 50% 50%, #0c1a2e 0%, #050d1a 100%)',
    shadow: '0 0 30px rgba(6,182,212,0.45), inset 0 0 25px rgba(6,182,212,0.12)',
    speed: 1.8,
  },
};

// Base durations for each blob's drift animation (seconds)
const BLOB_DURATIONS = [12, 15, 18, 14, 16];

// ── Component ───────────────────────────────────────────────
export function VoiceOrb() {
  const { state, isSupported, isPassiveListening, toggleListening, cancelVoice } = useVoiceAssistant();
  const reducedMotion = useReducedMotion();

  const { orbState, transcript, feedback } = state;
  const isActive = orbState !== 'idle';
  const palette = PALETTES[orbState] || PALETTES.idle;
  const speed = palette.speed;

  if (!isSupported) return null;

  return (
    <div className="fixed bottom-6 left-6 z-50" role="region" aria-label="Voice assistant">
      {/* ── Transcript bubbles ─────────────────────────── */}
      <AnimatePresence>
        {orbState === 'idle' && isPassiveListening && (
          <VoiceTranscript key="wake-hint" text='Say "Hey StudyPilot" or click to speak' type="hint" />
        )}
        {orbState === 'idle' && !isPassiveListening && (
          <VoiceTranscript key="click-hint" text="Click to activate voice" type="hint" />
        )}
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

      {/* ── Cancel ─────────────────────────────────────── */}
      <AnimatePresence>
        {isActive && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            onClick={cancelVoice}
            aria-label="Cancel voice assistant"
            className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-white/90 text-gray-600 flex items-center justify-center shadow-lg hover:bg-white transition-colors z-20"
          >
            <X className="w-3 h-3" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* ── Orb button ────────────────────────────────── */}
      <motion.button
        onClick={toggleListening}
        aria-label={
          orbState === 'idle'
            ? isPassiveListening
              ? 'Say "Hey StudyPilot" or click to activate'
              : 'Click to activate voice assistant'
            : orbState === 'listening'
              ? 'Listening... click to stop'
              : orbState === 'processing'
                ? 'Processing...'
                : 'Speaking...'
        }
        whileHover={reducedMotion ? undefined : { scale: 1.08 }}
        whileTap={reducedMotion ? undefined : { scale: 0.92 }}
        animate={{ scale: isActive ? 1.05 : 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        className="relative flex items-center justify-center cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-white/30 rounded-full group"
        style={{ width: ORB_SIZE, height: ORB_SIZE }}
      >
        {/* ── Outer smoke / aurora blobs ────────────────── */}
        <div
          className="absolute rounded-full overflow-hidden"
          style={{ inset: '-35%', filter: 'blur(12px)' }}
        >
          {[0, 1, 2, 3, 4].map((i) => {
            const driftDur = BLOB_DURATIONS[i] / speed;
            const fadeDur = (BLOB_DURATIONS[i] * 0.7) / speed;
            return (
              <div
                key={`outer-${i}`}
                className="absolute rounded-full"
                style={{
                  width: '60%',
                  height: '60%',
                  left: `${20 + (i % 3) * 15 - 10}%`,
                  top: `${20 + Math.floor(i / 2) * 20 - 5}%`,
                  background: `radial-gradient(circle, ${palette.blobs[i]} 0%, transparent 70%)`,
                  animation: reducedMotion
                    ? 'none'
                    : `smoke-drift-${i} ${driftDur}s ease-in-out infinite, smoke-fade-${i} ${fadeDur}s ease-in-out infinite`,
                }}
              />
            );
          })}
        </div>

        {/* ── Glass sphere ─────────────────────────────── */}
        <div
          className="absolute inset-0 rounded-full overflow-hidden"
          style={{ background: palette.bg, boxShadow: palette.shadow }}
        >
          {/* Inner smoke (clipped to sphere) */}
          <div className="absolute inset-[-50%]" style={{ filter: 'blur(8px)' }}>
            {[0, 1, 2, 3, 4].map((i) => {
              const driftIdx = (i + 2) % 5;
              const fadeIdx = (i + 1) % 5;
              const driftDur = (BLOB_DURATIONS[i] * 0.8) / speed;
              const fadeDur = (BLOB_DURATIONS[i] * 0.6) / speed;
              const delay = -i * 1.5;
              return (
                <div
                  key={`inner-${i}`}
                  className="absolute rounded-full"
                  style={{
                    width: '55%',
                    height: '55%',
                    left: `${22 + (i % 3) * 14}%`,
                    top: `${22 + Math.floor(i / 2) * 18}%`,
                    background: `radial-gradient(circle, ${palette.blobs[i]} 0%, transparent 65%)`,
                    animation: reducedMotion
                      ? 'none'
                      : `smoke-drift-${driftIdx} ${driftDur}s ease-in-out ${delay}s infinite, smoke-fade-${fadeIdx} ${fadeDur}s ease-in-out ${delay}s infinite`,
                  }}
                />
              );
            })}
          </div>

          {/* Core glow */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: `radial-gradient(circle at 48% 45%, ${palette.core} 0%, transparent 50%)`,
              animation: reducedMotion ? 'none' : `core-breathe ${6 / speed}s ease-in-out infinite`,
            }}
          />

          {/* Glass highlight */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: `
                radial-gradient(ellipse 50% 35% at 35% 28%, rgba(255,255,255,0.2) 0%, transparent 100%),
                linear-gradient(160deg, rgba(255,255,255,0.08) 0%, transparent 50%)
              `,
            }}
          />

          {/* Subtle rim */}
          <div
            className="absolute inset-0 rounded-full"
            style={{ boxShadow: 'inset 0 0 0 0.5px rgba(255,255,255,0.1)' }}
          />
        </div>

        {/* ── State icons ──────────────────────────────── */}
        <AnimatePresence mode="wait">
          {orbState === 'idle' && (
            <motion.div
              key="mic"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={{ duration: 0.2 }}
              className="relative z-10 text-white/60 group-hover:text-white/90 transition-colors duration-200"
            >
              <Mic className="w-5 h-5 drop-shadow-md" />
            </motion.div>
          )}

          {orbState === 'listening' && !reducedMotion && (
            <motion.div
              key="bars"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative z-10 flex items-center gap-[3px]"
            >
              {[0, 1, 2, 3, 4].map((i) => (
                <motion.div
                  key={i}
                  className="w-[2.5px] rounded-full bg-white/80"
                  animate={{ height: [6, 18 + Math.random() * 8, 6, 14 + Math.random() * 10, 6] }}
                  transition={{ duration: 0.7 + i * 0.08, repeat: Infinity, ease: 'easeInOut', delay: i * 0.07 }}
                  style={{ height: 6 }}
                />
              ))}
            </motion.div>
          )}

          {orbState === 'processing' && (
            <motion.div
              key="dots"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative z-10 flex items-center gap-1.5"
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-1.5 h-1.5 rounded-full bg-white/70"
                  animate={{ y: [0, -5, 0], opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 0.7, repeat: Infinity, ease: 'easeInOut', delay: i * 0.12 }}
                />
              ))}
            </motion.div>
          )}

          {orbState === 'speaking' && !reducedMotion && (
            <motion.div
              key="wave"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative z-10 flex items-center gap-[2px]"
            >
              {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                <motion.div
                  key={i}
                  className="w-[2px] rounded-full bg-white/65"
                  animate={{ height: [3, 10 + Math.abs(3 - i) * 3, 3] }}
                  transition={{ duration: 0.55 + i * 0.04, repeat: Infinity, ease: 'easeInOut', delay: i * 0.05 }}
                  style={{ height: 3 }}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Screen reader */}
      <div className="sr-only" aria-live="assertive" aria-atomic="true">{feedback}</div>
    </div>
  );
}
