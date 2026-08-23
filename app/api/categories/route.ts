import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { z } from 'zod';

const CategoryCreateSchema = z.object({
  name:        z.string().min(1),
  slug:        z.string().min(1).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase with hyphens only'),
  description: z.string().optional(),
  image:       z.string().url().optional().or(z.literal('')),
  href:        z.string().optional(),
  parentId:    z.string().optional(),
  storeType:   z.enum(['STORE', 'CLOTHING']).default('STORE'),
  sortOrder:   z.number().int().default(0),
  isVisible:   z.boolean().default(true),
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const storeType = searchParams.get('storeType');          // optional filter
    const visibleOnly = searchParams.get('visible') === 'true'; // storefront passes visible=true

    const categories = await prisma.category.findMany({
      where: {
        ...(storeType   ? { storeType }            : {}),
        ...(visibleOnly ? { isVisible: true }       : {}),
      },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    });
    return NextResponse.json(categories);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const parsed = CategoryCreateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ message: parsed.error.issues[0]?.message ?? 'Validation error' }, { status: 400 });
    }

    const data = parsed.data;
    const category = await prisma.category.create({
      data: {
        name:        data.name,
        slug:        data.slug,
        description: data.description,
        image:       data.image || null,
        href:        data.href || null,
        parentId:    data.parentId || null,
        storeType:   data.storeType,
        sortOrder:   data.sortOrder,
        isVisible:   data.isVisible,
      },
    });
    return NextResponse.json(category, { status: 201 });
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Category slug already exists' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
  }
}
