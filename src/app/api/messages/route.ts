// src/app/api/messages/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/db';
import { messages } from '@/db/schema';
import { eq, or, and, desc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const otherUserId = searchParams.get('userId');

    if (otherUserId) {
      // Get conversation with specific user
      const conversation = await db.query.messages.findMany({
        where: or(
          and(
            eq(messages.senderId, session.userId),
            eq(messages.receiverId, otherUserId)
          ),
          and(
            eq(messages.senderId, otherUserId),
            eq(messages.receiverId, session.userId)
          )
        ),
        with: {
          sender: {
            columns: {
              password: false,
            },
          },
          receiver: {
            columns: {
              password: false,
            },
          },
        },
        orderBy: [messages.createdAt],
      });

      return NextResponse.json(conversation);
    } else {
      // Get all messages for user
      const userMessages = await db.query.messages.findMany({
        where: or(
          eq(messages.senderId, session.userId),
          eq(messages.receiverId, session.userId)
        ),
        with: {
          sender: {
            columns: {
              password: false,
            },
          },
          receiver: {
            columns: {
              password: false,
            },
          },
        },
        orderBy: [desc(messages.createdAt)],
      });

      return NextResponse.json(userMessages);
    }
  } catch (error) {
    console.error('Get messages error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const { receiverId, content } = await request.json();

    if (!receiverId || !content) {
      return NextResponse.json(
        { error: 'Receiver ID and content are required' },
        { status: 400 }
      );
    }

    const [newMessage] = await db.insert(messages).values({
      senderId: session.userId,
      receiverId,
      content,
    }).returning();

    return NextResponse.json(newMessage);
  } catch (error) {
    console.error('Send message error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}