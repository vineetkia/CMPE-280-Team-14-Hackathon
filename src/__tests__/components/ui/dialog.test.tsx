import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

describe('Dialog', () => {
  it('opens when triggered', async () => {
    render(
      <Dialog>
        <DialogTrigger>Open Dialog</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Title</DialogTitle>
            <DialogDescription>Description</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );

    expect(screen.queryByText('Title')).not.toBeInTheDocument();
    fireEvent.click(screen.getByText('Open Dialog'));
    await waitFor(() => {
      expect(screen.getByText('Title')).toBeInTheDocument();
    });
  });

  it('renders title and description', async () => {
    render(
      <Dialog>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>My Dialog Title</DialogTitle>
            <DialogDescription>This is a description.</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );

    fireEvent.click(screen.getByText('Open'));
    await waitFor(() => {
      expect(screen.getByText('My Dialog Title')).toBeInTheDocument();
      expect(screen.getByText('This is a description.')).toBeInTheDocument();
    });
  });

  it('close button dismisses dialog', async () => {
    render(
      <Dialog>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Closeable</DialogTitle>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );

    fireEvent.click(screen.getByText('Open'));
    await waitFor(() => {
      expect(screen.getByText('Closeable')).toBeInTheDocument();
    });

    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);
    await waitFor(() => {
      expect(screen.queryByText('Closeable')).not.toBeInTheDocument();
    });
  });
});
