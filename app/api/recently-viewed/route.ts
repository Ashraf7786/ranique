import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ success: false });

  const { productId } = await req.json();

  if (productId) {
    await prisma.recentlyViewed.upsert({
      where: {
        userId_productId: { userId: (session.user as any).id, productId }
      },
      update: { viewedAt: new Date() },
      create: { userId: (session.user as any).id, productId }
    });
  }

  return NextResponse.json({ success: true });
}
