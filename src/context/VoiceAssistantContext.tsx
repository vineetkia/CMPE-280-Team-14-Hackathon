"use client";

import {
  createContext,
  useContext,
  useState,
  useReducer,
  useCallback,
  useEffect,
  useRef,
  type ReactNode,
} from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useTheme } from '@/context/ThemeContext';
import { parseVoiceIntent, getIntentFeedback } from '@/lib/voice-intents';
import { playActivationSound, playDeactivationSound } from '@/lib/activation-sound';
import { toast } from '@/hooks/useToast';
import type { VoiceOrbState } from '@/types';

// ─── Azure Speech SDK (dynamic import) ──────────────────
type SpeechSDK = typeof import('microsoft-cognitiveservices-speech-sdk');

interface TokenData {
  token: string;
  region: string;
  fetchedAt: number;
}

const TOKEN_CACHE_MS = 9 * 60 * 1000;
let cachedToken: TokenData | null = null;

async function fetchSpeechToken(): Promise<TokenData | null> {
  if (cachedToken && Date.now() - cachedToken.fetchedAt < TOKEN_CACHE_MS) {
    return cachedToken;
  }
  try {
    const res = await fetch('/api/speech-token');
    if (!res.ok) return null;
    const data = await res.json();
    cachedToken = { token: data.token, region: data.region, fetchedAt: Date.now() };
    return cachedToken;
  } catch {
    return null;
  }
}

// ─── Wake word matching ──────────────────────────────────
function matchesWakeWord(text: string): boolean {
  const t = text.toLowerCase().trim();
  if (/(?:hey|hi|a|hay|ace|they|say)\s*(?:study|steady|studi|studio)\s*(?:pilot|pilots?|pie\s*lot|pile[oa]t|pylot|pilat)/i.test(t)) {
    return true;
  }
  const studIdx = t.indexOf('stud');
  const pilotIdx = t.search(/p[iy]l/);
  if (studIdx >= 0 && pilotIdx > studIdx && pilotIdx - studIdx < 20) return true;
  return false;
}

function stripWakeWord(t: string): string {
  return t
    .replace(/^.*?(?:hey|hi|a|hay|ace|they|say)\s*(?:study|steady|studi|studio)\s*(?:pilot|pilots?|pie\s*lot|pile[oa]t|pylot|pilat)\s*/i, '')
    .trim();
}

// ─── State ────────────────────────────────────────────────
interface State {
  orbState: VoiceOrbState;
  transcript: string;
  feedback: string;
  error: string | null;
}

const INITIAL: State = { orbState: 'idle', transcript: '', feedback: '', error: null };

type Action =
  | { type: 'START_LISTENING' }
  | { type: 'TRANSCRIPT_UPDATE'; transcript: string }
  | { type: 'TRANSCRIPT_FINAL'; transcript: string }
  | { type: 'PROCESSING_COMPLETE'; feedback: string }
  | { type: 'SPEAKING_COMPLETE' }
  | { type: 'ERROR'; error: string }
  | { type: 'CANCEL' };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'START_LISTENING':
      return { ...state, orbState: 'listening', transcript: '', feedback: '', error: null };
    case 'TRANSCRIPT_UPDATE':
      return { ...state, transcript: action.transcript };
    case 'TRANSCRIPT_FINAL':
      return { ...state, orbState: 'processing', transcript: action.transcript };
    case 'PROCESSING_COMPLETE':
      return { ...state, orbState: 'speaking', feedback: action.feedback };
    case 'SPEAKING_COMPLETE':
      return { ...state, orbState: 'idle', transcript: '', feedback: '' };
    case 'ERROR':
      return { ...state, orbState: 'idle', error: action.error, transcript: '', feedback: '' };
    case 'CANCEL':
      return { ...INITIAL };
    default:
      return state;
  }
}

// ─── Context ──────────────────────────────────────────────
interface ContextType {
  state: State;
  isSupported: boolean;
  isPassiveListening: boolean;
  toggleListening: () => void;
  cancelVoice: () => void;
}

const Ctx = createContext<ContextType | null>(null);

// ─── Azure TTS (Text-to-Speech) ──────────────────────────
async function azureSpeak(
  text: string,
  sdk: SpeechSDK,
  tokenData: TokenData
): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      const speechConfig = sdk.SpeechConfig.fromAuthorizationToken(tokenData.token, tokenData.region);
      speechConfig.speechSynthesisVoiceName = 'en-US-JennyNeural';
      speechConfig.speechSynthesisOutputFormat =
        sdk.SpeechSynthesisOutputFormat.Audio16Khz32KBitRateMonoMp3;

      const audioConfig = sdk.AudioConfig.fromDefaultSpeakerOutput();
      const synthesizer = new sdk.SpeechSynthesizer(speechConfig, audioConfig);

      synthesizer.speakTextAsync(
        text,
        (result) => {
          synthesizer.close();
          if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
            resolve();
          } else {
            console.warn('[Voice] Azure TTS result:', result.reason, result.errorDetails);
            reject(new Error(result.errorDetails || 'TTS failed'));
          }
        },
        (error) => {
          synthesizer.close();
          console.warn('[Voice] Azure TTS error:', error);
          reject(error);
        }
      );
    } catch (e) {
      reject(e);
    }
  });
}

// Web Speech API fallback for TTS
function webSpeechSpeak(text: string): Promise<void> {
  return new Promise((resolve) => {
    if (!('speechSynthesis' in window) || !text.trim()) {
      resolve();
      return;
    }
    const synth = window.speechSynthesis;
    synth.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.05;
    utterance.pitch = 1.0;
    utterance.volume = 0.85;
    utterance.lang = 'en-US';

    const voices = synth.getVoices();
    const preferred = voices.find(v => v.lang.startsWith('en') && v.name.includes('Google')) ||
      voices.find(v => v.lang.startsWith('en') && v.localService) ||
      voices.find(v => v.lang.startsWith('en'));
    if (preferred) utterance.voice = preferred;

    const timeout = setTimeout(() => { resolve(); }, 15000);
    utterance.onend = () => { clearTimeout(timeout); resolve(); };
    utterance.onerror = () => { clearTimeout(timeout); resolve(); };
    synth.speak(utterance);
  });
}

// ─── Provider ─────────────────────────────────────────────
export function VoiceAssistantProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, INITIAL);
  const [supported, setSupported] = useState(false);
  const [passiveListening, setPassiveListening] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  const processingRef = useRef(false);
  const modeRef = useRef<'off' | 'wake' | 'command'>('off');
  const desiredModeRef = useRef<'off' | 'wake'>('off');

  const azureSdkRef = useRef<SpeechSDK | null>(null);
  const azureRecognizerRef = useRef<InstanceType<SpeechSDK['SpeechRecognizer']> | null>(null);
  const commandTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wakeRetryCountRef = useRef(0);
  const MAX_WAKE_RETRIES = 3;

  const pathRef = useRef(pathname);
  const themeRef = useRef(theme);
  const toggleThemeRef = useRef(toggleTheme);
  const routerRef = useRef(router);

  useEffect(() => { pathRef.current = pathname; }, [pathname]);
  useEffect(() => { themeRef.current = theme; }, [theme]);
  useEffect(() => { toggleThemeRef.current = toggleTheme; }, [toggleTheme]);
  useEffect(() => { routerRef.current = router; }, [router]);

  const startRecognizerRef = useRef<(mode: 'wake' | 'command') => Promise<void>>(async () => {});
  const executeRef = useRef<(transcript: string) => Promise<void>>(async () => {});

  // ─── Stop Azure recognizer ─────────────────────────────
  const stopRecognizer = useCallback(() => {
    modeRef.current = 'off';
    if (commandTimeoutRef.current) {
      clearTimeout(commandTimeoutRef.current);
      commandTimeoutRef.current = null;
    }
    if (azureRecognizerRef.current) {
      const recognizer = azureRecognizerRef.current;
      azureRecognizerRef.current = null;
      recognizer.recognizing = undefined as never;
      recognizer.recognized = undefined as never;
      recognizer.canceled = undefined as never;
      recognizer.sessionStopped = undefined as never;
      try {
        recognizer.stopContinuousRecognitionAsync(
          () => { try { recognizer.close(); } catch { /* ok */ } },
          () => { try { recognizer.close(); } catch { /* ok */ } }
        );
      } catch { /* ok */ }
    }
  }, []);

  // ─── TTS speak function ────────────────────────────────
  const speakText = useCallback(async (text: string) => {
    const sdk = azureSdkRef.current;
    const tokenData = await fetchSpeechToken();

    if (sdk && tokenData) {
      try {
        await azureSpeak(text, sdk, tokenData);
        return;
      } catch (e) {
        console.warn('[Voice] Azure TTS failed, falling back to Web Speech:', e);
      }
    }
    // Fallback to Web Speech API
    await webSpeechSpeak(text);
  }, []);

  // ─── Execute intent ────────────────────────────────────
  executeRef.current = async (transcript: string) => {
    if (processingRef.current) return;
    processingRef.current = true;
    stopRecognizer();

    dispatch({ type: 'TRANSCRIPT_FINAL', transcript });

    const intent = parseVoiceIntent(transcript);
    const fb = getIntentFeedback(intent, themeRef.current);
    const p = pathRef.current;

    switch (intent.type) {
      case 'navigate':
        if (p !== intent.target) routerRef.current.push(intent.target!);
        break;
      case 'add_todo':
        if (p !== '/todos') routerRef.current.push('/todos');
        setTimeout(() => window.dispatchEvent(new CustomEvent('voice:action', { detail: { action: 'add_todo' } })), p !== '/todos' ? 600 : 100);
        break;
      case 'add_assignment':
        if (p !== '/assignments') routerRef.current.push('/assignments');
        setTimeout(() => window.dispatchEvent(new CustomEvent('voice:action', { detail: { action: 'add_assignment' } })), p !== '/assignments' ? 600 : 100);
        break;
      case 'add_event':
        if (p !== '/calendar') routerRef.current.push('/calendar');
        setTimeout(() => window.dispatchEvent(new CustomEvent('voice:action', { detail: { action: 'add_event' } })), p !== '/calendar' ? 600 : 100);
        break;
      case 'new_chat':
        if (p !== '/chat') routerRef.current.push('/chat');
        setTimeout(() => window.dispatchEvent(new CustomEvent('voice:action', { detail: { action: 'new_chat' } })), p !== '/chat' ? 600 : 100);
        break;
      case 'ask_ai':
        routerRef.current.push(`/chat?q=${encodeURIComponent(intent.payload!)}`);
        break;
      case 'switch_theme':
        toggleThemeRef.current();
        break;
      case 'set_dark_mode':
        if (themeRef.current !== 'dark') toggleThemeRef.current();
        break;
      case 'set_light_mode':
        if (themeRef.current !== 'light') toggleThemeRef.current();
        break;
      case 'stop_listening':
        break;
      case 'unknown':
        toast({ title: 'Command not recognized', description: intent.rawTranscript });
        break;
    }

    // TTS voice response
    dispatch({ type: 'PROCESSING_COMPLETE', feedback: fb });
    try {
      await speakText(fb);
    } catch (e) {
      console.warn('[Voice] TTS error:', e);
    }

    if (intent.type === 'stop_listening') {
      await playDeactivationSound();
    }

    processingRef.current = false;
    dispatch({ type: 'SPEAKING_COMPLETE' });

    if (intent.type !== 'stop_listening') {
      desiredModeRef.current = 'wake';
      startRecognizerRef.current('wake');
    } else {
      desiredModeRef.current = 'off';
      setPassiveListening(false);
    }
  };

  // ─── Start Azure recognizer (wake OR command mode) ─────
  startRecognizerRef.current = async (mode: 'wake' | 'command') => {
    stopRecognizer();

    try {
      if (!azureSdkRef.current) {
        azureSdkRef.current = await import('microsoft-cognitiveservices-speech-sdk');
      }
      const sdk = azureSdkRef.current;

      const tokenData = await fetchSpeechToken();
      if (!tokenData) {
        console.error('[Voice] Azure Speech not configured');
        toast({ title: 'Voice not configured', description: 'Azure Speech credentials missing.', variant: 'destructive' });
        dispatch({ type: 'ERROR', error: 'Azure Speech not configured' });
        return;
      }

      const speechConfig = sdk.SpeechConfig.fromAuthorizationToken(tokenData.token, tokenData.region);
      speechConfig.speechRecognitionLanguage = 'en-US';

      const audioConfig = sdk.AudioConfig.fromDefaultMicrophoneInput();
      const recognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);
      azureRecognizerRef.current = recognizer;
      modeRef.current = mode;

      if (mode === 'wake') {
        recognizer.recognizing = (_sender: unknown, event: { result: { text: string } }) => {
          if (modeRef.current !== 'wake') return;
          const text = event.result.text;
          if (matchesWakeWord(text)) {
            const afterWake = stripWakeWord(text);
            stopRecognizer();
            setPassiveListening(false);
            playActivationSound().then(() => {
              if (afterWake && afterWake.length > 2) {
                dispatch({ type: 'START_LISTENING' });
                executeRef.current(afterWake);
              } else {
                dispatch({ type: 'START_LISTENING' });
                startRecognizerRef.current('command');
              }
            });
          }
        };

        recognizer.recognized = (_sender: unknown, event: { result: { text: string; reason: number } }) => {
          if (modeRef.current !== 'wake') return;
          if (event.result.reason === sdk.ResultReason.RecognizedSpeech && event.result.text) {
            const text = event.result.text;
            if (matchesWakeWord(text)) {
              const afterWake = stripWakeWord(text);
              stopRecognizer();
              setPassiveListening(false);
              playActivationSound().then(() => {
                if (afterWake && afterWake.length > 2) {
                  dispatch({ type: 'START_LISTENING' });
                  executeRef.current(afterWake);
                } else {
                  dispatch({ type: 'START_LISTENING' });
                  startRecognizerRef.current('command');
                }
              });
            }
          }
        };

        recognizer.canceled = (_sender: unknown, event: { reason: number; errorDetails?: string }) => {
          if (modeRef.current !== 'wake') return;
          if (event.reason === sdk.CancellationReason.Error) {
            console.warn('[Voice] Wake recognizer canceled:', event.errorDetails);
            if (event.errorDetails?.includes('token') || event.errorDetails?.includes('auth')) {
              cachedToken = null;
            }
            wakeRetryCountRef.current += 1;
            if (wakeRetryCountRef.current >= MAX_WAKE_RETRIES) {
              console.warn('[Voice] Wake listener canceled too many times — stopping retries');
              desiredModeRef.current = 'off';
              setPassiveListening(false);
              return;
            }
            if (desiredModeRef.current === 'wake') {
              const backoff = Math.min(2000 * Math.pow(2, wakeRetryCountRef.current - 1), 15000);
              setTimeout(() => {
                if (desiredModeRef.current === 'wake' && !processingRef.current) {
                  startRecognizerRef.current('wake');
                }
              }, backoff);
            }
          }
        };

        recognizer.sessionStopped = () => {
          if (modeRef.current !== 'wake') return;
          if (desiredModeRef.current === 'wake' && !processingRef.current && wakeRetryCountRef.current < MAX_WAKE_RETRIES) {
            setTimeout(() => {
              if (desiredModeRef.current === 'wake' && !processingRef.current) {
                startRecognizerRef.current('wake');
              }
            }, 500);
          }
        };

        recognizer.startContinuousRecognitionAsync(
          () => {
            wakeRetryCountRef.current = 0;
            setPassiveListening(true);
            console.info('[Voice] Azure wake word listener started');
          },
          (err: string) => {
            wakeRetryCountRef.current += 1;
            setPassiveListening(false);
            if (wakeRetryCountRef.current >= MAX_WAKE_RETRIES) {
              console.warn('[Voice] Wake listener failed after', MAX_WAKE_RETRIES, 'retries — microphone may be unavailable:', err);
              desiredModeRef.current = 'off';
              return;
            }
            console.warn('[Voice] Wake listener start failed (attempt', wakeRetryCountRef.current + '):', err);
            if (desiredModeRef.current === 'wake') {
              const backoff = Math.min(3000 * Math.pow(2, wakeRetryCountRef.current - 1), 15000);
              setTimeout(() => {
                if (desiredModeRef.current === 'wake' && !processingRef.current) {
                  startRecognizerRef.current('wake');
                }
              }, backoff);
            }
          }
        );
      } else {
        // ── COMMAND MODE ──────────────────────────────────
        let latestInterim = '';

        recognizer.recognizing = (_sender: unknown, event: { result: { text: string } }) => {
          if (modeRef.current !== 'command') return;
          latestInterim = event.result.text;
          dispatch({ type: 'TRANSCRIPT_UPDATE', transcript: event.result.text });

          if (commandTimeoutRef.current) clearTimeout(commandTimeoutRef.current);
          commandTimeoutRef.current = setTimeout(() => {
            if (latestInterim && !processingRef.current && modeRef.current === 'command') {
              executeRef.current(latestInterim);
            }
          }, 3000);
        };

        recognizer.recognized = (_sender: unknown, event: { result: { text: string; reason: number } }) => {
          if (modeRef.current !== 'command') return;
          if (event.result.reason === sdk.ResultReason.RecognizedSpeech && event.result.text) {
            if (commandTimeoutRef.current) {
              clearTimeout(commandTimeoutRef.current);
              commandTimeoutRef.current = null;
            }
            executeRef.current(event.result.text);
          }
        };

        recognizer.canceled = (_sender: unknown, event: { reason: number; errorDetails?: string }) => {
          if (modeRef.current !== 'command') return;
          console.warn('[Voice] Command recognizer canceled:', event.errorDetails);
          if (latestInterim && !processingRef.current) {
            executeRef.current(latestInterim);
          } else if (!processingRef.current) {
            executeRef.current('');
          }
        };

        recognizer.startContinuousRecognitionAsync(
          () => {
            commandTimeoutRef.current = setTimeout(() => {
              if (!processingRef.current && modeRef.current === 'command') {
                if (latestInterim) {
                  executeRef.current(latestInterim);
                } else {
                  executeRef.current('');
                }
              }
            }, 10000);
          },
          (err: string) => {
            console.error('[Voice] Failed to start command listener:', err);
            dispatch({ type: 'ERROR', error: 'Failed to start voice recognition' });
            processingRef.current = false;
            desiredModeRef.current = 'wake';
            startRecognizerRef.current('wake');
          }
        );
      }
    } catch (e) {
      console.error('[Voice] Azure Speech SDK error:', e);
      dispatch({ type: 'ERROR', error: 'Voice recognition unavailable' });
    }
  };

  // ─── Check Azure availability & auto-start ─────────────
  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        azureSdkRef.current = await import('microsoft-cognitiveservices-speech-sdk');
      } catch {
        console.error('[Voice] Failed to load Azure Speech SDK');
        return;
      }

      const token = await fetchSpeechToken();
      if (!mounted) return;

      if (token) {
        setSupported(true);
        console.info('[Voice] Azure Speech Services ready');
        desiredModeRef.current = 'wake';
        setTimeout(() => {
          if (mounted && desiredModeRef.current === 'wake') {
            startRecognizerRef.current('wake');
          }
        }, 800);
      } else {
        console.warn('[Voice] Azure Speech not configured — voice assistant disabled');
        setSupported(false);
      }
    })();

    return () => {
      mounted = false;
      desiredModeRef.current = 'off';
      stopRecognizer();
    };
  }, [stopRecognizer]);

  // ─── Watchdog: recover from silent death ───────────────
  useEffect(() => {
    if (!supported) return;
    const watchdog = setInterval(() => {
      if (
        desiredModeRef.current === 'wake' &&
        modeRef.current === 'off' &&
        azureRecognizerRef.current === null &&
        !processingRef.current &&
        wakeRetryCountRef.current < MAX_WAKE_RETRIES
      ) {
        console.info('[Voice] Watchdog: restarting wake listener');
        startRecognizerRef.current('wake');
      }
    }, 7000);
    return () => clearInterval(watchdog);
  }, [supported]);

  // ─── Token refresh ─────────────────────────────────────
  useEffect(() => {
    if (!supported) return;
    const refreshInterval = setInterval(() => {
      if (cachedToken && Date.now() - cachedToken.fetchedAt > TOKEN_CACHE_MS) {
        cachedToken = null;
        fetchSpeechToken();
      }
    }, 60000);
    return () => clearInterval(refreshInterval);
  }, [supported]);

  // ─── Recover on tab focus ──────────────────────────────
  useEffect(() => {
    const onFocus = () => {
      if (desiredModeRef.current === 'wake' && !processingRef.current) {
        setTimeout(() => {
          if (azureRecognizerRef.current === null && desiredModeRef.current === 'wake' && !processingRef.current) {
            console.info('[Voice] Tab focus: restarting wake listener');
            startRecognizerRef.current('wake');
          }
        }, 500);
      }
    };
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, []);

  // ─── Toggle (click / keyboard) ──────────────────────────
  const toggleListening = useCallback(async () => {
    wakeRetryCountRef.current = 0; // Reset on manual interaction
    if (state.orbState === 'listening') {
      stopRecognizer();
      dispatch({ type: 'CANCEL' });
      await playDeactivationSound();
      desiredModeRef.current = 'wake';
      startRecognizerRef.current('wake');
    } else if (state.orbState === 'idle') {
      stopRecognizer();
      setPassiveListening(false);
      await playActivationSound();
      dispatch({ type: 'START_LISTENING' });
      desiredModeRef.current = 'off';
      startRecognizerRef.current('command');
    } else if (state.orbState === 'speaking' || state.orbState === 'processing') {
      stopRecognizer();
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      dispatch({ type: 'CANCEL' });
      processingRef.current = false;
      await playDeactivationSound();
      desiredModeRef.current = 'wake';
      startRecognizerRef.current('wake');
    }
  }, [state.orbState, stopRecognizer]);

  const cancelVoice = useCallback(async () => {
    stopRecognizer();
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    dispatch({ type: 'CANCEL' });
    processingRef.current = false;
    await playDeactivationSound();
    desiredModeRef.current = 'wake';
    startRecognizerRef.current('wake');
  }, [stopRecognizer]);

  // ─── Keyboard shortcut ────────────────────────────────
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'V') {
        const tag = (document.activeElement as HTMLElement)?.tagName;
        if (tag === 'INPUT' || tag === 'TEXTAREA') return;
        e.preventDefault();
        toggleListening();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [toggleListening]);

  return (
    <Ctx.Provider value={{ state, isSupported: supported, isPassiveListening: passiveListening, toggleListening, cancelVoice }}>
      {children}
    </Ctx.Provider>
  );
}

export function useVoiceAssistant() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useVoiceAssistant must be used within VoiceAssistantProvider');
  return ctx;
}
