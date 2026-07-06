import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const CATEGORIES = ['cosmetics', 'accessories', 'bangles', 'purses'];
const BRANDS = ['Ranique', 'Luxe', 'Glow', 'Aura'];

const COLORS = [
  { label: 'Rose Gold', hex: '#b76e79', priceModifier: 0 },
  { label: 'Classic Gold', hex: '#ffd700', priceModifier: 0 },
  { label: 'Silver', hex: '#c0c0c0', priceModifier: 0 },
  { label: 'Midnight Black', hex: '#1a1a1a', priceModifier: 50 },
  { label: 'Ruby Red', hex: '#9b111e', priceModifier: 0 },
  { label: 'Emerald', hex: '#50c878', priceModifier: 100 },
  { label: 'Sapphire', hex: '#0f52ba', priceModifier: 100 },
  { label: 'Pearl White', hex: '#f0ead6', priceModifier: 0 },
  { label: 'Dusty Pink', hex: '#dcae96', priceModifier: 0 },
  { label: 'Champagne', hex: '#f7e7ce', priceModifier: 0 },
];

const ADJECTIVES = ['Velvet', 'Luxury', 'Royal', 'Radiant', 'Signature', 'Classic', 'Ethereal', 'Timeless', 'Enchanted', 'Modern', 'Vintage'];
const NOUNS = {
  cosmetics: ['Lipstick', 'Foundation', 'Palette', 'Glow Serum', 'Mascara', 'Blush', 'Highlighter', 'Concealer', 'Eyeliner', 'Lip Gloss'],
  accessories: ['Necklace', 'Earrings', 'Pendant', 'Choker', 'Ring', 'Bracelet', 'Anklet', 'Hair Clip', 'Brooch', 'Studs'],
  bangles: ['Kundan Bangles', 'Gold Plated Bangles', 'Glass Bangles', 'Bridal Chura', 'Polki Bangles', 'Diamond Finish Bangles', 'Meenakari Bangles', 'Oxidized Bangles', 'Thread Work Bangles', 'Kada'],
  purses: ['Clutch', 'Tote Bag', 'Sling Bag', 'Satchel', 'Hobo Bag', 'Crossbody', 'Evening Bag', 'Wallet', 'Mini Bag', 'Bucket Bag']
};

function getRandomItem(arr: any[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomColors(count: number) {
  const shuffled = [...COLORS].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function getRandomImages(count: number, category: string, index: number) {
  const images = [];
  for (let i = 0; i < count; i++) {
    const seed = `${category}-${index}-${i}`;
    images.push({
      url: `https://picsum.photos/seed/${seed}/800/1000`,
      altText: `${category} product view ${i + 1}`,
      isCover: i === 0,
      sortOrder: i
    });
  }
  return images;
}

function generateDescription(name: string, category: string) {
  return `Experience the epitome of elegance with our ${name}. Crafted for the modern connoisseur, this ${category} piece seamlessly blends timeless tradition with contemporary luxury. Whether you're dressing up for a grand celebration or adding a touch of sophistication to your daily ensemble, the ${name} is designed to make a statement. Meticulously detailed and crafted with premium materials to ensure lasting brilliance and unparalleled quality.\n\nHighlights:\n- Premium quality craftsmanship\n- Designed for maximum comfort and style\n- Perfect for both festive and casual occasions\n- Guaranteed to turn heads`;
}

async function main() {
  console.log('Starting large data generation...');

  // Get brand mapping
  const brandMap = new Map();
  for (const brand of BRANDS) {
    const dbBrand = await prisma.brand.upsert({
      where: { slug: brand.toLowerCase() },
      update: {},
      create: {
        name: brand,
        slug: brand.toLowerCase()
      }
    });
    brandMap.set(brand, dbBrand.id);
  }

  // Get category mapping
  const catMap = new Map();
  for (const cat of CATEGORIES) {
    const dbCat = await prisma.category.upsert({
      where: { slug: cat },
      update: {},
      create: {
        name: cat.charAt(0).toUpperCase() + cat.slice(1),
        slug: cat,
        description: `Explore our collection of ${cat}`
      }
    });
    catMap.set(cat, dbCat.id);
  }

  let globalProductCounter = 0;

  for (const category of CATEGORIES) {
    console.log(`Generating 25 products for ${category}...`);
    
    for (let i = 1; i <= 25; i++) {
      globalProductCounter++;
      const adjective = getRandomItem(ADJECTIVES);
      const noun = getRandomItem(NOUNS[category as keyof typeof NOUNS]);
      const brand = getRandomItem(BRANDS);
      
      const productName = `${adjective} ${noun} ${brand === 'Ranique' ? 'Edition' : `by ${brand}`}`;
      const slug = `${productName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Math.random().toString(36).substring(7)}`;
      
      const price = Math.floor(Math.random() * 5000) + 999;
      const originalPrice = Math.random() > 0.5 ? Math.floor(price * 1.5) : null;
      
      const colors = getRandomColors(4);
      const images = getRandomImages(4, category, globalProductCounter);

      try {
        await prisma.product.create({
          data: {
            title: productName,
            slug: slug,
            sku: slug,
            shortDescription: `A stunning ${category} essential featuring premium finish and exceptional quality.`,
            fullDescription: generateDescription(productName, category),
            sellingPrice: price,
            originalPrice: originalPrice,
            currentStock: Math.floor(Math.random() * 100) + 10,
            stockStatus: 'IN_STOCK',
            status: 'PUBLISHED',
            categoryId: catMap.get(category),
            brandId: brandMap.get(brand),
            rating: Number((Math.random() * 1 + 4).toFixed(1)),
            reviewCount: Math.floor(Math.random() * 500) + 20,
            colors: JSON.stringify(colors),
            images: {
              create: images
            }
          }
        });
      } catch (err) {
        console.error(`Failed to create product ${slug}`, err);
      }
    }
  }

  console.log(`Successfully generated ${globalProductCounter} products!`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
