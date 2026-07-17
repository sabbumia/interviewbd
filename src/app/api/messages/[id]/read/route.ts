// src/app/api/messages/[id]/read/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/db';
import { messages } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const message = await db.query.messages.findFirst({
      where: eq(messages.id, id),
    });

    if (!message) {
      return NextResponse.json(
        { error: 'Message not found' },
        { status: 404 }
      );
    }

    // Only receiver can mark as read
    if (message.receiverId !== session.userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const now = new Date();
    const [updated] = await db.update(messages)
      .set({ 
        isRead: true,
        readAt: now,
        deliveredAt: message.deliveredAt || now, // Ensure deliveredAt is set
      })
      .where(eq(messages.id, id))
      .returning();

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Mark message as read error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}