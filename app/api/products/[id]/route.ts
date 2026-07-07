import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        images: true,
        category: true,
        brand: true,
      }
    });
    
    if (!product) {
      // Also try to find by slug if id fails (useful for frontend fetching)
      const productBySlug = await prisma.product.findUnique({
        where: { slug: id },
        include: {
          images: true,
          category: true,
          brand: true,
        }
      });
      if (productBySlug) return NextResponse.json(productBySlug);
      
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    
    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await request.json();
    const product = await prisma.product.update({
      where: { id },
      data
    });
    revalidatePath('/', 'layout');
    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { searchParams } = new URL(request.url);
    const isHardDelete = searchParams.get('hard') === 'true';
    const { id } = await params;
    
    if (isHardDelete) {
      await prisma.product.delete({
        where: { id }
      });
    } else {
      await prisma.product.update({
        where: { id },
        data: { deletedAt: new Date() }
      });
    }
    revalidatePath('/', 'layout');
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
