import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { ProductUpdateSchema, validationError } from '@/lib/validation';

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
    const session = await getServerSession(authOptions);
    const role = (session?.user as any)?.role;
    if (!session || !session.user || !['ADMIN', 'STAFF'].includes(role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();

    // ─── STAFF: Create an Edit Request (requires Admin approval) ────────────
    if (role === 'STAFF') {
      const staffId = (session.user as any).id;

      // Security: STAFF can only edit products they listed
      const product = await prisma.product.findUnique({ where: { id } });
      if (!product || product.staffId !== staffId) {
        return NextResponse.json(
          { error: 'You can only edit products you have listed.' },
          { status: 403 }
        );
      }

      // Check if a PENDING request already exists for this product by this staff
      const existingRequest = await prisma.productEditRequest.findFirst({
        where: { productId: id, staffId, status: 'PENDING' },
      });
      if (existingRequest) {
        return NextResponse.json(
          { error: 'You already have a pending edit request for this product. Wait for Admin approval.' },
          { status: 400 }
        );
      }

      const editRequest = await prisma.productEditRequest.create({
        data: {
          productId: id,
          staffId,
          requestedData: body,
          status: 'PENDING',
        },
      });

      return NextResponse.json(
        { message: 'Edit request submitted for Admin approval.', request: editRequest },
        { status: 202 }
      );
    }

    // ─── ADMIN: Update product directly ─────────────────────────────────────
    const parsed = ProductUpdateSchema.safeParse(body);
    if (!parsed.success) return validationError(parsed.error);

    const { images, ...productData } = parsed.data;
    
    const product = await prisma.product.update({
      where: { id },
      data: {
        ...productData,
        images: images ? {
          deleteMany: {},
          create: images
        } : undefined,
      },
      include: {
        images: true,
        category: true,
        brand: true,
      }
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
    // 🔒 Security fix: Admin auth guard was missing on this route
    const session = await getServerSession(authOptions);
    if (!session || !session.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

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
