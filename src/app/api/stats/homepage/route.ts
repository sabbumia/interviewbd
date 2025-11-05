// src/app/api/stats/homepage/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/db';
import { users, fields, categories, questions, likes } from '@/db/schema';
import { count, eq, sql, desc } from 'drizzle-orm';

export async function GET() {
  try {
    // Get total counts
    const [usersCount] = await db.select({ count: count() }).from(users);
    const [questionsCount] = await db.select({ count: count() }).from(questions);
    const [fieldsCount] = await db.select({ count: count() }).from(fields);
    const [categoriesCount] = await db.select({ count: count() }).from(categories);

    // Get top 4 fields by question count
    const topFields = await db
      .select({
        id: fields.id,
        name: fields.name,
        description: fields.description,
        questionCount: count(questions.id),
      })
      .from(fields)
      .leftJoin(categories, eq(categories.fieldId, fields.id))
      .leftJoin(questions, eq(questions.categoryId, categories.id))
      .groupBy(fields.id, fields.name, fields.description)
      .orderBy(desc(count(questions.id)))
      .limit(4);

    // Get top 5 users by question count
    const topQuestionUsers = await db
      .select({
        userId: questions.userId,
        questionCount: count(questions.id),
      })
      .from(questions)
      .groupBy(questions.userId)
      .orderBy(desc(count(questions.id)))
      .limit(5);

    // Get user details for top question posters
    const topQuestionUsersWithDetails = await Promise.all(
      topQuestionUsers.map(async (item) => {
        const user = await db.query.users.findFirst({
          where: eq(users.id, item.userId),
          columns: {
            id: true,
            name: true,
            email: true,
            profilePicture: true,
            isVerified: true,
            role: true,
          },
        });

        return {
          ...user,
          questionCount: item.questionCount,
        };
      })
    );

    // Get top 5 users by total likes received
    const topLikedUsers = await db
      .select({
        userId: questions.userId,
        likeCount: count(likes.id),
      })
      .from(questions)
      .leftJoin(likes, eq(likes.questionId, questions.id))
      .groupBy(questions.userId)
      .orderBy(desc(count(likes.id)))
      .limit(5);

    // Get user details for top liked users
    const topLikedUsersWithDetails = await Promise.all(
      topLikedUsers.map(async (item) => {
        const user = await db.query.users.findFirst({
          where: eq(users.id, item.userId),
          columns: {
            id: true,
            name: true,
            email: true,
            profilePicture: true,
            isVerified: true,
            role: true,
          },
        });

        // Get question count for this user
        const [questionResult] = await db
          .select({ count: count() })
          .from(questions)
          .where(eq(questions.userId, item.userId));

        return {
          ...user,
          likeCount: item.likeCount,
          questionCount: questionResult.count,
        };
      })
    );

    return NextResponse.json({
      stats: {
        totalUsers: usersCount.count,
        totalQuestions: questionsCount.count,
        totalFields: fieldsCount.count,
        totalCategories: categoriesCount.count,
      },
      topFields: topFields.map(field => ({
        ...field,
        questionCount: field.questionCount || 0,
      })),
      topQuestionUsers: topQuestionUsersWithDetails.filter(user => user !== null),
      topLikedUsers: topLikedUsersWithDetails.filter(user => user !== null),
    });
  } catch (error) {
    console.error('Get homepage stats error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}