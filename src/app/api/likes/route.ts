// src/app/api/likes/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/db';
import { likes } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const { questionId } = await request.json();

    if (!questionId) {
      return NextResponse.json(
        { error: 'Question ID is required' },
        { status: 400 }
      );
    }

    // Check if user already liked this question
    const existingLike = await db.query.likes.findFirst({
      where: and(
        eq(likes.questionId, questionId),
        eq(likes.userId, session.userId)
      ),
    });

    if (existingLike) {
      return NextResponse.json(
        { error: 'Already liked this question' },
        { status: 400 }
      );
    }

    // Create new like
    const [newLike] = await db.insert(likes).values({
      questionId,
      userId: session.userId,
    }).returning();

    return NextResponse.json(newLike);
  } catch (error) {
    console.error('Create like error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const questionId = searchParams.get('questionId');

    if (!questionId) {
      return NextResponse.json(
        { error: 'Question ID is required' },
        { status: 400 }
      );
    }

    // Delete the like
    await db.delete(likes).where(
      and(
        eq(likes.questionId, questionId),
        eq(likes.userId, session.userId)
      )
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete like error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}