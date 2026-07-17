// src/app/api/connections/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/db';
import { connections } from '@/db/schema';
import { eq, or, and } from 'drizzle-orm';

export async function GET() {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Get all connections where user is involved
    const userConnections = await db.query.connections.findMany({
      where: or(
        eq(connections.userId, session.userId),
        eq(connections.connectedUserId, session.userId)
      ),
      with: {
        user: {
          columns: {
            password: false,
          },
          with: {
            verificationDetails: true,
          },
        },
        connectedUser: {
          columns: {
            password: false,
          },
          with: {
            verificationDetails: true,
          },
        },
      },
    });

    return NextResponse.json(userConnections);
  } catch (error) {
    console.error('Get connections error:', error);
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

    const { connectedUserId } = await request.json();

    if (!connectedUserId) {
      return NextResponse.json(
        { error: 'Connected user ID is required' },
        { status: 400 }
      );
    }

    // Check if connection already exists
    const existing = await db.query.connections.findFirst({
      where: or(
        and(
          eq(connections.userId, session.userId),
          eq(connections.connectedUserId, connectedUserId)
        ),
        and(
          eq(connections.userId, connectedUserId),
          eq(connections.connectedUserId, session.userId)
        )
      ),
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Connection already exists' },
        { status: 400 }
      );
    }

    const [newConnection] = await db.insert(connections).values({
      userId: session.userId,
      connectedUserId,
      status: 'pending',
    }).returning();

    return NextResponse.json(newConnection);
  } catch (error) {
    console.error('Create connection error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
