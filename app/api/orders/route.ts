import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { OrderCreateSchema, validationError } from '@/lib/validation';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const body = await req.json();

    // Zod validation — replaces all manual if(!field) checks
    const parsed = OrderCreateSchema.safeParse(body);
    if (!parsed.success) return validationError(parsed.error);
    const { items, shippingAddress, paymentMethod, couponCode,
      razorpayOrderId, razorpayPaymentId, razorpaySignature } = parsed.data;

    if (paymentMethod === 'ONLINE') {
      if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
        return NextResponse.json({ error: 'Missing Razorpay payment details' }, { status: 400 });
      }
      
      const crypto = require('crypto');
      const secret = process.env.RAZORPAY_KEY_SECRET;
      
      const generatedSignature = crypto
        .createHmac('sha256', secret)
        .update(razorpayOrderId + '|' + razorpayPaymentId)
        .digest('hex');
        
      if (generatedSignature !== razorpaySignature) {
        return NextResponse.json({ error: 'Invalid payment signature' }, { status: 400 });
      }
    }

    // Fetch product data to get current prices
    const productIds = items.map((i: any) => i.productId);
    const products = await prisma.product.findMany({ where: { id: { in: productIds } } });

    const productMap = new Map(products.map(p => [p.id, p]));

    // Build order items and verify prices
    const orderItems = items.map((item: any) => {
      const product = productMap.get(item.productId);
      if (!product) throw new Error(`Product not found: ${item.productId}`);
      return {
        productId: product.id,
        sku: product.sku,
        quantity: item.quantity,
        price: product.sellingPrice,
      };
    });

    const subtotal = orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity, 0
    );
    const shipping = subtotal > 999 ? 0 : 99;
    
    const pastOrderCount = await prisma.order.count({ where: { userId } });
    const isFirstOrder = pastOrderCount === 0;

    let appliedCouponDiscount = 0;
    let appliedFirstOrderDiscount = 0;
    let validCouponCode: string | null = null;
    
    if (couponCode) {
      const coupon = await prisma.coupon.findUnique({ where: { code: couponCode.toUpperCase() } });
      if (coupon && coupon.isActive && (!coupon.endsAt || new Date(coupon.endsAt) > new Date())) {
        if (coupon.productId) {
          const item = orderItems.find(i => i.productId === coupon.productId);
          if (item) {
             appliedCouponDiscount = Math.round((item.price * item.quantity) * (coupon.discountPercent / 100));
             validCouponCode = coupon.code;
          }
        } else {
          appliedCouponDiscount = Math.round(subtotal * (coupon.discountPercent / 100));
          validCouponCode = coupon.code;
        }
        
        // Update coupon usage
        if (validCouponCode) {
          await prisma.coupon.update({
            where: { code: validCouponCode },
            data: { currentUses: { increment: 1 } }
          });
        }
      }
    }
    
    if (isFirstOrder) {
      if (subtotal >= 1199) {
        appliedFirstOrderDiscount = Math.round(subtotal * 0.15);
      } else {
        appliedFirstOrderDiscount = Math.round(subtotal * 0.10);
      }
    }

    const totalDiscount = appliedCouponDiscount + appliedFirstOrderDiscount;
    const finalTotal = subtotal + shipping - totalDiscount;

    const { name, phone, email, line1, line2, city, state, zip, country } = shippingAddress;

    // Create the order
    const order = await prisma.order.create({
      data: {
        userId,
        totalAmount: finalTotal,
        currency: 'INR',
        paymentMethod,
        status: 'CONFIRMED',
        razorpayOrderId: razorpayOrderId || null,
        razorpayPaymentId: razorpayPaymentId || null,
        razorpaySignature: razorpaySignature || null,
        shippingName: name,
        shippingPhone: phone,
        shippingEmail: email,
        shippingLine1: line1,
        shippingLine2: line2 || null,
        shippingCity: city,
        shippingState: state,
        shippingZip: zip,
        shippingCountry: country || 'India',
        couponCode: validCouponCode,
        couponDiscount: appliedCouponDiscount,
        firstOrderDiscount: appliedFirstOrderDiscount,
        items: {
          create: orderItems,
        },
      },
      include: { items: true },
    });

    return NextResponse.json({ success: true, orderId: order.id, order });
  } catch (error: any) {
    console.error('Error creating order:', error);
    return NextResponse.json({ error: error.message || 'Failed to create order' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const { searchParams } = new URL(req.url);
    const latest = searchParams.get('latest') === 'true';

    if (latest) {
      const order = await prisma.order.findFirst({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      });
      return NextResponse.json(order);
    }

    const orders = await prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: { items: { include: { product: true } } }
    });

    return NextResponse.json(orders);
  } catch (error: any) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}
