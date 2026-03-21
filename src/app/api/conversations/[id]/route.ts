import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

// GET /api/conversations/:id
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id } = await params;
    const conversation = await prisma.conversation.findFirst({
      where: { id, userId: user.userId },
      include: { messages: { orderBy: { timestamp: 'asc' } } },
    });
    if (!conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    }
    return NextResponse.json(conversation);
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('[API] GET /api/conversations/:id error:', error);
    return NextResponse.json({ error: 'Failed to fetch conversation' }, { status: 500 });
  }
}

// PATCH /api/conversations/:id — rename
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id } = await params;
    const body = await request.json();

    // Verify ownership
    const existing = await prisma.conversation.findFirst({ where: { id, userId: user.userId } });
    if (!existing) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    }

    const conversation = await prisma.conversation.update({
      where: { id },
      data: {
        ...(body.title !== undefined && { title: body.title.trim() }),
      },
      include: { messages: { orderBy: { timestamp: 'asc' } } },
    });
    return NextResponse.json(conversation);
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('[API] PATCH /api/conversations/:id error:', error);
    return NextResponse.json({ error: 'Failed to update conversation' }, { status: 500 });
  }
}

// DELETE /api/conversations/:id
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id } = await params;

    // Verify ownership
    const existing = await prisma.conversation.findFirst({ where: { id, userId: user.userId } });
    if (!existing) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    }

    await prisma.conversation.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('[API] DELETE /api/conversations/:id error:', error);
    return NextResponse.json({ error: 'Failed to delete conversation' }, { status: 500 });
  }
}
