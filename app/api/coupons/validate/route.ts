import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { code, cartSubtotal, cartItems } = await request.json();

    if (!code) {
      return NextResponse.json({ error: 'Coupon code is required' }, { status: 400 });
    }

    const coupon = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase() },
      include: { product: true }
    });

    if (!coupon) {
      return NextResponse.json({ error: 'Invalid coupon code' }, { status: 400 });
    }

    if (!coupon.isActive) {
      return NextResponse.json({ error: 'Coupon is no longer active' }, { status: 400 });
    }

    if (coupon.endsAt && new Date(coupon.endsAt) < new Date()) {
      return NextResponse.json({ error: 'Coupon has expired' }, { status: 400 });
    }

    if (coupon.maxUses && coupon.currentUses >= coupon.maxUses) {
      return NextResponse.json({ error: 'Coupon usage limit reached' }, { status: 400 });
    }

    if (cartSubtotal < coupon.minOrderValue) {
      return NextResponse.json({ error: `Minimum order value of ₹${coupon.minOrderValue} required` }, { status: 400 });
    }

    let discountAmount = 0;

    if (coupon.productId) {
      // Coupon applies only to a specific product
      const item = cartItems.find((i: any) => i.productId === coupon.productId);
      if (!item) {
        return NextResponse.json({ error: 'This coupon is not valid for the items in your cart' }, { status: 400 });
      }
      // Calculate discount on that specific item
      const itemTotal = item.price * item.quantity;
      discountAmount = Math.round(itemTotal * (coupon.discountPercent / 100));
    } else {
      // Applies to whole cart
      discountAmount = Math.round(cartSubtotal * (coupon.discountPercent / 100));
    }

    return NextResponse.json({
      success: true,
      discountAmount,
      couponCode: coupon.code,
      message: `Coupon applied: ${coupon.discountPercent}% off`
    });

  } catch (error) {
    console.error("Error validating coupon:", error);
    return NextResponse.json({ error: 'Failed to validate coupon' }, { status: 500 });
  }
}
