import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const body = await req.json();
    const { items, shippingAddress, paymentMethod, totalAmount } = body;

    // Validate required fields
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }
    if (!shippingAddress) {
      return NextResponse.json({ error: 'Shipping address is required' }, { status: 400 });
    }
    if (!paymentMethod) {
      return NextResponse.json({ error: 'Payment method is required' }, { status: 400 });
    }

    const { name, phone, email, line1, line2, city, state, zip, country } = shippingAddress;
    if (!name || !phone || !email || !line1 || !city || !state || !zip) {
      return NextResponse.json({ error: 'All required shipping address fields must be filled' }, { status: 400 });
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
    const discount = Math.round(subtotal * 0.10);
    const finalTotal = subtotal + shipping - discount;

    // Create the order
    const order = await prisma.order.create({
      data: {
        userId,
        totalAmount: finalTotal,
        currency: 'INR',
        paymentMethod,
        status: paymentMethod === 'ONLINE' ? 'PENDING' : 'CONFIRMED',
        shippingName: name,
        shippingPhone: phone,
        shippingEmail: email,
        shippingLine1: line1,
        shippingLine2: line2 || null,
        shippingCity: city,
        shippingState: state,
        shippingZip: zip,
        shippingCountry: country || 'India',
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
