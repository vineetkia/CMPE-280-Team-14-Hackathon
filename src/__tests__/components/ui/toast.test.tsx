import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import {
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
} from '@/components/ui/toast';

describe('Toast components', () => {
  it('renders Toast with title and description', () => {
    render(
      <ToastProvider>
        <Toast open>
          <ToastTitle>Success!</ToastTitle>
          <ToastDescription>Your action was completed.</ToastDescription>
        </Toast>
        <ToastViewport />
      </ToastProvider>
    );
    expect(screen.getByText('Success!')).toBeInTheDocument();
    expect(screen.getByText('Your action was completed.')).toBeInTheDocument();
  });

  it('renders ToastClose button', () => {
    render(
      <ToastProvider>
        <Toast open>
          <ToastTitle>Closeable</ToastTitle>
          <ToastClose />
        </Toast>
        <ToastViewport />
      </ToastProvider>
    );
    expect(screen.getByText('Closeable')).toBeInTheDocument();
  });

  it('renders ToastAction', () => {
    render(
      <ToastProvider>
        <Toast open>
          <ToastTitle>With Action</ToastTitle>
          <ToastAction altText="Undo">Undo</ToastAction>
        </Toast>
        <ToastViewport />
      </ToastProvider>
    );
    expect(screen.getByText('Undo')).toBeInTheDocument();
  });

  it('renders Toast with variant', () => {
    const { container } = render(
      <ToastProvider>
        <Toast open variant="destructive">
          <ToastTitle>Error</ToastTitle>
        </Toast>
        <ToastViewport />
      </ToastProvider>
    );
    expect(screen.getByText('Error')).toBeInTheDocument();
  });

  it('renders ToastViewport', () => {
    const { container } = render(
      <ToastProvider>
        <ToastViewport />
      </ToastProvider>
    );
    const viewport = container.querySelector('ol');
    expect(viewport).toBeInTheDocument();
  });
});
