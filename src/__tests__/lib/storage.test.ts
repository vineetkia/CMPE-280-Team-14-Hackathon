import { describe, it, expect, beforeEach } from 'vitest';
import {
  todosService,
  assignmentsService,
  eventsService,
  conversationsService,
} from '@/lib/storage';

// ─── todosService ────────────────────────────────────────────────────────────

describe('todosService', () => {
  it('getAll returns empty array when localStorage is empty', () => {
    expect(todosService.getAll()).toEqual([]);
  });

  it('add creates a todo with auto-generated ID and createdAt', () => {
    const todo = todosService.add({
      title: 'Study Math',
      completed: false,
      priority: 'high',
      category: 'study',
    });
    expect(todo.id).toBeDefined();
    expect(typeof todo.id).toBe('string');
    expect(todo.createdAt).toBeInstanceOf(Date);
    expect(todo.title).toBe('Study Math');
  });

  it('add persists the item to localStorage', () => {
    todosService.add({ title: 'A', completed: false, priority: 'low', category: 'other' });
    const raw = localStorage.getItem('studypilot_todos');
    expect(raw).not.toBeNull();
    const parsed = JSON.parse(raw!);
    expect(parsed).toHaveLength(1);
    expect(parsed[0].title).toBe('A');
  });

  it('add appends to existing items', () => {
    todosService.add({ title: 'First', completed: false, priority: 'low', category: 'study' });
    todosService.add({ title: 'Second', completed: false, priority: 'medium', category: 'exam' });
    const all = todosService.getAll();
    expect(all).toHaveLength(2);
    expect(all[0].title).toBe('First');
    expect(all[1].title).toBe('Second');
  });

  it('getAll after add returns the added items', () => {
    const added = todosService.add({ title: 'Read', completed: false, priority: 'high', category: 'study' });
    const all = todosService.getAll();
    expect(all).toHaveLength(1);
    expect(all[0].id).toBe(added.id);
    expect(all[0].title).toBe('Read');
  });

  it('update modifies the correct item and persists', () => {
    const t = todosService.add({ title: 'Old', completed: false, priority: 'low', category: 'other' });
    const updated = todosService.update(t.id, { title: 'New', completed: true });
    expect(updated).toBeDefined();
    expect(updated!.title).toBe('New');
    expect(updated!.completed).toBe(true);
    // verify persisted
    const all = todosService.getAll();
    expect(all[0].title).toBe('New');
  });

  it('update returns undefined for non-existent ID', () => {
    expect(todosService.update('no-such-id', { title: 'X' })).toBeUndefined();
  });

  it('delete removes the correct item', () => {
    const t1 = todosService.add({ title: 'Keep', completed: false, priority: 'low', category: 'study' });
    const t2 = todosService.add({ title: 'Remove', completed: false, priority: 'low', category: 'study' });
    const result = todosService.delete(t2.id);
    expect(result).toBe(true);
    const all = todosService.getAll();
    expect(all).toHaveLength(1);
    expect(all[0].id).toBe(t1.id);
  });

  it('delete returns false for non-existent ID', () => {
    expect(todosService.delete('no-such-id')).toBe(false);
  });

  it('revives createdAt as Date object', () => {
    todosService.add({ title: 'D', completed: false, priority: 'low', category: 'study' });
    const all = todosService.getAll();
    expect(all[0].createdAt).toBeInstanceOf(Date);
  });
});

// ─── assignmentsService ──────────────────────────────────────────────────────

describe('assignmentsService', () => {
  it('getAll returns empty array when localStorage is empty', () => {
    expect(assignmentsService.getAll()).toEqual([]);
  });

  it('add creates assignment with auto-generated ID and createdAt', () => {
    const a = assignmentsService.add({
      title: 'HW1',
      subject: 'CS',
      description: 'Desc',
      dueDate: new Date(2026, 3, 1),
      status: 'not-started',
      priority: 'high',
    });
    expect(a.id).toBeDefined();
    expect(a.createdAt).toBeInstanceOf(Date);
  });

  it('add persists to localStorage', () => {
    assignmentsService.add({
      title: 'HW2',
      subject: 'Math',
      description: 'D',
      dueDate: new Date(),
      status: 'in-progress',
      priority: 'medium',
    });
    const raw = localStorage.getItem('studypilot_assignments');
    expect(raw).not.toBeNull();
    expect(JSON.parse(raw!)).toHaveLength(1);
  });

  it('add appends to existing items', () => {
    assignmentsService.add({ title: 'A1', subject: 'X', description: '', dueDate: new Date(), status: 'not-started', priority: 'low' });
    assignmentsService.add({ title: 'A2', subject: 'Y', description: '', dueDate: new Date(), status: 'not-started', priority: 'low' });
    expect(assignmentsService.getAll()).toHaveLength(2);
  });

  it('getAll after add returns the added items', () => {
    const added = assignmentsService.add({ title: 'A3', subject: 'Z', description: '', dueDate: new Date(), status: 'completed', priority: 'high' });
    const all = assignmentsService.getAll();
    expect(all[0].id).toBe(added.id);
  });

  it('update modifies the correct item and persists', () => {
    const a = assignmentsService.add({ title: 'Old', subject: 'S', description: '', dueDate: new Date(), status: 'not-started', priority: 'low' });
    const updated = assignmentsService.update(a.id, { title: 'Updated', status: 'completed' });
    expect(updated!.title).toBe('Updated');
    expect(updated!.status).toBe('completed');
    expect(assignmentsService.getAll()[0].title).toBe('Updated');
  });

  it('update returns undefined for non-existent ID', () => {
    expect(assignmentsService.update('missing', { title: 'X' })).toBeUndefined();
  });

  it('delete removes the correct item', () => {
    const a1 = assignmentsService.add({ title: 'Keep', subject: 'S', description: '', dueDate: new Date(), status: 'not-started', priority: 'low' });
    const a2 = assignmentsService.add({ title: 'Remove', subject: 'S', description: '', dueDate: new Date(), status: 'not-started', priority: 'low' });
    expect(assignmentsService.delete(a2.id)).toBe(true);
    const all = assignmentsService.getAll();
    expect(all).toHaveLength(1);
    expect(all[0].id).toBe(a1.id);
  });

  it('delete returns false for non-existent ID', () => {
    expect(assignmentsService.delete('nope')).toBe(false);
  });

  it('revives dueDate and createdAt as Date objects', () => {
    assignmentsService.add({ title: 'A', subject: 'S', description: '', dueDate: new Date(2026, 5, 1), status: 'not-started', priority: 'low' });
    const all = assignmentsService.getAll();
    expect(all[0].dueDate).toBeInstanceOf(Date);
    expect(all[0].createdAt).toBeInstanceOf(Date);
  });
});

// ─── eventsService ───────────────────────────────────────────────────────────

describe('eventsService', () => {
  it('getAll returns empty array when localStorage is empty', () => {
    expect(eventsService.getAll()).toEqual([]);
  });

  it('add creates event with auto-generated ID', () => {
    const e = eventsService.add({
      title: 'Lecture',
      date: new Date(2026, 2, 20),
      type: 'class',
    });
    expect(e.id).toBeDefined();
    expect(e.title).toBe('Lecture');
  });

  it('add persists to localStorage', () => {
    eventsService.add({ title: 'E1', date: new Date(), type: 'exam' });
    const raw = localStorage.getItem('studypilot_events');
    expect(raw).not.toBeNull();
    expect(JSON.parse(raw!)).toHaveLength(1);
  });

  it('add appends to existing items', () => {
    eventsService.add({ title: 'E1', date: new Date(), type: 'class' });
    eventsService.add({ title: 'E2', date: new Date(), type: 'study' });
    expect(eventsService.getAll()).toHaveLength(2);
  });

  it('getAll after add returns the added items', () => {
    const added = eventsService.add({ title: 'E', date: new Date(), type: 'other' });
    const all = eventsService.getAll();
    expect(all[0].id).toBe(added.id);
  });

  it('update modifies the correct item and persists', () => {
    const e = eventsService.add({ title: 'Old', date: new Date(), type: 'class' });
    const updated = eventsService.update(e.id, { title: 'Updated' });
    expect(updated!.title).toBe('Updated');
    expect(eventsService.getAll()[0].title).toBe('Updated');
  });

  it('update returns undefined for non-existent ID', () => {
    expect(eventsService.update('nope', { title: 'X' })).toBeUndefined();
  });

  it('delete removes the correct item', () => {
    const e1 = eventsService.add({ title: 'Keep', date: new Date(), type: 'class' });
    const e2 = eventsService.add({ title: 'Remove', date: new Date(), type: 'class' });
    expect(eventsService.delete(e2.id)).toBe(true);
    expect(eventsService.getAll()).toHaveLength(1);
    expect(eventsService.getAll()[0].id).toBe(e1.id);
  });

  it('delete returns false for non-existent ID', () => {
    expect(eventsService.delete('nope')).toBe(false);
  });

  it('revives date field as Date object', () => {
    eventsService.add({ title: 'E', date: new Date(2026, 5, 1), type: 'exam' });
    const all = eventsService.getAll();
    expect(all[0].date).toBeInstanceOf(Date);
  });
});

// ─── conversationsService ────────────────────────────────────────────────────

describe('conversationsService', () => {
  it('getAll returns empty array when localStorage is empty', () => {
    expect(conversationsService.getAll()).toEqual([]);
  });

  it('add creates conversation with auto-generated ID', () => {
    const c = conversationsService.add({
      title: 'Chat 1',
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    expect(c.id).toBeDefined();
    expect(c.title).toBe('Chat 1');
  });

  it('add persists to localStorage', () => {
    conversationsService.add({ title: 'C', messages: [], createdAt: new Date(), updatedAt: new Date() });
    const raw = localStorage.getItem('studypilot_conversations');
    expect(raw).not.toBeNull();
    expect(JSON.parse(raw!)).toHaveLength(1);
  });

  it('add appends to existing items', () => {
    conversationsService.add({ title: 'C1', messages: [], createdAt: new Date(), updatedAt: new Date() });
    conversationsService.add({ title: 'C2', messages: [], createdAt: new Date(), updatedAt: new Date() });
    expect(conversationsService.getAll()).toHaveLength(2);
  });

  it('getAll after add returns the added items', () => {
    const added = conversationsService.add({ title: 'C', messages: [], createdAt: new Date(), updatedAt: new Date() });
    const all = conversationsService.getAll();
    expect(all[0].id).toBe(added.id);
  });

  it('update modifies the correct item and persists', () => {
    const c = conversationsService.add({ title: 'Old', messages: [], createdAt: new Date(), updatedAt: new Date() });
    const updated = conversationsService.update(c.id, { title: 'New Title' });
    expect(updated!.title).toBe('New Title');
    expect(conversationsService.getAll()[0].title).toBe('New Title');
  });

  it('update returns undefined for non-existent ID', () => {
    expect(conversationsService.update('missing', { title: 'X' })).toBeUndefined();
  });

  it('delete removes the correct item', () => {
    const c1 = conversationsService.add({ title: 'Keep', messages: [], createdAt: new Date(), updatedAt: new Date() });
    const c2 = conversationsService.add({ title: 'Remove', messages: [], createdAt: new Date(), updatedAt: new Date() });
    expect(conversationsService.delete(c2.id)).toBe(true);
    expect(conversationsService.getAll()).toHaveLength(1);
    expect(conversationsService.getAll()[0].id).toBe(c1.id);
  });

  it('delete returns false for non-existent ID', () => {
    expect(conversationsService.delete('ghost')).toBe(false);
  });

  it('revives createdAt and updatedAt as Date objects', () => {
    conversationsService.add({ title: 'C', messages: [], createdAt: new Date(2026, 0, 1), updatedAt: new Date(2026, 0, 2) });
    const all = conversationsService.getAll();
    expect(all[0].createdAt).toBeInstanceOf(Date);
    expect(all[0].updatedAt).toBeInstanceOf(Date);
  });

  it('get() returns the correct conversation by ID', () => {
    const c1 = conversationsService.add({ title: 'One', messages: [], createdAt: new Date(), updatedAt: new Date() });
    conversationsService.add({ title: 'Two', messages: [], createdAt: new Date(), updatedAt: new Date() });
    const found = conversationsService.get(c1.id);
    expect(found).toBeDefined();
    expect(found!.title).toBe('One');
  });

  it('get() returns undefined for non-existent ID', () => {
    expect(conversationsService.get('non-existent')).toBeUndefined();
  });

  it('revives message timestamp as Date object', () => {
    conversationsService.add({
      title: 'With Messages',
      messages: [{ id: 'm1', role: 'user', content: 'Hi', timestamp: new Date(2026, 2, 15) }],
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    const all = conversationsService.getAll();
    expect(all[0].messages[0].timestamp).toBeInstanceOf(Date);
  });
});
