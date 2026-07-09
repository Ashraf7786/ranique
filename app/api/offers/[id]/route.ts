import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const offer = await prisma.productOffer.findUnique({
      where: { id },
      include: {
        product: true
      }
    });
    
    if (!offer) {
      return NextResponse.json({ error: 'Offer not found' }, { status: 404 });
    }
    
    return NextResponse.json(offer);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch offer' }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 🔒 Security fix: Admin auth guard was missing on this route
    const session = await getServerSession(authOptions);
    if (!session || !session.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;
    const data = await request.json();
    
    if (data.endsAt) {
      data.endsAt = new Date(data.endsAt);
    }

    const offer = await prisma.productOffer.update({
      where: { id },
      data
    });
    revalidatePath('/', 'layout');
    return NextResponse.json(offer);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update offer' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 🔒 Security fix: Admin auth guard was missing on this route
    const session = await getServerSession(authOptions);
    if (!session || !session.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;
    await prisma.productOffer.delete({
      where: { id }
    });
    revalidatePath('/', 'layout');
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete offer' }, { status: 500 });
  }
}
