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
      razorpayOrderId, razorpayPaymentId, razorpaySignature, paymentProofUrl, utrNumber } = parsed.data;

    // Payment validation moved below finalTotal calculation for Razorpay amount verification

    // Fetch product data to get current prices
    const productIds = items.map((i: any) => i.productId);
    const products = await prisma.product.findMany({ where: { id: { in: productIds } } });

    const productMap = new Map(products.map(p => [p.id, p]));

    // Build order items and verify prices
    const orderItems = items.map((item: any) => {
      const product = productMap.get(item.productId);
      if (!product) throw new Error(`Product not found: ${item.productId}`);
      
      // Strict size validation
      let sizeVariants: any[] = [];
      try {
        if ((product as any).sizeVariants) {
          sizeVariants = JSON.parse((product as any).sizeVariants);
        }
      } catch (e) {}

      if (sizeVariants.length > 0) {
        if (!item.size) {
           throw new Error(`Size is required for product: ${product.title}`);
        }
        const validSize = sizeVariants.find((sv: any) => sv.label === item.size);
        if (!validSize) {
           throw new Error(`Invalid size selected for product: ${product.title}`);
        }
        if (validSize.stock < item.quantity) {
           throw new Error(`Sorry, we have only ${validSize.stock} in stock for size ${item.size} of ${product.title}.`);
        }
      } else {
        if ((product as any).currentStock < item.quantity) {
           throw new Error(`Sorry, we have only ${(product as any).currentStock} in stock for ${product.title}.`);
        }
      }

      return {
        productId: product.id,
        sku: product.sku,
        quantity: item.quantity,
        price: product.sellingPrice,
        size: item.size || null,
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
      const coupon = await prisma.coupon.findUnique({ 
        where: { code: couponCode.toUpperCase() },
        include: { products: true }
      });
      if (coupon && coupon.isActive && (!coupon.endsAt || new Date(coupon.endsAt) > new Date())) {
        if (coupon.products && coupon.products.length > 0) {
          const validItems = orderItems.filter(i => coupon.products.some((p: any) => p.id === i.productId));
          if (validItems.length > 0) {
             const itemTotal = validItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
             appliedCouponDiscount = Math.round(itemTotal * (coupon.discountPercent / 100));
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

    let initialStatus = 'CONFIRMED';

    if (paymentMethod === 'ONLINE') {
      if (razorpayOrderId && razorpayPaymentId && razorpaySignature) {
        // Razorpay Verification
        const crypto = require('crypto');
        const secret = process.env.RAZORPAY_KEY_SECRET;
        
        const generatedSignature = crypto
          .createHmac('sha256', secret)
          .update(razorpayOrderId + '|' + razorpayPaymentId)
          .digest('hex');
          
        if (generatedSignature !== razorpaySignature) {
          return NextResponse.json({ error: 'Invalid payment signature' }, { status: 400 });
        }

        // Verify the payment amount against the actual calculated order total
        try {
          const Razorpay = require('razorpay');
          const rzp = new Razorpay({
            key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
            key_secret: process.env.RAZORPAY_KEY_SECRET!,
          });

          const payment = await rzp.payments.fetch(razorpayPaymentId);
          // Razorpay returns amount in subunits (paise)
          if (payment.amount !== Math.round(finalTotal * 100)) {
            return NextResponse.json({ error: 'Payment amount mismatch. Order rejected.' }, { status: 400 });
          }
        } catch (rzpErr) {
          console.error("Razorpay verify error:", rzpErr);
          return NextResponse.json({ error: 'Failed to verify payment amount with Razorpay' }, { status: 500 });
        }
      } else {
        // Manual QR Code Payment Verification
        if (!paymentProofUrl || !utrNumber) {
          return NextResponse.json({ error: 'Payment proof and UTR number are required' }, { status: 400 });
        }
        initialStatus = 'PENDING'; // Requires admin verification
      }
    } else if (paymentMethod === 'COD' || paymentMethod === 'WHATSAPP') {
      initialStatus = 'PENDING';
    }

    const { name, phone, email, line1, line2, city, state, zip, country } = shippingAddress;

    // Create the order
    const order = await prisma.order.create({
      data: {
        userId,
        totalAmount: finalTotal,
        currency: 'INR',
        paymentMethod,
        status: initialStatus,
        razorpayOrderId: razorpayOrderId || null,
        razorpayPaymentId: razorpayPaymentId || null,
        razorpaySignature: razorpaySignature || null,
        paymentProofUrl: paymentProofUrl || null,
        utrNumber: utrNumber || null,
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

    // ─── Decrement stock for each ordered product ─────────────────────────────
    for (const item of items as any[]) {
      const product = productMap.get(item.productId);
      if (!product) continue;

      const orderedSize = item.size || null;
      let sizeVariants: Array<{ id: string; label: string; stock: number }> | null = null;

      try {
        if ((product as any).sizeVariants) {
          sizeVariants = JSON.parse((product as any).sizeVariants);
        }
      } catch (_) {}

      if (sizeVariants && sizeVariants.length > 0 && orderedSize) {
        // Decrement the specific size's stock
        const updatedVariants = sizeVariants.map((sv) =>
          sv.label === orderedSize
            ? { ...sv, stock: Math.max(0, sv.stock - item.quantity) }
            : sv
        );
        const newTotal = updatedVariants.reduce((sum, sv) => sum + sv.stock, 0);

        await prisma.product.update({
          where: { id: item.productId },
          data: {
            sizeVariants: JSON.stringify(updatedVariants),
            currentStock: newTotal,
            stockStatus: newTotal <= 0 ? 'OUT_OF_STOCK' : 'IN_STOCK',
          },
        });
      } else {
        // No size variants — just decrement total stock
        const newStock = Math.max(0, (product as any).currentStock - item.quantity);
        await prisma.product.update({
          where: { id: item.productId },
          data: {
            currentStock: newStock,
            stockStatus: newStock <= 0 ? 'OUT_OF_STOCK' : 'IN_STOCK',
          },
        });
      }
    }

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
