import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('categoryId');
    const status = searchParams.get('status');
    const isFeatured = searchParams.get('isFeatured');

    const where: any = {};
    if (categoryId) where.categoryId = categoryId;
    if (status) where.status = status;
    if (isFeatured === 'true') where.isFeatured = true;

    const products = await prisma.product.findMany({
      where,
      include: {
        images: true,
        category: true,
        brand: true,
      },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const data = await request.json();
    const { images, ...productData } = data;
    
    const product = await prisma.product.create({
      data: {
        ...productData,
        images: images ? {
          create: images
        } : undefined,
      },
      include: {
        images: true,
        category: true,
        brand: true,
      }
    });
    return NextResponse.json(product, { status: 201 });
  } catch (error: any) {
    if (error.code === 'P2002') {
      const target = error.meta?.target || 'field';
      return NextResponse.json({ error: `A product with this ${target} already exists.` }, { status: 400 });
    }
    return NextResponse.json({ error: error.message || 'Failed to create product' }, { status: 500 });
  }
}
