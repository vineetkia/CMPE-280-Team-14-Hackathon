import { describe, it, expect, vi } from 'vitest';

vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: any) => <a href={href} {...props}>{children}</a>,
}));

vi.mock('next/navigation', () => ({
  usePathname: () => '/',
  useRouter: () => ({ push: vi.fn() }),
}));

vi.mock('@/lib/storage', () => ({
  todosService: { getAll: () => [{ id: '1' }], add: vi.fn() },
  assignmentsService: { getAll: () => [{ id: '1' }], add: vi.fn() },
  eventsService: { getAll: () => [{ id: '1' }], add: vi.fn() },
}));

vi.mock('@/mocks/data', () => ({
  mockTodos: [],
  mockAssignments: [],
  mockEvents: [],
}));

// We can't easily test the server component RootLayout directly since it uses metadata export.
// Instead we test that the module exports a default function.
describe('RootLayout module', () => {
  it('exports a default function', async () => {
    const mod = await import('@/app/layout');
    expect(typeof mod.default).toBe('function');
  });
});
