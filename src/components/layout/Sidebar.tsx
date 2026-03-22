"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CheckSquare,
  Calendar,
  FileText,
  MessageSquare,
  GraduationCap,
  X,
  LogOut,
  Settings,
  Mic,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useAuth } from '@/context/AuthContext';
import { useVoiceAssistant } from '@/context/VoiceAssistantContext';

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/todos', icon: CheckSquare, label: 'Todos' },
  { path: '/calendar', icon: Calendar, label: 'Calendar' },
  { path: '/assignments', icon: FileText, label: 'Assignments' },
  { path: '/chat', icon: MessageSquare, label: 'AI Chat' },
  { path: '/profile', icon: Settings, label: 'Settings' },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const prefersReducedMotion = useReducedMotion();
  const { user, logout } = useAuth();
  const { state: voiceState, isSupported: voiceSupported, isPassiveListening, toggleListening, cancelVoice } = useVoiceAssistant();
  const { orbState } = voiceState;
  const isVoiceActive = orbState !== 'idle';

  return (
    <aside className={`
      fixed md:sticky top-0 z-40
      w-64 h-screen
      backdrop-blur-2xl bg-[var(--glass)] border-r border-[var(--glass-border)] shadow-2xl glass-panel
      transition-transform duration-300 ease-in-out
      ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      md:translate-x-0
      flex flex-col
    `}>
      <div className="p-6 flex-1">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[var(--primary-solid)]">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-semibold text-[var(--foreground)] tracking-tight">
              StudyPilot
            </h1>
          </div>
          <button
            onClick={onClose}
            aria-label="Close sidebar"
            className="p-2 rounded-lg hover:bg-[var(--secondary)] md:hidden"
          >
            <X className="w-5 h-5 text-[var(--foreground)]" />
          </button>
        </div>

        <nav role="navigation" aria-label="Main navigation" className="space-y-0.5">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            const Icon = item.icon;

            return (
              <Link key={item.path} href={item.path} onClick={onClose} className="relative block">
                <motion.div
                  whileHover={prefersReducedMotion ? undefined : { x: 4, transition: { type: 'spring', stiffness: 400, damping: 25 } }}
                  whileTap={prefersReducedMotion ? undefined : { scale: 0.98 }}
                  className={`
                    relative flex items-center gap-3 px-3 py-2.5 rounded-lg
                    transition-colors duration-150 text-sm
                    ${isActive
                      ? 'text-white'
                      : 'hover:bg-[var(--secondary)] text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
                    }
                  `}
                >
                  <Icon className="w-[18px] h-[18px] relative z-10" />
                  <span className="font-medium relative z-10">{item.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute inset-0 rounded-lg bg-[var(--primary-solid)] -z-10"
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}
                </motion.div>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Voice assistant button */}
      {voiceSupported && (
        <div className="px-4 pt-3 pb-1">
          <motion.button
            onClick={toggleListening}
            whileHover={prefersReducedMotion ? undefined : { scale: 1.02 }}
            whileTap={prefersReducedMotion ? undefined : { scale: 0.97 }}
            aria-label={
              orbState === 'idle'
                ? isPassiveListening
                  ? 'Listening for "Hey StudyPilot" — click to speak'
                  : 'Click to activate voice assistant'
                : orbState === 'listening'
                  ? 'Listening... click to stop'
                  : 'Processing...'
            }
            className={`
              relative w-full flex items-center gap-3 px-3 py-2.5 rounded-lg
              transition-all duration-200 text-sm overflow-hidden
              ${isVoiceActive
                ? 'bg-[var(--primary-solid)] text-white shadow-lg shadow-[var(--primary-solid)]/20'
                : 'hover:bg-[var(--secondary)] text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
              }
            `}
          >
            {/* Animated background pulse when listening */}
            <AnimatePresence>
              {orbState === 'listening' && !prefersReducedMotion && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 rounded-lg"
                  style={{
                    background: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0) 100%)',
                    animation: 'voice-pulse 2s ease-in-out infinite',
                  }}
                />
              )}
            </AnimatePresence>

            <div className="relative w-[18px] h-[18px] flex items-center justify-center">
              <Mic className="w-[18px] h-[18px]" />
              {/* Listening indicator dot */}
              {(isVoiceActive || isPassiveListening) && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className={`absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full ${
                    isVoiceActive ? 'bg-white' : 'bg-emerald-400'
                  }`}
                >
                  {isVoiceActive && !prefersReducedMotion && (
                    <motion.div
                      animate={{ scale: [1, 1.8, 1], opacity: [1, 0, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="absolute inset-0 rounded-full bg-white"
                    />
                  )}
                </motion.div>
              )}
            </div>

            <span className="font-medium relative z-10 flex-1 text-left">
              {orbState === 'listening'
                ? 'Listening...'
                : orbState === 'processing'
                  ? 'Processing...'
                  : orbState === 'speaking'
                    ? 'Speaking...'
                    : 'Voice Assistant'}
            </span>

            {/* Sound bars when listening */}
            {orbState === 'listening' && !prefersReducedMotion && (
              <div className="flex items-center gap-[2px]">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-[2px] rounded-full bg-white/80"
                    animate={{ height: [4, 12, 4] }}
                    transition={{ duration: 0.6 + i * 0.1, repeat: Infinity, ease: 'easeInOut', delay: i * 0.08 }}
                    style={{ height: 4 }}
                  />
                ))}
              </div>
            )}

            {/* Cancel button when active */}
            {isVoiceActive && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                onClick={(e) => { e.stopPropagation(); cancelVoice(); }}
                className="p-0.5 rounded hover:bg-white/20 transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </motion.div>
            )}

            {/* Kbd shortcut hint */}
            {orbState === 'idle' && (
              <span className="text-[10px] opacity-40 font-mono hidden lg:inline">⌘⇧V</span>
            )}
          </motion.button>
        </div>
      )}

      {/* User section at bottom */}
      {user && (
        <div className="p-4 border-t border-[var(--glass-border)]">
          <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-[var(--secondary)] transition-colors cursor-default">
            <div className="w-9 h-9 rounded-lg bg-[var(--primary-solid)] flex items-center justify-center flex-shrink-0 shadow-sm">
              <span className="text-xs font-bold text-white">
                {user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[var(--foreground)] truncate">{user.name}</p>
              <p className="text-[11px] text-[var(--muted-foreground)] truncate">{user.email}</p>
            </div>
            <button
              onClick={logout}
              aria-label="Sign out"
              className="p-1.5 rounded-lg text-[var(--muted-foreground)] hover:text-red-400 hover:bg-red-500/10 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </aside>
  );
}
