import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { rateLimit } from "@/lib/rate-limit";

const reviewSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  customerName: z.string().min(2, "Name must be at least 2 characters").max(100),
  rating: z.number().min(1).max(5),
  comment: z.string().max(1000).optional(),
  isVerified: z.boolean().default(true),
  isGenuine: z.boolean().default(false),
});

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
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    const { success } = rateLimit(ip, 20, 60000); // 20 requests per minute
    
    if (!success) {
      return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
    }

    const session = await getServerSession(authOptions);
    if (!session || !session.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const validatedData = reviewSchema.parse(body);
    
    const review = await prisma.review.create({
      data: {
        productId: validatedData.productId,
        customerName: validatedData.customerName,
        rating: validatedData.rating,
        comment: validatedData.comment,
        isVerified: validatedData.isVerified,
        isGenuine: validatedData.isGenuine,
      },
    });
    
    revalidatePath('/', 'layout');
    
    return NextResponse.json(review, { status: 201 });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation failed", details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: error.message || 'Failed to create review' }, { status: 500 });
  }
}
