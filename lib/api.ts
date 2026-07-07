import { Product } from "./types";

// Removed API_URL to avoid Client Component prisma imports

// Adapter to transform backend DB model to frontend Product type
function mapBackendProduct(dbProduct: any): Product {
  let colors = [];
  try {
    if (dbProduct.colors) colors = JSON.parse(dbProduct.colors);
  } catch (e) {
    console.error("Failed to parse colors for product", dbProduct.slug);
  }

  // Inject Bangle Sizes
  let sizes = undefined;
  const isBangle = dbProduct.category?.slug === 'bangles' || 
                   dbProduct.category?.name?.toLowerCase().includes('bangle') ||
                   dbProduct.title?.toLowerCase().includes('bangle');

  if (isBangle) {
    const bangleSizes = ['2.2', '2.3', '2.4', '2.5', '2.6', '2.7', '2.8', '2.9', '2.10', 'Free Size'];
    sizes = bangleSizes.map(size => ({
      id: size.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      label: size,
      stock: dbProduct.currentStock > 0 ? 10 : 0 // Fake some stock based on product stock
    }));
  }

  return {
    id: dbProduct.id,
    slug: dbProduct.slug,
    name: dbProduct.title,
    brand: dbProduct.brand?.name || 'Ranique',
    category: (dbProduct.category?.slug as any) || 'cosmetics',
    price: dbProduct.sellingPrice,
    compareAtPrice: dbProduct.originalPrice || undefined,
    currency: dbProduct.currency || 'INR',
    rating: dbProduct.rating || 4.5,
    reviewCount: dbProduct.reviewCount || 0,
    badge: dbProduct.badge || undefined,
    description: dbProduct.shortDescription || '',
    details: dbProduct.fullDescription ? dbProduct.fullDescription.split('\n') : [],
    shipping: 'Free standard shipping on orders over ₹999. Express delivery available pan-India.',
    images: dbProduct.images?.map((img: any) => ({
      src: img.url,
      alt: img.altText || dbProduct.title,
    })) || [],
    variants: {
      colors: colors.length > 0 ? colors : undefined,
      sizes: sizes,
    },
    offer: dbProduct.offer && dbProduct.offer.isActive ? {
      discount: dbProduct.offer.discount,
      offerPrice: dbProduct.offer.offerPrice,
      endsAt: dbProduct.offer.endsAt.toISOString(),
      isActive: dbProduct.offer.isActive
    } : undefined
  };
}

import { prisma } from "./prisma";
import { unstable_cache } from "next/cache";

export async function getProducts(categorySlug?: string): Promise<any[]> {
  try {
    let where: any = {};
    if (categorySlug && categorySlug !== 'all') {
      const category = await prisma.category.findUnique({ where: { slug: categorySlug } });
      if (category) {
        where.categoryId = category.id;
      }
    }

    const dbProducts = await prisma.product.findMany({
      where: { ...where, deletedAt: null },
      include: {
        images: true,
        category: true,
        brand: true,
        offer: true,
      },
      orderBy: { createdAt: 'desc' }
    });

    return dbProducts.map(mapBackendProduct);
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return [];
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const dbProduct = await prisma.product.findFirst({
      where: { slug, deletedAt: null },
      include: {
        images: true,
        category: true,
        brand: true,
        offer: true,
      }
    });
    
    if (!dbProduct) return null;
    return mapBackendProduct(dbProduct);
  } catch (error) {
    console.error(`Failed to fetch product ${slug}:`, error);
    return null;
  }
}

export async function getCategories(): Promise<any[]> {
  const fetchCategories = unstable_cache(
    async () => {
      try {
        const categories = await prisma.category.findMany({
          orderBy: { createdAt: 'desc' }
        });
        return JSON.parse(JSON.stringify(categories));
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        return [];
      }
    },
    ['categories'],
    { revalidate: 60, tags: ['categories'] }
  );

  return fetchCategories();
}

export async function getBrands(): Promise<any[]> {
  const fetchBrands = unstable_cache(
    async () => {
      try {
        const brands = await prisma.brand.findMany({
          orderBy: { createdAt: 'desc' }
        });
        return JSON.parse(JSON.stringify(brands));
      } catch (error) {
        console.error("Failed to fetch brands:", error);
        return [];
      }
    },
    ['brands'],
    { revalidate: 60, tags: ['brands'] }
  );

  return fetchBrands();
}
