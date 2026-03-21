/**
 * Siri-like activation chime using Web Audio API.
 * Two quick ascending tones — no external audio files needed.
 *
 * AudioContext is lazily created only on first user gesture
 * to avoid Chrome's "AudioContext was not allowed to start" warning.
 */

let audioContext: AudioContext | null = null;

function getOrCreateAudioContext(): AudioContext | null {
  try {
    if (!audioContext) {
      audioContext = new AudioContext();
    }
    // Resume if suspended (browsers require user interaction first)
    if (audioContext.state === 'suspended') {
      audioContext.resume().catch(() => {});
    }
    return audioContext;
  } catch {
    return null;
  }
}

/**
 * Play a Siri-style activation chime: two quick ascending tones.
 * Returns a Promise that resolves when the sound finishes.
 * Silently resolves if AudioContext is not available.
 */
export function playActivationSound(): Promise<void> {
  return new Promise((resolve) => {
    try {
      const ctx = getOrCreateAudioContext();
      if (!ctx || ctx.state === 'suspended') {
        // Can't play audio yet — resolve silently
        resolve();
        return;
      }

      const now = ctx.currentTime;

      // ── Tone 1 (lower) ──────────────────────────────
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(880, now); // A5
      gain1.gain.setValueAtTime(0, now);
      gain1.gain.linearRampToValueAtTime(0.3, now + 0.04);
      gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.15);

      // ── Tone 2 (higher, slightly delayed) ───────────
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(1318.5, now + 0.1); // E6
      gain2.gain.setValueAtTime(0, now + 0.1);
      gain2.gain.linearRampToValueAtTime(0.25, now + 0.14);
      gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.1);
      osc2.stop(now + 0.3);

      // Resolve when second tone finishes
      setTimeout(resolve, 350);
    } catch {
      // Audio not available — resolve silently
      resolve();
    }
  });
}

/**
 * Play a deactivation sound: two quick descending tones.
 */
export function playDeactivationSound(): Promise<void> {
  return new Promise((resolve) => {
    try {
      const ctx = getOrCreateAudioContext();
      if (!ctx || ctx.state === 'suspended') {
        resolve();
        return;
      }

      const now = ctx.currentTime;

      // ── Tone 1 (higher) ──────────────────────────────
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(1318.5, now); // E6
      gain1.gain.setValueAtTime(0, now);
      gain1.gain.linearRampToValueAtTime(0.2, now + 0.03);
      gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.12);

      // ── Tone 2 (lower, slightly delayed) ────────────
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(880, now + 0.08); // A5
      gain2.gain.setValueAtTime(0, now + 0.08);
      gain2.gain.linearRampToValueAtTime(0.15, now + 0.11);
      gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.22);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.08);
      osc2.stop(now + 0.22);

      setTimeout(resolve, 280);
    } catch {
      resolve();
    }
  });
}

/**
 * Pre-warm the AudioContext on user interaction.
 * Call this from any click/touch handler to ensure audio works later.
 */
export function warmUpAudio(): void {
  getOrCreateAudioContext();
}
