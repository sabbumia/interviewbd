// src/app/api/questions/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/db';
import { questions } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const question = await db.query.questions.findFirst({
      where: eq(questions.id, id),
      with: {
        category: {
          with: {
            field: true,
          },
        },
        user: {
          columns: {
            password: false,
          },
        },
      },
    });

    if (!question) {
      return NextResponse.json(
        { error: 'Question not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(question);
  } catch (error) {
    console.error('Get question error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    const { id } = await params;

    if (!session) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const question = await db.query.questions.findFirst({
      where: eq(questions.id, id),
    });

    if (!question) {
      return NextResponse.json(
        { error: 'Question not found' },
        { status: 404 }
      );
    }

    // Only author, moderators, and admins can edit
    if (
      question.userId !== session.userId &&
      session.role !== 'admin' &&
      session.role !== 'moderator'
    ) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { questionText, answer, categoryId } = body;

    const [updated] = await db.update(questions)
      .set({
        questionText: questionText || question.questionText,
        answer: answer || question.answer,
        categoryId: categoryId || question.categoryId,
        updatedAt: new Date(),
      })
      .where(eq(questions.id, id))
      .returning();

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Update question error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    const { id } = await params;

    if (!session) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const question = await db.query.questions.findFirst({
      where: eq(questions.id, id),
    });

    if (!question) {
      return NextResponse.json(
        { error: 'Question not found' },
        { status: 404 }
      );
    }

    // Only author, moderators, and admins can delete
    if (
      question.userId !== session.userId &&
      session.role !== 'admin' &&
      session.role !== 'moderator'
    ) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    await db.delete(questions).where(eq(questions.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete question error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}