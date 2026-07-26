import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { VerifyOtpSchema, validationError } from '@/lib/validation';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const parsed = VerifyOtpSchema.safeParse(body);
    if (!parsed.success) return validationError(parsed.error);
    const { email, otp } = parsed.data;

    const otpRecord = await prisma.otpRequest.findFirst({
      where: {
        email,
        type: 'FORGOT_PASSWORD',
        otp
      },
      orderBy: { createdAt: 'desc' }
    });

    if (!otpRecord) {
      return NextResponse.json({ error: 'Invalid OTP' }, { status: 400 });
    }

    if (otpRecord.expiresAt < new Date()) {
      return NextResponse.json({ error: 'OTP has expired' }, { status: 400 });
    }

    // Do NOT delete the OTP here, as we need it for the final reset-password step
    // and for rate-limiting history. We just confirm it's valid.

    return NextResponse.json({ success: true, message: 'OTP is valid' });
  } catch (error: any) {
    console.error("Verify Forgot Password OTP Error:", error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
