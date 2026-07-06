import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

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
    const body = await request.json();
    const brand = await prisma.brand.create({
      data: body
    });
    return NextResponse.json(brand, { status: 201 });
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Brand slug already exists' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create brand' }, { status: 500 });
  }
}
