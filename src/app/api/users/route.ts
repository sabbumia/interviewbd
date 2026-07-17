// src/app/api/users/route.ts
import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/db';
import { users, questions } from '@/db/schema';
import { ne, eq, count } from 'drizzle-orm';

export async function GET() {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Get all users except the current user
    const allUsers = await db.query.users.findMany({
      where: ne(users.id, session.userId),
      columns: {
        password: false,
      },
      with: {
        verificationDetails: true,
      },
    });

    // Add question count for each user
    const usersWithStats = await Promise.all(
      allUsers.map(async (user) => {
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