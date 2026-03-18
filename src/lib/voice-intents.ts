import type { VoiceIntent, VoiceIntentType } from '@/types';

/**
 * Parse a voice transcript into a structured intent.
 * Uses deterministic keyword-based matching — no NLP dependency.
 * Rules are ordered by specificity (most specific first).
 */

type IntentRule = {
  pattern: RegExp;
  type: VoiceIntentType;
  target?: string;
  extractPayload?: (match: RegExpMatchArray) => string;
};

const rules: IntentRule[] = [
  // AI query — must be before navigation so "ask AI about X" isn't caught by "open AI"
  {
    pattern: /(?:ask|tell|query)\s+(?:ai|assistant|study\s*pilot)\s+(?:about|to|for|regarding)?\s*(.+)/i,
    type: 'ask_ai',
    extractPayload: (m) => m[1].trim(),
  },

  // Navigation — dashboard
  {
    pattern: /(?:go\s+to|open|show|navigate\s+to|take\s+me\s+to)\s+(?:the\s+)?(?:dashboard|home|main)/i,
    type: 'navigate',
    target: '/',
  },

  // Navigation — todos
  {
    pattern: /(?:go\s+to|open|show|navigate\s+to|take\s+me\s+to)\s+(?:the\s+)?(?:todos?|tasks?|to-?do(?:\s*list)?)/i,
    type: 'navigate',
    target: '/todos',
  },

  // Navigation — calendar
  {
    pattern: /(?:go\s+to|open|show|navigate\s+to|take\s+me\s+to)\s+(?:the\s+)?(?:calendar|schedule|events?)/i,
    type: 'navigate',
    target: '/calendar',
  },

  // Navigation — assignments
  {
    pattern: /(?:go\s+to|open|show|navigate\s+to|take\s+me\s+to)\s+(?:the\s+)?(?:assignments?|homework)/i,
    type: 'navigate',
    target: '/assignments',
  },

  // Navigation — chat
  {
    pattern: /(?:go\s+to|open|show|navigate\s+to|take\s+me\s+to)\s+(?:the\s+)?(?:chat|ai\s*chat|assistant|ai)/i,
    type: 'navigate',
    target: '/chat',
  },

  // Actions — add todo
  {
    pattern: /(?:add|create|make|new)\s+(?:a\s+|an?\s+)?(?:new\s+)?(?:todo|task|to-?do)/i,
    type: 'add_todo',
  },

  // Actions — add assignment
  {
    pattern: /(?:add|create|make|new)\s+(?:a\s+|an?\s+)?(?:new\s+)?(?:assignment|homework)/i,
    type: 'add_assignment',
  },

  // Actions — add event
  {
    pattern: /(?:add|create|make|new)\s+(?:a\s+|an?\s+)?(?:new\s+)?(?:event|meeting|class|session)/i,
    type: 'add_event',
  },

  // Actions — new chat
  {
    pattern: /(?:new|start|begin|create)\s+(?:a\s+)?(?:new\s+)?(?:chat|conversation)/i,
    type: 'new_chat',
  },

  // Theme — toggle
  {
    pattern: /(?:switch|toggle|change)\s+(?:the\s+)?theme/i,
    type: 'switch_theme',
  },

  // Theme — dark mode
  {
    pattern: /(?:dark\s*mode|go\s+dark|switch\s+to\s+dark|enable\s+dark|turn\s+(?:on\s+)?dark)/i,
    type: 'set_dark_mode',
  },

  // Theme — light mode
  {
    pattern: /(?:light\s*mode|go\s+light|switch\s+to\s+light|enable\s+light|turn\s+(?:on\s+)?light)/i,
    type: 'set_light_mode',
  },

  // Stop listening / goodbye
  {
    pattern: /(?:stop\s+listening|goodbye|bye\s+(?:study\s*pilot)?|go\s+to\s+sleep|deactivate|shut\s+(?:up|down)|that'?s?\s+all|never\s*mind|cancel)/i,
    type: 'stop_listening',
  },
];

/** Map route paths to human-readable page names for TTS feedback */
const pageNames: Record<string, string> = {
  '/': 'Dashboard',
  '/todos': 'Todos',
  '/calendar': 'Calendar',
  '/assignments': 'Assignments',
  '/chat': 'AI Chat',
};

export function getPageName(path: string): string {
  return pageNames[path] || path;
}

/**
 * Strip wake word, filler words, and normalize transcript for better matching.
 */
function normalize(transcript: string): string {
  return transcript
    .trim()
    // Strip "Hey StudyPilot" wake word (and common mis-hearings)
    .replace(/^(?:hey|hi|a|hay)\s+(?:study|steady|studi)\s*(?:pilot|pilots?|pile[oa]t)\s*/i, '')
    .replace(/^(?:hey|hi|ok|okay|please|can\s+you|could\s+you|i\s+want\s+to|i\s+need\s+to)\s+/i, '')
    .replace(/\s+please$/i, '')
    .trim();
}

/**
 * Parse a voice transcript into a structured VoiceIntent.
 * Returns intent with type, target, payload, and confidence.
 */
export function parseVoiceIntent(rawTranscript: string): VoiceIntent {
  const cleaned = normalize(rawTranscript);

  for (const rule of rules) {
    const match = cleaned.match(rule.pattern);
    if (match) {
      return {
        type: rule.type,
        target: rule.target,
        payload: rule.extractPayload ? rule.extractPayload(match) : undefined,
        confidence: 1.0,
        rawTranscript,
      };
    }
  }

  return {
    type: 'unknown',
    confidence: 0,
    rawTranscript,
  };
}

/**
 * Get the feedback message for a given intent (used for TTS).
 */
export function getIntentFeedback(intent: VoiceIntent, currentTheme?: string): string {
  switch (intent.type) {
    case 'navigate':
      return `Opening ${getPageName(intent.target!)} now`;
    case 'add_todo':
      return 'Sure, opening the add todo form now';
    case 'add_assignment':
      return 'Opening the assignment form for you';
    case 'add_event':
      return 'Sure, lets add a new event';
    case 'new_chat':
      return 'Starting a fresh conversation now';
    case 'ask_ai':
      return `Let me look that up for you`;
    case 'switch_theme':
      return `Done, switched to ${currentTheme === 'light' ? 'dark' : 'light'} mode`;
    case 'set_dark_mode':
      return 'Switching to dark mode now';
    case 'set_light_mode':
      return 'Switching to light mode now';
    case 'stop_listening':
      return 'Goodbye! Say Hey StudyPilot when you need me';
    case 'unknown':
      return "Sorry, I didn't catch that. You can say things like open assignments, add a todo, or ask AI about something.";
  }
}
