"use client";

import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { glassCard, gradientButton } from '@/lib/constants';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

interface CalendarHeaderProps {
  currentDate: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onAddEvent: () => void;
}

export function CalendarHeader({ currentDate, onPrevMonth, onNextMonth, onAddEvent }: CalendarHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={glassCard + ' p-6'}
    >
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-[var(--foreground)]">Calendar</h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={onPrevMonth}
              className="p-2 rounded-lg hover:bg-[var(--secondary)] transition-colors"
              aria-label="Previous month"
            >
              <ChevronLeft className="w-5 h-5" />
            </motion.button>
            <span className="text-lg font-semibold min-w-[160px] text-center">
              {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
            </span>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={onNextMonth}
              className="p-2 rounded-lg hover:bg-[var(--secondary)] transition-colors"
              aria-label="Next month"
            >
              <ChevronRight className="w-5 h-5" />
            </motion.button>
          </div>
          <Button onClick={onAddEvent} className={gradientButton}>
            <Plus className="w-4 h-4 mr-2" />
            Add Event
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
