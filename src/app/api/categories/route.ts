// src/app/api/categories/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/db';
import { categories } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const fieldId = searchParams.get('fieldId');

    let allCategories;
    if (fieldId) {
      allCategories = await db.query.categories.findMany({
        where: eq(categories.fieldId, fieldId),
        with: {
          field: true,
        },
      });
    } else {
      allCategories = await db.query.categories.findMany({
        with: {
          field: true,
        },
      });
    }

    return NextResponse.json(allCategories);
  } catch (error) {
    console.error('Get categories error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();

    // Allow both admin and moderator roles
    if (!session || (session.role !== 'admin' && session.role !== 'moderator')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const { name, description, fieldId } = await request.json();

    if (!name || !fieldId) {
      return NextResponse.json(
        { error: 'Name and fieldId are required' },
        { status: 400 }
      );
    }

    const [newCategory] = await db.insert(categories).values({
      name,
      description: description || null,
      fieldId,
    }).returning();

    return NextResponse.json(newCategory);
  } catch (error) {
    console.error('Create category error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}