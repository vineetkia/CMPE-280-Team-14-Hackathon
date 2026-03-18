import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST /api/conversations/:id/messages — add a message to a conversation
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { role, content } = body;

    if (!role || !content?.trim()) {
      return NextResponse.json({ error: 'Role and content are required' }, { status: 400 });
    }

    // Verify conversation exists
    const conversation = await prisma.conversation.findUnique({ where: { id } });
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
    console.error('[API] POST /api/conversations/:id/messages error:', error);
    return NextResponse.json({ error: 'Failed to add message' }, { status: 500 });
  }
}
