// src/app/api/verification/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/db';
import { verificationDetails } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      university,
      workStatus,
      location,
      socialMediaLinks,
      mobileNumber,
    } = body;

    if (!university || !workStatus || !location || !mobileNumber) {
      return NextResponse.json(
        { error: 'Required fields missing' },
        { status: 400 }
      );
    }

    // Check if verification already exists
    const existing = await db.query.verificationDetails.findFirst({
      where: eq(verificationDetails.userId, session.userId),
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Verification already submitted. Please wait for admin review.' },
        { status: 400 }
      );
    }

    // Create verification details with pending status (no profilePicture)
    await db.insert(verificationDetails).values({
      userId: session.userId,
      university,
      workStatus,
      location,
      socialMediaLinks: JSON.stringify(socialMediaLinks || {}),
      mobileNumber,
      status: 'pending',
    });

    return NextResponse.json({ 
      success: true,
      message: 'Verification request submitted. Please wait for admin approval.' 
    });
  } catch (error) {
    console.error('Verification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const details = await db.query.verificationDetails.findFirst({
      where: eq(verificationDetails.userId, session.userId),
    });

    if (!details) {
      return NextResponse.json(
        { error: 'Verification not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ...details,
      socialMediaLinks: JSON.parse(details.socialMediaLinks || '{}'),
    });
  } catch (error) {
    console.error('Get verification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Check current verification status
    const current = await db.query.verificationDetails.findFirst({
      where: eq(verificationDetails.userId, session.userId),
    });

    if (!current) {
      return NextResponse.json(
        { error: 'Verification not found' },
        { status: 404 }
      );
    }

    // Only allow updates if status is pending or rejected
    if (current.status === 'approved') {
      return NextResponse.json(
        { error: 'Cannot update approved verification' },
        { status: 400 }
      );
    }

    const body = await request.json();

    await db.update(verificationDetails)
      .set({
        ...body,
        socialMediaLinks: body.socialMediaLinks 
          ? JSON.stringify(body.socialMediaLinks) 
          : undefined,
        status: 'pending', // Reset status to pending on update
        updatedAt: new Date(),
      })
      .where(eq(verificationDetails.userId, session.userId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update verification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}