// src/app/api/auth/verify-email/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { users, emailVerificationCodes } from '@/db/schema';
import { hashPassword, createToken, setAuthCookie } from '@/lib/auth';
import { sendWelcomeEmail } from '@/lib/email';
import { eq, and, gt } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const { email, code, name, password } = await request.json();

    if (!email || !code || !name || !password) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Find verification code
    const verificationRecord = await db.query.emailVerificationCodes.findFirst({
      where: and(
        eq(emailVerificationCodes.email, email),
        eq(emailVerificationCodes.code, code),
        gt(emailVerificationCodes.expiresAt, new Date())
      ),
    });

    if (!verificationRecord) {
      return NextResponse.json(
        { error: 'Invalid or expired verification code' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      );
    }

    // Create user
    const hashedPassword = await hashPassword(password);
    const [newUser] = await db.insert(users).values({
      name,
      email,
      password: hashedPassword,
      emailVerified: true,
    }).returning();

    // Delete used verification code
    await db.delete(emailVerificationCodes).where(eq(emailVerificationCodes.email, email));

    // Create token
    const token = await createToken({
      userId: newUser.id,
      email: newUser.email,
      role: newUser.role,
    });

    await setAuthCookie(token);

    // Send welcome email (don't await to avoid blocking)
    sendWelcomeEmail(email, name).catch(err => 
      console.error('Failed to send welcome email:', err)
    );

    return NextResponse.json({
      message: 'Email verified successfully',
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        isVerified: newUser.isVerified,
        emailVerified: newUser.emailVerified,
      },
    });
  } catch (error) {
    console.error('Verify email error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}