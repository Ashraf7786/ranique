import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    // Separate images if provided
    const { images, ...productData } = data;
    
    try {
      return await this.prisma.product.create({
        data: {
          ...productData,
          images: images ? {
            create: images
          } : undefined,
        },
        include: {
          images: true,
          category: true,
          brand: true,
        }
      });
    } catch (error: any) {
      if (error.code === 'P2002') {
        const target = error.meta?.target || 'field';
        throw new import('@nestjs/common').BadRequestException(`A product with this ${target} already exists.`);
      }
      throw new import('@nestjs/common').BadRequestException(error.message || 'Invalid product data provided.');
    }
  }

  async findAll(query: any) {
    // Handle basic filtering (status, category)
    const { status, categoryId } = query;
    const where: any = {};
    if (status) where.status = status;
    if (categoryId) where.categoryId = categoryId;

    return this.prisma.product.findMany({
      where,
      include: {
        images: true,
        category: true,
        brand: true,
      },
      orderBy: {
        createdAt: 'desc',
      }
    });
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        images: true,
        category: true,
        brand: true,
      },
    });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async update(id: string, data: any) {
    const { images, ...productData } = data;

    // Handle image updates (simplified for now: just replacing all images if provided)
    if (images) {
      await this.prisma.productImage.deleteMany({
        where: { productId: id }
      });
    }

    return this.prisma.product.update({
      where: { id },
      data: {
        ...productData,
        images: images ? {
          create: images
        } : undefined,
      },
      include: {
        images: true,
        category: true,
        brand: true,
      }
    });
  }

  async remove(id: string) {
    return this.prisma.product.delete({
      where: { id },
    });
  }
}
