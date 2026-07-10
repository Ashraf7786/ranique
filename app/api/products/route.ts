import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { ProductCreateSchema, validationError } from '@/lib/validation';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('categoryId');
    const status = searchParams.get('status');
    const isFeatured = searchParams.get('isFeatured');
    const trash = searchParams.get('trash');

    const where: any = {};
    if (categoryId) where.categoryId = categoryId;
    if (status) where.status = status;
    if (isFeatured === 'true') where.isFeatured = true;
    
    if (trash === 'true') {
      where.deletedAt = { not: null };
    } else {
      where.deletedAt = null;
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        images: true,
        category: true,
        brand: true,
      },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const role = (session?.user as any)?.role;
    if (!session || !session.user || !['ADMIN', 'STAFF'].includes(role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();

    // Zod validation
    const parsed = ProductCreateSchema.safeParse(body);
    if (!parsed.success) return validationError(parsed.error);
    const { images, ...productData } = parsed.data;

    const product = await prisma.product.create({
      data: {
        ...productData,
        // If staff is adding, attach their userId as staffId
        staffId: role === 'STAFF' ? (session.user as any).id : undefined,
        // Staff-added products go PENDING_APPROVAL directly
        status: role === 'STAFF' ? 'PENDING_APPROVAL' : (productData.status || 'DRAFT'),
        images: images ? { create: images } : undefined,
      },
      include: { images: true, category: true, brand: true },
    });
    revalidatePath('/', 'layout');
    return NextResponse.json(product, { status: 201 });
  } catch (error: any) {
    if (error.code === 'P2002') {
      const target = error.meta?.target || 'field';
      return NextResponse.json({ error: `A product with this ${target} already exists.` }, { status: 400 });
    }
    return NextResponse.json({ error: error.message || 'Failed to create product' }, { status: 500 });
  }
}
