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

  return {
    id: dbProduct.id,
    slug: dbProduct.slug,
    name: dbProduct.title,
    brand: dbProduct.brand?.name || 'Unknown',
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
    },
  };
}

import { prisma } from "./prisma";

export async function getProducts(categorySlug?: string): Promise<Product[]> {
  try {
    const where: any = {};
    if (categorySlug && categorySlug !== 'all') {
      const category = await prisma.category.findUnique({ where: { slug: categorySlug } });
      if (category) {
        where.categoryId = category.id;
      }
    }
    
    const dbProducts = await prisma.product.findMany({
      where,
      include: {
        images: true,
        category: true,
        brand: true,
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
    const dbProduct = await prisma.product.findUnique({
      where: { slug },
      include: {
        images: true,
        category: true,
        brand: true,
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
  try {
    const categories = await prisma.category.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return JSON.parse(JSON.stringify(categories));
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return [];
  }
}

export async function getBrands(): Promise<any[]> {
  try {
    const brands = await prisma.brand.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return JSON.parse(JSON.stringify(brands));
  } catch (error) {
    console.error("Failed to fetch brands:", error);
    return [];
  }
}
