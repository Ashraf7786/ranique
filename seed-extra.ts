import { prisma } from './lib/prisma';

async function main() {
  console.log("Seeding extra products...");

  const accessories = await prisma.category.findUnique({ where: { slug: 'accessories' } });
  const bangles = await prisma.category.findUnique({ where: { slug: 'bangles' } });
  const purses = await prisma.category.findUnique({ where: { slug: 'purses' } });
  const brand = await prisma.brand.findUnique({ where: { slug: 'ranique' } });

  if (!accessories || !bangles || !purses || !brand) {
    console.log("Categories or brand not found!");
    return;
  }

  const products = [
    {
      title: 'Gold Plated Kundan Bangles',
      slug: 'gold-plated-kundan-bangles',
      shortDescription: 'Elegant traditional bangles perfect for weddings.',
      sku: 'BGL-001',
      sellingPrice: 4500,
      originalPrice: 5000,
      currentStock: 20,
      status: 'PUBLISHED',
      categoryId: bangles.id,
      brandId: brand.id,
      imageUrl: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=1000&auto=format&fit=crop'
    },
    {
      title: 'Silver Diamond Cut Bangles',
      slug: 'silver-diamond-cut-bangles',
      shortDescription: 'Modern silver bangles with a shimmering finish.',
      sku: 'BGL-002',
      sellingPrice: 3200,
      originalPrice: 3500,
      currentStock: 45,
      status: 'PUBLISHED',
      categoryId: bangles.id,
      brandId: brand.id,
      imageUrl: 'https://images.unsplash.com/photo-1599643478524-fb66f7f3299c?q=80&w=1000&auto=format&fit=crop'
    },
    {
      title: 'Luxury Leather Tote',
      slug: 'luxury-leather-tote',
      shortDescription: 'A spacious and stylish leather purse.',
      sku: 'PRS-001',
      sellingPrice: 8500,
      originalPrice: 10000,
      currentStock: 15,
      status: 'PUBLISHED',
      categoryId: purses.id,
      brandId: brand.id,
      imageUrl: 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?q=80&w=1000&auto=format&fit=crop'
    },
    {
      title: 'Evening Clutch Bag',
      slug: 'evening-clutch-bag',
      shortDescription: 'Perfect accessory for a night out.',
      sku: 'PRS-002',
      sellingPrice: 2400,
      originalPrice: 3000,
      currentStock: 30,
      status: 'PUBLISHED',
      categoryId: purses.id,
      brandId: brand.id,
      imageUrl: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?q=80&w=1000&auto=format&fit=crop'
    },
    {
      title: 'Pearl Drop Earrings',
      slug: 'pearl-drop-earrings',
      shortDescription: 'Classic pearl earrings set in 18k gold.',
      sku: 'ACC-001',
      sellingPrice: 15000,
      originalPrice: 16500,
      currentStock: 10,
      status: 'PUBLISHED',
      categoryId: accessories.id,
      brandId: brand.id,
      imageUrl: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=1000&auto=format&fit=crop'
    },
    {
      title: 'Crystal Hair Pins',
      slug: 'crystal-hair-pins',
      shortDescription: 'Beautiful crystal pins to style your hair.',
      sku: 'ACC-002',
      sellingPrice: 1200,
      originalPrice: 1500,
      currentStock: 100,
      status: 'PUBLISHED',
      categoryId: accessories.id,
      brandId: brand.id,
      imageUrl: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?q=80&w=1000&auto=format&fit=crop'
    }
  ];

  for (const p of products) {
    const { imageUrl, ...productData } = p;
    
    // Check if exists
    const existing = await prisma.product.findUnique({ where: { slug: p.slug } });
    if (existing) {
      console.log(`Product ${p.title} already exists`);
      continue;
    }
    
    await prisma.product.create({
      data: {
        ...productData,
        images: {
          create: [{ url: imageUrl, isCover: true, sortOrder: 0, altText: p.title }]
        }
      }
    });
    console.log(`Created product: ${p.title}`);
  }

  console.log("Extra products seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
