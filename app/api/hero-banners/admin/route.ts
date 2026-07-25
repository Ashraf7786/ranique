import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

// Admin-only: returns all banners including inactive, ordered by sortOrder
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any)?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  try {
    const banners = await prisma.heroBanner.findMany({
      orderBy: { sortOrder: 'asc' },
    });
    return NextResponse.json(banners);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch banners' }, { status: 500 });
  }
}
