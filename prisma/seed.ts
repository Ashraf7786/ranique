import { prisma } from '../lib/prisma';

async function main() {
  console.log("Seeding database with sample products...");

  // 1. Create a Category
  const cosmeticsCategory = await prisma.category.create({
    data: {
      name: 'Cosmetics',
      slug: 'cosmetics',
      description: 'Premium cosmetic products',
    },
  });

  const skincareCategory = await prisma.category.create({
    data: {
      name: 'Skincare',
      slug: 'skincare',
      description: 'Luxurious skincare routines',
    },
  });

  const accessoriesCategory = await prisma.category.create({
    data: {
      name: 'Accessories',
      slug: 'accessories',
      description: 'Premium accessories for every occasion',
    },
  });

  const banglesCategory = await prisma.category.create({
    data: {
      name: 'Bangles',
      slug: 'bangles',
      description: 'Traditional and modern bangles',
    },
  });

  const pursesCategory = await prisma.category.create({
    data: {
      name: 'Purses',
      slug: 'purses',
      description: 'Elegant purses and handbags',
    },
  });

  // 2. Create a Brand
  const raniqueBrand = await prisma.brand.create({
    data: {
      name: 'Ranique',
      slug: 'ranique',
      description: 'The official Ranique luxury line.',
    },
  });

  // 3. Create Sample Products
  const products = [
    {
      title: 'Velvet Matte Lipstick',
      slug: 'velvet-matte-lipstick',
      shortDescription: 'A rich, velvety matte lipstick that lasts all day.',
      sku: 'LIP-001',
      sellingPrice: 1500,
      originalPrice: 1800,
      currentStock: 100,
      status: 'PUBLISHED',
      categoryId: cosmeticsCategory.id,
      brandId: raniqueBrand.id,
      colors: JSON.stringify([
        { label: 'Crimson Red', hex: '#DC143C' },
        { label: 'Soft Peach', hex: '#FFDAB9' }
      ]),
      imageUrl: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?q=80&w=1000&auto=format&fit=crop'
    },
    {
      title: 'Luminous Foundation',
      slug: 'luminous-foundation',
      shortDescription: 'Flawless coverage with a natural, glowing finish.',
      sku: 'FND-002',
      sellingPrice: 2400,
      originalPrice: 2800,
      currentStock: 50,
      status: 'PUBLISHED',
      categoryId: cosmeticsCategory.id,
      brandId: raniqueBrand.id,
      colors: JSON.stringify([
        { label: 'Fair', hex: '#FFE4C4' },
        { label: 'Medium', hex: '#D2B48C' }
      ]),
      imageUrl: 'https://images.unsplash.com/photo-1599305090598-fe179d501227?q=80&w=1000&auto=format&fit=crop'
    },
    {
      title: 'Hydrating Night Serum',
      slug: 'hydrating-night-serum',
      shortDescription: 'Rejuvenate your skin overnight with deep hydration.',
      sku: 'SKN-001',
      sellingPrice: 3200,
      originalPrice: 3500,
      currentStock: 30,
      status: 'PUBLISHED',
      categoryId: skincareCategory.id,
      brandId: raniqueBrand.id,
      imageUrl: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=1000&auto=format&fit=crop'
    },
    {
      title: 'Rosewater Facial Mist',
      slug: 'rosewater-facial-mist',
      shortDescription: 'A refreshing burst of hydration anytime, anywhere.',
      sku: 'SKN-002',
      sellingPrice: 850,
      originalPrice: 1000,
      currentStock: 200,
      status: 'PUBLISHED',
      categoryId: skincareCategory.id,
      brandId: raniqueBrand.id,
      imageUrl: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?q=80&w=1000&auto=format&fit=crop'
    }
  ];

  for (const p of products) {
    const { imageUrl, ...productData } = p;
    await prisma.product.create({
      data: {
        ...productData,
        images: {
          create: [{ url: imageUrl, isCover: true }]
        }
      }
    });
    console.log(`Created product: ${p.title}`);
  }

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
