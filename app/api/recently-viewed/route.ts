import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ success: false });

  const { productId } = await req.json();

  if (productId) {
    await prisma.recentlyViewed.upsert({
      where: {
        userId_productId: { userId: (session.user as any).id, productId }
      },
      update: { viewedAt: new Date() },
      create: { userId: (session.user as any).id, productId }
    });
  }

  return NextResponse.json({ success: true });
}

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ products: [] });

  try {
    const rv = await prisma.recentlyViewed.findMany({
      where: { userId: (session.user as any).id },
      orderBy: { viewedAt: 'desc' },
      take: 4,
      include: {
        product: { include: { images: true } }
      }
    });

    const recentlyViewedProducts = rv.map(r => {
      let parsedColors = [];
      try {
        if (r.product.colors) parsedColors = JSON.parse(r.product.colors);
      } catch (e) {}

      return {
        ...r.product,
        name: r.product.title,
        price: r.product.sellingPrice,
        compareAtPrice: r.product.originalPrice,
        images: r.product.images.map((img: any) => ({
          src: img.url,
          alt: img.altText || r.product.title,
        })),
        variants: {
          colors: parsedColors.length > 0 ? parsedColors : undefined,
        },
      };
    });

    return NextResponse.json({ products: recentlyViewedProducts });
  } catch (e) {
    console.error("Recently viewed GET error:", e);
    return NextResponse.json({ products: [] }, { status: 500 });
  }
}
