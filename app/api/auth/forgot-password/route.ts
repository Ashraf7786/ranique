import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendOTP } from '@/lib/mailer';
import { ForgotPasswordSchema, validationError } from '@/lib/validation';
import { otpRateLimit } from '@/lib/rate-limit';

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req: Request) {
  try {
    // Rate limit: 5 requests per 15 minutes per IP (strict)
    const limit = otpRateLimit(req);
    if (!limit.success) {
      return NextResponse.json({ error: limit.error }, { status: 429 });
    }

    const body = await req.json();

    // Zod validation
    const parsed = ForgotPasswordSchema.safeParse(body);
    if (!parsed.success) return validationError(parsed.error);
    const { email } = parsed.data;

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
