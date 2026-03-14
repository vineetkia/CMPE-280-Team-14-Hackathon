import { Todo, Assignment, CalendarEvent, Conversation } from '../types';

const STORAGE_KEYS = {
  TODOS: 'studypilot_todos',
  ASSIGNMENTS: 'studypilot_assignments',
  EVENTS: 'studypilot_events',
  CONVERSATIONS: 'studypilot_conversations',
};

function getItems<T>(key: string): T[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data, (key, value) => {
    if (key === 'date' || key === 'dueDate' || key === 'createdAt' || key === 'updatedAt' || key === 'timestamp') {
      return new Date(value);
    }
    return value;
  }) : [];
}

function setItems<T>(key: string, items: T[]): void {
  localStorage.setItem(key, JSON.stringify(items));
}

export const todosService = {
  getAll: (): Todo[] => getItems<Todo>(STORAGE_KEYS.TODOS),
  add: (todo: Omit<Todo, 'id' | 'createdAt'>): Todo => {
    const todos = todosService.getAll();
    const newTodo: Todo = {
      ...todo,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    };
    setItems(STORAGE_KEYS.TODOS, [...todos, newTodo]);
    return newTodo;
  },
  update: (id: string, updates: Partial<Todo>): Todo | undefined => {
    const todos = todosService.getAll();
    const index = todos.findIndex(t => t.id === id);
    if (index === -1) return undefined;
    todos[index] = { ...todos[index], ...updates };
    setItems(STORAGE_KEYS.TODOS, todos);
    return todos[index];
  },
  delete: (id: string): boolean => {
    const todos = todosService.getAll();
    const filtered = todos.filter(t => t.id !== id);
    if (filtered.length === todos.length) return false;
    setItems(STORAGE_KEYS.TODOS, filtered);
    return true;
  },
};

export const assignmentsService = {
  getAll: (): Assignment[] => getItems<Assignment>(STORAGE_KEYS.ASSIGNMENTS),
  add: (assignment: Omit<Assignment, 'id' | 'createdAt'>): Assignment => {
    const assignments = assignmentsService.getAll();
    const newAssignment: Assignment = {
      ...assignment,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    };
    setItems(STORAGE_KEYS.ASSIGNMENTS, [...assignments, newAssignment]);
    return newAssignment;
  },
  update: (id: string, updates: Partial<Assignment>): Assignment | undefined => {
    const assignments = assignmentsService.getAll();
    const index = assignments.findIndex(a => a.id === id);
    if (index === -1) return undefined;
    assignments[index] = { ...assignments[index], ...updates };
    setItems(STORAGE_KEYS.ASSIGNMENTS, assignments);
    return assignments[index];
  },
  delete: (id: string): boolean => {
    const assignments = assignmentsService.getAll();
    const filtered = assignments.filter(a => a.id !== id);
    if (filtered.length === assignments.length) return false;
    setItems(STORAGE_KEYS.ASSIGNMENTS, filtered);
    return true;
  },
};

export const eventsService = {
  getAll: (): CalendarEvent[] => getItems<CalendarEvent>(STORAGE_KEYS.EVENTS),
  add: (event: Omit<CalendarEvent, 'id'>): CalendarEvent => {
    const events = eventsService.getAll();
    const newEvent: CalendarEvent = {
      ...event,
      id: crypto.randomUUID(),
    };
    setItems(STORAGE_KEYS.EVENTS, [...events, newEvent]);
    return newEvent;
  },
  update: (id: string, updates: Partial<CalendarEvent>): CalendarEvent | undefined => {
    const events = eventsService.getAll();
    const index = events.findIndex(e => e.id === id);
    if (index === -1) return undefined;
    events[index] = { ...events[index], ...updates };
    setItems(STORAGE_KEYS.EVENTS, events);
    return events[index];
  },
  delete: (id: string): boolean => {
    const events = eventsService.getAll();
    const filtered = events.filter(e => e.id !== id);
    if (filtered.length === events.length) return false;
    setItems(STORAGE_KEYS.EVENTS, filtered);
    return true;
  },
};

export const conversationsService = {
  getAll: (): Conversation[] => getItems<Conversation>(STORAGE_KEYS.CONVERSATIONS),
  get: (id: string): Conversation | undefined => {
    return conversationsService.getAll().find(c => c.id === id);
  },
  add: (conversation: Omit<Conversation, 'id'>): Conversation => {
    const conversations = conversationsService.getAll();
    const newConversation: Conversation = {
      ...conversation,
      id: crypto.randomUUID(),
    };
    setItems(STORAGE_KEYS.CONVERSATIONS, [...conversations, newConversation]);
    return newConversation;
  },
  update: (id: string, updates: Partial<Conversation>): Conversation | undefined => {
    const conversations = conversationsService.getAll();
    const index = conversations.findIndex(c => c.id === id);
    if (index === -1) return undefined;
    conversations[index] = { ...conversations[index], ...updates };
    setItems(STORAGE_KEYS.CONVERSATIONS, conversations);
    return conversations[index];
  },
  delete: (id: string): boolean => {
    const conversations = conversationsService.getAll();
    const filtered = conversations.filter(c => c.id !== id);
    if (filtered.length === conversations.length) return false;
    setItems(STORAGE_KEYS.CONVERSATIONS, filtered);
    return true;
  },
};
