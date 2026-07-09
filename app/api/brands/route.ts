import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { BrandCreateSchema, validationError } from '@/lib/validation';

export async function GET() {
  try {
    const brands = await prisma.brand.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(brands);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch brands' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    // 🔒 Security fix: Admin auth guard was missing on this route
    const session = await getServerSession(authOptions);
    if (!session || !session.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();

    // Zod validation
    const parsed = BrandCreateSchema.safeParse(body);
    if (!parsed.success) return validationError(parsed.error);

    const brand = await prisma.brand.create({
      data: parsed.data
    });
    return NextResponse.json(brand, { status: 201 });
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Brand slug already exists' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create brand' }, { status: 500 });
  }
}
