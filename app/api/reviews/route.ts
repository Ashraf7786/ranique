import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { ReviewCreateSchema, validationError } from '@/lib/validation';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');

    const where: any = {};
    if (productId) where.productId = productId;

    const reviews = await prisma.review.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        product: { select: { title: true } }
      }
    });
    return NextResponse.json(reviews);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();

    // Zod validation
    const parsed = ReviewCreateSchema.safeParse(body);
    if (!parsed.success) return validationError(parsed.error);

    const review = await prisma.review.create({
      data: {
        productId: parsed.data.productId,
        customerName: parsed.data.customerName,
        rating: parsed.data.rating,
        comment: parsed.data.comment ?? null,
        isVerified: parsed.data.isVerified ?? true,
        isGenuine: parsed.data.isGenuine ?? false,
      },
    });

    // Update Product reviewCount and rating
    const agg = await prisma.review.aggregate({
      where: { productId: parsed.data.productId },
      _avg: { rating: true },
      _count: { id: true },
    });
    
    await prisma.product.update({
      where: { id: parsed.data.productId },
      data: {
        reviewCount: agg._count.id,
        rating: agg._avg.rating ? Number(agg._avg.rating.toFixed(1)) : 0,
      }
    });

    revalidatePath('/', 'layout');

    return NextResponse.json(review, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create review' }, { status: 500 });
  }
}
