import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/assignments
export async function GET() {
  try {
    const assignments = await prisma.assignment.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(assignments);
  } catch (error) {
    console.error('[API] GET /api/assignments error:', error);
    return NextResponse.json({ error: 'Failed to fetch assignments' }, { status: 500 });
  }
}

// POST /api/assignments
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, subject, description, dueDate, priority, status } = body;

    if (!title?.trim() || !subject?.trim() || !dueDate) {
      return NextResponse.json({ error: 'Title, subject, and due date are required' }, { status: 400 });
    }

    const assignment = await prisma.assignment.create({
      data: {
        title: title.trim(),
        subject: subject.trim(),
        description: description?.trim() || '',
        dueDate: new Date(dueDate),
        priority: priority || 'medium',
        status: status || 'not-started',
      },
    });
    return NextResponse.json(assignment, { status: 201 });
  } catch (error) {
    console.error('[API] POST /api/assignments error:', error);
    return NextResponse.json({ error: 'Failed to create assignment' }, { status: 500 });
  }
}
