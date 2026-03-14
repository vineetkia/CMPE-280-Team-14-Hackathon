import { Todo, Assignment, CalendarEvent } from '../types';

export const mockTodos: Todo[] = [
  {
    id: '1',
    title: 'Review calculus notes',
    description: 'Go through chapters 5-7',
    completed: false,
    priority: 'high',
    category: 'study',
    dueDate: new Date(2026, 2, 20),
    createdAt: new Date(2026, 2, 15),
  },
  {
    id: '2',
    title: 'Prepare for Chemistry quiz',
    completed: false,
    priority: 'medium',
    category: 'exam',
    dueDate: new Date(2026, 2, 21),
    createdAt: new Date(2026, 2, 16),
  },
  {
    id: '3',
    title: 'Read History chapter 12',
    completed: true,
    priority: 'low',
    category: 'study',
    createdAt: new Date(2026, 2, 14),
  },
];

export const mockAssignments: Assignment[] = [
  {
    id: '1',
    title: 'Linear Algebra Problem Set',
    subject: 'Mathematics',
    description: 'Complete exercises 1-15 from chapter 8',
    dueDate: new Date(2026, 2, 25),
    status: 'in-progress',
    priority: 'high',
    createdAt: new Date(2026, 2, 10),
  },
  {
    id: '2',
    title: 'Physics Lab Report',
    subject: 'Physics',
    description: 'Write lab report for pendulum experiment',
    dueDate: new Date(2026, 2, 22),
    status: 'not-started',
    priority: 'medium',
    createdAt: new Date(2026, 2, 12),
  },
  {
    id: '3',
    title: 'Essay on Renaissance Art',
    subject: 'History',
    description: '2000 words on Italian Renaissance painters',
    dueDate: new Date(2026, 2, 28),
    status: 'completed',
    priority: 'medium',
    grade: 'A',
    createdAt: new Date(2026, 2, 5),
  },
];

export const mockEvents: CalendarEvent[] = [
  {
    id: '1',
    title: 'Calculus Midterm',
    description: 'Chapters 1-8',
    date: new Date(2026, 2, 24),
    type: 'exam',
    color: '#ef4444',
  },
  {
    id: '2',
    title: 'Chemistry Class',
    date: new Date(2026, 2, 19),
    type: 'class',
    color: '#3b82f6',
  },
  {
    id: '3',
    title: 'Study Group - Physics',
    description: 'Library, Room 301',
    date: new Date(2026, 2, 21),
    type: 'study',
    color: '#10b981',
  },
];
