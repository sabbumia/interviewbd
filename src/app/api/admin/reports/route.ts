// src/app/api/admin/reports/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/db';
import { reports } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    const session = await getSession();

    if (!session || (session.role !== 'admin' && session.role !== 'moderator')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // Get all pending reports with question and user details
    const allReports = await db.query.reports.findMany({
      where: eq(reports.status, 'pending'),
      with: {
        question: {
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
          },
        },
        reportedByUser: {
          columns: {
            password: false,
          },
        },
      },
      orderBy: (reports, { desc }) => [desc(reports.createdAt)],
    });

    return NextResponse.json(allReports);
  } catch (error) {
    console.error('Get reports error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}