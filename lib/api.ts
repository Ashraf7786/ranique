import { Product } from "./types";

const getBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL;
  if (typeof window !== 'undefined') return '/api';
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}/api`;
  return 'http://localhost:3000/api';
};

export const API_URL = getBaseUrl();

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

export async function getProducts(categorySlug?: string): Promise<Product[]> {
  try {
    const url = new URL(`${API_URL}/products`);
    const res = await fetch(url.toString(), { cache: 'no-store' });
    if (!res.ok) return [];
    
    const dbProducts = await res.json();
    let mapped = dbProducts.map(mapBackendProduct);
    
    if (categorySlug && categorySlug !== 'all') {
      mapped = mapped.filter((p: Product) => p.category === categorySlug);
    }
    
    return mapped;
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return [];
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    // In a real app we'd query by slug directly via NestJS API.
    // For now we fetch all and find, or assume the backend supports ?slug=
    const res = await fetch(`${API_URL}/products?slug=${slug}`, { cache: 'no-store' });
    if (!res.ok) return null;
    const products = await res.json();
    const product = products.find((p: any) => p.slug === slug);
    
    if (!product) return null;
    return mapBackendProduct(product);
  } catch (error) {
    console.error(`Failed to fetch product ${slug}:`, error);
    return null;
  }
}

export async function getCategories(): Promise<any[]> {
  try {
    const res = await fetch(`${API_URL}/categories`, { cache: 'no-store' });
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return [];
  }
}

export async function getBrands(): Promise<any[]> {
  try {
    const res = await fetch(`${API_URL}/brands`, { cache: 'no-store' });
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    console.error("Failed to fetch brands:", error);
    return [];
  }
}
