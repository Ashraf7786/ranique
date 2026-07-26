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

    const last24h = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const recentOTPs = await prisma.otpRequest.count({
      where: { email, type: 'FORGOT_PASSWORD', createdAt: { gte: last24h } }
    });

    if (recentOTPs >= 2) {
      return NextResponse.json({ error: 'Limit exhausted. Please try again after 24 hours.' }, { status: 429 });
    }

    const otpCode = generateOTP();

    // Save the request for both real and fake emails to prevent enumeration via rate limits
    await prisma.otpRequest.create({
      data: {
        email,
        otp: otpCode,
        type: 'FORGOT_PASSWORD',
        expiresAt: new Date(Date.now() + 10 * 60 * 1000)
      }
    });

    const user = await prisma.user.findUnique({ where: { email } });

    // Only actually send an email if the user exists
    if (user) {
      await sendOTP(email, otpCode);
    }

    return NextResponse.json({ success: true, message: 'If the email exists, an OTP was sent' });
  } catch (error: any) {
    console.error("Forgot Password Error:", error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
