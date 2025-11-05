// src/app/api/admin/analytics/route.ts
import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/db';
import { users, fields, categories, questions, connections, messages, likes, reports } from '@/db/schema';
import { count, eq, sql } from 'drizzle-orm';

export async function GET() {
  try {
    const session = await getSession();

    if (!session || session.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const [usersCount] = await db.select({ count: count() }).from(users);
    const [verifiedUsersCount] = await db.select({ count: count() }).from(users).where(eq(users.isVerified, true));
    const [fieldsCount] = await db.select({ count: count() }).from(fields);
    const [categoriesCount] = await db.select({ count: count() }).from(categories);
    const [questionsCount] = await db.select({ count: count() }).from(questions);
    const [connectionsCount] = await db.select({ count: count() }).from(connections).where(eq(connections.status, 'accepted'));
    const [messagesCount] = await db.select({ count: count() }).from(messages);
    const [likesCount] = await db.select({ count: count() }).from(likes);
    const [reportsCount] = await db.select({ count: count() }).from(reports).where(eq(reports.status, 'pending'));

    // Get top contributors with question count
    const topContributors = await db
      .select({
        userId: questions.userId,
        questionCount: count(questions.id),
      })
      .from(questions)
      .groupBy(questions.userId)
      .orderBy(sql`count(${questions.id}) desc`)
      .limit(10);

    // Enhance with user details and like count
    const contributorsWithDetails = await Promise.all(
      topContributors.map(async (contributor) => {
        const user = await db.query.users.findFirst({
          where: eq(users.id, contributor.userId),
          columns: {
            id: true,
            name: true,
            email: true,
            isVerified: true,
          },
        });

        // Get total likes for this user's questions
        const userQuestions = await db.query.questions.findMany({
          where: eq(questions.userId, contributor.userId),
          with: {
            likes: true,
          },
        });

        const totalLikes = userQuestions.reduce((sum, q) => sum + q.likes.length, 0);

        return {
          ...contributor,
          user,
          totalLikes,
        };
      })
    );

    return NextResponse.json({
      totalUsers: usersCount.count,
      verifiedUsers: verifiedUsersCount.count,
      totalFields: fieldsCount.count,
      totalCategories: categoriesCount.count,
      totalQuestions: questionsCount.count,
      totalConnections: connectionsCount.count,
      totalMessages: messagesCount.count,
      totalLikes: likesCount.count,
      pendingReports: reportsCount.count,
      topContributors: contributorsWithDetails,
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}