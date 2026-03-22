"use client";

import { useState } from 'react';
import { Sparkles, Plus, Loader2, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger
} from '@/components/ui/dialog';
import { sendChat, AIError, UserContext } from '@/lib/azure-openai';
import { toast } from '@/hooks/useToast';
import { priorityColors, categoryColors } from '@/lib/constants';
import type { Todo } from '@/types';

interface TodoSuggestion {
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  category: string;
  dueDate: string | null;
}

interface TodoAISuggestionsProps {
  todos: Todo[];
  assignments: Array<{ title: string; subject: string; description: string; dueDate: Date; status: string; priority: string }>;
  events: Array<{ title: string; date: Date; type: string }>;
  onAddTodo: (todo: Omit<Todo, 'id' | 'createdAt'>) => void;
}

export function TodoAISuggestions({ todos, assignments, events, onAddTodo }: TodoAISuggestionsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<TodoSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [addedIds, setAddedIds] = useState<Set<number>>(new Set());

  const generateSuggestions = async () => {
    setIsLoading(true);
    setSuggestions([]);
    setAddedIds(new Set());

    const context: UserContext = {
      todos: todos.map(t => ({
        title: t.title,
        completed: t.completed,
        priority: t.priority,
        category: t.category,
        dueDate: t.dueDate ? new Date(t.dueDate).toLocaleDateString() : undefined,
      })),
      assignments: assignments.map(a => ({
        title: a.title,
        subject: a.subject,
        description: a.description,
        dueDate: new Date(a.dueDate).toLocaleDateString(),
        status: a.status,
        priority: a.priority,
      })),
      events: events.map(e => ({
        title: e.title,
        date: new Date(e.date).toLocaleDateString(),
        type: e.type,
      })),
    };

    try {
      const response = await sendChat(
        [{ role: 'user', content: 'Suggest todos based on my current assignments, events, and existing tasks.' }],
        context,
        'todo-suggestions'
      );

      // Parse JSON from response (might be wrapped in ```json block)
      const jsonMatch = response.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]) as TodoSuggestion[];
        setSuggestions(parsed);
      } else {
        throw new Error('Could not parse suggestions');
      }
    } catch (error) {
      if (error instanceof AIError && error.shouldFallback) {
        toast({ title: 'AI unavailable', description: 'Showing default suggestions.' });
        // Fallback suggestions based on existing data
        const fallbackSuggestions: TodoSuggestion[] = assignments
          .filter(a => a.status !== 'completed')
          .slice(0, 3)
          .map(a => ({
            title: `Start working on: ${a.title}`,
            description: `Break down the ${a.subject} assignment into smaller tasks`,
            priority: a.priority as 'low' | 'medium' | 'high',
            category: 'assignment',
            dueDate: new Date(a.dueDate).toISOString(),
          }));
        setSuggestions(fallbackSuggestions);
      } else {
        toast({ title: 'Error', description: 'Failed to generate suggestions.', variant: 'destructive' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const addSuggestion = (suggestion: TodoSuggestion, index: number) => {
    onAddTodo({
      title: suggestion.title,
      description: suggestion.description,
      priority: suggestion.priority,
      category: (suggestion.category || 'other') as Todo['category'],
      completed: false,
      dueDate: suggestion.dueDate ? new Date(suggestion.dueDate) : undefined,
    });
    setAddedIds(prev => new Set(prev).add(index));
    toast({ title: 'Todo added!' });
  };

  const addAll = () => {
    suggestions.forEach((s, i) => {
      if (!addedIds.has(i)) {
        addSuggestion(s, i);
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            if (suggestions.length === 0) generateSuggestions();
          }}
          className="gap-2"
        >
          <Sparkles className="w-4 h-4" />
          <span className="hidden sm:inline">AI Suggest</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-violet-500" />
            AI Todo Suggestions
          </DialogTitle>
        </DialogHeader>

        {isLoading && (
          <div className="flex items-center justify-center py-8 gap-2 text-[var(--muted-foreground)]">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Analyzing your schedule...</span>
          </div>
        )}

        {!isLoading && suggestions.length > 0 && (
          <>
            <ScrollArea className="max-h-[400px]">
              <div className="space-y-3">
                <AnimatePresence>
                  {suggestions.map((suggestion, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`p-4 rounded-xl border border-[var(--glass-border)] bg-[var(--secondary)] ${
                        addedIds.has(index) ? 'opacity-60' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm text-[var(--foreground)]">{suggestion.title}</h4>
                          {suggestion.description && (
                            <p className="text-xs text-[var(--muted-foreground)] mt-1">{suggestion.description}</p>
                          )}
                          <div className="flex gap-2 mt-2">
                            <Badge className={priorityColors[suggestion.priority] || ''}>
                              {suggestion.priority}
                            </Badge>
                            <Badge className={categoryColors[suggestion.category as keyof typeof categoryColors] || ''}>
                              {suggestion.category}
                            </Badge>
                          </div>
                        </div>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => addSuggestion(suggestion, index)}
                          disabled={addedIds.has(index)}
                          aria-label={addedIds.has(index) ? 'Already added' : 'Add todo'}
                          className="shrink-0"
                        >
                          {addedIds.has(index)
                            ? <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                            : <Plus className="w-5 h-5" />
                          }
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </ScrollArea>
            <div className="flex gap-2 pt-2">
              <Button onClick={addAll} size="sm" className="bg-[var(--primary-solid)] text-white">
                <Plus className="w-4 h-4 mr-1" />
                Add All ({suggestions.length - addedIds.size})
              </Button>
              <Button onClick={generateSuggestions} variant="outline" size="sm">
                <Sparkles className="w-4 h-4 mr-1" />
                Regenerate
              </Button>
            </div>
          </>
        )}

        {!isLoading && suggestions.length === 0 && (
          <div className="text-center py-8 text-[var(--muted-foreground)]">
            <Sparkles className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>Click to generate AI-powered todo suggestions</p>
            <Button onClick={generateSuggestions} className="mt-4" variant="outline">
              Generate Suggestions
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
