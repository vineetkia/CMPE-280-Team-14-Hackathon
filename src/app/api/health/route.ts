import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/health — check database connectivity
export async function GET() {
  try {
    const todoCount = await prisma.todo.count();
    const assignmentCount = await prisma.assignment.count();
    const eventCount = await prisma.calendarEvent.count();
    const conversationCount = await prisma.conversation.count();

    return NextResponse.json({
      status: 'healthy',
      database: 'connected',
      counts: {
        todos: todoCount,
        assignments: assignmentCount,
        events: eventCount,
        conversations: conversationCount,
      },
    });
  } catch (error) {
    console.error('[API] Health check failed:', error);
    return NextResponse.json(
      { status: 'unhealthy', database: 'disconnected', error: String(error) },
      { status: 503 }
    );
  }
}
