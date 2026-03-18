import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// PATCH /api/assignments/:id
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const assignment = await prisma.assignment.update({
      where: { id },
      data: {
        ...(body.title !== undefined && { title: body.title.trim() }),
        ...(body.subject !== undefined && { subject: body.subject.trim() }),
        ...(body.description !== undefined && { description: body.description?.trim() || '' }),
        ...(body.dueDate !== undefined && { dueDate: new Date(body.dueDate) }),
        ...(body.status !== undefined && { status: body.status }),
        ...(body.priority !== undefined && { priority: body.priority }),
        ...(body.grade !== undefined && { grade: body.grade || null }),
      },
    });
    return NextResponse.json(assignment);
  } catch (error) {
    console.error('[API] PATCH /api/assignments/:id error:', error);
    return NextResponse.json({ error: 'Failed to update assignment' }, { status: 500 });
  }
}

// DELETE /api/assignments/:id
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.assignment.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[API] DELETE /api/assignments/:id error:', error);
    return NextResponse.json({ error: 'Failed to delete assignment' }, { status: 500 });
  }
}
