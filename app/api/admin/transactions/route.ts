import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || 'ALL';
    const method = searchParams.get('method') || 'ALL';

    const whereClause: any = {};

    if (search) {
      whereClause.OR = [
        { shippingName: { contains: search, mode: 'insensitive' } },
        { id: { contains: search, mode: 'insensitive' } },
        { razorpayPaymentId: { contains: search, mode: 'insensitive' } },
        { razorpayOrderId: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (status !== 'ALL') {
      whereClause.status = status;
    }

    if (method !== 'ALL') {
      whereClause.paymentMethod = method;
    }

    const orders = await prisma.order.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        shippingName: true,
        totalAmount: true,
        status: true,
        paymentMethod: true,
        razorpayPaymentId: true,
        razorpayOrderId: true,
        createdAt: true,
        user: {
          select: { email: true }
        }
      }
    });

    // Calculate metrics for dashboard
    const allOrders = await prisma.order.findMany({
      select: { totalAmount: true, status: true, paymentMethod: true }
    });

    const metrics = {
      totalRevenue: allOrders.filter(o => o.status !== 'CANCELLED' && o.status !== 'PENDING').reduce((sum, o) => sum + o.totalAmount, 0),
      successfulCount: allOrders.filter(o => o.status !== 'CANCELLED' && o.status !== 'PENDING').length,
      pendingCount: allOrders.filter(o => o.status === 'PENDING').length,
    };

    return NextResponse.json({ orders, metrics });
  } catch (error: any) {
    console.error('Transactions fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch transactions' }, { status: 500 });
  }
}
