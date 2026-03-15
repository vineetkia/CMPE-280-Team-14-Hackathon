"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const item = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const suggestions = ['Explain calculus', 'Study tips', 'Physics formulas', 'Essay help'];

export function AskAI() {
  const [aiQuestion, setAiQuestion] = useState('');
  const router = useRouter();

  const handleAskAI = () => {
    const text = aiQuestion.trim();
    if (text) {
      router.push(`/chat?q=${encodeURIComponent(text)}`);
    } else {
      router.push('/chat');
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    router.push(`/chat?q=${encodeURIComponent(suggestion)}`);
  };

  return (
    <motion.div
      variants={item}
      className="backdrop-blur-xl bg-gradient-to-br from-[var(--glass)] to-[var(--glass-hover)] border border-[var(--glass-border)] rounded-2xl p-8 shadow-xl glass-shine"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-xl bg-gradient-to-br from-[#667eea] to-[#764ba2]">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-[var(--foreground)]">Ask AI Anything</h2>
          <p className="text-sm text-[var(--muted-foreground)]">
            Get instant help with your studies
          </p>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-3">
        <Input
          placeholder="e.g., Explain quantum physics in simple terms..."
          value={aiQuestion}
          onChange={(e) => setAiQuestion(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleAskAI();
            }
          }}
          className="flex-1 bg-white/50 dark:bg-gray-800/50 border-[var(--border)] backdrop-blur-sm"
        />
        <Button
          onClick={handleAskAI}
          className="w-full sm:w-auto bg-gradient-to-r from-[#667eea] to-[#764ba2] hover:shadow-lg hover:shadow-[#667eea]/30 transition-all"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          Ask AI
        </Button>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {suggestions.map((suggestion) => (
          <motion.button
            key={suggestion}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleSuggestionClick(suggestion)}
            className="px-3 py-1.5 rounded-lg bg-[var(--secondary)] hover:bg-[var(--accent)] text-sm text-[var(--secondary-foreground)] transition-colors"
          >
            {suggestion}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
