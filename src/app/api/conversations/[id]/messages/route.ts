import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

// POST /api/conversations/:id/messages — add a message to a conversation
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id } = await params;
    const body = await request.json();
    const { role, content } = body;

    if (!role || !content?.trim()) {
      return NextResponse.json({ error: 'Role and content are required' }, { status: 400 });
    }

    // Verify conversation belongs to current user
    const conversation = await prisma.conversation.findFirst({
      where: { id, userId: user.userId },
    });
    if (!conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    }

    const message = await prisma.message.create({
      data: {
        role,
        content: content.trim(),
        conversationId: id,
      },
    });

    // Update conversation's updatedAt and title (for first message)
    const messageCount = await prisma.message.count({ where: { conversationId: id } });
    if (messageCount === 1 && role === 'user') {
      await prisma.conversation.update({
        where: { id },
        data: { title: content.trim().slice(0, 50) },
      });
    } else {
      await prisma.conversation.update({
        where: { id },
        data: { updatedAt: new Date() },
      });
    }

    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('[API] POST /api/conversations/:id/messages error:', error);
    return NextResponse.json({ error: 'Failed to add message' }, { status: 500 });
  }
}
