import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { sendOrderNotification } from '@/lib/mailer';

export async function PATCH(request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { status } = await request.json();
    if (!status) {
      return NextResponse.json({ error: 'Status is required' }, { status: 400 });
    }

    const order = await prisma.order.update({
      where: { id: params.id },
      data: { status },
      include: { user: true }
    });

    // Send email notification for specific status updates
    if (status === 'CONFIRMED' || status === 'SHIPPED') {
      if (order.user && order.user.email) {
        await sendOrderNotification(order.user.email, order.id, status, order.totalAmount);
      }
    }

    return NextResponse.json(order);
  } catch (error: any) {
    console.error("Error updating order:", error);
    return NextResponse.json({ error: 'Failed to update order status' }, { status: 500 });
  }
}

export async function DELETE(request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await prisma.order.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting order:", error);
    return NextResponse.json({ error: 'Failed to delete order' }, { status: 500 });
  }
}

