import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { WishlistItemSchema, validationError } from '@/lib/validation';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();

  // Zod validation
  const parsed = WishlistItemSchema.safeParse(body);
  if (!parsed.success) return validationError(parsed.error);
  const { productId } = parsed.data;

  let wishlist = await prisma.wishlist.findUnique({ where: { userId: (session.user as any).id } });
  
  if (!wishlist) {
    wishlist = await prisma.wishlist.create({ data: { userId: (session.user as any).id } });
  }

  // Toggle wishlist item
  const existingItem = await prisma.wishlistItem.findUnique({
    where: { wishlistId_productId: { wishlistId: wishlist.id, productId } }
  });

  if (existingItem) {
    await prisma.wishlistItem.delete({ where: { id: existingItem.id } });
    return NextResponse.json({ success: true, action: 'removed' });
  } else {
    await prisma.wishlistItem.create({
      data: { wishlistId: wishlist.id, productId }
    });
    return NextResponse.json({ success: true, action: 'added' });
  }
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ items: [] });

  const wishlist = await prisma.wishlist.findUnique({
    where: { userId: (session.user as any).id },
    include: { items: true }
  });

  return NextResponse.json(wishlist || { items: [] });
}
