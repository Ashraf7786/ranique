import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.ranique.in'

  // Fetch all active products
  const products = await prisma.product.findMany({
    where: { status: 'PUBLISHED' },
    select: { slug: true, updatedAt: true }
  })

  // We could also fetch active blog posts if the schema has them, assuming they exist.
  // For now, we will add static paths and products.

  const staticRoutes = [
    '',
    '/shop',
    '/about',
    '/contact',
    '/faq',
    '/our-story',
    '/shipping-policy',
    '/return-refund-policy',
    '/cancellation-policy',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  const productRoutes = products.map((product) => ({
    url: `${baseUrl}/product/${product.slug}`,
    lastModified: product.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }))

  return [...staticRoutes, ...productRoutes]
}
