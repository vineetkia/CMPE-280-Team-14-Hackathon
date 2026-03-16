import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AssignmentStats } from '@/components/assignments/AssignmentStats';

describe('AssignmentStats', () => {
  const stats = {
    total: 10,
    notStarted: 3,
    inProgress: 4,
    completed: 3,
  };

  it('renders all 4 stat labels', () => {
    render(<AssignmentStats stats={stats} />);
    expect(screen.getByText('Total')).toBeInTheDocument();
    expect(screen.getByText('Not Started')).toBeInTheDocument();
    expect(screen.getByText('In Progress')).toBeInTheDocument();
    expect(screen.getByText('Completed')).toBeInTheDocument();
  });

  it('renders correct values', () => {
    render(<AssignmentStats stats={stats} />);
    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
    // notStarted and completed both equal 3, so there should be two elements with text "3"
    const threes = screen.getAllByText('3');
    expect(threes).toHaveLength(2);
  });
});
