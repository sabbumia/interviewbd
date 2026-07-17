// src/app/api/reports/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/db';
import { reports } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const { questionId, reason } = await request.json();

    if (!questionId || !reason || !reason.trim()) {
      return NextResponse.json(
        { error: 'Question ID and reason are required' },
        { status: 400 }
      );
    }

    // Check if user already reported this question
    const existingReport = await db.query.reports.findFirst({
      where: and(
        eq(reports.questionId, questionId),
        eq(reports.reportedBy, session.userId)
      ),
    });

    if (existingReport) {
      return NextResponse.json(
        { error: 'You have already reported this question' },
        { status: 400 }
      );
    }

    // Create new report
    const [newReport] = await db.insert(reports).values({
      questionId,
      reportedBy: session.userId,
      reason: reason.trim(),
      status: 'pending',
    }).returning();

    return NextResponse.json({ 
      success: true, 
      message: 'Report submitted successfully',
      report: newReport 
    });
  } catch (error) {
    console.error('Create report error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}