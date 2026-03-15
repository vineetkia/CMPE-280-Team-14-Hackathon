"use client";

import { useState, useEffect } from 'react';
import { Bell, Moon, Sun, User, Menu } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { AnimatePresence, motion } from 'motion/react';

interface TopBarProps {
  onMenuToggle: () => void;
}

export function TopBar({ onMenuToggle }: TopBarProps) {
  const { theme, toggleTheme } = useTheme();
  const [dateString, setDateString] = useState('');

  useEffect(() => {
    setDateString(new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }));
  }, []);

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
              Welcome back! 👋
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

          <motion.button
            whileHover={{ scale: 1.08, rotate: 3 }}
            whileTap={{ scale: 0.92 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            aria-label="User profile"
            className="flex items-center gap-2 p-2 pl-3 rounded-xl hover:bg-[var(--secondary)] transition-colors"
          >
            <span className="text-sm font-medium text-[var(--foreground)] hidden sm:inline">John Doe</span>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#667eea] to-[#764ba2] flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
          </motion.button>
        </div>
      </div>
    </header>
  );
}
