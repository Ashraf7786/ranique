import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { sendOTP } from '@/lib/mailer';
import { RegisterSchema, validationError } from '@/lib/validation';
import { authRateLimit } from '@/lib/rate-limit';

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req: Request) {
  try {
    // Rate limit: 10 attempts per hour per IP
    const limit = authRateLimit(req);
    if (!limit.success) {
      return NextResponse.json({ error: limit.error }, { status: 429 });
    }

    const body = await req.json();

    // Zod validation
    const parsed = RegisterSchema.safeParse(body);
    if (!parsed.success) return validationError(parsed.error);
    const { firstName, lastName, mobileNumber, email, password } = parsed.data;

    // Check if user already exists
    let user = await prisma.user.findUnique({ where: { email } });

    if (user && user.isEmailVerified) {
      return NextResponse.json({ error: 'User already exists and is verified. Please log in.' }, { status: 400 });
    }

    // Rate limiting: max 7 OTP requests per 24 hours
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const otpCount = await prisma.otpRequest.count({
      where: { email, type: 'REGISTER', createdAt: { gte: twentyFourHoursAgo } }
    });

    if (otpCount >= 7) {
      return NextResponse.json({ error: 'Max OTP limit reached (7 per 24 hours). Please try again tomorrow.' }, { status: 429 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otpCode = generateOTP();

    if (user && !user.isEmailVerified) {
      // Update unverified user
      user = await prisma.user.update({
        where: { email },
        data: {
          firstName,
          lastName,
          mobileNumber,
          password: hashedPassword,
          provider: 'CREDENTIALS'
        }
      });
    } else {
      // Create new unverified user
      user = await prisma.user.create({
        data: {
          firstName,
          lastName,
          mobileNumber,
          email,
          password: hashedPassword,
          provider: 'CREDENTIALS'
        }
      });
    }

    // Do not delete old OTPs here, just create a new one.
    // This allows us to count them for the 24-hour limit.
    await prisma.otpRequest.create({
      data: {
        email,
        otp: otpCode,
        type: 'REGISTER',
        expiresAt: new Date(Date.now() + 10 * 60 * 1000) // 10 mins
      }
    });

    // Send email
    await sendOTP(email, otpCode);

    return NextResponse.json({ success: true, message: 'OTP sent to email' });
  } catch (error: any) {
    console.error("Register Error:", error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
