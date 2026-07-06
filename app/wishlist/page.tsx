import { getProducts } from "@/lib/api";
import WishlistClient from "./WishlistClient";

export default async function WishlistPage() {
  const allProducts = await getProducts();
  
  return (
    <WishlistClient initialProducts={allProducts} />
  );
}
