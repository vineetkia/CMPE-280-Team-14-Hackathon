import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

// GET /api/todos — list all todos for current user
export async function GET() {
  try {
    const user = await requireAuth();
    const todos = await prisma.todo.findMany({
      where: { userId: user.userId },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(todos);
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('[API] GET /api/todos error:', error);
    return NextResponse.json({ error: 'Failed to fetch todos' }, { status: 500 });
  }
}

// POST /api/todos — create a new todo
export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    const body = await request.json();
    const { title, description, priority, category, dueDate } = body;

    if (!title?.trim()) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const todo = await prisma.todo.create({
      data: {
        title: title.trim(),
        description: description?.trim() || null,
        priority: priority || 'medium',
        category: category || 'other',
        dueDate: dueDate ? new Date(dueDate) : null,
        userId: user.userId,
      },
    });
    return NextResponse.json(todo, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('[API] POST /api/todos error:', error);
    return NextResponse.json({ error: 'Failed to create todo' }, { status: 500 });
  }
}
