// src/app/api/users/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/db';
import { users, questions } from '@/db/schema';
import { eq, count } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const { id } = await params;

    // Get user details
    const user = await db.query.users.findFirst({
      where: eq(users.id, id),
      columns: {
        password: false,
      },
      with: {
        verificationDetails: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Get question count
    const [questionCountResult] = await db
      .select({ count: count() })
      .from(questions)
      .where(eq(questions.userId, id));

    // Get user's questions with likes
    const userQuestions = await db.query.questions.findMany({
      where: eq(questions.userId, id),
      with: {
        category: {
          with: {
            field: true,
          },
        },
        likes: true,
      },
      orderBy: (questions, { desc }) => [desc(questions.createdAt)],
      limit: 10, // Show latest 10 questions
    });

    // Calculate total likes
    const totalLikes = userQuestions.reduce((sum, q) => sum + q.likes.length, 0);

    return NextResponse.json({
      ...user,
      questionCount: questionCountResult.count,
      totalLikes,
      recentQuestions: userQuestions.map(q => ({
        ...q,
        likeCount: q.likes.length,
        likes: undefined, // Remove full likes array
      })),
    });
  } catch (error) {
    console.error('Get user detail error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}