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
  X
} from 'lucide-react';
import { motion } from 'motion/react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/todos', icon: CheckSquare, label: 'Todos' },
  { path: '/calendar', icon: Calendar, label: 'Calendar' },
  { path: '/assignments', icon: FileText, label: 'Assignments' },
  { path: '/chat', icon: MessageSquare, label: 'AI Chat' },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const prefersReducedMotion = useReducedMotion();

  return (
    <aside className={`
      fixed md:sticky top-0 z-40
      w-64 h-screen
      backdrop-blur-xl bg-[var(--glass)] border-r border-[var(--glass-border)] shadow-2xl
      transition-transform duration-300 ease-in-out
      ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      md:translate-x-0
    `}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-[#667eea] to-[#764ba2] shadow-lg">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">
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

        <nav role="navigation" aria-label="Main navigation" className="space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            const Icon = item.icon;

            return (
              <Link key={item.path} href={item.path} onClick={onClose} className="relative block">
                <motion.div
                  whileHover={prefersReducedMotion ? undefined : { x: 6, transition: { type: 'spring', stiffness: 400, damping: 25 } }}
                  whileTap={prefersReducedMotion ? undefined : { scale: 0.97 }}
                  className={`
                    relative flex items-center gap-3 px-4 py-3 rounded-xl
                    transition-colors duration-200
                    ${isActive
                      ? 'text-white'
                      : 'hover:bg-[var(--secondary)] text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
                    }
                  `}
                >
                  <Icon className="w-5 h-5 relative z-10" />
                  <span className="font-medium relative z-10">{item.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#667eea] to-[#764ba2] shadow-lg shadow-[#667eea]/30 -z-10"
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}
                </motion.div>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
