import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

// GET — public: returns all active banners ordered by sortOrder
export async function GET() {
  try {
    const banners = await prisma.heroBanner.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    });
    return NextResponse.json(banners);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch banners' }, { status: 500 });
  }
}

// POST — admin-only: create a new banner
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any)?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  try {
    const body = await request.json();
    const banner = await prisma.heroBanner.create({ data: body });
    revalidatePath('/');
    return NextResponse.json(banner, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create banner' }, { status: 500 });
  }
}
