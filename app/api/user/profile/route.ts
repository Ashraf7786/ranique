import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { ProfileUpdateSchema, validationError } from '@/lib/validation';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { addresses: true }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const body = await req.json();

    // Zod validation
    const parsed = ProfileUpdateSchema.safeParse(body);
    if (!parsed.success) return validationError(parsed.error);
    const { firstName, lastName, mobileNumber, dob, gender, address } = parsed.data;

    // Update user base fields
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        firstName,
        lastName,
        mobileNumber,
        dob: dob ? new Date(dob) : null,
        gender,
      }
    });

    // Update address if provided
    let updatedAddress = null;
    if (address) {
      const existingAddress = await prisma.address.findFirst({
        where: { userId, isDefault: true }
      });

      if (existingAddress) {
        updatedAddress = await prisma.address.update({
          where: { id: existingAddress.id },
          data: {
            name: address.name,
            phone: address.phone,
            line1: address.line1,
            line2: address.line2 || null,
            city: address.city,
            state: address.state,
            zip: address.zip,
            country: address.country || 'India',
          }
        });
      } else {
        updatedAddress = await prisma.address.create({
          data: {
            userId,
            isDefault: true,
            name: address.name,
            phone: address.phone,
            line1: address.line1,
            line2: address.line2 || null,
            city: address.city,
            state: address.state,
            zip: address.zip,
            country: address.country || 'India',
          }
        });
      }
    }

    return NextResponse.json({ user: updatedUser, address: updatedAddress });
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}
