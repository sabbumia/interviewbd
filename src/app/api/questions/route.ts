// // src/app/api/questions/route.ts
// import { NextRequest, NextResponse } from 'next/server';
// import { getSession } from '@/lib/auth';
// import { db } from '@/db';
// import { questions, likes } from '@/db/schema';
// import { eq, and, count } from 'drizzle-orm';

// export async function GET(request: NextRequest) {
//   try {
//     const session = await getSession();
//     const { searchParams } = new URL(request.url);
//     const categoryId = searchParams.get('categoryId');
//     const userId = searchParams.get('userId');

//     let allQuestions;
    
//     if (categoryId) {
//       allQuestions = await db.query.questions.findMany({
//         where: eq(questions.categoryId, categoryId),
//         with: {
//           user: {
//             columns: {
//               password: false,
//             },
//             with: {
//               verificationDetails: true,
//             },
//           },
//           category: {
//             with: {
//               field: true,
//             },
//           },
//           likes: true,
//         },
//         orderBy: (questions, { desc }) => [desc(questions.createdAt)],
//       });
//     } else if (userId) {
//       allQuestions = await db.query.questions.findMany({
//         where: eq(questions.userId, userId),
//         with: {
//           category: {
//             with: {
//               field: true,
//             },
//           },
//           likes: true,
//         },
//         orderBy: (questions, { desc }) => [desc(questions.createdAt)],
//       });
//     } else {
//       allQuestions = await db.query.questions.findMany({
//         with: {
//           user: {
//             columns: {
//               password: false,
//             },
//           },
//           category: {
//             with: {
//               field: true,
//             },
//           },
//           likes: true,
//         },
//         orderBy: (questions, { desc }) => [desc(questions.createdAt)],
//       });
//     }

//     // Add like count and check if current user liked each question
//     const questionsWithLikes = allQuestions.map(question => ({
//       ...question,
//       likeCount: question.likes.length,
//       isLikedByUser: session ? question.likes.some(like => like.userId === session.userId) : false,
//       likes: undefined, // Remove the full likes array from response
//     }));

//     return NextResponse.json(questionsWithLikes);
//   } catch (error) {
//     console.error('Get questions error:', error);
//     return NextResponse.json(
//       { error: 'Internal server error' },
//       { status: 500 }
//     );
//   }
// }

// export async function POST(request: NextRequest) {
//   try {
//     const session = await getSession();

//     if (!session) {
//       return NextResponse.json(
//         { error: 'Not authenticated' },
//         { status: 401 }
//       );
//     }

//     const { questionText, answer, categoryId } = await request.json();

//     if (!questionText || !answer || !categoryId) {
//       return NextResponse.json(
//         { error: 'All fields are required' },
//         { status: 400 }
//       );
//     }

//     const [newQuestion] = await db.insert(questions).values({
//       questionText,
//       answer,
//       categoryId,
//       userId: session.userId,
//     }).returning();

//     return NextResponse.json(newQuestion);
//   } catch (error) {
//     console.error('Create question error:', error);
//     return NextResponse.json(
//       { error: 'Internal server error' },
//       { status: 500 }
//     );
//   }
// }








// src/app/api/questions/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/db';
import { questions, likes } from '@/db/schema';
import { eq, and, count } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('categoryId');
    const userId = searchParams.get('userId');

    let allQuestions;
    
    if (categoryId) {
      allQuestions = await db.query.questions.findMany({
        where: eq(questions.categoryId, categoryId),
        with: {
          user: {
            columns: {
              password: false,
            },
            with: {
              verificationDetails: true,
            },
          },
          category: {
            with: {
              field: true,
            },
          },
          likes: true,
        },
        orderBy: (questions, { desc }) => [desc(questions.createdAt)],
      });
    } else if (userId) {
      allQuestions = await db.query.questions.findMany({
        where: eq(questions.userId, userId),
        with: {
          user: {
            columns: {
              password: false,
            },
          },
          category: {
            with: {
              field: true,
            },
          },
          likes: true,
        },
        orderBy: (questions, { desc }) => [desc(questions.createdAt)],
      });
    } else {
      allQuestions = await db.query.questions.findMany({
        with: {
          user: {
            columns: {
              password: false,
            },
          },
          category: {
            with: {
              field: true,
            },
          },
          likes: true,
        },
        orderBy: (questions, { desc }) => [desc(questions.createdAt)],
      });
    }

    // Add like count, user question count, and check if current user liked each question
    const questionsWithStats = await Promise.all(
      allQuestions.map(async (question) => {
        // Get question count for the user who posted this question
        let userQuestionCount = 0;
        if (question.userId) {
          const [result] = await db
            .select({ count: count() })
            .from(questions)
            .where(eq(questions.userId, question.userId));
          userQuestionCount = result.count;
        }

        return {
          ...question,
          likeCount: question.likes.length,
          isLikedByUser: session ? question.likes.some(like => like.userId === session.userId) : false,
          user: question.user ? {
            ...question.user,
            questionCount: userQuestionCount,
          } : {
            id: question.userId,
            name: 'Unknown User',
            isVerified: false,
            questionCount: userQuestionCount,
          },
          likes: undefined, // Remove the full likes array from response
        };
      })
    );

    return NextResponse.json(questionsWithStats);
  } catch (error) {
    console.error('Get questions error:', error);
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

    const { questionText, answer, categoryId } = await request.json();

    if (!questionText || !answer || !categoryId) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    const [newQuestion] = await db.insert(questions).values({
      questionText,
      answer,
      categoryId,
      userId: session.userId,
    }).returning();

    return NextResponse.json(newQuestion);
  } catch (error) {
    console.error('Create question error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}