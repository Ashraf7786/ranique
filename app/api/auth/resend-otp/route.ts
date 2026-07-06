import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendOTP } from '@/lib/mailer';

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (user && user.isEmailVerified) {
      return NextResponse.json({ error: 'User is already verified' }, { status: 400 });
    }

    // Rate limiting: max 7 OTP requests per 24 hours
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const otpCount = await prisma.otpRequest.count({
      where: { email, type: 'REGISTER', createdAt: { gte: twentyFourHoursAgo } }
    });

    if (otpCount >= 7) {
      return NextResponse.json({ error: 'Max OTP limit reached (7 per 24 hours). Please try again tomorrow.' }, { status: 429 });
    }

    const otpCode = generateOTP();

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

    return NextResponse.json({ success: true, message: 'OTP resent to email' });
  } catch (error: any) {
    console.error("Resend OTP Error:", error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
