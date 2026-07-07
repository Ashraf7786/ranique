import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { revalidateTag } from 'next/cache';

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
    const data = await request.json();
    const { productId, discount, offerPrice, endsAt, isActive } = data;

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
      revalidateTag('products');
      return NextResponse.json(offer);
    }

    // Create new offer
    const offer = await prisma.productOffer.create({
      data: {
        productId,
        discount,
        offerPrice,
        endsAt: new Date(endsAt),
        isActive
      }
    });

    revalidateTag('products');
    return NextResponse.json(offer, { status: 201 });
  } catch (error) {
    console.error("Failed to create offer:", error);
    return NextResponse.json({ error: 'Failed to create offer' }, { status: 500 });
  }
}
