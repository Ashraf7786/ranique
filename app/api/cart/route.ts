import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ items: [] });

  const cart = await prisma.cart.findUnique({
    where: { userId: (session.user as any).id },
    include: {
      items: {
        include: { product: { include: { images: true } } }
      }
    }
  });

  return NextResponse.json(cart || { items: [] });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { productId, quantity, variantSku } = await req.json();

  let cart = await prisma.cart.findUnique({ where: { userId: (session.user as any).id } });
  
  if (!cart) {
    cart = await prisma.cart.create({ data: { userId: (session.user as any).id } });
  }

  // Check if item exists
  const existingItem = await prisma.cartItem.findFirst({
    where: { cartId: cart.id, productId, variantSku: variantSku || null }
  });

  if (existingItem) {
    await prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: existingItem.quantity + quantity }
    });
  } else {
    await prisma.cartItem.create({
      data: { cartId: cart.id, productId, quantity, variantSku: variantSku || null }
    });
  }

  return NextResponse.json({ success: true });
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const url = new URL(req.url);
  const cartItemId = url.searchParams.get('itemId');

  if (cartItemId) {
    await prisma.cartItem.delete({ where: { id: cartItemId } });
  } else {
    // clear cart
    const cart = await prisma.cart.findUnique({ where: { userId: (session.user as any).id } });
    if (cart) {
      await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    }
  }

  return NextResponse.json({ success: true });
}
