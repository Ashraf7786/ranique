import { PrismaClient } from '@prisma/client';
// Using relative path to access the mock data from the frontend
import { MOCK_PRODUCTS, CATEGORIES, BRANDS } from '../../lib/mockData';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database with mock data...');

  // 1. Create Categories
  console.log('Creating categories...');
  const categoryMap = new Map();
  for (const cat of CATEGORIES) {
    if (cat.id === 'all') continue;
    
    const createdCat = await prisma.category.upsert({
      where: { slug: cat.id },
      update: {},
      create: {
        name: cat.label,
        slug: cat.id,
      },
    });
    categoryMap.set(cat.id, createdCat.id);
  }

  // 2. Create Brands
  console.log('Creating brands...');
  const brandMap = new Map();
  for (const brandName of BRANDS) {
    const slug = brandName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const createdBrand = await prisma.brand.upsert({
      where: { slug },
      update: {},
      create: {
        name: brandName,
        slug,
      },
    });
    brandMap.set(brandName, createdBrand.id);
  }

  // 3. Create Products
  console.log('Creating products...');
  for (const mock of MOCK_PRODUCTS) {
    const brandSlug = mock.brand.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const brandId = brandMap.get(mock.brand);
    const categoryId = categoryMap.get(mock.category);

    const colorsString = mock.variants?.colors ? JSON.stringify(mock.variants.colors) : null;

    const product = await prisma.product.upsert({
      where: { slug: mock.slug },
      update: {},
      create: {
        title: mock.name,
        slug: mock.slug,
        sku: mock.id.toUpperCase(),
        shortDescription: mock.description,
        fullDescription: mock.details ? mock.details.join('\n') : mock.description,
        sellingPrice: mock.price,
        originalPrice: mock.compareAtPrice || null,
        badge: mock.badge || null,
        rating: mock.rating || 4.5,
        reviewCount: mock.reviewCount || 0,
        status: 'PUBLISHED',
        currentStock: 50,
        colors: colorsString,
        brandId,
        categoryId,
        images: {
          create: mock.images.map((img: any, i: number) => ({
            url: img.src,
            altText: img.alt,
            isCover: i === 0,
            sortOrder: i,
          })),
        },
      },
    });
    console.log(`Created product: ${product.title}`);
  }

  console.log('Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
