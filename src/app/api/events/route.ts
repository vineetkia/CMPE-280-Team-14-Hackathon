import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/events
export async function GET() {
  try {
    const events = await prisma.calendarEvent.findMany({
      orderBy: { date: 'asc' },
    });
    return NextResponse.json(events);
  } catch (error) {
    console.error('[API] GET /api/events error:', error);
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
  }
}

// POST /api/events
export async function POST(request: NextRequest) {
  try {
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
      },
    });
    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    console.error('[API] POST /api/events error:', error);
    return NextResponse.json({ error: 'Failed to create event' }, { status: 500 });
  }
}
