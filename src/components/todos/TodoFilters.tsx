"use client";

import { Search, Filter } from 'lucide-react';
import { motion } from 'motion/react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface TodoFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  filterPriority: string;
  onPriorityChange: (value: string) => void;
  filterCategory: string;
  onCategoryChange: (value: string) => void;
}

export function TodoFilters({
  searchQuery,
  onSearchChange,
  filterPriority,
  onPriorityChange,
  filterCategory,
  onCategoryChange,
}: TodoFiltersProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="backdrop-blur-2xl bg-[var(--glass)] border border-[var(--glass-border)] rounded-2xl p-4 md:p-6 shadow-lg glass-panel"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
          <Input
            placeholder="Search todos..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 bg-white/50 dark:bg-gray-800/50"
          />
        </div>
        <Select value={filterPriority} onValueChange={onPriorityChange}>
          <SelectTrigger className="bg-white/50 dark:bg-gray-800/50">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Filter by priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priorities</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterCategory} onValueChange={onCategoryChange}>
          <SelectTrigger className="bg-white/50 dark:bg-gray-800/50">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="study">Study</SelectItem>
            <SelectItem value="assignment">Assignment</SelectItem>
            <SelectItem value="exam">Exam</SelectItem>
            <SelectItem value="project">Project</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </motion.div>
  );
}
