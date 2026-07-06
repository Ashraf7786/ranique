import { notFound } from "next/navigation";
import { getProductBySlug, getProducts } from "@/lib/api";
import { PDPClient } from "./PDPClient";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const allCategoryProducts = await getProducts(product.category);
  const related = allCategoryProducts.filter(p => p.id !== product.id).slice(0, 4);

  return <PDPClient product={product} related={related} />;
}
