// ─── Core Product Types ─────────────────────────────────────────────────────

export type ProductCategory =
  | "cosmetics"
  | "accessories"
  | "bangles"
  | "purses";

export type BadgeType = "NEW" | "SALE" | "BESTSELLER" | "LIMITED";

export interface ColorVariant {
  id: string;
  label: string;
  hex: string;
  stock: number;
  priceModifier?: number; // added to base price if present
  slug?: string;
}

export interface SizeVariant {
  id: string;
  label: string;
  stock: number;
}

export interface ProductVariant {
  colors?: ColorVariant[];
  sizes?: SizeVariant[];
}

export interface ProductImage {
  src: string;
  alt: string;
  blurDataURL?: string;
}

export interface ProductReview {
  id: string;
  productId: string;
  customerName: string;
  rating: number;
  comment?: string;
  isVerified: boolean;
  isGenuine: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface ProductOfferType {
  discount: number;
  offerPrice: number;
  endsAt: string;
  isActive: boolean;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: ProductCategory;
  price: number;
  compareAtPrice?: number;
  currency: string;
  rating: number;
  reviewCount: number;
  badge?: BadgeType;
  images: ProductImage[];
  variants: ProductVariant;
  description: string;
  details: string[];
  shipping: string;
  material?: string;
  reviews?: ProductReview[] | any[];
  offer?: ProductOfferType;
  inStock?: boolean;
  boughtLastWeek?: number;
  isNewArrival?: boolean;
}

// ─── Cart Types ─────────────────────────────────────────────────────────────

export interface CartItem {
  cartItemId: string;       // unique per cart entry (product + variant combo)
  product: Product;
  selectedColor?: ColorVariant;
  selectedSize?: SizeVariant;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

export type CartAction =
  | { type: "ADD_ITEM"; payload: Omit<CartItem, "cartItemId"> }
  | { type: "REMOVE_ITEM"; payload: { cartItemId: string } }
  | { type: "UPDATE_QTY"; payload: { cartItemId: string; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "OPEN_CART" }
  | { type: "CLOSE_CART" };

// ─── Wishlist Types ──────────────────────────────────────────────────────────

export interface WishlistState {
  productIds: Set<string>;
}

// ─── Filter Types ────────────────────────────────────────────────────────────

export interface PriceRange {
  min: number;
  max: number;
}

export interface ActiveFilters {
  category: ProductCategory | "all";
  priceRange: PriceRange | null;
  colors: string[];          // hex values
  materials: string[];
  brands: string[];
  minRating: number | null;
}

// ─── UI Types ────────────────────────────────────────────────────────────────

export type ButtonVariant = "primary" | "secondary" | "ghost" | "outline";
export type ButtonSize = "sm" | "md" | "lg";

export interface TabItem {
  id: string;
  label: string;
  content: React.ReactNode;
}
