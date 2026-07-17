// src/app/api/messages/delivered/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/db';
import { messages } from '@/db/schema';
import { eq, and, isNull } from 'drizzle-orm';

// Mark messages as delivered when user comes online
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const { messageIds } = await request.json();

    if (!messageIds || !Array.isArray(messageIds)) {
      return NextResponse.json(
        { error: 'Message IDs array required' },
        { status: 400 }
      );
    }

    // Mark all undelivered messages to this user as delivered
    await db
      .update(messages)
      .set({ deliveredAt: new Date() })
      .where(
        and(
          eq(messages.receiverId, session.userId),
          isNull(messages.deliveredAt)
        )
      );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Mark delivered error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}