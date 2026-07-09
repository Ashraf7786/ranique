import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { VerifyOtpSchema, validationError } from '@/lib/validation';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Zod validation
    const parsed = VerifyOtpSchema.safeParse(body);
    if (!parsed.success) return validationError(parsed.error);
    const { email, otp } = parsed.data;

    const otpRecord = await prisma.otpRequest.findFirst({
      where: {
        email,
        type: 'REGISTER',
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

    // Mark user as verified
    await prisma.user.update({
      where: { email },
      data: { isEmailVerified: true }
    });

    // Clean up OTPs
    await prisma.otpRequest.deleteMany({
      where: { email, type: 'REGISTER' }
    });

    // Create empty wishlist and cart for the user
    const user = await prisma.user.findUnique({ where: { email } });
    if (user) {
      await prisma.wishlist.create({ data: { userId: user.id } }).catch(() => {});
      await prisma.cart.create({ data: { userId: user.id } }).catch(() => {});
    }

    return NextResponse.json({ success: true, message: 'Email verified successfully' });
  } catch (error: any) {
    console.error("Verify OTP Error:", error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
