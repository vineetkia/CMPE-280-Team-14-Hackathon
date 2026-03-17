"use client";

import { useState, useRef } from 'react';
import { Sparkles, Copy, Check, Loader2, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/components/ui/button';
import { glassCard, gradientButton } from '@/lib/constants';
import { MarkdownRenderer } from '@/components/chat/MarkdownRenderer';
import { useTodos } from '@/hooks/useTodos';
import { useAssignments } from '@/hooks/useAssignments';
import { useEvents } from '@/hooks/useEvents';
import { streamChat, AIError, UserContext } from '@/lib/azure-openai';
import { toast } from '@/hooks/useToast';

export function StudyPlanGenerator() {
  const [plan, setPlan] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const { todos } = useTodos();
  const { assignments } = useAssignments();
  const { events } = useEvents();

  const generatePlan = async () => {
    setIsGenerating(true);
    setPlan('');

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

    const abortController = new AbortController();
    abortRef.current = abortController;

    try {
      let accumulated = '';
      const messages = [{ role: 'user' as const, content: 'Create a personalized study plan based on my current tasks, assignments, and schedule. Organize by day with specific action items.' }];

      for await (const chunk of streamChat(messages, context, 'study-plan', abortController.signal)) {
        accumulated += chunk;
        setPlan(accumulated);
      }
    } catch (error) {
      if (error instanceof AIError && error.shouldFallback) {
        toast({ title: 'AI unavailable', description: 'Could not generate study plan. Try again later.' });
        setPlan('**Study Plan** (Offline Mode)\n\n1. Review your highest-priority tasks first\n2. Complete assignments before their due dates\n3. Use spaced repetition for exam preparation\n4. Take breaks every 45 minutes\n5. Review notes within 24 hours of class');
      } else if ((error as Error).name !== 'AbortError') {
        toast({ title: 'Error', description: 'Failed to generate study plan.', variant: 'destructive' });
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const copyPlan = async () => {
    await navigator.clipboard.writeText(plan);
    setCopied(true);
    toast({ title: 'Copied!', description: 'Study plan copied to clipboard.' });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${glassCard} p-6 glass-shine`}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500">
          <BookOpen className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-[var(--foreground)]">AI Study Planner</h3>
          <p className="text-sm text-[var(--muted-foreground)]">Generate a personalized study plan from your data</p>
        </div>
      </div>

      {!plan && !isGenerating && (
        <Button onClick={generatePlan} className={gradientButton}>
          <Sparkles className="w-4 h-4 mr-2" />
          Generate Study Plan
        </Button>
      )}

      {isGenerating && !plan && (
        <div className="flex items-center gap-2 text-[var(--muted-foreground)]">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Analyzing your schedule...</span>
        </div>
      )}

      <AnimatePresence>
        {plan && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-4"
          >
            <div className="max-h-[400px] overflow-y-auto rounded-xl bg-[var(--secondary)]/30 p-4">
              <div className="text-[var(--foreground)]">
                <MarkdownRenderer content={plan} />
                {isGenerating && (
                  <span className="streaming-cursor" />
                )}
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button
                onClick={copyPlan}
                variant="outline"
                size="sm"
                disabled={isGenerating}
              >
                {copied ? <Check className="w-4 h-4 mr-1" /> : <Copy className="w-4 h-4 mr-1" />}
                {copied ? 'Copied!' : 'Copy'}
              </Button>
              <Button
                onClick={generatePlan}
                variant="outline"
                size="sm"
                disabled={isGenerating}
              >
                <Sparkles className="w-4 h-4 mr-1" />
                Regenerate
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
