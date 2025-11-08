// src/app/api/profile/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/db';
import { users, verificationDetails } from '@/db/schema';
import { eq } from 'drizzle-orm';

// GET endpoint to fetch user profile
export async function GET(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const [user] = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        profilePicture: users.profilePicture,
        role: users.role,
        isVerified: users.isVerified,
      })
      .from(users)
      .where(eq(users.id, session.userId))
      .limit(1);

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Fetch verification details separately if user is verified
    let verificationData = null;
    if (user.isVerified) {
      const [verification] = await db
        .select({
          university: verificationDetails.university,
          workStatus: verificationDetails.workStatus,
          location: verificationDetails.location,
          mobileNumber: verificationDetails.mobileNumber,
          socialMediaLinks: verificationDetails.socialMediaLinks,
        })
        .from(verificationDetails)
        .where(eq(verificationDetails.userId, session.userId))
        .limit(1);

      verificationData = verification || null;
    }

    return NextResponse.json({
      success: true,
      user: {
        ...user,
        verificationDetails: verificationData,
      },
    });
  } catch (error) {
    console.error('Get profile error:', error);
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

    const body = await request.json();
    const { profilePicture, name } = body;

    const updateData: any = {
      updatedAt: new Date(),
    };

    if (profilePicture) {
      updateData.profilePicture = profilePicture;
    }

    if (name && name.trim()) {
      updateData.name = name.trim();
    }

    const [updatedUser] = await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, session.userId))
      .returning({
        id: users.id,
        name: users.name,
        email: users.email,
        profilePicture: users.profilePicture,
        role: users.role,
        isVerified: users.isVerified,
      });

    // Fetch verification details separately if user is verified
    let verificationData = null;
    if (updatedUser.isVerified) {
      const [verification] = await db
        .select({
          university: verificationDetails.university,
          workStatus: verificationDetails.workStatus,
          location: verificationDetails.location,
          mobileNumber: verificationDetails.mobileNumber,
          socialMediaLinks: verificationDetails.socialMediaLinks,
        })
        .from(verificationDetails)
        .where(eq(verificationDetails.userId, session.userId))
        .limit(1);

      verificationData = verification || null;
    }

    return NextResponse.json({
      success: true,
      user: {
        ...updatedUser,
        verificationDetails: verificationData,
      },
    });
  } catch (error) {
    console.error('Update profile error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}