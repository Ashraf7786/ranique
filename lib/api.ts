import { Product } from "./types";

// Removed API_URL to avoid Client Component prisma imports

// Adapter to transform backend DB model to frontend Product type
function mapBackendProduct(dbProduct: any, siblings: any[] = []): Product {
  let colors: any[] = [];
  try {
    if (dbProduct.colors) {
      colors = JSON.parse(dbProduct.colors);
      if (colors.length > 0) {
        colors[0].slug = dbProduct.slug;
      }
    }
  } catch (e) {
    console.error("Failed to parse colors for product", dbProduct.slug);
  }

  // Aggregate colors from siblings if they exist
  if (siblings.length > 0) {
    colors = []; // Rebuild to include all sibling colors
    for (const sib of siblings) {
      if (sib.colors) {
        try {
          const sibColors = JSON.parse(sib.colors);
          if (sibColors.length > 0) {
            const c = sibColors[0];
            c.slug = sib.slug;
            c.stock = sib.currentStock > 0 ? 10 : 0;
            colors.push(c);
          }
        } catch (e) {}
      }
    }
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
    inStock: dbProduct.currentStock > 0,
    rating: dbProduct.rating,
    reviewCount: dbProduct.reviewCount,
    boughtLastWeek: dbProduct.boughtLastWeek || Math.floor(Math.random() * (45 - 15 + 1) + 15),
    isNewArrival: dbProduct.isNewArrival,
    badge: dbProduct.badge,
    reviews: dbProduct.reviews || [],
    currency: dbProduct.currency || 'INR',
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
        reviews: { orderBy: { createdAt: 'desc' } },
      },
      orderBy: { createdAt: 'desc' }
    });

    return dbProducts.map(p => mapBackendProduct(p));
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
        reviews: { orderBy: { createdAt: 'desc' } },
      }
    });
    
    if (!dbProduct) return null;

    let siblings: any[] = [];
    if (dbProduct.variantGroupId) {
      siblings = await prisma.product.findMany({
        where: {
          variantGroupId: dbProduct.variantGroupId,
          deletedAt: null,
          status: 'PUBLISHED' // only show published siblings
        },
        select: {
          slug: true,
          colors: true,
          currentStock: true,
        },
      });
    }

    return mapBackendProduct(dbProduct, siblings);
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
