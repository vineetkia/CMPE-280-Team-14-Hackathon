export interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  category: 'study' | 'assignment' | 'exam' | 'project' | 'other';
  dueDate?: Date;
  createdAt: Date;
}

export interface Assignment {
  id: string;
  title: string;
  subject: string;
  description: string;
  dueDate: Date;
  status: 'not-started' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  grade?: string;
  createdAt: Date;
}

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  date: Date;
  type: 'class' | 'exam' | 'assignment' | 'study' | 'other';
  color?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface Conversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}
