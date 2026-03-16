"use client";

import { Sparkles, BookOpen, GraduationCap, FileText, Brain, Target, Lightbulb } from 'lucide-react';
import { motion } from 'motion/react';

const prompts = [
  { icon: BookOpen, text: "Explain quantum physics in simple terms" },
  { icon: GraduationCap, text: "Help me prepare for my calculus midterm" },
  { icon: FileText, text: "Review my essay outline on Renaissance Art" },
  { icon: Brain, text: "Create flashcards for Chemistry chapter 5" },
  { icon: Target, text: "How to manage my time better this semester" },
  { icon: Lightbulb, text: "Explain the differences between TCP and UDP" },
];

interface ChatEmptyStateProps {
  onSendMessage: (message: string) => void;
}

export function ChatEmptyState({ onSendMessage }: ChatEmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-12"
    >
      <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-[#667eea] to-[#764ba2] mb-6">
        <Sparkles className="w-12 h-12 text-white" />
      </div>
      <h2 className="text-2xl font-bold text-[var(--foreground)] mb-2">
        How can I help you today?
      </h2>
      <p className="text-[var(--muted-foreground)] mb-8">
        Ask me anything about your studies
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl mx-auto">
        {prompts.map((prompt) => (
          <motion.button
            key={prompt.text}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onSendMessage(prompt.text)}
            className="p-4 rounded-xl bg-[var(--secondary)] hover:bg-[var(--accent)] text-left transition-colors flex items-center gap-3"
          >
            <prompt.icon className="w-5 h-5 text-[var(--muted-foreground)] flex-shrink-0" />
            <p className="text-sm font-medium text-[var(--foreground)]">{prompt.text}</p>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
