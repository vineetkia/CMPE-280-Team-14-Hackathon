import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// PATCH /api/events/:id
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const event = await prisma.calendarEvent.update({
      where: { id },
      data: {
        ...(body.title !== undefined && { title: body.title.trim() }),
        ...(body.description !== undefined && { description: body.description?.trim() || null }),
        ...(body.date !== undefined && { date: new Date(body.date) }),
        ...(body.type !== undefined && { type: body.type }),
        ...(body.color !== undefined && { color: body.color || null }),
      },
    });
    return NextResponse.json(event);
  } catch (error) {
    console.error('[API] PATCH /api/events/:id error:', error);
    return NextResponse.json({ error: 'Failed to update event' }, { status: 500 });
  }
}

// DELETE /api/events/:id
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.calendarEvent.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[API] DELETE /api/events/:id error:', error);
    return NextResponse.json({ error: 'Failed to delete event' }, { status: 500 });
  }
}
