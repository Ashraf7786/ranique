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
    // 🔒 Security guard: Admin auth
    const session = await getServerSession(authOptions);
    if (!session || !session.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();

    // Zod validation
    const parsed = OfferCreateSchema.safeParse(body);
    if (!parsed.success) return validationError(parsed.error);
    const { productId, categoryId, discount, offerPrice, endsAt, isActive } = parsed.data;

    // ── Category-wise Offer Logic ──────────────────────────────────────────
    if (categoryId) {
      // Find all subcategory IDs under this category
      let categoryIds = [categoryId];
      const subCategories = await prisma.category.findMany({
        where: { parentId: categoryId }
      });
      if (subCategories.length > 0) {
        categoryIds.push(...subCategories.map(s => s.id));
      }

      // Fetch all products inside these categories
      const products = await prisma.product.findMany({
        where: {
          categoryId: { in: categoryIds },
          deletedAt: null
        }
      });

      if (products.length === 0) {
        return NextResponse.json({ error: 'No products found in this category' }, { status: 400 });
      }

      // Bulk upsert product offers
      const createdOffers = [];
      for (const p of products) {
        const calculatedPrice = Math.round((p.sellingPrice || 0) * (1 - (discount / 100)));
        const offer = await prisma.productOffer.upsert({
          where: { productId: p.id },
          update: {
            discount,
            offerPrice: calculatedPrice,
            endsAt: new Date(endsAt),
            isActive: isActive ?? true
          },
          create: {
            productId: p.id,
            discount,
            offerPrice: calculatedPrice,
            endsAt: new Date(endsAt),
            isActive: isActive ?? true
          }
        });
        createdOffers.push(offer);
      }

      revalidatePath('/', 'layout');
      return NextResponse.json({ success: true, count: createdOffers.length, offers: createdOffers }, { status: 201 });
    }

    // ── Product-wise Offer Logic ───────────────────────────────────────────
    if (!productId) {
      return NextResponse.json({ error: 'Either Product ID or Category ID is required' }, { status: 400 });
    }

    const calculatedPrice = offerPrice ?? 0;

    // Check if an offer already exists for this product
    const existingOffer = await prisma.productOffer.findUnique({
      where: { productId }
    });

    if (existingOffer) {
      // Update existing offer
      const offer = await prisma.productOffer.update({
        where: { productId },
        data: { discount, offerPrice: calculatedPrice, endsAt: new Date(endsAt), isActive }
      });
      revalidatePath('/', 'layout');
      return NextResponse.json(offer);
    }

    // Create new offer
    const offer = await prisma.productOffer.create({
      data: {
        productId,
        discount,
        offerPrice: calculatedPrice,
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
