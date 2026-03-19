/**
 * State-driven configuration for the Siri orb.
 *
 * Each VoiceOrbState maps to a set of visual parameters:
 *  - intensity    (how "alive" the orb appears)
 *  - speed        (animation time multiplier)
 *  - colors       (four hex colours for the prismatic bands)
 *  - coreColor    (centre bloom tint)
 *  - glowCSS      (ambient glow colour for the outer container)
 */

import type { VoiceOrbState } from '@/types';
import type { OrbConfig } from './OrbRenderer';

export interface OrbStateConfig extends OrbConfig {
  glowCSS: string;
}

export const ORB_STATES: Record<VoiceOrbState, OrbStateConfig> = {
  idle: {
    intensity: 0.6,
    speed: 0.9,
    colors: ['#f472b6', '#38bdf8', '#34d399', '#a78bfa'],
    coreColor: '#e0e7ff',
    audioLevel: 0,
    glowCSS: 'rgba(99,102,241,0.35)',
  },
  listening: {
    intensity: 0.95,
    speed: 1.5,
    colors: ['#f472b6', '#e879f9', '#38bdf8', '#22d3ee'],
    coreColor: '#fae8ff',
    audioLevel: 0,
    glowCSS: 'rgba(196,85,247,0.55)',
  },
  processing: {
    intensity: 0.7,
    speed: 1.1,
    colors: ['#818cf8', '#6366f1', '#a5b4fc', '#c084fc'],
    coreColor: '#e0e7ff',
    audioLevel: 0,
    glowCSS: 'rgba(99,102,241,0.45)',
  },
  speaking: {
    intensity: 0.85,
    speed: 1.3,
    colors: ['#22d3ee', '#06b6d4', '#38bdf8', '#34d399'],
    coreColor: '#cffafe',
    audioLevel: 0,
    glowCSS: 'rgba(6,182,212,0.50)',
  },
};
