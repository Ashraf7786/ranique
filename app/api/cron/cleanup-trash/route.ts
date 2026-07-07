import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    // Optional: Verify the request is coming from Vercel Cron
    const authHeader = request.headers.get('authorization');
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const deletedProducts = await prisma.product.deleteMany({
      where: {
        deletedAt: {
          lte: thirtyDaysAgo
        }
      }
    });

    return NextResponse.json({ 
      success: true, 
      message: `Permanently deleted ${deletedProducts.count} trashed products.` 
    });
  } catch (error) {
    console.error("Cron Job Error:", error);
    return NextResponse.json({ error: 'Failed to cleanup trash' }, { status: 500 });
  }
}
