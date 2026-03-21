import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

// GET /api/events
export async function GET() {
  try {
    const user = await requireAuth();
    const events = await prisma.calendarEvent.findMany({
      where: { userId: user.userId },
      orderBy: { date: 'asc' },
    });
    return NextResponse.json(events);
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('[API] GET /api/events error:', error);
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
  }
}

// POST /api/events
export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    const body = await request.json();
    const { title, description, date, type, color } = body;

    if (!title?.trim() || !date) {
      return NextResponse.json({ error: 'Title and date are required' }, { status: 400 });
    }

    const event = await prisma.calendarEvent.create({
      data: {
        title: title.trim(),
        description: description?.trim() || null,
        date: new Date(date),
        type: type || 'other',
        color: color || null,
        userId: user.userId,
      },
    });
    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('[API] POST /api/events error:', error);
    return NextResponse.json({ error: 'Failed to create event' }, { status: 500 });
  }
}
