// src/app/api/admin/users/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/db';
import { users, questions } from '@/db/schema';
import { count, eq } from 'drizzle-orm';

export async function GET() {
  try {
    const session = await getSession();

    if (!session || (session.role !== 'admin' && session.role !== 'moderator')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // Fetch all users
    const allUsers = await db.query.users.findMany({
      columns: {
        password: false,
      },
      with: {
        verificationDetails: true,
      },
    });

    // Enhance users with question counts
    const usersWithStats = await Promise.all(
      allUsers.map(async (user) => {
        // Get question count for each user
        const [result] = await db
          .select({ count: count() })
          .from(questions)
          .where(eq(questions.userId, user.id));

        return {
          ...user,
          questionCount: result.count,
        };
      })
    );

    return NextResponse.json(usersWithStats);
  } catch (error) {
    console.error('Get users error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}