import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/todos — list all todos
export async function GET() {
  try {
    const todos = await prisma.todo.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(todos);
  } catch (error) {
    console.error('[API] GET /api/todos error:', error);
    return NextResponse.json({ error: 'Failed to fetch todos' }, { status: 500 });
  }
}

// POST /api/todos — create a new todo
export async function POST(request: NextRequest) {
  try {
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
      },
    });
    return NextResponse.json(todo, { status: 201 });
  } catch (error) {
    console.error('[API] POST /api/todos error:', error);
    return NextResponse.json({ error: 'Failed to create todo' }, { status: 500 });
  }
}
