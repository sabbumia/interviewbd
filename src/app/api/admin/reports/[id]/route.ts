// src/app/api/admin/reports/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/db';
import { reports, questions, messages, connections } from '@/db/schema';
import { eq, and, or } from 'drizzle-orm';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();

    if (!session || (session.role !== 'admin' && session.role !== 'moderator')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const { id } = await params;
    const { action } = await request.json(); // action: 'dismiss' or 'delete_question'

    if (!action || !['dismiss', 'delete_question'].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid action' },
        { status: 400 }
      );
    }

    // Get the report with full details
    const report = await db.query.reports.findFirst({
      where: eq(reports.id, id),
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
    });

    if (!report) {
      return NextResponse.json(
        { error: 'Report not found' },
        { status: 404 }
      );
    }

    // Ensure connection exists between admin and reporter for sending messages
    const existingConnection = await db.query.connections.findFirst({
      where: or(
        and(
          eq(connections.userId, session.userId),
          eq(connections.connectedUserId, report.reportedBy)
        ),
        and(
          eq(connections.userId, report.reportedBy),
          eq(connections.connectedUserId, session.userId)
        )
      ),
    });

    if (!existingConnection) {
      // Create a connection between admin and reporter
      await db.insert(connections).values({
        userId: session.userId,
        connectedUserId: report.reportedBy,
        status: 'accepted',
      });
    }

    if (action === 'delete_question') {
      // Send thank you message to reporter
      const thankYouMessage = `✅ Report Action Taken

Dear ${report.reportedByUser.name},

Thank you for reporting the question. After reviewing your report, we have taken action.

📋 Report Details:
• Question: "${report.question.questionText.substring(0, 100)}${report.question.questionText.length > 100 ? '...' : ''}"
• Category: ${report.question.category.field.name} > ${report.question.category.name}
• Your Reason: ${report.reason}

🎯 Action Taken:
The reported question has been deleted from our platform as it violated our community guidelines.

Your vigilance helps us maintain a safe and quality learning environment for all users. We appreciate your contribution to keeping our community healthy.

If you encounter any other inappropriate content, please don't hesitate to report it.

Thank you for helping us improve!

Best regards,
${session.role === 'admin' ? 'Admin' : 'Moderation'} Team`;

      await db.insert(messages).values({
        senderId: session.userId, // Admin/Moderator sends the message
        receiverId: report.reportedBy,
        content: thankYouMessage,
      });

      // Ensure connection exists between admin and question author
      const authorConnection = await db.query.connections.findFirst({
        where: or(
          and(
            eq(connections.userId, session.userId),
            eq(connections.connectedUserId, report.question.userId)
          ),
          and(
            eq(connections.userId, report.question.userId),
            eq(connections.connectedUserId, session.userId)
          )
        ),
      });

      if (!authorConnection) {
        // Create a connection between admin and question author
        await db.insert(connections).values({
          userId: session.userId,
          connectedUserId: report.question.userId,
          status: 'accepted',
        });
      }

      // Send notification to question author
      const authorNotification = `🚫 Content Removal Notice

Dear ${report.question.user.name},

We are writing to inform you that one of your questions has been removed from our platform.

📋 Question Details:
• Question: "${report.question.questionText.substring(0, 100)}${report.question.questionText.length > 100 ? '...' : ''}"
• Category: ${report.question.category.field.name} > ${report.question.category.name}
• Posted on: ${new Date(report.question.createdAt).toLocaleDateString()}

⚠️ Reason for Removal:
Your question was reported by a community member and upon review, it was found to violate our community guidelines.

Report Reason: ${report.reason}

📌 Community Guidelines Reminder:
Please ensure all content you post:
• Is relevant and appropriate
• Provides accurate information
• Respects other community members
• Follows our terms of service

💡 Moving Forward:
We encourage you to review our community guidelines before posting new content. Future violations may result in additional actions on your account.

If you believe this removal was made in error, please reply to this message with your concerns, and we will review your case.

Best regards,
${session.role === 'admin' ? 'Admin' : 'Moderation'} Team`;

      await db.insert(messages).values({
        senderId: session.userId,
        receiverId: report.question.userId,
        content: authorNotification,
      });

      // Delete the question (this will cascade delete the report and all likes due to onDelete: 'cascade')
      await db.delete(questions).where(eq(questions.id, report.questionId));
      
      return NextResponse.json({ 
        success: true, 
        message: 'Question deleted successfully. Reporter and author notified.' 
      });
    } else if (action === 'dismiss') {
      // Send warning message to reporter
      const warningMessage = `⚠️ Report Review Update

Dear ${report.reportedByUser.name},

We have reviewed your report regarding the following question:

📋 Report Details:
• Question: "${report.question.questionText.substring(0, 100)}${report.question.questionText.length > 100 ? '...' : ''}"
• Category: ${report.question.category.field.name} > ${report.question.category.name}
• Your Reason: ${report.reason}

🔍 Review Outcome:
After careful review, we have determined that the reported question does not violate our community guidelines. The content appears to be appropriate and relevant to the platform.

⚠️ Important Reminder:
Please ensure that reports are submitted only for genuine violations such as:
• Inappropriate or offensive content
• Spam or misleading information
• Incorrect or harmful answers
• Violation of community guidelines

Submitting false or unfounded reports may affect your standing in the community. We appreciate your understanding and ask that you review our guidelines carefully before reporting content in the future.

If you have any questions about our content policies, please feel free to reach out.

Best regards,
${session.role === 'admin' ? 'Admin' : 'Moderation'} Team`;

      await db.insert(messages).values({
        senderId: session.userId, // Admin/Moderator sends the message
        receiverId: report.reportedBy,
        content: warningMessage,
      });

      // Just delete/dismiss the report
      await db.delete(reports).where(eq(reports.id, id));
      
      return NextResponse.json({ 
        success: true, 
        message: 'Report dismissed successfully and reporter notified' 
      });
    }
  } catch (error) {
    console.error('Handle report error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}