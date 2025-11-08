// src/app/api/admin/verification/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/db';
import { verificationDetails } from '@/db/schema';
import { eq } from 'drizzle-orm';

// Get all pending verification requests
export async function GET() {
  try {
    const session = await getSession();

    if (!session || (session.role !== 'admin' && session.role !== 'moderator')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const requests = await db.query.verificationDetails.findMany({
      with: {
        user: {
          columns: {
            id: true,
            name: true,
            email: true,
            isVerified: true,
            profilePicture: true,
          },
        },
      },
      orderBy: (vd, { desc }) => [desc(vd.createdAt)],
    });

    // Parse social media links for each request
    const parsedRequests = requests.map(req => ({
      ...req,
      socialMediaLinks: JSON.parse(req.socialMediaLinks || '{}'),
    }));

    return NextResponse.json(parsedRequests);
  } catch (error) {
    console.error('Get verification requests error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}