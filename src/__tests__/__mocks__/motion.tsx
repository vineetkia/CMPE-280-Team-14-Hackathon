import React from 'react';

// Mock framer-motion / motion library for testing
const createMotionComponent = (tag: string) => {
  return React.forwardRef<HTMLElement, any>(({ children, initial, animate, exit, variants, whileHover, whileTap, whileInView, transition, layout, layoutId, ...props }, ref) => {
    return React.createElement(tag, { ...props, ref }, children);
  });
};

export const motion = new Proxy({} as Record<string, React.ComponentType<any>>, {
  get: (_target, prop: string) => {
    return createMotionComponent(prop);
  },
});

export const AnimatePresence = ({ children }: { children: React.ReactNode }) => <>{children}</>;

export const useAnimation = () => ({
  start: vi.fn(),
  stop: vi.fn(),
  set: vi.fn(),
});

export const useMotionValue = (initial: number) => ({
  get: () => initial,
  set: vi.fn(),
  onChange: vi.fn(),
});

export const useTransform = () => ({
  get: () => 0,
  set: vi.fn(),
});

export const useInView = () => true;

export const useScroll = () => ({
  scrollY: { get: () => 0, set: vi.fn(), onChange: vi.fn() },
});

export const useSpring = () => ({
  get: () => 0,
  set: vi.fn(),
});

// Mock the animate() function used for imperative animations (e.g., animated counters)
export const animate = (from: number, to: number, options?: { onUpdate?: (v: number) => void; [key: string]: unknown }) => {
  // Immediately call onUpdate with the final value so tests see the correct number
  if (options?.onUpdate) {
    options.onUpdate(to);
  }
  return { stop: vi.fn() };
};

export default { motion, AnimatePresence };
