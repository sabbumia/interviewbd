// src/app/api/fields/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/db';
import { fields } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const field = await db.query.fields.findFirst({
      where: eq(fields.id, id),
      with: {
        categories: {
          with: {
            questions: {
              columns: {
                id: true,
              },
            },
          },
        },
      },
    });

    if (!field) {
      return NextResponse.json(
        { error: 'Field not found' },
        { status: 404 }
      );
    }

    // Transform categories to include question count
    const transformedField = {
      ...field,
      categories: field.categories.map(category => ({
        ...category,
        _count: {
          questions: category.questions?.length || 0,
        },
        questions: undefined, // Remove the full questions array from response
      })),
    };

    return NextResponse.json(transformedField);
  } catch (error) {
    console.error('Get field error:', error);
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
    
    // Allow both admin and moderator roles
    if (!session || (session.role !== 'admin' && session.role !== 'moderator')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const body = await request.json();

    const [updated] = await db.update(fields)
      .set({ ...body, updatedAt: new Date() })
      .where(eq(fields.id, id))
      .returning();

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Update field error:', error);
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
    const { id } = await params;
    const session = await getSession();

    // Allow both admin and moderator roles
    if (!session || (session.role !== 'admin' && session.role !== 'moderator')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    await db.delete(fields).where(eq(fields.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete field error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}