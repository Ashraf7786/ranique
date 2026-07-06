import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json({ error: 'Email and OTP are required' }, { status: 400 });
    }

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
