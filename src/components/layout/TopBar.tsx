"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Bell, Moon, Sun, User, Menu, LogOut, ChevronDown, Settings, Mic } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { useVoiceAssistant } from '@/context/VoiceAssistantContext';
import { AnimatePresence, motion } from 'motion/react';

interface TopBarProps {
  onMenuToggle: () => void;
}

export function TopBar({ onMenuToggle }: TopBarProps) {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const { state: voiceState, isSupported: voiceSupported, toggleListening } = useVoiceAssistant();
  const isVoiceActive = voiceState.orbState !== 'idle';
  const [dateString, setDateString] = useState('');
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setDateString(new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }));
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const displayName = user?.name || 'User';
  const firstName = user?.name?.split(' ')[0] || 'Student';
  const initials = displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <header className="h-14 backdrop-blur-2xl bg-[var(--glass)] border-b border-[var(--glass-border)] glass-panel sticky top-0 z-10">
      <div className="h-full px-4 sm:px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={onMenuToggle}
            aria-label="Toggle menu"
            className="p-2 rounded-lg hover:bg-[var(--secondary)] transition-colors md:hidden"
          >
            <Menu className="w-5 h-5 text-[var(--foreground)]" />
          </motion.button>
          <div>
            <h2 className="text-[15px] font-semibold text-[var(--foreground)] leading-tight">
              Welcome back, {firstName}
            </h2>
            <p className="text-xs text-[var(--muted-foreground)] leading-tight">
              {dateString}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Voice mic — visible on mobile (sidebar hidden), hidden on desktop */}
          {voiceSupported && (
            <button
              onClick={toggleListening}
              aria-label={isVoiceActive ? 'Stop voice assistant' : 'Activate voice assistant'}
              className={`p-2 rounded-lg transition-colors md:hidden relative ${
                isVoiceActive
                  ? 'bg-[var(--primary-solid)] text-white'
                  : 'hover:bg-[var(--secondary)] text-[var(--foreground)]'
              }`}
            >
              <Mic className="w-[18px] h-[18px]" />
              {isVoiceActive && (
                <motion.span
                  animate={{ scale: [1, 1.6, 1], opacity: [1, 0, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="absolute top-1 right-1 w-2 h-2 rounded-full bg-white"
                />
              )}
            </button>
          )}

          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="p-2 rounded-lg hover:bg-[var(--secondary)] transition-colors"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={theme}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                {theme === 'dark' ? (
                  <Sun className="w-[18px] h-[18px] text-[var(--foreground)]" />
                ) : (
                  <Moon className="w-[18px] h-[18px] text-[var(--foreground)]" />
                )}
              </motion.div>
            </AnimatePresence>
          </button>

          <button
            aria-label="Notifications"
            className="p-2 rounded-lg hover:bg-[var(--secondary)] transition-colors relative"
          >
            <Bell className="w-[18px] h-[18px] text-[var(--foreground)]" />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[var(--destructive)] rounded-full" />
          </button>

          <div className="w-px h-6 bg-[var(--glass-border)] mx-1 hidden sm:block" />

          {/* User profile dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              aria-label="User profile"
              className="flex items-center gap-2 py-1.5 px-2 rounded-lg hover:bg-[var(--secondary)] transition-colors"
            >
              <div className="w-7 h-7 rounded-lg bg-[var(--primary-solid)] flex items-center justify-center shadow-sm">
                <span className="text-[10px] font-bold text-white">{initials}</span>
              </div>
              <span className="text-sm font-medium text-[var(--foreground)] hidden sm:inline max-w-[120px] truncate">
                {firstName}
              </span>
              <ChevronDown className={`w-3.5 h-3.5 text-[var(--muted-foreground)] transition-transform duration-200 hidden sm:block ${profileOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {profileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -4, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -4, scale: 0.97 }}
                  transition={{ duration: 0.12 }}
                  className="absolute right-0 top-full mt-1.5 w-48 sm:w-52 backdrop-blur-xl bg-[var(--popover)] border border-[var(--glass-border)] rounded-xl shadow-2xl overflow-hidden z-50"
                >
                  {/* User info header */}
                  <div className="px-3 py-2.5 border-b border-[var(--glass-border)]">
                    <p className="text-sm font-semibold text-[var(--foreground)] truncate">{displayName}</p>
                    <p className="text-[11px] text-[var(--muted-foreground)] truncate">{user?.email}</p>
                  </div>

                  {/* Menu items */}
                  <div className="p-1">
                    <button
                      onClick={() => { setProfileOpen(false); router.push('/profile'); }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-[var(--foreground)] hover:bg-[var(--secondary)] transition-colors"
                    >
                      <Settings className="w-3.5 h-3.5 text-[var(--muted-foreground)]" />
                      Settings
                    </button>
                    <button
                      onClick={() => { setProfileOpen(false); router.push('/profile'); }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-[var(--foreground)] hover:bg-[var(--secondary)] transition-colors"
                    >
                      <User className="w-3.5 h-3.5 text-[var(--muted-foreground)]" />
                      Profile
                    </button>
                  </div>

                  {/* Sign out */}
                  <div className="p-1 border-t border-[var(--glass-border)]">
                    <button
                      onClick={() => { setProfileOpen(false); logout(); }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Sign out
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
}
