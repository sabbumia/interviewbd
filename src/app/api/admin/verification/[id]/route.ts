// src/app/api/admin/verification/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/db';
import { verificationDetails, users, messages, connections } from '@/db/schema';
import { eq, and, or } from 'drizzle-orm';

// Approve or Reject verification
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
    const body = await request.json();
    const { action, rejectionReason } = body; // action: 'approve' or 'reject'

    if (!action || !['approve', 'reject'].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid action' },
        { status: 400 }
      );
    }

    // Get the verification request
    const verification = await db.query.verificationDetails.findFirst({
      where: eq(verificationDetails.id, id),
      with: {
        user: true,
      },
    });

    if (!verification) {
      return NextResponse.json(
        { error: 'Verification request not found' },
        { status: 404 }
      );
    }

    if (action === 'approve') {
      // Update verification status to approved
      await db.update(verificationDetails)
        .set({
          status: 'approved',
          reviewedBy: session.userId,
          reviewedAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(verificationDetails.id, id));

      // Update user verification status
      await db.update(users)
        .set({ 
          isVerified: true, 
          updatedAt: new Date() 
        })
        .where(eq(users.id, verification.userId));

      // Ensure connection exists between admin and user
      const existingConnection = await db.query.connections.findFirst({
        where: or(
          and(
            eq(connections.userId, session.userId),
            eq(connections.connectedUserId, verification.userId)
          ),
          and(
            eq(connections.userId, verification.userId),
            eq(connections.connectedUserId, session.userId)
          )
        ),
      });

      if (!existingConnection) {
        // Create a connection between admin and user
        await db.insert(connections).values({
          userId: session.userId,
          connectedUserId: verification.userId,
          status: 'accepted',
        });
      }

      // Send congratulations message
      const approvalMessage = `🎉 Congratulations ${verification.user.name}!

Your verification request has been approved! You are now a verified member of our community.

As a verified member, you can:
✓ Build trust with other users
✓ Access premium features
✓ Connect with other verified professionals

Thank you for being part of our platform!

Best regards,
Admin Team`;

      await db.insert(messages).values({
        senderId: session.userId, // Admin sends the message
        receiverId: verification.userId,
        content: approvalMessage,
      });

      return NextResponse.json({ 
        success: true, 
        message: 'Verification approved successfully and user notified' 
      });
    } else {
      // Reject verification
      const customReason = rejectionReason || 'The information provided did not meet our verification standards.';
      
      // Ensure connection exists between admin and user for rejection message
      const existingConnection = await db.query.connections.findFirst({
        where: or(
          and(
            eq(connections.userId, session.userId),
            eq(connections.connectedUserId, verification.userId)
          ),
          and(
            eq(connections.userId, verification.userId),
            eq(connections.connectedUserId, session.userId)
          )
        ),
      });

      if (!existingConnection) {
        // Create a connection between admin and user
        await db.insert(connections).values({
          userId: session.userId,
          connectedUserId: verification.userId,
          status: 'accepted',
        });
      }
      
      // Send rejection message
      const rejectionMessage = `⚠️ Verification Request Update

Dear ${verification.user.name},

We're sorry to inform you that your verification request has been rejected.

Reason: ${customReason}

Please review your information and submit a new verification request with accurate details. Make sure to:
• Provide correct university/institution name
• Use a valid mobile number
• Enter accurate location information
• Add genuine social media profiles (if applicable)

You can submit a new verification request from your profile page.

If you believe this was a mistake, please ensure all information is accurate before resubmitting.

Best regards,
Admin Team`;

      await db.insert(messages).values({
        senderId: session.userId, // Admin sends the message
        receiverId: verification.userId,
        content: rejectionMessage,
      });

      // Delete the verification request
      await db.delete(verificationDetails)
        .where(eq(verificationDetails.id, id));

      return NextResponse.json({ 
        success: true, 
        message: 'Verification rejected, user notified, and request deleted' 
      });
    }
  } catch (error) {
    console.error('Verification action error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Delete verification request
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();

    if (!session || session.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const { id } = await params;

    await db.delete(verificationDetails)
      .where(eq(verificationDetails.id, id));

    return NextResponse.json({ 
      success: true, 
      message: 'Verification request deleted' 
    });
  } catch (error) {
    console.error('Delete verification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}