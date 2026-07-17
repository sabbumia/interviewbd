// src/app/api/messages/unread-count/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/db';
import { messages } from '@/db/schema';
import { eq, and, count } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Count unread messages where user is the receiver
    const [result] = await db
      .select({ count: count() })
      .from(messages)
      .where(
        and(
          eq(messages.receiverId, session.userId),
          eq(messages.isRead, false)
        )
      );

    return NextResponse.json({ count: result.count });
  } catch (error) {
    console.error('Get unread count error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}