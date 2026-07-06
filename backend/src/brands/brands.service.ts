import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BrandsService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    return this.prisma.brand.create({ data });
  }

  async findAll() {
    return this.prisma.brand.findMany();
  }

  async findOne(id: string) {
    const brand = await this.prisma.brand.findUnique({
      where: { id },
    });
    if (!brand) throw new NotFoundException('Brand not found');
    return brand;
  }

  async update(id: string, data: any) {
    return this.prisma.brand.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    return this.prisma.brand.delete({
      where: { id },
    });
  }
}
