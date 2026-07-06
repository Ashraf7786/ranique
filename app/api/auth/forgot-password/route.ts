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

    if (!user) {
      // Don't leak whether the email exists, just say sent
      return NextResponse.json({ success: true, message: 'If the email exists, an OTP was sent' });
    }

    const otpCode = generateOTP();

    await prisma.otpRequest.deleteMany({
      where: { email, type: 'FORGOT_PASSWORD' }
    });

    await prisma.otpRequest.create({
      data: {
        email,
        otp: otpCode,
        type: 'FORGOT_PASSWORD',
        expiresAt: new Date(Date.now() + 10 * 60 * 1000)
      }
    });

    await sendOTP(email, otpCode);

    return NextResponse.json({ success: true, message: 'If the email exists, an OTP was sent' });
  } catch (error: any) {
    console.error("Forgot Password Error:", error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
