import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CheckCircle2 } from 'lucide-react';
import { StatCard } from '@/components/dashboard/StatCard';

const mockStat = {
  label: 'Tasks Completed',
  value: 5,
  total: 10,
  icon: CheckCircle2,
  color: 'from-emerald-400 to-cyan-400',
  bgColor: 'bg-emerald-500/10',
  iconColor: 'text-emerald-500',
};

describe('StatCard', () => {
  it('renders the stat label', () => {
    render(<StatCard stat={mockStat} index={0} />);
    expect(screen.getByText('Tasks Completed')).toBeInTheDocument();
  });

  it('renders value and total', () => {
    render(<StatCard stat={mockStat} index={0} />);
    expect(screen.getByText('/10')).toBeInTheDocument();
    expect(screen.getByText((content, element) => {
      return element?.tagName === 'H3' && content.startsWith('5');
    })).toBeInTheDocument();
  });

  it('renders the percentage', () => {
    render(<StatCard stat={mockStat} index={0} />);
    // 5/10 = 50%
    expect(screen.getByText('50%')).toBeInTheDocument();
  });
});
