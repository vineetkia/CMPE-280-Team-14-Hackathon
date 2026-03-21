"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Bell, Moon, Sun, User, Menu, LogOut, ChevronDown } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { AnimatePresence, motion } from 'motion/react';

interface TopBarProps {
  onMenuToggle: () => void;
}

export function TopBar({ onMenuToggle }: TopBarProps) {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
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
  const initials = displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <header className="h-16 backdrop-blur-xl bg-[var(--glass)] border-b border-[var(--glass-border)] sticky top-0 z-10 shadow-sm">
      <div className="h-full px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={onMenuToggle}
            aria-label="Toggle menu"
            className="p-2.5 rounded-xl hover:bg-[var(--secondary)] transition-colors md:hidden"
          >
            <Menu className="w-5 h-5 text-[var(--foreground)]" />
          </motion.button>
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-[var(--foreground)]">
              Welcome back, {user?.name?.split(' ')[0] || 'Student'}!
            </h2>
            <p className="text-sm text-[var(--muted-foreground)]">
              {dateString}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.08, rotate: 3 }}
            whileTap={{ scale: 0.92 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="p-2.5 rounded-xl hover:bg-[var(--secondary)] transition-colors"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={theme}
                initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
                animate={{ rotate: 0, opacity: 1, scale: 1 }}
                exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.2 }}
              >
                {theme === 'dark' ? (
                  <Sun className="w-5 h-5 text-[var(--foreground)]" />
                ) : (
                  <Moon className="w-5 h-5 text-[var(--foreground)]" />
                )}
              </motion.div>
            </AnimatePresence>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.08, rotate: 3 }}
            whileTap={{ scale: 0.92 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            aria-label="Notifications"
            className="p-2.5 rounded-xl hover:bg-[var(--secondary)] transition-colors relative"
          >
            <Bell className="w-5 h-5 text-[var(--foreground)]" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[var(--destructive)] rounded-full" />
          </motion.button>

          {/* User profile dropdown */}
          <div className="relative" ref={profileRef}>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setProfileOpen(!profileOpen)}
              aria-label="User profile"
              className="flex items-center gap-2 p-2 pl-3 rounded-xl hover:bg-[var(--secondary)] transition-colors"
            >
              <span className="text-sm font-medium text-[var(--foreground)] hidden sm:inline">
                {displayName}
              </span>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#667eea] to-[#764ba2] flex items-center justify-center">
                <span className="text-xs font-bold text-white">{initials}</span>
              </div>
              <ChevronDown className={`w-4 h-4 text-[var(--muted-foreground)] transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
            </motion.button>

            <AnimatePresence>
              {profileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-2 w-56 backdrop-blur-xl bg-[var(--glass)] border border-[var(--glass-border)] rounded-xl shadow-2xl overflow-hidden z-50"
                >
                  <div className="p-3 border-b border-[var(--glass-border)]">
                    <p className="text-sm font-medium text-[var(--foreground)]">{displayName}</p>
                    <p className="text-xs text-[var(--muted-foreground)]">{user?.email}</p>
                  </div>
                  <div className="p-1">
                    <button
                      onClick={() => { setProfileOpen(false); router.push('/profile'); }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[var(--foreground)] hover:bg-[var(--secondary)] transition-colors"
                    >
                      <User className="w-4 h-4" />
                      Profile
                    </button>
                    <button
                      onClick={() => { setProfileOpen(false); logout(); }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
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
