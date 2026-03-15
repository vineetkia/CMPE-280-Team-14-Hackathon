"use client";

import { useMemo } from 'react';
import { Plus, CalendarDays } from 'lucide-react';
import { motion } from 'motion/react';
import { CalendarEvent } from '@/types';
import { glassCard } from '@/lib/constants';
import { EmptyState } from '@/components/shared/EmptyState';

interface CalendarAgendaProps {
  currentDate: Date;
  events: CalendarEvent[];
  onDateClick: (date: Date) => void;
}

export function CalendarAgenda({ currentDate, events, onDateClick }: CalendarAgendaProps) {
  const groupedEvents = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const groups: { date: Date; events: CalendarEvent[] }[] = [];

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dayEvents = events.filter(event => {
        const eventDate = new Date(event.date);
        return eventDate.toDateString() === date.toDateString();
      });
      if (dayEvents.length > 0) {
        groups.push({ date, events: dayEvents });
      }
    }

    return groups;
  }, [currentDate, events]);

  const isToday = (date: Date) => date.toDateString() === new Date().toDateString();

  return (
    <div className="block md:hidden space-y-4">
      {groupedEvents.length > 0 ? (
        groupedEvents.map(({ date, events: dayEvents }) => (
          <motion.div
            key={date.toISOString()}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={glassCard + ' p-4'}
          >
            <button
              onClick={() => onDateClick(date)}
              className="flex items-center justify-between w-full mb-3"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`
                    w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold
                    ${isToday(date)
                      ? 'bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white'
                      : 'bg-[var(--secondary)] text-[var(--foreground)]'}
                  `}
                >
                  {date.getDate()}
                </div>
                <div className="text-left">
                  <p className="font-semibold text-[var(--foreground)]">
                    {date.toLocaleDateString('en-US', { weekday: 'long' })}
                  </p>
                  <p className="text-xs text-[var(--muted-foreground)]">
                    {date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
                  </p>
                </div>
              </div>
              <Plus className="w-4 h-4 text-[var(--muted-foreground)]" aria-label="Add event on this date" />
            </button>

            <div className="space-y-2">
              {dayEvents.map(event => (
                <div
                  key={event.id}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg"
                  style={{ backgroundColor: `${event.color}15` }}
                >
                  <div
                    className="w-1 h-8 rounded-full shrink-0"
                    style={{ backgroundColor: event.color }}
                  />
                  <div className="min-w-0">
                    <p className="font-medium text-sm truncate" style={{ color: event.color }}>
                      {event.title}
                    </p>
                    {event.description && (
                      <p className="text-xs text-[var(--muted-foreground)] truncate">{event.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ))
      ) : (
        <div className={glassCard}>
          <EmptyState
            icon={CalendarDays}
            title="No events this month"
            description="Tap Add Event to create your first event."
          />
        </div>
      )}
    </div>
  );
}
