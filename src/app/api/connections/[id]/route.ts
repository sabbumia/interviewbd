// src/app/api/connections/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/db';
import { connections } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    
    if (!session) {
      console.log('❌ No session found');
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // IMPORTANT: Await params first (Next.js 15 requirement)
    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    console.log('✅ PUT request received:', {
      connectionId: id,
      newStatus: status,
      userId: session.userId,
      userRole: session.role
    });

    if (!status || !['accepted', 'rejected'].includes(status)) {
      console.log('❌ Invalid status:', status);
      return NextResponse.json(
        { error: 'Invalid status. Must be "accepted" or "rejected"' },
        { status: 400 }
      );
    }

    const connection = await db.query.connections.findFirst({
      where: eq(connections.id, id),
    });

    console.log('📊 Connection found:', connection);

    if (!connection) {
      console.log('❌ Connection not found');
      return NextResponse.json(
        { error: 'Connection not found' },
        { status: 404 }
      );
    }

    // Only the receiver can accept/reject
    if (connection.connectedUserId !== session.userId) {
      console.log('❌ Unauthorized:', {
        connectedUserId: connection.connectedUserId,
        sessionUserId: session.userId,
        message: 'Only the receiver can accept/reject'
      });
      return NextResponse.json(
        { error: 'Unauthorized: You can only accept/reject requests sent to you' },
        { status: 403 }
      );
    }

    console.log('✅ Authorization passed, updating connection...');

    const [updated] = await db.update(connections)
      .set({ status })
      .where(eq(connections.id, id))
      .returning();

    console.log('✅ Connection updated successfully:', updated);

    return NextResponse.json(updated);
  } catch (error) {
    console.error('❌ Update connection error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();

    if (!session) {
      console.log('❌ No session found');
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // IMPORTANT: Await params first (Next.js 15 requirement)
    const { id } = await params;

    console.log('✅ DELETE request received:', {
      connectionId: id,
      userId: session.userId
    });

    const connection = await db.query.connections.findFirst({
      where: eq(connections.id, id),
    });

    console.log('📊 Connection found:', connection);

    if (!connection) {
      console.log('❌ Connection not found');
      return NextResponse.json(
        { error: 'Connection not found' },
        { status: 404 }
      );
    }

    // Both users can delete the connection
    if (connection.userId !== session.userId && connection.connectedUserId !== session.userId) {
      console.log('❌ Unauthorized: User is not part of this connection');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    console.log('✅ Authorization passed, deleting connection...');

    await db.delete(connections).where(eq(connections.id, id));

    console.log('✅ Connection deleted successfully');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('❌ Delete connection error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    );
  }
}