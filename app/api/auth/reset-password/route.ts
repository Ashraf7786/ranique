import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { ResetPasswordSchema, validationError } from '@/lib/validation';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Zod validation
    const parsed = ResetPasswordSchema.safeParse(body);
    if (!parsed.success) return validationError(parsed.error);
    const { email, otp, newPassword } = parsed.data;

    const otpRecord = await prisma.otpRequest.findFirst({
      where: {
        email,
        type: 'FORGOT_PASSWORD',
        otp
      }
    });

    if (!otpRecord) {
      return NextResponse.json({ error: 'Invalid OTP' }, { status: 400 });
    }

    if (otpRecord.expiresAt < new Date()) {
      return NextResponse.json({ error: 'OTP has expired' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { email },
      data: { password: hashedPassword }
    });

    await prisma.otpRequest.deleteMany({
      where: { email, type: 'FORGOT_PASSWORD' }
    });

    return NextResponse.json({ success: true, message: 'Password reset successfully' });
  } catch (error: any) {
    console.error("Reset Password Error:", error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
