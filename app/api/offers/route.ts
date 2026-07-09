import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { OfferCreateSchema, validationError } from '@/lib/validation';

export async function GET(request: Request) {
  try {
    const offers = await prisma.productOffer.findMany({
      include: {
        product: {
          include: {
            images: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(offers);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch offers' }, { status: 500 });
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
    const parsed = OfferCreateSchema.safeParse(body);
    if (!parsed.success) return validationError(parsed.error);
    const { productId, discount, offerPrice, endsAt, isActive } = parsed.data;

    // Check if an offer already exists for this product
    const existingOffer = await prisma.productOffer.findUnique({
      where: { productId }
    });

    if (existingOffer) {
      // Update existing offer
      const offer = await prisma.productOffer.update({
        where: { productId },
        data: { discount, offerPrice, endsAt: new Date(endsAt), isActive }
      });
      revalidatePath('/', 'layout');
      return NextResponse.json(offer);
    }

    // Create new offer
    const offer = await prisma.productOffer.create({
      data: {
        productId,
        discount,
        offerPrice,
        endsAt: new Date(endsAt),
        isActive: isActive ?? true
      }
    });

    revalidatePath('/', 'layout');
    return NextResponse.json(offer, { status: 201 });
  } catch (error) {
    console.error("Failed to create offer:", error);
    return NextResponse.json({ error: 'Failed to create offer' }, { status: 500 });
  }
}
