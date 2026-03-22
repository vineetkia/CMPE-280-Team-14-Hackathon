"use client";

import { motion, AnimatePresence } from 'motion/react';
import { CalendarEvent } from '@/types';
import { glassCard } from '@/lib/constants';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

interface CalendarGridProps {
  days: Date[];
  currentDate: Date;
  events: CalendarEvent[];
  getEventsForDate: (date: Date) => CalendarEvent[];
  onDateClick: (date: Date) => void;
}

export function CalendarGrid({ days, currentDate, events, getEventsForDate, onDateClick }: CalendarGridProps) {
  const isCurrentMonth = (date: Date) => date.getMonth() === currentDate.getMonth();
  const isToday = (date: Date) => date.toDateString() === new Date().toDateString();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.1 }}
      className={glassCard + ' p-6 hidden md:block'}
    >
      <div className="grid grid-cols-7 gap-2 mb-4">
        {DAYS.map(day => (
          <div key={day} className="text-center font-semibold text-[var(--muted-foreground)] py-2">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        <AnimatePresence mode="popLayout">
          {days.map((date, index) => {
            if (!date) return null;

            const dayEvents = getEventsForDate(date);
            const isCurrentMonthDay = isCurrentMonth(date);
            const isTodayDate = isToday(date);

            return (
              <motion.div
                key={`${date.toISOString()}-${index}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                whileHover={{ scale: 1.05, zIndex: 10 }}
                onClick={() => onDateClick(date)}
                className={`
                  min-h-[60px] md:min-h-[100px] p-3 rounded-xl cursor-pointer transition-all
                  ${isCurrentMonthDay
                    ? 'bg-white/50 dark:bg-gray-800/50 hover:bg-white/70 dark:hover:bg-gray-800/70'
                    : 'bg-white/20 dark:bg-gray-800/20 text-[var(--muted-foreground)]'}
                  ${isTodayDate ? 'ring-2 ring-[var(--primary-solid)] shadow-lg' : ''}
                `}
              >
                <div className={`
                  text-sm font-semibold mb-2
                  ${isTodayDate
                    ? 'w-7 h-7 rounded-full bg-[var(--primary-solid)] text-white flex items-center justify-center'
                    : ''}
                `}>
                  {date.getDate()}
                </div>
                <div className="space-y-1">
                  {dayEvents.slice(0, 2).map(event => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="text-xs px-2 py-1 rounded-md truncate font-medium"
                      style={{
                        backgroundColor: `${event.color}20`,
                        color: event.color,
                      }}
                    >
                      {event.title}
                    </motion.div>
                  ))}
                  {dayEvents.length > 2 && (
                    <div className="text-xs text-[var(--muted-foreground)] px-2">
                      +{dayEvents.length - 2} more
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
