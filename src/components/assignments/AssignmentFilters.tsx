"use client";

import { Plus, Search } from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { glassCard, gradientButton } from '@/lib/constants';

interface AssignmentFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  filterStatus: string;
  onStatusChange: (value: string) => void;
  filterPriority: string;
  onPriorityChange: (value: string) => void;
  filterGrade: string;
  onGradeChange: (value: string) => void;
  availableGrades: string[];
  onAddClick: () => void;
}

export function AssignmentFilters({
  searchQuery,
  onSearchChange,
  filterStatus,
  onStatusChange,
  filterPriority,
  onPriorityChange,
  filterGrade,
  onGradeChange,
  availableGrades,
  onAddClick,
}: AssignmentFiltersProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className={glassCard + ' p-4 md:p-6'}
    >
      <div className="flex flex-col lg:flex-row gap-4 items-end">
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
            <Input
              placeholder="Search assignments..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 bg-white/50 dark:bg-gray-800/50"
            />
          </div>
          <Select value={filterStatus} onValueChange={onStatusChange}>
            <SelectTrigger className="bg-white/50 dark:bg-gray-800/50">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="not-started">Not Started</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterPriority} onValueChange={onPriorityChange}>
            <SelectTrigger className="bg-white/50 dark:bg-gray-800/50">
              <SelectValue placeholder="Filter by priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterGrade} onValueChange={onGradeChange}>
            <SelectTrigger className="bg-white/50 dark:bg-gray-800/50">
              <SelectValue placeholder="Filter by grade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Grades</SelectItem>
              <SelectItem value="ungraded">Ungraded</SelectItem>
              {availableGrades.map((grade) => (
                <SelectItem key={grade} value={grade}>
                  {grade}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button
          onClick={onAddClick}
          className={gradientButton + ' w-full lg:w-auto'}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Assignment
        </Button>
      </div>
    </motion.div>
  );
}
