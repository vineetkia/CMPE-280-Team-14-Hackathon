import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/conversations
export async function GET() {
  try {
    const conversations = await prisma.conversation.findMany({
      include: { messages: { orderBy: { timestamp: 'asc' } } },
      orderBy: { updatedAt: 'desc' },
    });
    return NextResponse.json(conversations);
  } catch (error) {
    console.error('[API] GET /api/conversations error:', error);
    return NextResponse.json({ error: 'Failed to fetch conversations' }, { status: 500 });
  }
}

// POST /api/conversations — create a new conversation
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title } = body;

    const conversation = await prisma.conversation.create({
      data: {
        title: title?.trim() || 'New Conversation',
      },
      include: { messages: true },
    });
    return NextResponse.json(conversation, { status: 201 });
  } catch (error) {
    console.error('[API] POST /api/conversations error:', error);
    return NextResponse.json({ error: 'Failed to create conversation' }, { status: 500 });
  }
}
