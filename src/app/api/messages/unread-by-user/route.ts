// src/app/api/messages/unread-by-user/route.ts
import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/db';
import { messages } from '@/db/schema';
import { eq, and, sql } from 'drizzle-orm';

export async function GET() {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Get unread message count grouped by sender
    const unreadCounts = await db
      .select({
        senderId: messages.senderId,
        count: sql<number>`count(*)::int`,
      })
      .from(messages)
      .where(
        and(
          eq(messages.receiverId, session.userId),
          eq(messages.isRead, false)
        )
      )
      .groupBy(messages.senderId);

    // Convert to object for easy lookup
    const countsMap: Record<string, number> = {};
    unreadCounts.forEach(item => {
      countsMap[item.senderId] = item.count;
    });

    return NextResponse.json({ unreadCounts: countsMap });
  } catch (error) {
    console.error('Get unread counts error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}